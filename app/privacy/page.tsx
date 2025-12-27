import { Metadata } from "next";
import { Header, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "Құпиялылық саясаты",
  description: "Vertex GDPR бойынша жеке ақпаратыңызды қалай жинайтынын, пайдаланатынын және қорғайтынын біліңіз.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <article className="pt-32 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black tracking-tight mb-4">Құпиялылық саясаты</h1>
          <p className="text-muted-foreground mb-8">Соңғы жаңарту: 20 желтоқсан 2025</p>

          <div className="prose prose-invert prose-amber max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">1. Кіріспе</h2>
              <p className="text-muted-foreground mb-4">
                NewCo Ltd. (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), Company No: NEW123, registered at New Address 1, is committed to protecting your privacy and personal data in accordance with the General Data Protection Regulation (GDPR) and applicable data protection laws.
              </p>
              <p className="text-muted-foreground mb-4">
                This Privacy Policy explains how we collect, use, store, and protect your personal data when you use the Vertex platform and services.
              </p>
              <p className="text-muted-foreground">
                We are the data controller for the personal data we process. Our Data Protection Officer can be contacted at dpo@vertex.ai.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">2. Біз жинайтын жеке деректер</h2>

              <h3 className="text-xl font-semibold mb-3">2.1 Сіз ұсынатын ақпарат</h3>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Account information: name, email address, password (encrypted)</li>
                <li>Payment information: billing address, payment card details (processed by our payment provider)</li>
                <li>Profile information: professional background, preferences</li>
                <li>Communications: messages sent through our platform, support inquiries</li>
                <li>Service requests: project descriptions, requirements</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">2.2 Автоматты түрде жиналатын ақпарат</h3>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Technical data: IP address, browser type and version, device information</li>
                <li>Usage data: pages visited, time spent, interaction patterns</li>
                <li>Cookies and tracking technologies (see our <a href="/cookies" className="text-primary hover:underline">Cookie Policy</a>)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">2.3 Үшінші тараптардан алынған ақпарат</h3>
              <p className="text-muted-foreground">
                We may receive data from payment processors, analytics providers, and security services necessary to operate our platform.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">3. Өңдеудің заңды негіздері мен мақсаттары</h2>
              <p className="text-muted-foreground mb-4">
                We process your personal data only when we have a lawful basis:
              </p>

              <h3 className="text-xl font-semibold mb-3">3.1 Contractual Necessity</h3>
              <p className="text-muted-foreground mb-4">
                To provide our services, process transactions, and fulfill our contractual obligations to you.
              </p>

              <h3 className="text-xl font-semibold mb-3">3.2 Legitimate Interests</h3>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Platform improvement and optimization</li>
                <li>Fraud prevention and security</li>
                <li>Customer support and relationship management</li>
                <li>Analytics and business intelligence</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">3.3 Legal Obligations</h3>
              <p className="text-muted-foreground mb-4">
                To comply with legal requirements including tax, accounting, and anti-money laundering obligations.
              </p>

              <h3 className="text-xl font-semibold mb-3">3.4 Consent</h3>
              <p className="text-muted-foreground">
                For marketing communications and non-essential cookies. You may withdraw consent at any time.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">4. Деректерді бөлісу және ашу</h2>
              <p className="text-muted-foreground mb-4">
                We do not sell your personal data. We share data only as follows:
              </p>

              <h3 className="text-xl font-semibold mb-3">4.1 Service Providers</h3>
              <p className="text-muted-foreground mb-4">
                We engage trusted third-party processors for:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Payment processing (PCI-DSS compliant)</li>
                <li>Cloud hosting and infrastructure</li>
                <li>Email communications</li>
                <li>Analytics services</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                All processors are bound by data processing agreements ensuring GDPR compliance.
              </p>

              <h3 className="text-xl font-semibold mb-3">4.2 Specialists</h3>
              <p className="text-muted-foreground mb-4">
                When you engage a specialist, relevant project information is shared to facilitate service delivery.
              </p>

              <h3 className="text-xl font-semibold mb-3">4.3 Legal Requirements</h3>
              <p className="text-muted-foreground">
                We may disclose data when required by law, to protect our rights, or in response to valid legal requests from authorities.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">5. Халықаралық деректерді тасымалдау</h2>
              <p className="text-muted-foreground mb-4">
                Your data is primarily stored within the European Economic Area (EEA). Where we transfer data outside the EEA, we ensure appropriate safeguards are in place:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Standard Contractual Clauses approved by the European Commission</li>
                <li>Adequacy decisions by the European Commission</li>
                <li>Other legally recognized transfer mechanisms</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">6. Деректерді сақтау</h2>
              <p className="text-muted-foreground mb-4">
                We retain personal data only as long as necessary:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Account data: While your account is active and up to 7 years after closure for legal obligations</li>
                <li>Transaction records: 7 years for tax and accounting purposes</li>
                <li>Marketing data: Until you withdraw consent or 2 years of inactivity</li>
                <li>Technical logs: 90 days</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">7. Деректер қауіпсіздігі</h2>
              <p className="text-muted-foreground mb-4">
                We implement appropriate technical and organizational measures to protect your data:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Encryption in transit (TLS) and at rest</li>
                <li>Access controls and authentication</li>
                <li>Regular security assessments and audits</li>
                <li>Employee training on data protection</li>
                <li>Incident response procedures</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                In the event of a data breach affecting your rights, we will notify you and the relevant supervisory authority within 72 hours as required by GDPR.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">8. GDPR бойынша сіздің құқықтарыңыз</h2>
              <p className="text-muted-foreground mb-4">
                You have the following rights regarding your personal data:
              </p>

              <h3 className="text-xl font-semibold mb-3">8.1 Right of Access</h3>
              <p className="text-muted-foreground mb-4">
                Request a copy of your personal data we hold.
              </p>

              <h3 className="text-xl font-semibold mb-3">8.2 Right to Rectification</h3>
              <p className="text-muted-foreground mb-4">
                Correct inaccurate or incomplete personal data.
              </p>

              <h3 className="text-xl font-semibold mb-3">8.3 Right to Erasure</h3>
              <p className="text-muted-foreground mb-4">
                Request deletion of your personal data (subject to legal retention requirements).
              </p>

              <h3 className="text-xl font-semibold mb-3">8.4 Right to Restriction</h3>
              <p className="text-muted-foreground mb-4">
                Request restriction of processing in certain circumstances.
              </p>

              <h3 className="text-xl font-semibold mb-3">8.5 Right to Data Portability</h3>
              <p className="text-muted-foreground mb-4">
                Receive your data in a structured, commonly used format and transmit it to another controller.
              </p>

              <h3 className="text-xl font-semibold mb-3">8.6 Right to Object</h3>
              <p className="text-muted-foreground mb-4">
                Object to processing based on legitimate interests or for direct marketing.
              </p>

              <h3 className="text-xl font-semibold mb-3">8.7 Right to Withdraw Consent</h3>
              <p className="text-muted-foreground mb-4">
                Withdraw consent for processing based on consent (does not affect prior lawful processing).
              </p>

              <p className="text-muted-foreground">
                To exercise these rights, contact us at privacy@vertex.ai. We will respond within one month. You also have the right to lodge a complaint with your local data protection supervisory authority.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">9. Cookie файлдары және бақылау</h2>
              <p className="text-muted-foreground">
                We use cookies and similar technologies. For detailed information, see our <a href="/cookies" className="text-primary hover:underline">Cookie Policy</a>. You can manage cookie preferences through your browser settings or our cookie consent tool.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">10. Маркетингтік байланыстар</h2>
              <p className="text-muted-foreground">
                We send marketing communications only with your consent. You may unsubscribe at any time using the link in our emails or by contacting privacy@vertex.ai. We will process your opt-out within 48 hours.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">11. Балалардың құпиялылығы</h2>
              <p className="text-muted-foreground">
                Our services are not intended for individuals under 16 years of age. We do not knowingly collect personal data from children. If you believe we have collected data from a child, please contact us immediately at privacy@vertex.ai.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">12. Автоматтандырылған шешім қабылдау</h2>
              <p className="text-muted-foreground">
                We may use automated systems to match clients with specialists. You have the right to request human review of automated decisions that significantly affect you.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">13. Саясатқа өзгерістер</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. Material changes will be notified to you by email or prominent notice on our platform at least 30 days in advance. The &quot;Last updated&quot; date will be revised accordingly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">14. Байланыс ақпараты</h2>
              <p className="text-muted-foreground mb-4">
                For questions, concerns, or to exercise your rights, please contact:
              </p>
              <p className="text-muted-foreground">
                <strong>Data Controller:</strong><br />
                NewCo Ltd.<br />
                New Address 1<br />
                Company No: NEW123<br />
                <br />
                <strong>Data Protection Officer:</strong><br />
                Email: dpo@vertex.ai<br />
                <br />
                <strong>Privacy Inquiries:</strong><br />
                Email: privacy@vertex.ai<br />
                <br />
                <strong>General Support:</strong><br />
                Email: support@vertex.ai
              </p>
            </section>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
