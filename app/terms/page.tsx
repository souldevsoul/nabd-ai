import { Metadata } from "next";
import { Header, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "Қызмет шарттары",
  description: "Vertex-тің AI консалтинг қызметтерін пайдалану шарттары мен ережелері.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <article className="pt-32 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black tracking-tight mb-4">Қызмет шарттары</h1>
          <p className="text-muted-foreground mb-8">Соңғы жаңарту: 20 желтоқсан 2025</p>

          <div className="prose prose-invert prose-amber max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">1. Introduction and Acceptance</h2>
              <p className="text-muted-foreground mb-4">
                These Terms of Service govern your use of Vertex&apos;s AI consulting platform and services, operated by NewCo Ltd. (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), registered at New Address 1, Company No: NEW123.
              </p>
              <p className="text-muted-foreground mb-4">
                By accessing or using our services, you agree to be bound by these Terms. If you do not agree, you may not use our services.
              </p>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms with reasonable notice. Material changes will be notified to you at least 30 days in advance. Continued use after changes constitutes acceptance.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">2. Services Description</h2>
              <p className="text-muted-foreground mb-4">
                Vertex provides a premium AI consulting platform connecting individual clients with elite AI specialists. Our services include:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Access to verified AI consultants and specialists</li>
                <li>Credit-based payment system for consulting services</li>
                <li>Bespoke AI solutions and strategic advisory</li>
                <li>Platform tools for service delivery and communication</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">3. Consumer Rights (EU)</h2>

              <h3 className="text-xl font-semibold mb-3">3.1 Right of Withdrawal</h3>
              <p className="text-muted-foreground mb-4">
                As a consumer in the European Union, you have the right to withdraw from credit purchases within 14 days of purchase without giving any reason. To exercise this right, contact us at support@vertex.ai with your order details.
              </p>
              <p className="text-muted-foreground mb-4">
                Please note: If you request consulting services to begin during the withdrawal period and the service is fully performed, you may not be entitled to withdraw or may be required to pay proportionate costs for services rendered.
              </p>

              <h3 className="text-xl font-semibold mb-3">3.2 Consumer Guarantees</h3>
              <p className="text-muted-foreground">
                Services must be performed with reasonable care and skill. If services are defective or not as described, you may be entitled to a remedy including service correction, price reduction, or refund in accordance with EU consumer protection laws.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">4. Credit System</h2>

              <h3 className="text-xl font-semibold mb-3">4.1 Credit Purchases</h3>
              <p className="text-muted-foreground mb-4">
                Credits are purchased directly as one-time transactions. Vertex does not operate on a subscription model. Each credit purchase is a separate contract for digital content.
              </p>
              <p className="text-muted-foreground mb-4">
                Exchange rate: 10 credits = 1 USD (or equivalent in EUR). Prices are displayed in your local currency at checkout.
              </p>

              <h3 className="text-xl font-semibold mb-3">4.2 Credit Terms</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Credits do not expire</li>
                <li>Credits are non-transferable between accounts</li>
                <li>Unused credits may be refunded within 30 days of purchase (subject to withdrawal rights)</li>
                <li>Credits are debited only when services are successfully completed</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">5. User Obligations</h2>
              <p className="text-muted-foreground mb-4">
                You agree to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide accurate account information</li>
                <li>Maintain confidentiality of your credentials</li>
                <li>Use services only for lawful purposes</li>
                <li>Not attempt to circumvent platform security</li>
                <li>Communicate respectfully with specialists</li>
                <li>Comply with all applicable EU and local laws</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">6. Payment Terms</h2>
              <p className="text-muted-foreground mb-4">
                All payments are processed securely through authorized payment providers. We accept Visa and Mastercard.
              </p>
              <p className="text-muted-foreground mb-4">
                Prices include applicable VAT where required. VAT will be shown separately at checkout for EU customers.
              </p>
              <p className="text-muted-foreground">
                You will receive a tax-compliant invoice for each purchase via email.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">7. Refund Policy</h2>
              <p className="text-muted-foreground mb-4">
                See our dedicated <a href="/refund" className="text-primary hover:underline">Refund Policy</a> for complete details.
              </p>
              <p className="text-muted-foreground">
                In summary: Unused credits may be refunded within 30 days. Credits used for completed services are generally non-refundable, though we maintain a satisfaction guarantee and will work to resolve any issues.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">8. Intellectual Property</h2>
              <p className="text-muted-foreground mb-4">
                All platform content, trademarks, and intellectual property remain the property of NewCo Ltd. or our licensors.
              </p>
              <p className="text-muted-foreground">
                Deliverables from consulting engagements: Ownership and licensing terms will be specified in individual engagement agreements between you and the specialist.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">9. Liability</h2>
              <p className="text-muted-foreground mb-4">
                Nothing in these Terms excludes or limits our liability for:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Death or personal injury caused by negligence</li>
                <li>Fraud or fraudulent misrepresentation</li>
                <li>Any liability that cannot be excluded under EU law</li>
              </ul>
              <p className="text-muted-foreground">
                Subject to the above, our liability for any claim is limited to the total amount you paid us in the 12 months preceding the claim. We are not liable for indirect or consequential losses that are not reasonably foreseeable.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">10. Data Protection</h2>
              <p className="text-muted-foreground">
                Your personal data is processed in accordance with our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> and applicable data protection laws including GDPR. You have rights regarding your personal data as detailed in our Privacy Policy.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">11. Termination</h2>
              <p className="text-muted-foreground mb-4">
                You may close your account at any time. We may suspend or terminate accounts for violations of these Terms, with notice where reasonably possible.
              </p>
              <p className="text-muted-foreground">
                Upon termination, unused credits may be refunded in accordance with our refund policy. Completed services and their terms survive termination.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">12. Dispute Resolution</h2>
              <p className="text-muted-foreground mb-4">
                These Terms are governed by the laws of the European Union and applicable member state law.
              </p>
              <p className="text-muted-foreground mb-4">
                In the event of a dispute, we encourage you to contact us first at legal@vertex.ai to seek an amicable resolution.
              </p>
              <p className="text-muted-foreground mb-4">
                If you are a consumer in the EU, you retain the right to bring proceedings in the courts of your country of residence. You may also use the EU Online Dispute Resolution platform at <a href="https://ec.europa.eu/consumers/odr" className="text-primary hover:underline" target="_blank" rel="noopener">https://ec.europa.eu/consumers/odr</a>.
              </p>
              <p className="text-muted-foreground">
                Nothing in these Terms affects your statutory rights as a consumer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">13. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about these Terms of Service, please contact us at:<br />
                <br />
                NewCo Ltd.<br />
                New Address 1<br />
                Company No: NEW123<br />
                <br />
                Email: legal@vertex.ai<br />
                Support: support@vertex.ai
              </p>
            </section>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
