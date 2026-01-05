"use client";

import { Header, Footer } from "@/components/layout";
import { useTranslation } from "@/lib/i18n";

export default function RefundPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <article className="pt-32 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black tracking-tight mb-4">{t("refund.title")}</h1>
          <p className="text-muted-foreground mb-8">{t("refund.lastUpdated")}: 24 December 2024</p>

          <div className="prose prose-invert prose-amber max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("refund.sections.overview.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("refund.sections.overview.p1")}
              </p>
              <p className="text-muted-foreground">
                {t("refund.sections.overview.p2")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("refund.sections.euRights.title")}</h2>

              <h3 className="text-xl font-semibold mb-3">{t("refund.sections.euRights.yourRights.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("refund.sections.euRights.yourRights.p1")}
              </p>

              <h3 className="text-xl font-semibold mb-3">{t("refund.sections.euRights.howTo.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("refund.sections.euRights.howTo.p1")}
              </p>
              <p className="text-muted-foreground mb-4">
                {t("refund.sections.euRights.howTo.p2")}<br />
                {t("refund.sections.euRights.howTo.subject")}<br />
                {t("refund.sections.euRights.howTo.include")}
              </p>
              <p className="text-muted-foreground mb-4">
                {t("refund.sections.euRights.howTo.p3")}
              </p>

              <h3 className="text-xl font-semibold mb-3">{t("refund.sections.euRights.exception.title")}</h3>
              <p className="text-muted-foreground">
                {t("refund.sections.euRights.exception.p1")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("refund.sections.creditRefund.title")}</h2>

              <h3 className="text-xl font-semibold mb-3">{t("refund.sections.creditRefund.unused.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("refund.sections.creditRefund.unused.p1")}
              </p>
              <p className="text-muted-foreground mb-4">
                {t("refund.sections.creditRefund.unused.p2")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>{t("refund.sections.creditRefund.unused.item1")}</li>
                <li>{t("refund.sections.creditRefund.unused.item2")}</li>
                <li>{t("refund.sections.creditRefund.unused.item3")}</li>
                <li>{t("refund.sections.creditRefund.unused.item4")}</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">{t("refund.sections.creditRefund.partial.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("refund.sections.creditRefund.partial.p1")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>{t("refund.sections.creditRefund.partial.item1")}</li>
                <li>{t("refund.sections.creditRefund.partial.item2")}</li>
                <li>{t("refund.sections.creditRefund.partial.item3")}</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">{t("refund.sections.creditRefund.bonus.title")}</h3>
              <p className="text-muted-foreground">
                {t("refund.sections.creditRefund.bonus.p1")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("refund.sections.serviceRefunds.title")}</h2>

              <h3 className="text-xl font-semibold mb-3">{t("refund.sections.serviceRefunds.completed.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("refund.sections.serviceRefunds.completed.p1")}
              </p>

              <h3 className="text-xl font-semibold mb-3">{t("refund.sections.serviceRefunds.cancelled.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("refund.sections.serviceRefunds.cancelled.p1")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>{t("refund.sections.serviceRefunds.cancelled.item1")}</li>
                <li>{t("refund.sections.serviceRefunds.cancelled.item2")}</li>
                <li>{t("refund.sections.serviceRefunds.cancelled.item3")}</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">{t("refund.sections.serviceRefunds.defects.title")}</h3>
              <p className="text-muted-foreground">
                {t("refund.sections.serviceRefunds.defects.p1")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("refund.sections.satisfaction.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("refund.sections.satisfaction.p1")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>{t("refund.sections.satisfaction.item1")}</li>
                <li>{t("refund.sections.satisfaction.item2")}</li>
                <li>{t("refund.sections.satisfaction.item3")}
                  <ul className="list-circle pl-6 mt-2 space-y-1">
                    <li>{t("refund.sections.satisfaction.subItem1")}</li>
                    <li>{t("refund.sections.satisfaction.subItem2")}</li>
                    <li>{t("refund.sections.satisfaction.subItem3")}</li>
                  </ul>
                </li>
              </ul>
              <p className="text-muted-foreground">
                {t("refund.sections.satisfaction.p2")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("refund.sections.processing.title")}</h2>

              <h3 className="text-xl font-semibold mb-3">{t("refund.sections.processing.time.title")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("refund.sections.processing.time.p1")}
              </p>

              <h3 className="text-xl font-semibold mb-3">{t("refund.sections.processing.payment.title")}</h3>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>{t("refund.sections.processing.payment.item1")}</li>
                <li>{t("refund.sections.processing.payment.item2")}</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">{t("refund.sections.processing.currency.title")}</h3>
              <p className="text-muted-foreground">
                {t("refund.sections.processing.currency.p1")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("refund.sections.nonRefundable.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("refund.sections.nonRefundable.p1")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>{t("refund.sections.nonRefundable.item1")}</li>
                <li>{t("refund.sections.nonRefundable.item2")}</li>
                <li>{t("refund.sections.nonRefundable.item3")}</li>
                <li>{t("refund.sections.nonRefundable.item4")}</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("refund.sections.fraudulent.title")}</h2>
              <p className="text-muted-foreground">
                {t("refund.sections.fraudulent.p1")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("refund.sections.disputes.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("refund.sections.disputes.p1")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>{t("refund.sections.disputes.item1")}</li>
                <li>{t("refund.sections.disputes.item2")}: <a href="https://ec.europa.eu/consumers/odr" className="text-primary hover:underline" target="_blank" rel="noopener">https://ec.europa.eu/consumers/odr</a></li>
                <li>{t("refund.sections.disputes.item3")}</li>
                <li>{t("refund.sections.disputes.item4")}</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t("refund.sections.changes.title")}</h2>
              <p className="text-muted-foreground">
                {t("refund.sections.changes.p1")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">{t("refund.sections.contact.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("refund.sections.contact.p1")}
              </p>
              <p className="text-muted-foreground">
                {t("refund.sections.contact.company")}<br />
                {t("refund.sections.contact.address")}<br />
                {t("refund.sections.contact.companyNo")}<br />
                <br />
                {t("refund.sections.contact.email")}<br />
                {t("refund.sections.contact.hours")}<br />
                <br />
                {t("refund.sections.contact.urgent")}
              </p>
            </section>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
