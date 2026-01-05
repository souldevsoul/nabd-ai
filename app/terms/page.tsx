"use client";

import { Header, Footer } from "@/components/layout";
import { useTranslation } from "@/lib/i18n";

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <article className="pt-32 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black tracking-tight mb-4">{t("terms.title")}</h1>
          <p className="text-muted-foreground mb-8">{t("terms.lastUpdated")}: 20 December 2025</p>

          <div className="prose prose-invert prose-amber max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("terms.sections.intro.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("terms.sections.intro.p1")}
              </p>
              <p className="text-muted-foreground mb-4">
                {t("terms.sections.intro.p2")}
              </p>
              <p className="text-muted-foreground">
                {t("terms.sections.intro.p3")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("terms.sections.services.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("terms.sections.services.p1")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>{t("terms.sections.services.item1")}</li>
                <li>{t("terms.sections.services.item2")}</li>
                <li>{t("terms.sections.services.item3")}</li>
                <li>{t("terms.sections.services.item4")}</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("terms.sections.consumerRights.title")}</h2>

              <h3 className="text-xl font-semibold mb-3">{t("terms.sections.consumerRights.withdrawal.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("terms.sections.consumerRights.withdrawal.p1")}
              </p>
              <p className="text-muted-foreground mb-4">
                {t("terms.sections.consumerRights.withdrawal.p2")}
              </p>

              <h3 className="text-xl font-semibold mb-3">{t("terms.sections.consumerRights.guarantees.title")}</h3>
              <p className="text-muted-foreground">
                {t("terms.sections.consumerRights.guarantees.p1")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("terms.sections.credits.title")}</h2>

              <h3 className="text-xl font-semibold mb-3">{t("terms.sections.credits.purchases.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("terms.sections.credits.purchases.p1")}
              </p>
              <p className="text-muted-foreground mb-4">
                {t("terms.sections.credits.purchases.p2")}
              </p>

              <h3 className="text-xl font-semibold mb-3">{t("terms.sections.credits.terms.title")}</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>{t("terms.sections.credits.terms.item1")}</li>
                <li>{t("terms.sections.credits.terms.item2")}</li>
                <li>{t("terms.sections.credits.terms.item3")}</li>
                <li>{t("terms.sections.credits.terms.item4")}</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("terms.sections.obligations.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("terms.sections.obligations.p1")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>{t("terms.sections.obligations.item1")}</li>
                <li>{t("terms.sections.obligations.item2")}</li>
                <li>{t("terms.sections.obligations.item3")}</li>
                <li>{t("terms.sections.obligations.item4")}</li>
                <li>{t("terms.sections.obligations.item5")}</li>
                <li>{t("terms.sections.obligations.item6")}</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("terms.sections.payment.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("terms.sections.payment.p1")}
              </p>
              <p className="text-muted-foreground mb-4">
                {t("terms.sections.payment.p2")}
              </p>
              <p className="text-muted-foreground">
                {t("terms.sections.payment.p3")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("terms.sections.refund.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("terms.sections.refund.p1")} <a href="/refund" className="text-primary hover:underline">{t("footer.refund")}</a>
              </p>
              <p className="text-muted-foreground">
                {t("terms.sections.refund.p2")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("terms.sections.ip.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("terms.sections.ip.p1")}
              </p>
              <p className="text-muted-foreground">
                {t("terms.sections.ip.p2")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("terms.sections.liability.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("terms.sections.liability.p1")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>{t("terms.sections.liability.item1")}</li>
                <li>{t("terms.sections.liability.item2")}</li>
                <li>{t("terms.sections.liability.item3")}</li>
              </ul>
              <p className="text-muted-foreground">
                {t("terms.sections.liability.p2")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("terms.sections.data.title")}</h2>
              <p className="text-muted-foreground">
                {t("terms.sections.data.p1")} <a href="/privacy" className="text-primary hover:underline">{t("footer.privacy")}</a>
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("terms.sections.termination.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("terms.sections.termination.p1")}
              </p>
              <p className="text-muted-foreground">
                {t("terms.sections.termination.p2")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("terms.sections.disputes.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("terms.sections.disputes.p1")}
              </p>
              <p className="text-muted-foreground mb-4">
                {t("terms.sections.disputes.p2")}
              </p>
              <p className="text-muted-foreground mb-4">
                {t("terms.sections.disputes.p3")} <a href="https://ec.europa.eu/consumers/odr" className="text-primary hover:underline" target="_blank" rel="noopener">https://ec.europa.eu/consumers/odr</a>.
              </p>
              <p className="text-muted-foreground">
                {t("terms.sections.disputes.p4")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">{t("terms.sections.contact.title")}</h2>
              <p className="text-muted-foreground">
                {t("terms.sections.contact.p1")}<br />
                <br />
                {t("terms.sections.contact.company")}<br />
                {t("terms.sections.contact.address")}<br />
                {t("terms.sections.contact.companyNo")}<br />
                <br />
                {t("terms.sections.contact.emailLegal")}<br />
                {t("terms.sections.contact.emailSupport")}
              </p>
            </section>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
