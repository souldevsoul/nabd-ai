"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { RiSparklingLine, RiArrowRightLine, RiCheckLine, RiShieldCheckLine, RiVipCrownLine, RiVipDiamondLine, RiTimeLine, RiQuestionLine, RiPhoneLine, RiCalculatorLine } from "react-icons/ri";
import { useState } from "react";
import { useTranslation } from "@/lib/i18n";

// Credit Calculator Component
function CreditCalculator() {
  const [credits, setCredits] = useState(100);
  const { t } = useTranslation();

  // Calculate discount based on credit amount
  const getDiscount = (amount: number) => {
    if (amount >= 1000) return 0.15;
    if (amount >= 500) return 0.08;
    if (amount >= 100) return 0.03;
    return 0;
  };

  const basePrice = credits * 0.1; // 10 credits = $1
  const discount = getDiscount(credits);
  const finalPrice = basePrice * (1 - discount);
  const savings = basePrice - finalPrice;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredits(parseInt(e.target.value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setCredits(Math.min(Math.max(value, 10), 10000));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="elite-card max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-primary/30 bg-primary/5">
          <RiCalculatorLine className="text-primary" size={14} />
          <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">{t("pricing.calculator.title")}</span>
        </div>
        <h3 className="font-display text-3xl md:text-4xl font-light text-foreground mb-4">
          {t("pricing.calculator.designPackage")}
        </h3>
        <p className="text-muted-foreground text-sm">
          {t("pricing.calculator.selectCredits")}
        </p>
      </div>

      {/* Credit Input */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-muted-foreground mb-4 text-center">
          {t("pricing.calculator.numberOfCredits")}
        </label>
        <input
          type="number"
          value={credits}
          onChange={handleInputChange}
          min="10"
          max="10000"
          className="w-full text-center text-4xl font-display font-bold bg-transparent border-b-2 border-primary/20 focus:border-primary outline-none py-4 transition-colors"
        />
      </div>

      {/* Slider */}
      <div className="mb-12">
        <input
          type="range"
          min="10"
          max="10000"
          step="10"
          value={credits}
          onChange={handleSliderChange}
          className="w-full h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary/20 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:shadow-primary/20 [&::-moz-range-thumb]:cursor-pointer"
        />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>10</span>
          <span>10,000</span>
        </div>
      </div>

      {/* Pricing Display */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1 tracking-wider uppercase">{t("pricing.calculator.basePrice")}</p>
            <p className="text-2xl font-display font-bold text-foreground/60">
              ${basePrice.toFixed(2)}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1 tracking-wider uppercase">
              {t("pricing.calculator.volumeDiscount")} ({(discount * 100).toFixed(0)}%)
            </p>
            <p className="text-2xl font-display font-bold text-primary">
              -${savings.toFixed(2)}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1 tracking-wider uppercase">{t("pricing.calculator.finalPrice")}</p>
            <p className="text-3xl font-display font-bold gradient-text">
              ${finalPrice.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="text-center pt-6 border-t border-primary/20">
          <p className="text-sm text-muted-foreground">
            {t("pricing.calculator.effectiveRate")}: <span className="font-semibold text-foreground">${(finalPrice / credits).toFixed(3)}</span> {t("pricing.calculator.perCredit")}
          </p>
        </div>
      </div>

      {/* Discount Tier Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className={`p-3 rounded border text-center transition-all ${credits < 100 ? 'border-primary bg-primary/5' : 'border-border/50'}`}>
          <p className="text-xs text-muted-foreground mb-1">&lt;100</p>
          <p className="font-display font-bold text-sm">0%</p>
        </div>
        <div className={`p-3 rounded border text-center transition-all ${credits >= 100 && credits < 500 ? 'border-primary bg-primary/5' : 'border-border/50'}`}>
          <p className="text-xs text-muted-foreground mb-1">100-499</p>
          <p className="font-display font-bold text-sm">3%</p>
        </div>
        <div className={`p-3 rounded border text-center transition-all ${credits >= 500 && credits < 1000 ? 'border-primary bg-primary/5' : 'border-border/50'}`}>
          <p className="text-xs text-muted-foreground mb-1">500-999</p>
          <p className="font-display font-bold text-sm">8%</p>
        </div>
        <div className={`p-3 rounded border text-center transition-all ${credits >= 1000 ? 'border-primary bg-primary/5' : 'border-border/50'}`}>
          <p className="text-xs text-muted-foreground mb-1">1000+</p>
          <p className="font-display font-bold text-sm">15%</p>
        </div>
      </div>

      {/* CTA */}
      <Link href={`/dashboard/wallet?topup=${credits}`} className="block">
        <Button className="w-full py-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-display tracking-wider uppercase text-sm shadow-lg shadow-secondary/20 transition-all duration-500">
          {t("pricing.calculator.purchase")} {credits.toLocaleString()} {t("common.credits")}
          <RiArrowRightLine className="ml-2" size={16} />
        </Button>
      </Link>

      <p className="text-center text-xs text-muted-foreground mt-6 flex items-center justify-center gap-2">
        <RiTimeLine size={14} className="text-primary" />
        {t("pricing.calculator.creditsNeverExpire")}
      </p>
    </motion.div>
  );
}

export default function PricingPage() {
  const { t } = useTranslation();

  const membershipTiers = [
    {
      tierKey: "foundation",
      credits: 100,
      price: 10,
      discount: 0,
      pricePerCredit: "0.10",
      featureKeys: [
        "pricing.features.eliteCredits",
        "pricing.features.accessAllServices",
        "pricing.features.standardResponse",
        "pricing.features.emailSupport",
        "pricing.features.neverExpire",
      ],
      href: "/dashboard/wallet?topup=100",
      featured: false,
      icon: RiSparklingLine,
    },
    {
      tierKey: "executive",
      credits: 500,
      price: 48.5,
      discount: 3,
      pricePerCredit: "0.097",
      savings: "3%",
      featureKeys: [
        "pricing.features.eliteCredits",
        "pricing.features.volumeDiscount",
        "pricing.features.priorityQueue",
        "pricing.features.accountManager",
        "pricing.features.responseGuarantee",
        "pricing.features.phoneSupport",
      ],
      href: "/dashboard/wallet?topup=500",
      featured: true,
      icon: RiVipCrownLine,
    },
    {
      tierKey: "pinnacle",
      credits: 1000,
      price: 92,
      discount: 8,
      pricePerCredit: "0.092",
      savings: "8%",
      featureKeys: [
        "pricing.features.eliteCredits",
        "pricing.features.volumeDiscount",
        "pricing.features.instantPriority",
        "pricing.features.successDirector",
        "pricing.features.platinumSLA",
        "pricing.features.slackChannel",
        "pricing.features.executiveBriefing",
      ],
      href: "/dashboard/wallet?topup=1000",
      featured: false,
      icon: RiVipDiamondLine,
    },
    {
      tierKey: "chairman",
      credits: 2500,
      price: 212.5,
      discount: 15,
      pricePerCredit: "0.085",
      savings: "15%",
      featureKeys: [
        "pricing.features.eliteCredits",
        "pricing.features.volumeDiscount",
        "pricing.features.conciergeService",
        "pricing.features.cSuitePartner",
        "pricing.features.instantPriority",
        "pricing.features.integrationSupport",
        "pricing.features.strategySessions",
        "pricing.features.vipStatus",
      ],
      href: "/dashboard/wallet?topup=2500",
      featured: false,
      icon: RiVipDiamondLine,
    },
  ];

  const valuePropositions = [
    {
      number: "01",
      titleKey: "pricing.values.transparent.title",
      descKey: "pricing.values.transparent.description",
    },
    {
      number: "02",
      titleKey: "pricing.values.perpetual.title",
      descKey: "pricing.values.perpetual.description",
    },
    {
      number: "03",
      titleKey: "pricing.values.satisfaction.title",
      descKey: "pricing.values.satisfaction.description",
    },
  ];

  const faqs = [
    { qKey: "pricing.faq.q1", aKey: "pricing.faq.a1" },
    { qKey: "pricing.faq.q2", aKey: "pricing.faq.a2" },
    { qKey: "pricing.faq.q3", aKey: "pricing.faq.a3" },
    { qKey: "pricing.faq.q4", aKey: "pricing.faq.a4" },
  ];

  return (
    <div className="min-h-screen bg-background starfield">
      <Header />

      {/* Hero - CENTERED with Orbital Ring Decorations */}
      <section className="pt-40 pb-24 relative overflow-hidden bg-background min-h-[85vh] flex items-center">
        {/* Concentric orbital rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="absolute w-[800px] h-[800px] border border-primary/10 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            className="absolute w-[600px] h-[600px] border border-primary/15 rounded-full"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute w-[400px] h-[400px] border-2 border-primary/20 rounded-full"
          />

          {/* Orbiting elements */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-[600px] h-[600px]"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full" />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute w-[400px] h-[400px]"
          >
            <div className="absolute top-1/2 right-0 translate-x-1/2 w-2 h-2 bg-aurora rounded-full" />
          </motion.div>
        </div>

        <div className="relative mx-auto max-w-4xl px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 mb-10 border-2 border-primary/40 bg-primary/10 backdrop-blur-sm">
              <RiVipDiamondLine className="text-primary" size={18} />
              <span className="text-sm tracking-[0.4em] uppercase text-primary font-bold">{t("pricing.elitePricing")}</span>
            </div>

            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-light text-black leading-[0.9] mb-10">
              {t("pricing.investment")}
              <span className="block font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent mt-4">
                {t("pricing.premiumLevel")}
              </span>
            </h1>

            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-primary" />
              <div className="w-3 h-3 border-2 border-primary rotate-45" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-primary" />
            </div>

            <p className="text-gray-600 text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed mb-4">
              {t("pricing.eliteCredits")}
            </p>
            <p className="text-black text-lg md:text-xl font-medium max-w-xl mx-auto">
              {t("pricing.neverExpire")} {t("pricing.volumeDiscounts")}
            </p>

            {/* Orbital stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16 flex items-center justify-center gap-12 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 border border-primary/30 rounded-full flex items-center justify-center">
                  <RiTimeLine size={16} className="text-primary" />
                </div>
                <span>{t("pricing.noExpiry")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 border border-primary/30 rounded-full flex items-center justify-center">
                  <RiShieldCheckLine size={16} className="text-primary" />
                </div>
                <span>{t("pricing.secure")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 border border-primary/30 rounded-full flex items-center justify-center">
                  <RiSparklingLine size={16} className="text-primary" />
                </div>
                <span>{t("pricing.premium")}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="pb-20 bg-background">
        <div className="mx-auto max-w-7xl px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-light text-black mb-4">
              {t("pricing.creditPackages")}
            </h2>
            <p className="text-gray-600 text-lg">{t("pricing.curatedPackages")}</p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-4">
            {membershipTiers.map((tier, i) => (
              <motion.div
                key={tier.tierKey}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className={`relative bg-muted border ${
                  tier.featured
                    ? "border-primary shadow-2xl shadow-primary/10 scale-105"
                    : "border-border hover:border-primary/40"
                } rounded-lg p-8 transition-all duration-500 hover:shadow-xl group`}
              >
                {/* Featured badge */}
                {tier.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-4 py-2 bg-primary text-white text-xs font-semibold tracking-wider uppercase shadow-lg">
                      {t("pricing.mostPopular")}
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="mb-8 pt-2">
                  <div className="flex flex-col items-center text-center mb-4">
                    <tier.icon size={32} className="text-primary mb-4" />
                    <h3 className="font-display text-2xl font-bold tracking-wide text-black">{t(`pricing.${tier.tierKey}.tier`)}</h3>
                    <p className="text-xs text-gray-500 tracking-wider mt-1">{t(`pricing.${tier.tierKey}.tagline`)}</p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-8 pb-8 border-b border-border">
                  <div className="flex items-baseline justify-center gap-1 mb-3">
                    <span className="font-display text-5xl font-bold text-black">${tier.price}</span>
                  </div>
                  <div className="text-center mb-3">
                    <span className="text-gray-600 font-medium">{tier.credits.toLocaleString()} {t("common.credits")}</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-sm">
                    <span className="text-gray-500">${tier.pricePerCredit}/{t("common.credits").slice(0, -1)}</span>
                    {tier.savings && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-bold tracking-wide">
                        {tier.savings}
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-10">
                  {tier.featureKeys.map((featureKey) => (
                    <li key={featureKey} className="flex items-start gap-3">
                      <RiCheckLine size={18} className="text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{t(featureKey)}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href={tier.href} className="block mt-auto">
                  <Button
                    className={`w-full py-6 font-display tracking-wider uppercase text-sm transition-all duration-500 ${
                      tier.featured
                        ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg"
                        : "bg-muted border-2 border-primary text-foreground hover:bg-primary hover:text-primary-foreground"
                    }`}
                  >
                    {t(`pricing.${tier.tierKey}.cta`)}
                    <RiArrowRightLine className="ml-2" size={16} />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Credit Calculator Section */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="mx-auto max-w-7xl px-8">
          <CreditCalculator />
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-24 bg-background border-y border-border">
        <div className="mx-auto max-w-7xl px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 mb-6 border border-primary/30 bg-primary/5">
              <RiSparklingLine className="text-primary" size={16} />
              <span className="text-xs tracking-[0.4em] uppercase text-primary font-semibold">{t("pricing.difference.title")}</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-light text-black">
              {t("pricing.difference.whyLeaders")}
            </h2>
          </motion.div>

          <div className="grid gap-0 md:grid-cols-3">
            {valuePropositions.map((prop, i) => (
              <motion.div
                key={prop.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="group p-12 border-t border-border md:border-t-0 md:border-l first:border-l-0 first:border-t-0 hover:bg-muted/30 transition-all duration-500"
              >
                <span className="text-6xl font-display font-extralight text-primary/20 group-hover:text-primary transition-colors duration-500">
                  {prop.number}
                </span>
                <h3 className="font-display font-bold text-xl tracking-wide mt-6 mb-4 text-black">
                  {t(prop.titleKey)}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t(prop.descKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Support CTA */}
      <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-5xl px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-muted border border-border rounded-lg p-12 md:p-16 text-center relative overflow-hidden shadow-xl"
          >
            {/* Background decoration */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-6 py-3 mb-8 border border-primary/30 bg-primary/5">
                <RiVipDiamondLine className="text-primary" size={16} />
                <span className="text-xs tracking-[0.4em] uppercase text-primary font-semibold">{t("pricing.premium.title")}</span>
              </div>

              <h2 className="font-display text-4xl md:text-5xl font-light text-black mb-4">
                {t("pricing.premium.bespoke")}
                <span className="block font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mt-3">{t("pricing.premium.forDistinguished")}</span>
              </h2>

              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto my-10" />

              <p className="text-gray-600 text-xl font-light max-w-2xl mx-auto mb-12 leading-relaxed">
                {t("pricing.premium.description")}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/request">
                  <Button className="px-12 py-7 bg-black hover:bg-black/90 text-white font-display tracking-wider uppercase text-sm shadow-lg transition-all duration-500">
                    <RiPhoneLine className="mr-2" size={16} />
                    {t("pricing.premium.scheduleConsultation")}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-background border-t border-border">
        <div className="mx-auto max-w-3xl px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 mb-6 border border-primary/30 bg-primary/5">
              <RiQuestionLine className="text-primary" size={16} />
              <span className="text-xs tracking-[0.4em] uppercase text-primary font-semibold">{t("pricing.faq.title")}</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-light text-black">
              {t("pricing.faq.common")}
            </h2>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.qKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-muted border border-border rounded-lg p-8 hover:border-primary/40 transition-all duration-300 hover:shadow-lg"
              >
                <h3 className="font-display font-bold text-black tracking-wide mb-3 text-lg">{t(faq.qKey)}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{t(faq.aKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Footer */}
      <section className="py-16 bg-muted/30 border-t border-border">
        <div className="mx-auto max-w-7xl px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-600 text-sm">
            <div className="flex items-center gap-2">
              <RiShieldCheckLine size={20} className="text-primary" />
              <span className="tracking-wider font-medium">{t("pricing.trust.securePayments")}</span>
            </div>
            <div className="w-px h-5 bg-gray-300 hidden sm:block" />
            <div className="flex items-center gap-2">
              <RiTimeLine size={20} className="text-primary" />
              <span className="tracking-wider font-medium">{t("pricing.trust.neverExpire")}</span>
            </div>
            <div className="w-px h-5 bg-gray-300 hidden sm:block" />
            <div className="flex items-center gap-2">
              <RiSparklingLine size={20} className="text-primary" />
              <span className="tracking-wider font-medium">{t("pricing.trust.satisfactionGuaranteed")}</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
