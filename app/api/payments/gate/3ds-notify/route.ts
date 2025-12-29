import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * 3DS Notification endpoint
 * Called by payment provider when device fingerprinting iframe completes
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get('payment_id');

  console.log('[3DS Notify] GET request - checking fingerprinting status:', paymentId);

  if (!paymentId) {
    return NextResponse.json({ error: 'Missing payment_id' }, { status: 400 });
  }

  // Check if fingerprinting was received
  const invoice = await db.invoice.findFirst({
    where: { paymentId },
  });

  if (!invoice) {
    return NextResponse.json({ payment_id: paymentId, received: false });
  }

  const threeDSData = invoice.threeDSData as Record<string, unknown> | null;
  return NextResponse.json({
    payment_id: paymentId,
    received: threeDSData?.fingerprintingComplete || false,
    timestamp: threeDSData?.fingerprintingTimestamp || null,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let paymentId = searchParams.get('payment_id');

    console.log('[3DS Notify] POST request received');

    // Try to get payment_id from body
    if (!paymentId) {
      try {
        const contentType = request.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const body = await request.json();
          paymentId = body.payment_id || body.paymentId;
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
          const formData = await request.formData();
          paymentId = formData.get('payment_id') as string;
        } else {
          const text = await request.text();
          // Try parsing as JSON anyway
          try {
            const parsed = JSON.parse(text);
            paymentId = parsed.payment_id || parsed.paymentId;
          } catch {
            // Try URL params format
            const params = new URLSearchParams(text);
            paymentId = params.get('payment_id');
          }
        }
      } catch (e) {
        console.log('[3DS Notify] Could not parse body for payment_id');
      }
    }

    console.log('[3DS Notify] Payment ID:', paymentId);

    if (paymentId) {
      // Find and update invoice
      const invoice = await db.invoice.findFirst({
        where: { paymentId },
      });

      if (invoice) {
        const existingData = (invoice.threeDSData as Record<string, unknown>) || {};

        await db.invoice.update({
          where: { id: invoice.id },
          data: {
            threeDSData: {
              ...existingData,
              fingerprintingComplete: true,
              fingerprintingTimestamp: new Date().toISOString(),
            },
          },
        });

        console.log('[3DS Notify] Updated invoice with fingerprinting complete');
      } else {
        console.log('[3DS Notify] Invoice not found for payment:', paymentId);
      }
    }

    // Always return success to acknowledge notification
    return NextResponse.json({
      status: 'received',
      payment_id: paymentId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[3DS Notify] Error:', error);
    // Return success anyway to prevent retries
    return NextResponse.json({ status: 'received' }, { status: 200 });
  }
}
