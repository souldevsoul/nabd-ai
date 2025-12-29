import crypto from 'crypto';

// Generic payment gateway configuration - no provider names
const PAYMENT_PROJECT_ID = process.env.PAYMENT_PROJECT_ID || '';
const PAYMENT_SECRET_KEY = process.env.PAYMENT_SECRET_KEY || '';
const PAYMENT_API_URL = process.env.PAYMENT_API_URL || '';

export interface PaymentRequest {
  userId: string;
  credits: number;
  amount: number; // in cents
  currency: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardHolder: string;
  customerEmail?: string;
  customerIp: string;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingPostalCode?: string;
  billingCountry?: string;
}

export interface PaymentResponse {
  payment_id: string;
  status: 'success' | 'decline' | 'pending' | '3ds_required' | 'error';
  message?: string;
  // Basic 3DS
  acs_url?: string;
  pa_req?: string;
  md?: string;
  term_url?: string;
  // Extended 3DS
  iframe_url?: string;
  threeds_method_data?: string;
  // 3DS2 Challenge
  threeds2?: {
    iframe?: { url: string; params?: { threeDSMethodData?: string } };
    redirect?: { url: string; params?: { creq?: string; threeDSSessionData?: string } };
  };
  errors?: Array<{ code?: string; message?: string }>;
}

export interface CallbackData {
  project_id?: number;
  payment?: {
    id: string;
    status: string;
    type?: string;
  };
  operation?: {
    id?: number;
    status?: string;
    message?: string;
    code?: string;
  };
  acs?: {
    acs_url?: string;
    pa_req?: string;
    md?: string;
    term_url?: string;
  };
  threeds2?: {
    iframe?: { url: string; params?: { threeDSMethodData?: string } };
    redirect?: { url: string; params?: { creq?: string; threeDSSessionData?: string } };
  };
  custom_fields?: Record<string, string>;
  signature: string;
}

export class PaymentGateService {
  /**
   * Validate card number using Luhn algorithm
   */
  static validateCardNumber(cardNumber: string): boolean {
    const digits = cardNumber.replace(/\s/g, '');
    if (!/^\d+$/.test(digits)) return false;
    if (digits.length < 13 || digits.length > 19) return false;

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      const digitChar = digits[i];
      if (!digitChar) continue;

      let digit = parseInt(digitChar, 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  /**
   * Validate expiry date
   */
  static validateExpiryDate(month: string, year: string): boolean {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const expMonth = parseInt(month, 10);
    const expYear = parseInt(year, 10);

    if (expMonth < 1 || expMonth > 12) return false;

    const fullYear = expYear < 100 ? 2000 + expYear : expYear;

    if (fullYear < currentYear) return false;
    if (fullYear === currentYear && expMonth < currentMonth) return false;

    return true;
  }

  /**
   * Format card number with spaces
   */
  static formatCardNumber(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ');
  }

  /**
   * Detect card type from number
   */
  static getCardType(cardNumber: string): string {
    const number = cardNumber.replace(/\s/g, '');
    if (/^4/.test(number)) return 'visa';
    if (/^5[1-5]/.test(number)) return 'mastercard';
    if (/^3[47]/.test(number)) return 'amex';
    if (/^6(?:011|5)/.test(number)) return 'discover';
    return 'unknown';
  }

  /**
   * Generate HMAC-SHA512 signature for API requests
   * Algorithm: Flatten → Sort → Join with semicolons → HMAC-SHA512 → Base64
   */
  static generateSignature(data: Record<string, unknown>): string {
    // Remove existing signatures
    const dataToSign = JSON.parse(JSON.stringify(data));
    if (dataToSign.general?.signature) delete dataToSign.general.signature;
    if (dataToSign.signature) delete dataToSign.signature;

    // Flatten and build parameter strings
    const flattenParams = (obj: Record<string, unknown>, prefix = ''): string[] => {
      const result: string[] = [];

      for (const key of Object.keys(obj).sort()) {
        const value = obj[key];
        const fullPath = prefix ? `${prefix}:${key}` : key;

        if (value === null || value === undefined) {
          continue;
        } else if (Array.isArray(value)) {
          if (value.length === 0) continue;
          value.forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              result.push(...flattenParams(item as Record<string, unknown>, `${fullPath}:${index}`));
            } else if (item === '') {
              result.push(`${fullPath}:${index}:`);
            } else if (typeof item === 'boolean') {
              result.push(`${fullPath}:${index}:${item ? '1' : '0'}`);
            } else {
              result.push(`${fullPath}:${index}:${item}`);
            }
          });
        } else if (typeof value === 'object') {
          result.push(...flattenParams(value as Record<string, unknown>, fullPath));
        } else if (value === '') {
          result.push(`${fullPath}:`);
        } else if (typeof value === 'boolean') {
          result.push(`${fullPath}:${value ? '1' : '0'}`);
        } else {
          result.push(`${fullPath}:${value}`);
        }
      }

      return result;
    };

