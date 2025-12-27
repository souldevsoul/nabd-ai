import { Metadata } from "next";
import { Header, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "Cookie саясаты",
  description: "Vertex cookie файлдарын және ұқсас бақылау технологияларын қалай пайдаланатынын біліңіз.",
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <article className="pt-32 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black tracking-tight mb-4">Cookie саясаты</h1>
          <p className="text-muted-foreground mb-8">Соңғы жаңарту: 24 желтоқсан 2024</p>

          <div className="prose prose-invert prose-amber max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground mb-4">
                This Cookie Policy explains how NewCo Ltd. (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) uses cookies and similar tracking technologies on the Vertex platform.
              </p>
              <p className="text-muted-foreground">
                By using our website, you consent to the use of cookies in accordance with this policy. You can manage your cookie preferences as described below.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">2. What Are Cookies?</h2>
              <p className="text-muted-foreground mb-4">
                Cookies are small text files placed on your device when you visit a website. They help the website remember information about your visit, such as your preferences and actions.
              </p>
              <p className="text-muted-foreground">
                Similar technologies include web beacons, pixels, and local storage, which serve comparable purposes.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">3. Types of Cookies We Use</h2>

              <h3 className="text-xl font-semibold mb-3">3.1 Strictly Necessary Cookies</h3>
              <p className="text-muted-foreground mb-4">
                These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and accessibility.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Authentication and session management</li>
                <li>Security and fraud prevention</li>
                <li>Load balancing</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                <strong>Legal basis:</strong> Contractual necessity<br />
                <strong>Can be disabled:</strong> No (required for service operation)
              </p>

              <h3 className="text-xl font-semibold mb-3">3.2 Functional Cookies</h3>
              <p className="text-muted-foreground mb-4">
                These cookies enable enhanced functionality and personalization, such as remembering your preferences.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Language preferences</li>
                <li>Display preferences (theme, layout)</li>
                <li>User interface customizations</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                <strong>Legal basis:</strong> Legitimate interest / Consent<br />
                <strong>Can be disabled:</strong> Yes
              </p>

              <h3 className="text-xl font-semibold mb-3">3.3 Performance/Analytics Cookies</h3>
              <p className="text-muted-foreground mb-4">
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Page views and navigation patterns</li>
                <li>Error tracking and performance monitoring</li>
                <li>Feature usage statistics</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                <strong>Legal basis:</strong> Consent<br />
                <strong>Can be disabled:</strong> Yes
              </p>

              <h3 className="text-xl font-semibold mb-3">3.4 Marketing/Targeting Cookies</h3>
              <p className="text-muted-foreground mb-4">
                These cookies track your browsing habits to deliver relevant advertisements and measure campaign effectiveness.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Advertising delivery and personalization</li>
                <li>Campaign performance tracking</li>
                <li>Retargeting</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                <strong>Legal basis:</strong> Consent<br />
                <strong>Can be disabled:</strong> Yes
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">4. Cookie Duration</h2>

              <h3 className="text-xl font-semibold mb-3">4.1 Session Cookies</h3>
              <p className="text-muted-foreground mb-4">
                Temporary cookies that are deleted when you close your browser. Used for session management and security.
              </p>

              <h3 className="text-xl font-semibold mb-3">4.2 Persistent Cookies</h3>
              <p className="text-muted-foreground">
                Remain on your device for a set period (up to 12 months) or until manually deleted. Used to remember your preferences across sessions.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">5. Third-Party Cookies</h2>
              <p className="text-muted-foreground mb-4">
                We may use third-party services that set their own cookies. These providers have their own privacy policies:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Analytics providers (e.g., anonymized analytics)</li>
                <li>Payment processors (for secure transactions)</li>
                <li>Content delivery networks (for performance)</li>
                <li>Security services (for fraud prevention)</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">6. Managing Your Cookie Preferences</h2>

              <h3 className="text-xl font-semibold mb-3">6.1 Cookie Consent Tool</h3>
              <p className="text-muted-foreground mb-4">
                When you first visit our website, you&apos;ll see a cookie consent banner. You can accept all cookies, reject non-essential cookies, or customize your preferences.
              </p>
              <p className="text-muted-foreground mb-4">
                You can change your preferences at any time by accessing the cookie settings in your account or using the cookie preferences link in the footer.
              </p>

              <h3 className="text-xl font-semibold mb-3">6.2 Browser Settings</h3>
              <p className="text-muted-foreground mb-4">
                Most browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Block all cookies</li>
                <li>Accept only first-party cookies</li>
                <li>Delete cookies after each browsing session</li>
                <li>Make exceptions for specific websites</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                Please note that blocking all cookies may impact your ability to use certain features of our website.
              </p>

              <h3 className="text-xl font-semibold mb-3">6.3 Browser-Specific Instructions</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Chrome:</strong> Settings &gt; Privacy and security &gt; Cookies and other site data</li>
                <li><strong>Firefox:</strong> Options &gt; Privacy &amp; Security &gt; Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences &gt; Privacy &gt; Cookies and website data</li>
                <li><strong>Edge:</strong> Settings &gt; Cookies and site permissions &gt; Cookies and site data</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">7. Do Not Track Signals</h2>
              <p className="text-muted-foreground">
                Some browsers support &quot;Do Not Track&quot; (DNT) signals. Currently, there is no universal standard for handling DNT signals. We respect your privacy choices made through our cookie consent tool and browser settings.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">8. Specific Cookie Details</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-muted-foreground">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-4">Cookie Name</th>
                      <th className="text-left py-2 px-4">Purpose</th>
                      <th className="text-left py-2 px-4">Type</th>
                      <th className="text-left py-2 px-4">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="py-2 px-4">vertex_session</td>
                      <td className="py-2 px-4">Authentication</td>
                      <td className="py-2 px-4">Necessary</td>
                      <td className="py-2 px-4">Session</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4">vertex_csrf</td>
                      <td className="py-2 px-4">Security</td>
                      <td className="py-2 px-4">Necessary</td>
                      <td className="py-2 px-4">Session</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4">vertex_prefs</td>
                      <td className="py-2 px-4">User preferences</td>
                      <td className="py-2 px-4">Functional</td>
                      <td className="py-2 px-4">12 months</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4">vertex_analytics</td>
                      <td className="py-2 px-4">Usage statistics</td>
                      <td className="py-2 px-4">Analytics</td>
                      <td className="py-2 px-4">12 months</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">9. Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                Under GDPR, you have rights regarding cookies and tracking:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Right to be informed about cookies we use</li>
                <li>Right to consent or refuse non-essential cookies</li>
                <li>Right to withdraw consent at any time</li>
                <li>Right to object to processing for legitimate interests</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">10. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Cookie Policy from time to time to reflect changes in our practices or legal requirements. The &quot;Last updated&quot; date will be revised accordingly. We encourage you to review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have questions about our use of cookies, please contact us:
              </p>
              <p className="text-muted-foreground">
                NewCo Ltd.<br />
                New Address 1<br />
                Company No: NEW123<br />
                <br />
                Email: privacy@vertex.ai<br />
                Data Protection Officer: dpo@vertex.ai
              </p>
            </section>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
