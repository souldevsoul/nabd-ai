"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { RiAwardLine, RiShieldKeyholeLine, RiSparklingLine, RiPriceTag3Line, RiRocketLine } from "react-icons/ri";
import { useTranslation } from "@/lib/i18n";

export default function AboutPage() {
  const { t } = useTranslation();

  const missionParameters = [
    {
      icon: RiRocketLine,
      titleKey: "about.speed",
      code: "PARAM-001",
      descKey: "about.speedDesc",
    },
    {
      icon: RiShieldKeyholeLine,
      titleKey: "about.security",
      code: "PARAM-002",
      descKey: "about.securityDesc",
    },
    {
      icon: RiPriceTag3Line,
      titleKey: "about.precision",
      code: "PARAM-003",
      descKey: "about.precisionDesc",
    },
    {
      icon: RiSparklingLine,
      titleKey: "about.legacy",
      code: "PARAM-004",
      descKey: "about.legacyDesc",
    },
  ];

  const flightManifest = [
    { value: "2025", labelKey: "about.missionStart", code: "EST" },
    { valueKey: "cta.elite", labelKey: "about.crewClass", code: "TIER" },
    { value: "\u221E", labelKey: "about.orbitCapacity", code: "RANGE" },
    { value: "100%", labelKey: "about.performance", code: "PERF" },
  ];

  const crewRoster = [
    { roleKey: "about.missionCommander", positionKey: "about.strategicOps", code: "CDR" },
    { roleKey: "about.flightEngineer", positionKey: "about.technicalSystems", code: "FE" },
    { roleKey: "about.payloadSpecialist", positionKey: "about.specializedSolutions", code: "PS" },
  ];
  return (
    <div className="min-h-screen starfield">
      <Header />

      {/* Hero - STAGGERED Layout with Floating Elements */}
      <section className="pt-32 pb-20 relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="aurora" />

        {/* Floating geometric elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-1/4 w-32 h-32 border-2 border-aurora/20 rotate-12 hidden lg:block"
        />
        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -8, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 left-20 w-24 h-24 border-2 border-primary/20 rounded-full hidden lg:block"
        />
        <motion.div
          animate={{
            y: [0, -25, 0],
            x: [0, 10, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/3 left-1/3 w-16 h-16 border-2 border-aurora/15 rotate-45 hidden lg:block"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left column - Staggered up */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 lg:-mt-20"
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 border-2 border-aurora/40 bg-aurora/10 backdrop-blur-sm mb-8">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-aurora rounded-full"
                />
                <span className="text-xs tracking-cosmos uppercase text-aurora font-semibold">{t("about.missionClassification")}</span>
              </div>

              <Logo size="lg" className="mb-8" />

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-extrabold uppercase tracking-tight text-background leading-[0.9] mb-6">
                {t("about.missionBriefing")}
                <span className="block gradient-text mt-2">{t("about.briefing")}</span>
              </h1>

              <div className="w-32 h-1 bg-aurora mb-8" />
            </motion.div>

            {/* Right column - Staggered down */}
            <motion.div
              initial={{ opacity: 0, y: -60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-7 lg:mt-20"
            >
              <div className="space-y-6">
                <p className="text-xl md:text-2xl text-background/80 font-body font-light leading-relaxed">
                  {t("about.description1")}
                </p>
                <p className="text-lg text-background/70 font-body font-light leading-relaxed">
                  {t("about.description2")}
                </p>
                <p className="text-base text-background/60 font-body font-light leading-relaxed">
                  {t("about.description3")}
                </p>

                {/* Floating stats */}
                <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-aurora/20">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-display font-bold text-aurora mb-1">2025</div>
                    <div className="text-xs text-background/50 uppercase tracking-wider">{t("about.launch")}</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-display font-bold text-aurora mb-1">100%</div>
                    <div className="text-xs text-background/50 uppercase tracking-wider">{t("about.success")}</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-display font-bold text-aurora mb-1">{"\u221E"}</div>
                    <div className="text-xs text-background/50 uppercase tracking-wider">{t("about.orbit")}</div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Objective */}
      <section className="py-20 bg-background/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-aurora/40 bg-aurora/5 mb-4">
                <span className="text-xs tracking-cosmos uppercase text-aurora font-semibold">{t("about.missionObjective")}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-extrabold uppercase mb-6 text-background">
                {t("about.launchDirective")}
              </h2>
              <p className="text-background/70 mb-4 leading-relaxed font-light">
                {t("about.objectiveDesc1")}
              </p>
              <p className="text-background/70 mb-4 leading-relaxed font-light">
                {t("about.objectiveDesc2")}
              </p>
              <p className="text-background/70 leading-relaxed font-light">
                {t("about.objectiveDesc3")}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square space-window overflow-hidden"
            >
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="text-center">
                  <RiAwardLine className="w-24 h-24 text-aurora mx-auto mb-6 cosmic-glow-pulse" />
                  <p className="text-2xl font-display font-bold uppercase text-aurora mb-2 tracking-cosmos">
                    {t("about.eliteMissionStatus")}
                  </p>
                  <p className="text-background/70">{t("about.exclusiveDesign")}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Flight Manifest - Stats */}
      <section className="py-16 bg-navy/30 border-y border-aurora/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {flightManifest.map((stat, i) => (
              <motion.div
                key={stat.labelKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="text-center space-window p-6"
              >
                <div className="text-xs text-aurora/60 uppercase tracking-cosmos mb-2 font-mono">
                  {stat.code}
                </div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-aurora">
                  {stat.valueKey ? t(stat.valueKey) : stat.value}
                </div>
                <div className="mt-2 text-xs text-background/60 uppercase tracking-cosmos font-display font-medium">
                  {t(stat.labelKey)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Parameters - Values */}
      <section className="py-20 bg-background/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-aurora/40 bg-aurora/5 mb-4">
              <span className="text-xs tracking-cosmos uppercase text-aurora font-semibold">{t("about.coreSystems")}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold uppercase mb-4 text-background">
              {t("about.missionParameters")}
            </h2>
            <p className="text-background/70 max-w-2xl mx-auto font-light">
              {t("about.parametersDesc")}
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {missionParameters.map((param, i) => (
              <motion.div
                key={param.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="space-window p-6 group hover:border-aurora/60 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border-2 border-aurora/60 flex items-center justify-center flex-shrink-0 group-hover:bg-aurora/10 transition-all">
                    <param.icon size={24} className="text-aurora" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-display font-bold uppercase tracking-wide text-background">
                        {t(param.titleKey)}
                      </h3>
                      <span className="text-xs text-aurora/60 font-mono">{param.code}</span>
                    </div>
                    <p className="text-background/70 font-light">{t(param.descKey)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Crew Roster - Expertise Areas */}
      <section className="py-20 bg-navy/30 border-y border-aurora/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-aurora/40 bg-aurora/5 mb-4">
              <span className="text-xs tracking-cosmos uppercase text-aurora font-semibold">{t("about.readyToEngage")}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-extrabold uppercase mb-4 text-background">
              {t("about.crewRoster")}
            </h2>
            <p className="text-background/70 max-w-2xl mx-auto font-light">
              {t("about.crewRosterDesc")}
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {crewRoster.map((item, i) => (
              <motion.div
                key={item.roleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="text-center space-window p-6"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-aurora/60 mb-4">
                  <span className="text-aurora font-display font-bold text-xl">{item.code}</span>
                </div>
                <h3 className="font-display font-bold uppercase tracking-cosmos text-background mb-1">
                  {t(item.roleKey)}
                </h3>
                <p className="text-background/60 text-sm">{t(item.positionKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Launch Sequence */}
      <section className="py-20 bg-background/50 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 border-2 border-aurora/40 bg-aurora/5 mb-6">
              <span className="w-2 h-2 bg-aurora rounded-full animate-pulse" />
              <span className="text-xs tracking-cosmos uppercase text-aurora font-semibold">{t("about.recruitmentActive")}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-extrabold uppercase mb-4 text-background">
              {t("about.requestMissionClearance")}
            </h2>
            <p className="text-background/70 mb-8 max-w-2xl mx-auto font-light">
              {t("about.ctaDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/request">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white font-display font-bold uppercase tracking-cosmos shadow-lg shadow-primary/25 hover:shadow-[0_0_30px_rgba(30,64,175,0.5)] transition-all"
                >
                  <RiRocketLine size={20} className="mr-2" />
                  {t("cta.requestConsultation")}
                </Button>
              </Link>
              <Link href="/specialists">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-aurora/30 hover:bg-aurora/5 hover:border-aurora font-display font-bold uppercase tracking-cosmos text-aurora"
                >
                  {t("about.viewCrewRoster")}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