    const params = flattenParams(dataToSign);
    params.sort();
    const stringToSign = params.join(';');

    const hmac = crypto.createHmac('sha512', PAYMENT_SECRET_KEY);
    hmac.update(stringToSign, 'utf8');
    return hmac.digest('base64');
  }

  /**
   * Verify callback signature
   */
  static verifySignature(data: CallbackData): boolean {
    const receivedSignature = data.signature;
    if (!receivedSignature) {
      console.error('[PaymentGate] No signature in callback');
      return false;
    }

    const dataWithoutSignature = { ...data };
    delete (dataWithoutSignature as Record<string, unknown>).signature;

    const expectedSignature = this.generateSignature(dataWithoutSignature);
    const isValid = receivedSignature === expectedSignature;

    if (!isValid) {
      console.error('[PaymentGate] Signature mismatch');
    }

    return isValid;
  }

  /**
   * Initialize payment with card details
   */
  static async initializePayment(params: PaymentRequest): Promise<PaymentResponse> {
    const paymentId = `payment_${params.userId}_${Date.now()}`;

    // Force HTTPS for return URLs
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || '';
    baseUrl = baseUrl.replace(/^http:\/\//i, 'https://');

    const requestData: Record<string, unknown> = {
      general: {
        project_id: parseInt(PAYMENT_PROJECT_ID),
        payment_id: paymentId,
      },
      customer: {
        id: params.userId,
        ip_address: params.customerIp,
        ...(params.customerEmail && { email: params.customerEmail }),
      },
      payment: {
        amount: params.amount,
        currency: params.currency,
        description: `Credits Purchase - ${params.credits} credits`,
        extra_param: '3ds', // Enable extended 3DS
      },
      card: {
        pan: params.cardNumber.replace(/\s/g, ''),
        year: parseInt(params.expiryYear.length === 2 ? `20${params.expiryYear}` : params.expiryYear, 10),
        month: parseInt(params.expiryMonth, 10),
        card_holder: params.cardHolder.toUpperCase(),
        cvv: params.cvv,
      },
      return_url: {
        success: `${baseUrl}/api/payments/gate/3ds-return?payment_id=${paymentId}&status=success`,
        decline: `${baseUrl}/api/payments/gate/3ds-return?payment_id=${paymentId}&status=decline`,
      },
      acs_return_url: {
        return_url: `${baseUrl}/api/payments/gate/3ds-return?payment_id=${paymentId}`,
        '3ds_notification_url': `${baseUrl}/api/payments/gate/3ds-notify?payment_id=${paymentId}`,
      },
      custom_fields: {
        payment_id: paymentId,
        user_id: params.userId,
        credits: String(params.credits),
      },
    };

    // Add AVS data if provided
    if (params.billingPostalCode || params.billingAddress) {
      requestData.avs_data = {
        ...(params.billingPostalCode && { avs_post_code: params.billingPostalCode }),
        ...(params.billingAddress && { avs_street_address: params.billingAddress }),
      };
    }

    // Generate and attach signature
    const signature = this.generateSignature(requestData);
    (requestData.general as Record<string, unknown>).signature = signature;

    console.log('[PaymentGate] Initiating payment:', paymentId);

    try {
      const response = await fetch(`${PAYMENT_API_URL}/v2/payment/card/sale`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();
      console.log('[PaymentGate] Response status:', response.status);

      // Handle error responses
      if (!response.ok || responseData.status === 'error') {
        console.error('[PaymentGate] API Error:', responseData);
        return {
          payment_id: paymentId,
          status: 'error',
          message: responseData.message || 'Payment request failed',
          errors: responseData.errors,
        };
      }

      // Immediate success (rare without 3DS)
      if (responseData.operation?.status === 'success' || responseData.payment?.status === 'success') {
        return {
          payment_id: paymentId,
          status: 'success',
          message: 'Payment successful',
        };
      }

      // Extended 3DS (device fingerprinting iframe)
      if (responseData.threeds2?.iframe || responseData.iframe) {
        const iframe = responseData.threeds2?.iframe || responseData.iframe;
        console.log('[PaymentGate] Extended 3DS - iframe required');
        return {
          payment_id: paymentId,
          status: '3ds_required',
          iframe_url: iframe.url,
          threeds_method_data: iframe.params?.threeDSMethodData || iframe.params?.['3DSMethodData'],
        };
      }

      // Basic 3DS (ACS redirect)
      if (responseData.acs) {
        console.log('[PaymentGate] Basic 3DS - ACS redirect required');
        return {
          payment_id: paymentId,
          status: '3ds_required',
          acs_url: responseData.acs.acs_url,
          pa_req: responseData.acs.pa_req,
          md: responseData.acs.md,
          term_url: responseData.acs.term_url,
        };
      }

      // Decline
      if (responseData.operation?.status === 'decline' || responseData.payment?.status === 'decline') {
        return {
          payment_id: paymentId,
          status: 'decline',
          message: responseData.operation?.message || 'Payment declined',
        };
      }

      // Pending - awaiting callback
      return {
        payment_id: paymentId,
        status: 'pending',
        message: 'Payment is being processed',
      };
    } catch (error) {
      console.error('[PaymentGate] Payment error:', error);
      throw error;
    }
  }

  /**
   * Submit 3DS result (PaRes or cRes)
   */
  static async submit3DSResult(params: {
    paymentId: string;
    paRes: string;
    md: string;
  }): Promise<PaymentResponse> {
    const requestData: Record<string, unknown> = {
      general: {
        project_id: parseInt(PAYMENT_PROJECT_ID),
        payment_id: params.paymentId,
      },
      pares: params.paRes,
      md: params.md,
    };

    const signature = this.generateSignature(requestData);
    (requestData.general as Record<string, unknown>).signature = signature;

    console.log('[PaymentGate] Submitting 3DS result:', params.paymentId);

    try {
      const response = await fetch(`${PAYMENT_API_URL}/v2/payment/card/3ds_result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();
      console.log('[PaymentGate] 3DS result response:', responseData);

      if (responseData.operation?.status === 'success' || responseData.payment?.status === 'success') {
        return { payment_id: params.paymentId, status: 'success' };
      } else if (responseData.operation?.status === 'decline' || responseData.payment?.status === 'decline') {
        return {
          payment_id: params.paymentId,
          status: 'decline',
          message: responseData.operation?.message || 'Payment declined',
        };
      }

      return { payment_id: params.paymentId, status: 'pending' };
    } catch (error) {
      console.error('[PaymentGate] 3DS result error:', error);
      throw error;
    }
  }

  /**
   * Initiate 3DS check after fingerprinting iframe completion
   */
  static async initiate3DSCheck(paymentId: string, completionIndicator: boolean): Promise<PaymentResponse> {
    console.log('[PaymentGate] Initiating 3DS check:', { paymentId, completionIndicator });

    const requestData: Record<string, unknown> = {
      general: {
        project_id: parseInt(PAYMENT_PROJECT_ID),
        payment_id: paymentId,
      },
      threeds_completion_indicator: completionIndicator,
    };

    const signature = this.generateSignature(requestData);
    (requestData.general as Record<string, unknown>).signature = signature;

    try {
      const response = await fetch(`${PAYMENT_API_URL}/v2/payment/card/3ds_check_iframe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();
      console.log('[PaymentGate] 3DS check response:', JSON.stringify(responseData, null, 2));

      // Success (frictionless flow)
      if (responseData.operation?.status === 'success' || responseData.payment?.status === 'success') {
        return { payment_id: paymentId, status: 'success' };
      }

      // Challenge required (redirect)
      if (responseData.threeds2?.redirect) {
        const redirect = responseData.threeds2.redirect;
        console.log('[PaymentGate] Challenge flow required');
        return {
          payment_id: paymentId,
          status: '3ds_required',
          acs_url: redirect.url,
          pa_req: redirect.params?.creq,
          md: redirect.params?.threeDSSessionData,
        };
      }

      // Decline
      if (responseData.operation?.status === 'decline' || responseData.payment?.status === 'decline') {
        return {
          payment_id: paymentId,
          status: 'decline',
          message: responseData.operation?.message || 'Payment declined',
        };
      }

      return { payment_id: paymentId, status: 'pending' };
    } catch (error) {
      console.error('[PaymentGate] 3DS check error:', error);
      throw error;
    }
  }

  /**
   * Check payment status (for polling)
   */
  static async checkPaymentStatus(paymentId: string): Promise<{
    status: 'success' | 'decline' | 'pending' | 'unknown';
    message?: string;
    acs?: {
      acs_url: string;
      pa_req: string;
      md: string;
      term_url?: string;
    };
  }> {
    const requestData: Record<string, unknown> = {
      general: {
        project_id: parseInt(PAYMENT_PROJECT_ID),
        payment_id: paymentId,
      },
    };

    const signature = this.generateSignature(requestData);
    (requestData.general as Record<string, unknown>).signature = signature;

    try {
      const response = await fetch(`${PAYMENT_API_URL}/v2/payment/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();

      // Transaction not found = still processing
      if (responseData.errors?.some((e: { code?: string; message?: string }) =>
        e.code === '3061' || e.message?.includes('not found'))) {
        return { status: 'pending', message: 'Payment is being processed' };
      }

      // Check for ACS data
      if (responseData.acs) {
        return {
          status: 'pending',
          message: '3DS authentication required',
          acs: {
            acs_url: responseData.acs.acs_url,
            pa_req: responseData.acs.pa_req,
            md: responseData.acs.md,
            term_url: responseData.acs.term_url,
          },
        };
      }

      const paymentStatus = String(responseData.payment?.status || '').toLowerCase();
      const operationStatus = String(responseData.operation?.status || '').toLowerCase();

      if (['success', 'completed'].includes(paymentStatus) || operationStatus === 'success') {
        return { status: 'success' };
      }
      if (['decline', 'declined', 'failed', 'error'].includes(paymentStatus) || operationStatus === 'decline') {
        return { status: 'decline', message: responseData.operation?.message || 'Payment declined' };
      }
      if (['pending', 'processing', 'awaiting 3ds result'].includes(paymentStatus)) {
        return { status: 'pending' };
      }

      return { status: 'unknown', message: 'Unable to determine payment status' };
    } catch (error) {
      console.error('[PaymentGate] Status check error:', error);
      return { status: 'unknown', message: 'Error checking payment status' };
    }
  }
}
