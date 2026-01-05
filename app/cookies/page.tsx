"use client";

import { Header, Footer } from "@/components/layout";
import { useTranslation } from "@/lib/i18n";

export default function CookiesPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <article className="pt-32 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black tracking-tight mb-4">{t("cookies.title")}</h1>
          <p className="text-muted-foreground mb-8">{t("cookies.lastUpdated")}: 24 December 2024</p>

          <div className="prose prose-invert prose-amber max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("cookies.sections.intro.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("cookies.sections.intro.p1")}
              </p>
              <p className="text-muted-foreground">
                {t("cookies.sections.intro.p2")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("cookies.sections.whatAreCookies.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("cookies.sections.whatAreCookies.p1")}
              </p>
              <p className="text-muted-foreground">
                {t("cookies.sections.whatAreCookies.p2")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("cookies.sections.types.title")}</h2>

              <h3 className="text-xl font-semibold mb-3">{t("cookies.sections.types.necessary.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("cookies.sections.types.necessary.p1")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>{t("cookies.sections.types.necessary.item1")}</li>
                <li>{t("cookies.sections.types.necessary.item2")}</li>
                <li>{t("cookies.sections.types.necessary.item3")}</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                <strong>{t("cookies.sections.types.necessary.legalBasis")}</strong> {t("cookies.sections.types.necessary.contractual")}<br />
                <strong>{t("cookies.sections.types.necessary.canBeDisabled")}</strong> {t("cookies.sections.types.necessary.no")}
              </p>

              <h3 className="text-xl font-semibold mb-3">{t("cookies.sections.types.functional.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("cookies.sections.types.functional.p1")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>{t("cookies.sections.types.functional.item1")}</li>
                <li>{t("cookies.sections.types.functional.item2")}</li>
                <li>{t("cookies.sections.types.functional.item3")}</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                <strong>{t("cookies.sections.types.necessary.legalBasis")}</strong> {t("cookies.sections.types.functional.legalBasis")}<br />
                <strong>{t("cookies.sections.types.necessary.canBeDisabled")}</strong> {t("cookies.sections.types.functional.canBeDisabled")}
              </p>

              <h3 className="text-xl font-semibold mb-3">{t("cookies.sections.types.analytics.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("cookies.sections.types.analytics.p1")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>{t("cookies.sections.types.analytics.item1")}</li>
                <li>{t("cookies.sections.types.analytics.item2")}</li>
                <li>{t("cookies.sections.types.analytics.item3")}</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                <strong>{t("cookies.sections.types.necessary.legalBasis")}</strong> {t("cookies.sections.types.analytics.legalBasis")}<br />
                <strong>{t("cookies.sections.types.necessary.canBeDisabled")}</strong> {t("cookies.sections.types.analytics.canBeDisabled")}
              </p>

              <h3 className="text-xl font-semibold mb-3">{t("cookies.sections.types.marketing.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("cookies.sections.types.marketing.p1")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>{t("cookies.sections.types.marketing.item1")}</li>
                <li>{t("cookies.sections.types.marketing.item2")}</li>
                <li>{t("cookies.sections.types.marketing.item3")}</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                <strong>{t("cookies.sections.types.necessary.legalBasis")}</strong> {t("cookies.sections.types.marketing.legalBasis")}<br />
                <strong>{t("cookies.sections.types.necessary.canBeDisabled")}</strong> {t("cookies.sections.types.marketing.canBeDisabled")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("cookies.sections.duration.title")}</h2>

              <h3 className="text-xl font-semibold mb-3">{t("cookies.sections.duration.session.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("cookies.sections.duration.session.p1")}
              </p>

              <h3 className="text-xl font-semibold mb-3">{t("cookies.sections.duration.persistent.title")}</h3>
              <p className="text-muted-foreground">
                {t("cookies.sections.duration.persistent.p1")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("cookies.sections.thirdParty.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("cookies.sections.thirdParty.p1")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>{t("cookies.sections.thirdParty.item1")}</li>
                <li>{t("cookies.sections.thirdParty.item2")}</li>
                <li>{t("cookies.sections.thirdParty.item3")}</li>
                <li>{t("cookies.sections.thirdParty.item4")}</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("cookies.sections.managing.title")}</h2>

              <h3 className="text-xl font-semibold mb-3">{t("cookies.sections.managing.consent.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("cookies.sections.managing.consent.p1")}
              </p>
              <p className="text-muted-foreground mb-4">
                {t("cookies.sections.managing.consent.p2")}
              </p>

              <h3 className="text-xl font-semibold mb-3">{t("cookies.sections.managing.browser.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("cookies.sections.managing.browser.p1")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>{t("cookies.sections.managing.browser.item1")}</li>
                <li>{t("cookies.sections.managing.browser.item2")}</li>
                <li>{t("cookies.sections.managing.browser.item3")}</li>
                <li>{t("cookies.sections.managing.browser.item4")}</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                {t("cookies.sections.managing.browser.p2")}
              </p>

              <h3 className="text-xl font-semibold mb-3">{t("cookies.sections.managing.instructions.title")}</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Chrome:</strong> {t("cookies.sections.managing.instructions.chrome")}</li>
                <li><strong>Firefox:</strong> {t("cookies.sections.managing.instructions.firefox")}</li>
                <li><strong>Safari:</strong> {t("cookies.sections.managing.instructions.safari")}</li>
                <li><strong>Edge:</strong> {t("cookies.sections.managing.instructions.edge")}</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("cookies.sections.dnt.title")}</h2>
              <p className="text-muted-foreground">
                {t("cookies.sections.dnt.p1")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("cookies.sections.details.title")}</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-muted-foreground">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-4">{t("cookies.sections.details.headerName")}</th>
                      <th className="text-left py-2 px-4">{t("cookies.sections.details.headerPurpose")}</th>
                      <th className="text-left py-2 px-4">{t("cookies.sections.details.headerType")}</th>
                      <th className="text-left py-2 px-4">{t("cookies.sections.details.headerDuration")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="py-2 px-4">nabd_session</td>
                      <td className="py-2 px-4">{t("cookies.sections.details.authentication")}</td>
                      <td className="py-2 px-4">{t("cookies.sections.details.necessary")}</td>
                      <td className="py-2 px-4">{t("cookies.sections.details.session")}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4">nabd_csrf</td>
                      <td className="py-2 px-4">{t("cookies.sections.details.security")}</td>
                      <td className="py-2 px-4">{t("cookies.sections.details.necessary")}</td>
                      <td className="py-2 px-4">{t("cookies.sections.details.session")}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4">nabd_prefs</td>
                      <td className="py-2 px-4">{t("cookies.sections.details.userPreferences")}</td>
                      <td className="py-2 px-4">{t("cookies.sections.details.functional")}</td>
                      <td className="py-2 px-4">12 {t("cookies.sections.details.months")}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4">nabd_analytics</td>
                      <td className="py-2 px-4">{t("cookies.sections.details.usageStatistics")}</td>
                      <td className="py-2 px-4">{t("cookies.sections.details.analytics")}</td>
                      <td className="py-2 px-4">12 {t("cookies.sections.details.months")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("cookies.sections.rights.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("cookies.sections.rights.p1")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>{t("cookies.sections.rights.item1")}</li>
                <li>{t("cookies.sections.rights.item2")}</li>
                <li>{t("cookies.sections.rights.item3")}</li>
                <li>{t("cookies.sections.rights.item4")}</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("cookies.sections.changes.title")}</h2>
              <p className="text-muted-foreground">
                {t("cookies.sections.changes.p1")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">{t("cookies.sections.contact.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("cookies.sections.contact.p1")}
              </p>
              <p className="text-muted-foreground">
                {t("cookies.sections.contact.company")}<br />
                {t("cookies.sections.contact.address")}<br />
                {t("cookies.sections.contact.companyNo")}<br />
                <br />
                {t("cookies.sections.contact.email")}<br />
                {t("cookies.sections.contact.dpo")}
              </p>
            </section>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
