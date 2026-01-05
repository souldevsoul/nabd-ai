"use client";

import { Header, Footer } from "@/components/layout";
import { useTranslation } from "@/lib/i18n";

export default function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <article className="pt-32 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black tracking-tight mb-4">{t("privacy.title")}</h1>
          <p className="text-muted-foreground mb-8">{t("privacy.lastUpdated")}: 20 December 2025</p>

          <div className="prose prose-invert prose-amber max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("privacy.sections.intro.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy.sections.intro.p1")}
              </p>
              <p className="text-muted-foreground mb-4">
                {t("privacy.sections.intro.p2")}
              </p>
              <p className="text-muted-foreground">
                {t("privacy.sections.intro.p3")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("privacy.sections.dataCollected.title")}</h2>

              <h3 className="text-xl font-semibold mb-3">{t("privacy.sections.dataCollected.provided.title")}</h3>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>{t("privacy.sections.dataCollected.provided.item1")}</li>
                <li>{t("privacy.sections.dataCollected.provided.item2")}</li>
                <li>{t("privacy.sections.dataCollected.provided.item3")}</li>
                <li>{t("privacy.sections.dataCollected.provided.item4")}</li>
                <li>{t("privacy.sections.dataCollected.provided.item5")}</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">{t("privacy.sections.dataCollected.automatic.title")}</h3>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>{t("privacy.sections.dataCollected.automatic.item1")}</li>
                <li>{t("privacy.sections.dataCollected.automatic.item2")}</li>
                <li>{t("privacy.sections.dataCollected.automatic.item3")}</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">{t("privacy.sections.dataCollected.thirdParty.title")}</h3>
              <p className="text-muted-foreground">
                {t("privacy.sections.dataCollected.thirdParty.p1")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("privacy.sections.legalBasis.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy.sections.legalBasis.p1")}
              </p>

              <h3 className="text-xl font-semibold mb-3">{t("privacy.sections.legalBasis.contractual.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("privacy.sections.legalBasis.contractual.p1")}
              </p>

              <h3 className="text-xl font-semibold mb-3">{t("privacy.sections.legalBasis.legitimate.title")}</h3>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>{t("privacy.sections.legalBasis.legitimate.item1")}</li>
                <li>{t("privacy.sections.legalBasis.legitimate.item2")}</li>
                <li>{t("privacy.sections.legalBasis.legitimate.item3")}</li>
                <li>{t("privacy.sections.legalBasis.legitimate.item4")}</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">{t("privacy.sections.legalBasis.legal.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("privacy.sections.legalBasis.legal.p1")}
              </p>

              <h3 className="text-xl font-semibold mb-3">{t("privacy.sections.legalBasis.consent.title")}</h3>
              <p className="text-muted-foreground">
                {t("privacy.sections.legalBasis.consent.p1")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("privacy.sections.sharing.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy.sections.sharing.p1")}
              </p>

              <h3 className="text-xl font-semibold mb-3">{t("privacy.sections.sharing.providers.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("privacy.sections.sharing.providers.p1")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>{t("privacy.sections.sharing.providers.item1")}</li>
                <li>{t("privacy.sections.sharing.providers.item2")}</li>
                <li>{t("privacy.sections.sharing.providers.item3")}</li>
                <li>{t("privacy.sections.sharing.providers.item4")}</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                {t("privacy.sections.sharing.providers.p2")}
              </p>

              <h3 className="text-xl font-semibold mb-3">{t("privacy.sections.sharing.specialists.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("privacy.sections.sharing.specialists.p1")}
              </p>

              <h3 className="text-xl font-semibold mb-3">{t("privacy.sections.sharing.legal.title")}</h3>
              <p className="text-muted-foreground">
                {t("privacy.sections.sharing.legal.p1")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("privacy.sections.transfers.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy.sections.transfers.p1")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>{t("privacy.sections.transfers.item1")}</li>
                <li>{t("privacy.sections.transfers.item2")}</li>
                <li>{t("privacy.sections.transfers.item3")}</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("privacy.sections.retention.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy.sections.retention.p1")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>{t("privacy.sections.retention.item1")}</li>
                <li>{t("privacy.sections.retention.item2")}</li>
                <li>{t("privacy.sections.retention.item3")}</li>
                <li>{t("privacy.sections.retention.item4")}</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("privacy.sections.security.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy.sections.security.p1")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>{t("privacy.sections.security.item1")}</li>
                <li>{t("privacy.sections.security.item2")}</li>
                <li>{t("privacy.sections.security.item3")}</li>
                <li>{t("privacy.sections.security.item4")}</li>
                <li>{t("privacy.sections.security.item5")}</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                {t("privacy.sections.security.p2")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("privacy.sections.rights.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy.sections.rights.p1")}
              </p>

              <h3 className="text-xl font-semibold mb-3">{t("privacy.sections.rights.access.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("privacy.sections.rights.access.p1")}
              </p>

              <h3 className="text-xl font-semibold mb-3">{t("privacy.sections.rights.rectification.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("privacy.sections.rights.rectification.p1")}
              </p>

              <h3 className="text-xl font-semibold mb-3">{t("privacy.sections.rights.erasure.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("privacy.sections.rights.erasure.p1")}
              </p>

              <h3 className="text-xl font-semibold mb-3">{t("privacy.sections.rights.restriction.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("privacy.sections.rights.restriction.p1")}
              </p>

              <h3 className="text-xl font-semibold mb-3">{t("privacy.sections.rights.portability.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("privacy.sections.rights.portability.p1")}
              </p>

              <h3 className="text-xl font-semibold mb-3">{t("privacy.sections.rights.object.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("privacy.sections.rights.object.p1")}
              </p>

              <h3 className="text-xl font-semibold mb-3">{t("privacy.sections.rights.withdraw.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("privacy.sections.rights.withdraw.p1")}
              </p>

              <p className="text-muted-foreground">
                {t("privacy.sections.rights.exercise")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("privacy.sections.cookies.title")}</h2>
              <p className="text-muted-foreground">
                {t("privacy.sections.cookies.p1")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("privacy.sections.marketing.title")}</h2>
              <p className="text-muted-foreground">
                {t("privacy.sections.marketing.p1")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("privacy.sections.children.title")}</h2>
              <p className="text-muted-foreground">
                {t("privacy.sections.children.p1")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("privacy.sections.automated.title")}</h2>
              <p className="text-muted-foreground">
                {t("privacy.sections.automated.p1")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("privacy.sections.changes.title")}</h2>
              <p className="text-muted-foreground">
                {t("privacy.sections.changes.p1")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">{t("privacy.sections.contact.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy.sections.contact.p1")}
              </p>
              <p className="text-muted-foreground">
                <strong>{t("privacy.sections.contact.controller")}</strong><br />
                {t("privacy.sections.contact.company")}<br />
                {t("privacy.sections.contact.address")}<br />
                {t("privacy.sections.contact.companyNo")}<br />
                <br />
                <strong>{t("privacy.sections.contact.dpo")}</strong><br />
                {t("privacy.sections.contact.dpEmail")}<br />
                <br />
                <strong>{t("privacy.sections.contact.privacyInquiries")}</strong><br />
                {t("privacy.sections.contact.privacyEmail")}<br />
                <br />
                <strong>{t("privacy.sections.contact.generalSupport")}</strong><br />
                {t("privacy.sections.contact.supportEmail")}
              </p>
            </section>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
