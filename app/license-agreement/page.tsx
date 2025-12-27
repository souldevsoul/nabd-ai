import { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { SlCheck, SlClose } from "react-icons/sl";

export const metadata: Metadata = {
  title: "Лицензиялық келісім",
  description: "Vertex-тегі фотосурет лицензиялау опциялары мен пайдалану құқықтарын түсіну.",
};

const licenseComparison = [
  {
    feature: "Digital use (websites, apps)",
    standard: true,
    extended: true,
  },
  {
    feature: "Social media",
    standard: true,
    extended: true,
  },
  {
    feature: "Print materials (up to 500k copies)",
    standard: true,
    extended: true,
  },
  {
    feature: "Print materials (unlimited)",
    standard: false,
    extended: true,
  },
  {
    feature: "Products for resale",
    standard: false,
    extended: true,
  },
  {
    feature: "Broadcast/streaming",
    standard: false,
    extended: true,
  },
  {
    feature: "Editorial use",
    standard: true,
    extended: true,
  },
  {
    feature: "Commercial advertising",
    standard: true,
    extended: true,
  },
  {
    feature: "Modify/edit the image",
    standard: true,
    extended: true,
  },
  {
    feature: "Multi-seat license (teams)",
    standard: false,
    extended: true,
  },
];

export default function LicenseAgreementPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <article className="pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black tracking-tight mb-4">Лицензиялық келісім</h1>
          <p className="text-muted-foreground mb-8">Соңғы жаңарту: 1 желтоқсан 2024</p>

          {/* License Comparison */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Лицензия түрлері</h2>
            <div className="stat-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-4 font-semibold">Мүмкіндік</th>
                      <th className="text-center py-4 px-4 font-semibold">
                        <span className="text-amber-400">Стандартты</span>
                      </th>
                      <th className="text-center py-4 px-4 font-semibold">
                        <span className="text-emerald-400">Кеңейтілген</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {licenseComparison.map((item, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {item.feature}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {item.standard ? (
                            <SlCheck className="inline-block text-emerald-400" size={18} />
                          ) : (
                            <SlClose className="inline-block text-red-400" size={18} />
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {item.extended ? (
                            <SlCheck className="inline-block text-emerald-400" size={18} />
                          ) : (
                            <SlClose className="inline-block text-red-400" size={18} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <div className="prose prose-invert prose-amber max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">1. Grant of License</h2>
              <p className="text-muted-foreground mb-4">
                Upon purchase of a photo from Vertex, the Licensor (photographer) grants
                you (the Licensee) a non-exclusive, worldwide, perpetual license to use the
                photo according to the terms of the license type selected at purchase.
              </p>
              <p className="text-muted-foreground">
                This license is non-transferable and may not be sublicensed to third parties.
                The photographer retains full copyright ownership of the image.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">2. Standard License</h2>
              <p className="text-muted-foreground mb-4">
                The Standard License permits:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Use in websites, apps, and digital media</li>
                <li>Social media posts and advertising</li>
                <li>Print materials with distribution up to 500,000 copies</li>
                <li>Presentations, documents, and educational materials</li>
                <li>Editorial and news content</li>
                <li>Commercial advertising (excluding products for resale)</li>
              </ul>
              <p className="text-muted-foreground">
                Standard licenses are valid for a single user/seat. Organizations requiring
                multiple users should purchase additional licenses or upgrade to Extended.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">3. Extended License</h2>
              <p className="text-muted-foreground mb-4">
                The Extended License includes all Standard License rights plus:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Unlimited print distribution</li>
                <li>Products intended for resale (merchandise, prints, etc.)</li>
                <li>Broadcast, streaming, and video production</li>
                <li>Multi-seat license for teams up to 10 users</li>
                <li>Template and design tool creation</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">4. Restrictions</h2>
              <p className="text-muted-foreground mb-4">
                Regardless of license type, you may NOT:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Resell, redistribute, or share the original image file</li>
                <li>Use the image in a way that suggests endorsement by persons depicted</li>
                <li>Use in pornographic, defamatory, or illegal content</li>
                <li>Remove or alter watermarks or embedded metadata</li>
                <li>Use to train AI/ML models without explicit written permission</li>
                <li>Falsely claim authorship of the photograph</li>
                <li>Use in a trademark or logo</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">5. Model and Property Releases</h2>
              <p className="text-muted-foreground mb-4">
                Photos featuring identifiable people or private property may require additional
                releases for certain uses. Release information is displayed on each photo&apos;s
                detail page.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Model Released:</strong> Commercial use with identifiable people permitted</li>
                <li><strong>Property Released:</strong> Commercial use with identifiable property permitted</li>
                <li><strong>Editorial Only:</strong> Use limited to newsworthy/editorial context</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">6. Attribution</h2>
              <p className="text-muted-foreground">
                Attribution is appreciated but not required under either license type. If you
                choose to provide credit, please use: &quot;Photo by [Photographer Name] via
                Vertex&quot;.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">7. Authenticity Guarantee</h2>
              <p className="text-muted-foreground">
                All photos on Vertex are verified as authentic human-made photography.
                Each image includes preserved EXIF metadata demonstrating its authenticity.
                If you discover a photo was misrepresented, contact us for a full refund.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">8. Warranty and Indemnification</h2>
              <p className="text-muted-foreground mb-4">
                Vertex and the photographer warrant that:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>The photographer owns or has rights to license the image</li>
                <li>The image does not infringe any third-party rights (to our knowledge)</li>
                <li>Appropriate releases are obtained where indicated</li>
              </ul>
              <p className="text-muted-foreground">
                Vertex&apos;s liability is limited to the purchase price of the license. We
                recommend consulting legal counsel for high-risk uses.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">9. Termination</h2>
              <p className="text-muted-foreground">
                This license is perpetual unless terminated for breach. If you violate these
                terms, your license automatically terminates and you must cease all use of
                the image. Vertex may pursue legal remedies for unauthorized use.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Contact</h2>
              <p className="text-muted-foreground">
                For licensing questions or custom licensing arrangements, contact:<br />
                Email: licensing@vertex.ai<br />
                For enterprise licensing: enterprise@vertex.ai
              </p>
            </section>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
