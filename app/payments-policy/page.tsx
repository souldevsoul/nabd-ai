"use client";

import { Header, Footer } from "@/components/layout";

export default function PaymentsPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <article className="pt-32 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black tracking-tight mb-4">Payments Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 20, 2025</p>

          <div className="prose prose-invert prose-amber max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground mb-4">
                This Payments Policy explains how NABD, operated by NewCo Ltd. (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), handles payment processing, billing, and related financial matters for our AI consulting platform.
              </p>
              <p className="text-muted-foreground">
                By using our services and making purchases on our platform, you agree to this Payments Policy. Please read it carefully alongside our Terms of Service and Refund Policy.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">2. Credit System</h2>

              <h3 className="text-xl font-semibold mb-3">2.1 How Credits Work</h3>
              <p className="text-muted-foreground mb-4">
                NABD operates on a credit-based payment system. Credits are our platform currency used to access AI consulting services and other offerings.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Exchange rate: 10 credits = $1 USD (or equivalent in local currency)</li>
                <li>Credits are purchased upfront and deducted when services are rendered</li>
                <li>Credits never expire and remain valid indefinitely</li>
                <li>Credits are non-transferable between accounts</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">2.2 Credit Packages</h3>
              <p className="text-muted-foreground mb-4">
                We offer various credit packages with volume discounts. Larger packages provide better value per credit. Custom packages are available for organizations with specific needs.
              </p>

              <h3 className="text-xl font-semibold mb-3">2.3 Bonus Credits</h3>
              <p className="text-muted-foreground">
                Promotional bonus credits may be offered periodically. Bonus credits are subject to specific terms and are typically non-refundable but never expire.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">3. Accepted Payment Methods</h2>
              <p className="text-muted-foreground mb-4">
                We accept the following payment methods for credit purchases:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Credit Cards:</strong> Visa, Mastercard</li>
                <li><strong>Debit Cards:</strong> Visa Debit, Mastercard Debit</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                All payments are processed securely through our authorized payment providers. We do not store your full card details on our servers.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">4. Pricing and Currency</h2>

              <h3 className="text-xl font-semibold mb-3">4.1 Displayed Prices</h3>
              <p className="text-muted-foreground mb-4">
                Prices are displayed in USD by default. Local currency equivalents may be shown at checkout based on your location.
              </p>

              <h3 className="text-xl font-semibold mb-3">4.2 Taxes and VAT</h3>
              <p className="text-muted-foreground mb-4">
                Prices may be exclusive of applicable taxes. VAT and other taxes will be calculated and displayed at checkout based on your billing address. EU customers will see VAT applied in accordance with EU regulations.
              </p>

              <h3 className="text-xl font-semibold mb-3">4.3 Currency Conversion</h3>
              <p className="text-muted-foreground">
                If paying in a currency other than USD, your bank or card issuer may apply currency conversion fees. These fees are beyond our control and are the responsibility of the cardholder.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">5. Payment Processing</h2>

              <h3 className="text-xl font-semibold mb-3">5.1 Authorization</h3>
              <p className="text-muted-foreground mb-4">
                When you submit a payment, we request authorization from your card issuer. The authorization hold is converted to a charge upon successful processing.
              </p>

              <h3 className="text-xl font-semibold mb-3">5.2 Failed Payments</h3>
              <p className="text-muted-foreground mb-4">
                If a payment fails, credits will not be added to your account. Common reasons for payment failure include:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Insufficient funds</li>
                <li>Card expired or invalid</li>
                <li>Transaction declined by issuing bank</li>
                <li>3D Secure authentication failure</li>
              </ul>
              <p className="text-muted-foreground">
                Please contact your card issuer if payments are repeatedly declined, or try an alternative payment method.
              </p>

              <h3 className="text-xl font-semibold mb-3">5.3 Payment Confirmation</h3>
              <p className="text-muted-foreground">
                Upon successful payment, you will receive an email confirmation with your receipt. Credits are added to your account immediately after payment confirmation.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">6. Invoices and Receipts</h2>
              <p className="text-muted-foreground mb-4">
                We provide tax-compliant invoices for all purchases. Invoices are sent automatically to your registered email address and are available in your account dashboard.
              </p>
              <p className="text-muted-foreground">
                Invoices include all required information for business expense reporting, including VAT registration numbers where applicable.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">7. Refunds and Chargebacks</h2>

              <h3 className="text-xl font-semibold mb-3">7.1 Refund Policy</h3>
              <p className="text-muted-foreground mb-4">
                Please refer to our dedicated Refund Policy for complete details on refunds, including EU consumer withdrawal rights and our satisfaction guarantee.
              </p>

              <h3 className="text-xl font-semibold mb-3">7.2 Chargebacks</h3>
              <p className="text-muted-foreground mb-4">
                We encourage you to contact us before initiating a chargeback with your card issuer. Our support team can often resolve issues more quickly and efficiently.
              </p>
              <p className="text-muted-foreground">
                Fraudulent chargebacks may result in account suspension and potential legal action. We maintain records of all transactions and service delivery for dispute resolution.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">8. Payment Security</h2>
              <p className="text-muted-foreground mb-4">
                We take payment security seriously and implement industry-standard measures:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>PCI DSS compliant payment processing</li>
                <li>TLS encryption for all payment data transmission</li>
                <li>3D Secure (3DS) authentication for card payments</li>
                <li>Fraud detection and prevention systems</li>
                <li>Regular security audits and assessments</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Your full card details are never stored on our servers. Payment information is handled directly by our certified payment processors.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">9. Billing Disputes</h2>
              <p className="text-muted-foreground mb-4">
                If you believe there has been an error in billing, please contact us within 30 days of the transaction date:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Email: billing@nabd.ai</li>
                <li>Include your order number and description of the issue</li>
                <li>We will investigate and respond within 5 business days</li>
              </ul>
              <p className="text-muted-foreground">
                For EU consumers, you may also use the EU Online Dispute Resolution platform for unresolved billing disputes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                For questions about payments, billing, or this Payments Policy:
              </p>
              <p className="text-muted-foreground">
                <strong>NewCo Ltd.</strong><br />
                New Address 1<br />
                Company No: NEW123<br />
                <br />
                <strong>Billing Inquiries:</strong> billing@nabd.ai<br />
                <strong>General Support:</strong> support@nabd.ai<br />
                <br />
                Customer Service: Monday-Friday, 9:00-17:00 CET
              </p>
            </section>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
