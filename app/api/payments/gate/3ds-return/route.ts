import { NextRequest, NextResponse } from 'next/server';
import { PaymentGateService } from '@/lib/services/payment-gate';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

  console.log('[3DS Return] GET request:', { paymentId, status });

  // Force HTTPS for redirect
  const origin = new URL(request.url).origin;
  const baseUrl = origin.replace(/^http:/, 'https:').replace(/\/$/, '');

  let redirectUrl = `${baseUrl}/dashboard/wallet`;
  if (status === 'success') {
    redirectUrl = `${baseUrl}/dashboard/wallet?status=success&payment_id=${paymentId}`;
  } else if (status === 'decline' || status === 'declined') {
    redirectUrl = `${baseUrl}/dashboard/wallet?status=declined&payment_id=${paymentId}`;
  }

  return new NextResponse(generateRedirectHTML(redirectUrl, status || 'pending'), {
    headers: { 'Content-Type': 'text/html' },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let paymentId = searchParams.get('payment_id');

    // Parse form data from ACS
    const formData = await request.formData();
    const paRes = formData.get('PaRes') as string;
    const cRes = formData.get('cres') as string;
    const md = formData.get('MD') as string;

    console.log('[3DS Return] POST request:', {
      paymentId,
      hasPaRes: !!paRes,
      hasCRes: !!cRes,
      hasMD: !!md,
    });

    // Extract payment ID from MD if not in query
    if (!paymentId && md) {
      // MD might contain the payment ID or be the payment ID itself
      if (md.startsWith('payment_')) {
        paymentId = md;
      }
    }

    if (!paymentId) {
      console.error('[3DS Return] No payment ID found');
      return new NextResponse(generateErrorHTML('Missing payment ID'), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // Submit 3DS result to provider
    const authData = paRes || cRes;
    if (!authData) {
      console.error('[3DS Return] No auth data (PaRes/cRes)');
      return new NextResponse(generateErrorHTML('Missing authentication data'), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    const result = await PaymentGateService.submit3DSResult({
      paymentId,
      paRes: authData,
      md: md || paymentId,
    });

    console.log('[3DS Return] Provider response:', result.status);

    // Force HTTPS for redirect
    const origin = new URL(request.url).origin;
    const baseUrl = origin.replace(/^http:/, 'https:').replace(/\/$/, '');

    let redirectUrl = `${baseUrl}/dashboard/wallet`;
    if (result.status === 'success') {
      redirectUrl = `${baseUrl}/dashboard/wallet?status=success&payment_id=${paymentId}`;
    } else if (result.status === 'decline') {
      redirectUrl = `${baseUrl}/dashboard/wallet?status=declined&payment_id=${paymentId}&message=${encodeURIComponent(result.message || 'Payment declined')}`;
    }

    return new NextResponse(generateRedirectHTML(redirectUrl, result.status), {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('[3DS Return] Error:', error);
    return new NextResponse(generateErrorHTML('Payment verification failed'), {
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

function generateRedirectHTML(url: string, status: string): string {
  const isSuccess = status === 'success';
  const statusColor = isSuccess ? '#10b981' : '#f59e0b';
  const statusText = isSuccess ? 'Payment Complete' : 'Processing...';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${statusText}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      color: white;
    }
    .container {
      text-align: center;
      padding: 2rem;
      max-width: 400px;
    }
    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(255,255,255,0.2);
      border-top-color: ${statusColor};
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1.5rem;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .success-icon {
      width: 64px;
      height: 64px;
      background: ${statusColor};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }
    .success-icon svg {
      width: 32px;
      height: 32px;
      fill: white;
    }
    h1 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    p {
      color: rgba(255,255,255,0.7);
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  <div class="container">
    ${isSuccess ? `
      <div class="success-icon">
        <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
      </div>
    ` : `
      <div class="spinner"></div>
    `}
    <h1>${statusText}</h1>
    <p>${isSuccess ? 'Redirecting to your wallet...' : 'Please wait while we complete your payment...'}</p>
  </div>
  <script>
    // Notify parent window if in iframe
    if (window.parent !== window) {
      try {
        window.parent.postMessage({ type: '3ds_complete', status: '${status}' }, '*');
      } catch (e) {}
    }
    // Redirect after short delay
    setTimeout(function() {
      window.location.href = '${url}';
    }, 1500);
  </script>
</body>
</html>`;
}

function generateErrorHTML(message: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Payment Error</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #1e293b;
      color: white;
      text-align: center;
    }
    .error-icon {
      width: 64px;
      height: 64px;
      background: #ef4444;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
    }
    .error-icon svg {
      width: 32px;
      height: 32px;
      fill: white;
    }
    h1 { font-size: 1.25rem; margin-bottom: 0.5rem; }
    p { color: rgba(255,255,255,0.7); }
  </style>
</head>
<body>
  <div>
    <div class="error-icon">
      <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
    </div>
    <h1>Payment Error</h1>
    <p>${message}</p>
  </div>
  <script>
    setTimeout(function() {
      window.location.href = '${baseUrl}/dashboard/wallet?status=error';
    }, 3000);
  </script>
</body>
</html>`;
}
