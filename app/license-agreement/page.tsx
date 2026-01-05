"use client";

import { Header, Footer } from "@/components/layout";
import { SlCheck, SlClose } from "react-icons/sl";
import { useTranslation } from "@/lib/i18n";

export default function LicenseAgreementPage() {
  const { t } = useTranslation();

  const licenseComparison = [
    { featureKey: "digitalUse", standard: true, extended: true },
    { featureKey: "socialMedia", standard: true, extended: true },
    { featureKey: "printLimited", standard: true, extended: true },
    { featureKey: "printUnlimited", standard: false, extended: true },
    { featureKey: "productsForResale", standard: false, extended: true },
    { featureKey: "broadcast", standard: false, extended: true },
    { featureKey: "editorial", standard: true, extended: true },
    { featureKey: "commercial", standard: true, extended: true },
    { featureKey: "modify", standard: true, extended: true },
    { featureKey: "multiSeat", standard: false, extended: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <article className="pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black tracking-tight mb-4">{t("license.title")}</h1>
          <p className="text-muted-foreground mb-8">{t("license.lastUpdated")}: 1 December 2024</p>

          {/* License Comparison */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">{t("license.licenseTypes")}</h2>
            <div className="stat-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-4 font-semibold">{t("license.feature")}</th>
                      <th className="text-center py-4 px-4 font-semibold">
                        <span className="text-amber-400">{t("license.standard")}</span>
                      </th>
                      <th className="text-center py-4 px-4 font-semibold">
                        <span className="text-emerald-400">{t("license.extended")}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {licenseComparison.map((item, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {t(`license.features.${item.featureKey}`)}
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
              <h2 className="text-2xl font-bold mb-4">{t("license.sections.grant.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("license.sections.grant.p1")}
              </p>
              <p className="text-muted-foreground">
                {t("license.sections.grant.p2")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("license.sections.standardLicense.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("license.sections.standardLicense.p1")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>{t("license.sections.standardLicense.item1")}</li>
                <li>{t("license.sections.standardLicense.item2")}</li>
                <li>{t("license.sections.standardLicense.item3")}</li>
                <li>{t("license.sections.standardLicense.item4")}</li>
                <li>{t("license.sections.standardLicense.item5")}</li>
                <li>{t("license.sections.standardLicense.item6")}</li>
              </ul>
              <p className="text-muted-foreground">
                {t("license.sections.standardLicense.p2")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("license.sections.extendedLicense.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("license.sections.extendedLicense.p1")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>{t("license.sections.extendedLicense.item1")}</li>
                <li>{t("license.sections.extendedLicense.item2")}</li>
                <li>{t("license.sections.extendedLicense.item3")}</li>
                <li>{t("license.sections.extendedLicense.item4")}</li>
                <li>{t("license.sections.extendedLicense.item5")}</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("license.sections.restrictions.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("license.sections.restrictions.p1")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>{t("license.sections.restrictions.item1")}</li>
                <li>{t("license.sections.restrictions.item2")}</li>
                <li>{t("license.sections.restrictions.item3")}</li>
                <li>{t("license.sections.restrictions.item4")}</li>
                <li>{t("license.sections.restrictions.item5")}</li>
                <li>{t("license.sections.restrictions.item6")}</li>
                <li>{t("license.sections.restrictions.item7")}</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("license.sections.releases.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("license.sections.releases.p1")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>{t("license.sections.releases.item1")}</strong></li>
                <li><strong>{t("license.sections.releases.item2")}</strong></li>
                <li><strong>{t("license.sections.releases.item3")}</strong></li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("license.sections.attribution.title")}</h2>
              <p className="text-muted-foreground">
                {t("license.sections.attribution.p1")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("license.sections.authenticity.title")}</h2>
              <p className="text-muted-foreground">
                {t("license.sections.authenticity.p1")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("license.sections.warranty.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("license.sections.warranty.p1")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>{t("license.sections.warranty.item1")}</li>
                <li>{t("license.sections.warranty.item2")}</li>
                <li>{t("license.sections.warranty.item3")}</li>
              </ul>
              <p className="text-muted-foreground">
                {t("license.sections.warranty.p2")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("license.sections.termination.title")}</h2>
              <p className="text-muted-foreground">
                {t("license.sections.termination.p1")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">{t("license.sections.contact.title")}</h2>
              <p className="text-muted-foreground">
                {t("license.sections.contact.p1")}<br />
                {t("license.sections.contact.licensing")}<br />
                {t("license.sections.contact.enterprise")}
              </p>
            </section>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
