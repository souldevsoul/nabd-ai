import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { PaymentGateService } from '@/lib/services/payment-gate';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('payment_id') || searchParams.get('paymentid');

    if (!paymentId) {
      return NextResponse.json({ error: 'Missing payment_id' }, { status: 400 });
    }

    console.log('[Payment Status] Checking:', paymentId);

    // Find invoice (verify ownership)
    const invoice = await db.invoice.findFirst({
      where: {
        paymentId,
        userId: session.user.id,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Return cached status if final
    if (invoice.status === 'PAID') {
      const wallet = await db.wallet.findUnique({ where: { userId: session.user.id } });
      return NextResponse.json({
        status: 'success',
        credits: invoice.creditsAmount,
        balance: wallet?.balance || 0,
      });
    }

    if (invoice.status === 'FAILED') {
      return NextResponse.json({ status: 'decline', message: 'Payment failed' });
    }

    // Check for stored 3DS data
    if (invoice.threeDSData && invoice.status === 'PENDING') {
      const threeDSData = invoice.threeDSData as Record<string, unknown>;

      // 3DS2 challenge redirect (after fingerprinting)
      if (threeDSData.threeds2_redirect && !threeDSData.challengeHandled) {
        const redirect = threeDSData.threeds2_redirect as {
          url: string;
          params?: { creq?: string; threeDSSessionData?: string };
        };
        return NextResponse.json({
          status: '3ds_required',
          threeds2_challenge: true,
          redirect_url: redirect.url,
          creq: redirect.params?.creq,
          threeds_session_data: redirect.params?.threeDSSessionData,
        });
      }

      // Check for threeds2 in nested structure
      const threeds2 = threeDSData.threeds2 as {
        redirect?: { url: string; params?: { creq?: string; threeDSSessionData?: string } };
        iframe?: { url: string; params?: { threeDSMethodData?: string } };
      } | undefined;

      if (threeds2?.redirect && !threeDSData.challengeHandled) {
        return NextResponse.json({
          status: '3ds_required',
          threeds2_challenge: true,
          redirect_url: threeds2.redirect.url,
          creq: threeds2.redirect.params?.creq,
          threeds_session_data: threeds2.redirect.params?.threeDSSessionData,
        });
      }

      // Extended 3DS iframe (fingerprinting)
      if (threeds2?.iframe && !threeDSData.fingerprintingComplete) {
        return NextResponse.json({
          status: '3ds_required',
          extended_3ds: true,
          iframe_url: threeds2.iframe.url,
          threeds_method_data: threeds2.iframe.params?.threeDSMethodData,
        });
      }

      // Check for direct iframe_url
      if (threeDSData.iframe_url && !threeDSData.fingerprintingComplete) {
        return NextResponse.json({
          status: '3ds_required',
          extended_3ds: true,
          iframe_url: threeDSData.iframe_url,
          threeds_method_data: threeDSData.threeds_method_data,
        });
      }

      // Basic 3DS (ACS redirect)
      const acs = threeDSData.acs as {
        acs_url: string;
        pa_req: string;
        md: string;
        term_url?: string;
      } | undefined;

      if (acs?.acs_url) {
        return NextResponse.json({
          status: '3ds_required',
          acs_url: acs.acs_url,
          pa_req: acs.pa_req,
          md: acs.md,
          term_url: acs.term_url,
        });
      }

      // Direct acs_url in threeDSData
      if (threeDSData.acs_url) {
        return NextResponse.json({
          status: '3ds_required',
          acs_url: threeDSData.acs_url,
          pa_req: threeDSData.pa_req,
          md: threeDSData.md,
          term_url: threeDSData.term_url,
        });
      }
    }

    // Poll payment provider if still pending
    const statusResult = await PaymentGateService.checkPaymentStatus(paymentId);

    if (statusResult.status === 'success') {
      // Credits should be added by webhook, but check just in case
      const existingTx = await db.creditTransaction.findFirst({
        where: { paymentId },
      });

      if (!existingTx && invoice.creditsAmount) {
        // Add credits (webhook might not have arrived yet)
        let wallet = await db.wallet.findUnique({ where: { userId: session.user.id } });
        if (!wallet) {
          wallet = await db.wallet.create({ data: { userId: session.user.id } });
        }

        const newBalance = wallet.balance + invoice.creditsAmount;

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
              paymentId,
              invoiceId: invoice.id,
            },
          }),
          db.invoice.update({
            where: { id: invoice.id },
            data: { status: 'PAID', paidAt: new Date() },
          }),
        ]);

        console.log('[Payment Status] Credits added via polling:', invoice.creditsAmount);
      }

      const wallet = await db.wallet.findUnique({ where: { userId: session.user.id } });
      return NextResponse.json({
        status: 'success',
        credits: invoice.creditsAmount,
        balance: wallet?.balance || 0,
      });
    }

    if (statusResult.status === 'decline') {
      await db.invoice.update({
        where: { id: invoice.id },
        data: { status: 'FAILED' },
      });
      return NextResponse.json({ status: 'decline', message: statusResult.message });
    }

    // Still pending
    return NextResponse.json({ status: 'pending', message: statusResult.message });
  } catch (error) {
    console.error('[Payment Status] Error:', error);
    return NextResponse.json({ error: 'Status check failed' }, { status: 500 });
  }
}
