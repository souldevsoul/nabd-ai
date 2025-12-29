import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { PaymentGateService, CallbackData } from '@/lib/services/payment-gate';

export async function GET() {
  // Health check endpoint
  return NextResponse.json({ status: 'ok', endpoint: 'payment-callback' });
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    let callbackData: CallbackData;

    try {
      callbackData = JSON.parse(rawBody);
    } catch {
      console.error('[Payment Callback] Failed to parse JSON');
      return NextResponse.json({ status: 'parse_error' }, { status: 200 });
    }

    console.log('[Payment Callback] ========== CALLBACK RECEIVED ==========');
    console.log('[Payment Callback] Data:', JSON.stringify(callbackData, null, 2));

    // Verify signature
    if (!PaymentGateService.verifySignature(callbackData)) {
      console.error('[Payment Callback] Invalid signature - rejecting');
      return NextResponse.json({ status: 'invalid_signature' }, { status: 200 });
    }

    // Extract payment ID from various possible locations
    const paymentId =
      callbackData.payment?.id ||
      callbackData.custom_fields?.payment_id ||
      (callbackData as unknown as Record<string, any>)["general"]?.["payment_id"];

    if (!paymentId) {
      console.error('[Payment Callback] No payment ID found');
      return NextResponse.json({ status: 'no_payment_id' }, { status: 200 });
    }

    console.log('[Payment Callback] Processing payment:', paymentId);

    // Find invoice
    const invoice = await db.invoice.findFirst({
      where: { paymentId: String(paymentId) },
      include: { user: true },
    });

    if (!invoice) {
      console.error('[Payment Callback] Invoice not found:', paymentId);
      return NextResponse.json({ status: 'invoice_not_found' }, { status: 200 });
    }

    // Already processed?
    if (invoice.status === 'PAID') {
      console.log('[Payment Callback] Already processed, skipping');
      return NextResponse.json({ status: 'already_processed' }, { status: 200 });
    }

    // Store 3DS data if present
    if (callbackData.acs || callbackData.threeds2) {
      console.log('[Payment Callback] Storing 3DS data');
      await db.invoice.update({
        where: { id: invoice.id },
        data: {
          threeDSData: {
            acs: callbackData.acs,
            threeds2: callbackData.threeds2,
            webhookTimestamp: new Date().toISOString(),
          },
        },
      });
    }

    // Determine final status
    const operationStatus = callbackData.operation?.status?.toLowerCase();
    const paymentStatus = callbackData.payment?.status?.toLowerCase();

    let finalStatus: 'success' | 'decline' | 'pending' = 'pending';

    if (operationStatus === 'success' || paymentStatus === 'success') {
      finalStatus = 'success';
    } else if (
      operationStatus === 'decline' ||
      paymentStatus === 'decline' ||
      paymentStatus === 'failed' ||
      paymentStatus === 'error'
    ) {
      finalStatus = 'decline';
    } else if (
      paymentStatus === 'awaiting 3ds result' ||
      paymentStatus === 'pending' ||
      paymentStatus === 'processing'
    ) {
      finalStatus = 'pending';
    }

    console.log('[Payment Callback] Final status:', finalStatus);

    // Process success
    if (finalStatus === 'success' && invoice.creditsAmount) {
      // Check for duplicate transaction
      const existingTx = await db.creditTransaction.findFirst({
        where: { paymentId: String(paymentId) },
      });

      if (!existingTx) {
        // Get or create wallet
        let wallet = await db.wallet.findUnique({ where: { userId: invoice.userId } });
        if (!wallet) {
          wallet = await db.wallet.create({ data: { userId: invoice.userId } });
        }

        const newBalance = wallet.balance + invoice.creditsAmount;

        // Atomic credit addition
        await db.$transaction([
          db.wallet.update({
            where: { id: wallet.id },
            data: { balance: newBalance },
          }),
          db.creditTransaction.create({
            data: {
              walletId: wallet.id,
              type: 'CREDIT_PURCHASE',
              amount: invoice.creditsAmount,
              balance: newBalance,
              description: `Purchased ${invoice.creditsAmount} credits`,
              paymentId: String(paymentId),
              invoiceId: invoice.id,
            },
          }),
          db.invoice.update({
            where: { id: invoice.id },
            data: { status: 'PAID', paidAt: new Date() },
          }),
        ]);

        console.log('[Payment Callback] Credits added:', invoice.creditsAmount, 'New balance:', newBalance);
      } else {
        console.log('[Payment Callback] Credits already added, skipping duplicate');
      }
    }

    // Process decline
    if (finalStatus === 'decline') {
      await db.invoice.update({
        where: { id: invoice.id },
        data: { status: 'FAILED' },
      });
      console.log('[Payment Callback] Invoice marked as FAILED');
    }

    // Always return 200 to acknowledge webhook
    return NextResponse.json({ status: 'received' }, { status: 200 });
  } catch (error) {
    console.error('[Payment Callback] Error:', error);
    // Return 200 to prevent retries on our errors
    return NextResponse.json({ status: 'error' }, { status: 200 });
  }
}
