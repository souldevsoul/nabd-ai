"use client";

import { Header, Footer } from "@/components/layout";

export default function AMLPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <article className="pt-32 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black tracking-tight mb-4">Anti-Money Laundering Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 20, 2025</p>

          <div className="prose prose-invert prose-amber max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">1. Introduction and Purpose</h2>
              <p className="text-muted-foreground mb-4">
                NABD, operated by NewCo Ltd. (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), is committed to preventing money laundering, terrorist financing, and other financial crimes. This Anti-Money Laundering (AML) Policy outlines our commitment to regulatory compliance and the measures we implement to detect, prevent, and report suspicious activities.
              </p>
              <p className="text-muted-foreground">
                This policy applies to all employees, contractors, and third parties who conduct business on behalf of NABD.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">2. Regulatory Framework</h2>
              <p className="text-muted-foreground mb-4">
                Our AML program is designed to comply with applicable laws and regulations, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>European Union Anti-Money Laundering Directives (AMLD)</li>
                <li>Financial Action Task Force (FATF) Recommendations</li>
                <li>Local jurisdiction requirements where we operate</li>
                <li>Payment Card Industry Data Security Standards (PCI DSS)</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                We regularly review and update our AML procedures to ensure continued compliance with evolving regulations.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">3. Risk-Based Approach</h2>
              <p className="text-muted-foreground mb-4">
                We adopt a risk-based approach to AML compliance, tailoring our due diligence measures to the level of risk presented by each customer relationship and transaction. Risk factors we consider include:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Customer type and business nature</li>
                <li>Geographic location and jurisdiction risk</li>
                <li>Transaction patterns and volume</li>
                <li>Payment methods used</li>
                <li>Service types requested</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">4. Customer Due Diligence (CDD)</h2>

              <h3 className="text-xl font-semibold mb-3">4.1 Standard Due Diligence</h3>
              <p className="text-muted-foreground mb-4">
                For all customers, we collect and verify:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Full legal name</li>
                <li>Email address (verified)</li>
                <li>Billing address</li>
                <li>Payment method information</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">4.2 Enhanced Due Diligence (EDD)</h3>
              <p className="text-muted-foreground mb-4">
                For higher-risk customers or transactions, we may require additional information:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Government-issued identification</li>
                <li>Proof of address</li>
                <li>Source of funds documentation</li>
                <li>Business registration documents (for organizations)</li>
                <li>Beneficial ownership information</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">4.3 Ongoing Monitoring</h3>
              <p className="text-muted-foreground">
                We continuously monitor customer activity and transactions to identify unusual patterns that may indicate money laundering or other financial crimes. This includes automated transaction monitoring and periodic reviews of customer relationships.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">5. Know Your Customer (KYC)</h2>
              <p className="text-muted-foreground mb-4">
                Our KYC procedures ensure we understand who our customers are and the nature of their business with us. KYC measures include:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Identity verification at account registration</li>
                <li>Screening against sanctions lists and PEP (Politically Exposed Persons) databases</li>
                <li>Verification of business entities and beneficial owners</li>
                <li>Regular customer information updates</li>
                <li>Enhanced verification for high-value transactions</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">6. Transaction Monitoring</h2>
              <p className="text-muted-foreground mb-4">
                We monitor transactions to detect potentially suspicious activity, including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Unusual transaction patterns or volumes</li>
                <li>Transactions inconsistent with customer profile</li>
                <li>Rapid movement of funds</li>
                <li>Multiple transactions just below reporting thresholds</li>
                <li>Transactions involving high-risk jurisdictions</li>
                <li>Use of multiple payment methods or accounts</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Suspicious activities are escalated to our compliance team for investigation and potential reporting to authorities.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">7. Sanctions Compliance</h2>
              <p className="text-muted-foreground mb-4">
                We screen all customers against applicable sanctions lists, including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>EU Consolidated Sanctions List</li>
                <li>UN Security Council Sanctions Lists</li>
                <li>OFAC (Office of Foreign Assets Control) Lists</li>
                <li>Other applicable national sanctions lists</li>
              </ul>
              <p className="text-muted-foreground">
                We do not conduct business with individuals or entities on sanctions lists, or in sanctioned jurisdictions where prohibited.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">8. Suspicious Activity Reporting</h2>
              <p className="text-muted-foreground mb-4">
                When we identify suspicious activity, we:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Document the activity and reasons for suspicion</li>
                <li>Escalate to our AML Compliance Officer</li>
                <li>File Suspicious Activity Reports (SARs) with relevant authorities as required</li>
                <li>Maintain confidentiality of reports (tipping off is prohibited)</li>
                <li>Retain records for the legally required period</li>
              </ul>
              <p className="text-muted-foreground">
                We may suspend or terminate accounts involved in suspected money laundering or financial crimes without prior notice.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">9. Record Keeping</h2>
              <p className="text-muted-foreground mb-4">
                We maintain comprehensive records of:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Customer identification and verification documents</li>
                <li>Transaction records and history</li>
                <li>Due diligence documentation</li>
                <li>Suspicious activity reports and investigations</li>
                <li>AML training records</li>
              </ul>
              <p className="text-muted-foreground">
                Records are retained for a minimum of 5 years after the end of the customer relationship or transaction date, or longer if required by applicable law.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">10. Employee Training</h2>
              <p className="text-muted-foreground mb-4">
                All relevant employees receive AML training covering:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Recognition of suspicious activities</li>
                <li>Customer due diligence procedures</li>
                <li>Reporting obligations and procedures</li>
                <li>Legal and regulatory requirements</li>
                <li>Consequences of non-compliance</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Training is provided upon hiring and refreshed annually, with additional training when regulations change.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">11. Compliance Officer</h2>
              <p className="text-muted-foreground mb-4">
                Our designated AML Compliance Officer is responsible for:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Overseeing the AML program</li>
                <li>Ensuring regulatory compliance</li>
                <li>Investigating suspicious activities</li>
                <li>Filing required reports with authorities</li>
                <li>Coordinating with law enforcement when required</li>
                <li>Regular program reviews and updates</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">12. Customer Obligations</h2>
              <p className="text-muted-foreground mb-4">
                By using our services, customers agree to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide accurate and complete identification information</li>
                <li>Update information when it changes</li>
                <li>Cooperate with verification and due diligence requests</li>
                <li>Use our services only for lawful purposes</li>
                <li>Not use our platform to launder money or finance illegal activities</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Failure to comply may result in account suspension, termination, and reporting to authorities.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">13. Policy Updates</h2>
              <p className="text-muted-foreground">
                This AML Policy is reviewed and updated regularly to reflect changes in regulations, best practices, and our business operations. Material changes will be communicated to affected parties as appropriate.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">14. Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                For questions about this AML Policy or to report suspicious activity:
              </p>
              <p className="text-muted-foreground">
                <strong>NewCo Ltd.</strong><br />
                New Address 1<br />
                Company No: NEW123<br />
                <br />
                <strong>AML Compliance:</strong> compliance@nabd.ai<br />
                <strong>General Inquiries:</strong> legal@nabd.ai<br />
                <br />
                All reports are treated confidentially and investigated thoroughly.
              </p>
            </section>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
