import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { PaymentGateService } from '@/lib/services/payment-gate';
import { z } from 'zod';

const InitPaymentSchema = z.object({
  credits: z.number().positive(),
  amount: z.number().positive(), // in cents
  currency: z.string().default('EUR'),
  cardNumber: z.string().min(13).max(19),
  expiryMonth: z.string().min(1).max(2),
  expiryYear: z.string().min(2).max(4),
  cvv: z.string().min(3).max(4),
  cardHolder: z.string().min(2),
  billingAddress: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingPostalCode: z.string().optional(),
  billingCountry: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = InitPaymentSchema.parse(body);

    // Validate card number
    if (!PaymentGateService.validateCardNumber(data.cardNumber)) {
      return NextResponse.json({ error: 'Invalid card number' }, { status: 400 });
    }

    // Validate expiry date
    if (!PaymentGateService.validateExpiryDate(data.expiryMonth, data.expiryYear)) {
      return NextResponse.json({ error: 'Card has expired or invalid expiry date' }, { status: 400 });
    }

    // Get customer IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const customerIp = forwardedFor?.split(',')[0]?.trim() || realIp || '127.0.0.1';

    // Initialize payment with provider
    const result = await PaymentGateService.initializePayment({
      userId: session.user.id,
      credits: data.credits,
      amount: data.amount,
      currency: data.currency,
      cardNumber: data.cardNumber,
      expiryMonth: data.expiryMonth,
      expiryYear: data.expiryYear.length === 2 ? `20${data.expiryYear}` : data.expiryYear,
      cvv: data.cvv,
      cardHolder: data.cardHolder,
      customerEmail: session.user.email || undefined,
      customerIp,
      billingAddress: data.billingAddress,
      billingCity: data.billingCity,
      billingState: data.billingState,
      billingPostalCode: data.billingPostalCode,
      billingCountry: data.billingCountry,
    });

    // Create invoice record
    const invoice = await db.invoice.create({
      data: {
        userId: session.user.id,
        invoiceNumber: `INV-${Date.now()}`,
        amount: data.amount / 100, // Convert cents to dollars
        creditsAmount: data.credits,
        currency: data.currency,
        status: 'PENDING',
        paymentId: result.payment_id,
      },
    });

    console.log('[Payment Init] Invoice created:', invoice.id, 'Payment ID:', result.payment_id);

    // Handle responses
    if (result.status === 'success') {
      // Immediate success (rare, no 3DS) - add credits
      await addCreditsToUser(session.user.id, data.credits, result.payment_id, invoice.id);
      return NextResponse.json({
        status: 'success',
        paymentId: result.payment_id,
      });
    }

    if (result.status === '3ds_required') {
      // Store 3DS data in invoice for status endpoint
      await db.invoice.update({
        where: { id: invoice.id },
        data: {
          threeDSData: {
            acs_url: result.acs_url,
            pa_req: result.pa_req,
            md: result.md,
            term_url: result.term_url,
            iframe_url: result.iframe_url,
            threeds_method_data: result.threeds_method_data,
            threeds2: result.threeds2,
          },
        },
      });

      // Extended 3DS (fingerprinting iframe)
      if (result.iframe_url) {
        return NextResponse.json({
          status: '3ds_required',
          paymentId: result.payment_id,
          extended_3ds: true,
          iframe_url: result.iframe_url,
          threeds_method_data: result.threeds_method_data,
        });
      }

      // Basic 3DS (ACS redirect)
      return NextResponse.json({
        status: '3ds_required',
        paymentId: result.payment_id,
        acs_url: result.acs_url,
        pa_req: result.pa_req,
        md: result.md,
        term_url: result.term_url,
      });
    }

    if (result.status === 'decline' || result.status === 'error') {
      await db.invoice.update({
        where: { id: invoice.id },
        data: { status: 'FAILED' },
      });
      return NextResponse.json(
        { status: 'decline', message: result.message || 'Payment declined' },
        { status: 400 }
      );
    }

    // Pending - client will poll status
    return NextResponse.json({
      status: 'pending',
      paymentId: result.payment_id,
    });
  } catch (error) {
    console.error('[Payment Init] Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 });
  }
}

async function addCreditsToUser(userId: string, credits: number, paymentId: string, invoiceId: string) {
  // Get or create wallet
  let wallet = await db.wallet.findUnique({ where: { userId } });
  if (!wallet) {
    wallet = await db.wallet.create({ data: { userId } });
  }

  const newBalance = wallet.balance + credits;

  // Atomic transaction
  await db.$transaction([
    db.wallet.update({
      where: { id: wallet.id },
      data: { balance: newBalance },
    }),
    db.creditTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'CREDIT_PURCHASE',
        amount: credits,
        balance: newBalance,
        description: `Purchased ${credits} credits`,
        paymentId,
        invoiceId,
      },
    }),
    db.invoice.update({
      where: { id: invoiceId },
      data: { status: 'PAID', paidAt: new Date() },
    }),
  ]);

  console.log('[Payment Init] Credits added:', credits, 'New balance:', newBalance);
}
