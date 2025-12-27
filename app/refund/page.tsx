import { Metadata } from "next";
import { Header, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "Қайтару саясаты",
  description: "Vertex қайтару саясаты және ЕО тұтынушыларының шегіну құқықтары.",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <article className="pt-32 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black tracking-tight mb-4">Қайтару саясаты</h1>
          <p className="text-muted-foreground mb-8">Соңғы жаңарту: 24 желтоқсан 2024</p>

          <div className="prose prose-invert prose-amber max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">1. Overview</h2>
              <p className="text-muted-foreground mb-4">
                At Vertex, operated by NewCo Ltd., we are committed to your satisfaction. This Refund Policy outlines your rights to refunds and withdrawals in compliance with EU consumer protection laws.
              </p>
              <p className="text-muted-foreground">
                All refunds are subject to the terms outlined below and your statutory rights under EU law.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">2. EU Right of Withdrawal (14-Day Cooling-Off Period)</h2>

              <h3 className="text-xl font-semibold mb-3">2.1 Your Rights</h3>
              <p className="text-muted-foreground mb-4">
                As a consumer in the European Union, you have the right to withdraw from credit purchases within 14 days of purchase without providing a reason, in accordance with the EU Consumer Rights Directive.
              </p>

              <h3 className="text-xl font-semibold mb-3">2.2 How to Exercise Your Right</h3>
              <p className="text-muted-foreground mb-4">
                To withdraw from a purchase, send a clear written statement to:
              </p>
              <p className="text-muted-foreground mb-4">
                Email: support@vertex.ai<br />
                Subject line: &quot;Withdrawal Request&quot;<br />
                Include: Your name, order number, and date of purchase
              </p>
              <p className="text-muted-foreground mb-4">
                The 14-day period begins on the day of purchase. You must communicate your decision to withdraw before the deadline.
              </p>

              <h3 className="text-xl font-semibold mb-3">2.3 Important Exception - Services Commenced Early</h3>
              <p className="text-muted-foreground">
                If you request consulting services to begin during the 14-day withdrawal period and the service is fully performed, you lose your right to withdraw. However, you will only pay proportionate costs for services actually rendered before withdrawal.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">3. Credit Refund Policy</h2>

              <h3 className="text-xl font-semibold mb-3">3.1 Unused Credits</h3>
              <p className="text-muted-foreground mb-4">
                Unused credits may be refunded within 30 days of purchase. After 30 days, credits remain valid indefinitely but are non-refundable.
              </p>
              <p className="text-muted-foreground mb-4">
                To request a refund of unused credits, contact support@vertex.ai with:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Your account email</li>
                <li>Purchase date and order number</li>
                <li>Number of unused credits</li>
                <li>Reason for refund (optional but helpful)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">3.2 Partially Used Credit Packages</h3>
              <p className="text-muted-foreground mb-4">
                If you have used some credits from a package:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Within 14 days: You may withdraw and receive a refund for unused credits (minus the standard rate for credits used)</li>
                <li>After 14 days but within 30 days: Refund available for unused credits at the package rate</li>
                <li>After 30 days: No refund available, but credits remain valid</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">3.3 Bonus Credits</h3>
              <p className="text-muted-foreground">
                Bonus credits received as part of promotional packages are non-refundable but remain valid indefinitely.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">4. Service Refunds</h2>

              <h3 className="text-xl font-semibold mb-3">4.1 Completed Services</h3>
              <p className="text-muted-foreground mb-4">
                Credits used for successfully completed consulting services are generally non-refundable. However, we maintain a satisfaction guarantee (see Section 5).
              </p>

              <h3 className="text-xl font-semibold mb-3">4.2 Cancelled or Incomplete Services</h3>
              <p className="text-muted-foreground mb-4">
                If a service is cancelled before completion or a specialist fails to deliver:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Full credit refund to your account balance</li>
                <li>Option to cash refund within 14 days of cancellation</li>
                <li>No penalty or deduction</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">4.3 Service Defects</h3>
              <p className="text-muted-foreground">
                If services are defective, not as described, or fail to meet reasonable quality standards, you are entitled to remedies under EU consumer law, including service correction, price reduction, or refund.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">5. Satisfaction Guarantee</h2>
              <p className="text-muted-foreground mb-4">
                We stand behind the quality of our specialist services. If you are not satisfied with a completed service:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Contact us within 7 days of service completion</li>
                <li>Provide specific details about your concerns</li>
                <li>We will review and offer remedies, which may include:
                  <ul className="list-circle pl-6 mt-2 space-y-1">
                    <li>Service revision by the same specialist</li>
                    <li>Reassignment to a different specialist</li>
                    <li>Partial or full credit refund</li>
                  </ul>
                </li>
              </ul>
              <p className="text-muted-foreground">
                Our goal is to ensure every engagement meets your expectations and our standards of excellence.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">6. Refund Processing</h2>

              <h3 className="text-xl font-semibold mb-3">6.1 Processing Time</h3>
              <p className="text-muted-foreground mb-4">
                We process refund requests within 5 business days of approval. Refunds are issued to your original payment method.
              </p>

              <h3 className="text-xl font-semibold mb-3">6.2 Payment Method Timing</h3>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Credit/Debit cards: 5-10 business days (depending on your bank)</li>
                <li>Other payment methods: As specified by the payment provider</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">6.3 Currency and Fees</h3>
              <p className="text-muted-foreground">
                Refunds are issued in the original purchase currency. We do not charge refund processing fees. However, your bank or payment provider may apply currency conversion or transaction fees beyond our control.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">7. Non-Refundable Items</h2>
              <p className="text-muted-foreground mb-4">
                The following are non-refundable:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Bonus credits from promotional offers</li>
                <li>Credits older than 30 days (unless subject to satisfaction guarantee)</li>
                <li>Gift credits or promotional codes</li>
                <li>Services fully performed during the withdrawal period with your express consent</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">8. Fraudulent or Abusive Refund Requests</h2>
              <p className="text-muted-foreground">
                We reserve the right to refuse refunds for fraudulent or abusive requests, including repeated refund requests without valid reason. Such actions may result in account suspension or termination.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">9. Dispute Resolution</h2>
              <p className="text-muted-foreground mb-4">
                If you are not satisfied with our refund decision, you may:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Contact our customer support team for escalation</li>
                <li>Use the EU Online Dispute Resolution platform: <a href="https://ec.europa.eu/consumers/odr" className="text-primary hover:underline" target="_blank" rel="noopener">https://ec.europa.eu/consumers/odr</a></li>
                <li>Contact your local consumer protection authority</li>
                <li>Seek legal remedies under applicable law</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">10. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Refund Policy from time to time. Material changes will be notified by email or prominent notice on our platform. Your statutory rights as a consumer are not affected by policy changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                For refund requests or questions about this policy:
              </p>
              <p className="text-muted-foreground">
                NewCo Ltd.<br />
                New Address 1<br />
                Company No: NEW123<br />
                <br />
                Email: support@vertex.ai<br />
                Customer Service: Available Monday-Friday, 9:00-17:00 CET<br />
                <br />
                For urgent refund inquiries: refunds@vertex.ai
              </p>
            </section>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
