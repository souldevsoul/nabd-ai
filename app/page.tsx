"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { Header, Footer } from "@/components/layout";
import { RiArrowRightLine, RiArrowDownLine, RiSparklingLine, RiShieldCheckLine, RiAwardLine, RiCheckboxCircleLine, RiBrainLine, RiLineChartLine, RiDatabase2Line, RiHeartPulseLine, RiHeartLine } from "react-icons/ri";
import { useTranslation } from "@/lib/i18n";

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { t, locale } = useTranslation();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const eliteServices = [
    { id: "01", titleKey: "services.aiStrategy.title", descKey: "services.aiStrategy.description", icon: RiBrainLine },
    { id: "02", titleKey: "services.mlSolutions.title", descKey: "services.mlSolutions.description", icon: RiLineChartLine },
    { id: "03", titleKey: "services.dataEngineering.title", descKey: "services.dataEngineering.description", icon: RiDatabase2Line },
  ];

  const accolades = [
    { metric: locale === "ar" ? "٩٫٦ مليار ريال" : "$9.6B SAR", labelKey: "accolades.portfolioValue" },
    { metric: "Fortune 100", labelKey: "accolades.premiumClients" },
    { metric: locale === "ar" ? "٩٩٫٩٪" : "99.9%", labelKey: "accolades.satisfactionRate" },
    { metric: locale === "ar" ? "٢٤/٧" : "24/7", labelKey: "accolades.dedicatedSupport" },
  ];

  const promiseFeatures = [
    { icon: RiAwardLine, titleKey: "promise.distinguished", descKey: "promise.distinguishedDesc", x: '20%', y: '20%' },
    { icon: RiShieldCheckLine, titleKey: "promise.secure", descKey: "promise.secureDesc", x: '80%', y: '15%' },
    { icon: RiSparklingLine, titleKey: "promise.premium", descKey: "promise.premiumDesc", x: '25%', y: '75%' },
    { icon: RiCheckboxCircleLine, titleKey: "promise.results", descKey: "promise.resultsDesc", x: '75%', y: '80%' },
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background overflow-x-hidden">
      <Header />

      {/* Section 1: Hero - "ECG Monitor" Heartbeat Theme */}
      <section ref={heroRef} className="relative min-h-screen bg-gradient-to-b from-background via-background to-muted/30 overflow-hidden">
        {/* ECG grid overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(220, 38, 38, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(220, 38, 38, 0.3) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />

        {/* Animated heartbeat line across screen */}
        <svg className="absolute top-1/3 w-full h-32 pointer-events-none" preserveAspectRatio="none">
          <motion.path
            d="M 0,64 L 200,64 L 220,32 L 240,96 L 260,32 L 280,64 L 1920,64"
            stroke="oklch(0.55 0.22 25)"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>

        <motion.div
          style={{ opacity, y }}
          className="relative min-h-screen grid lg:grid-cols-2 gap-8 px-8 lg:px-16 pt-20"
        >
          {/* LEFT PANEL: Vital Signs Display */}
          <div className="relative flex flex-col justify-center py-20 lg:py-0">
            <motion.div
              initial={{ opacity: 0, x: locale === "ar" ? -60 : 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10"
            >
              {/* Vital Signs Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-primary/40 bg-primary/10 backdrop-blur-sm"
              >
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-[10px] tracking-[0.2em] uppercase text-primary font-bold font-mono">{t("hero.vitalSigns")}</span>
              </motion.div>

              {/* Main Headline - At peak of heartbeat */}
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-foreground leading-[1.1] tracking-wide mb-6">
                <span className="block">{t("hero.pulseOfAI")}</span>
                <span className="block font-bold mt-2">
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">{t("hero.artificialIntelligence")}</span>
                </span>
              </h1>

              {/* ECG rhythm line */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-l from-primary/60 to-transparent" />
                <RiHeartPulseLine className="text-primary animate-pulse" size={20} />
              </div>

              <p className="text-foreground/90 text-base md:text-lg font-light leading-relaxed mb-3">
                {t("hero.platformDescription")}
              </p>
              <p className="text-primary/80 text-sm md:text-base font-light leading-relaxed mb-10">
                {t("hero.tagline")}
              </p>

              {/* Vital Signs Panel */}
              <div className="bg-gradient-to-br from-card to-muted/50 border border-primary/30 rounded-lg p-6 mb-8 max-w-md shadow-lg shadow-primary/10">
                <div className="text-primary text-[10px] font-mono mb-4 tracking-wider border-b border-primary/20 pb-2">{t("hero.vitalIndicators")}</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background/50 rounded p-3">
                    <div className="text-primary text-xs font-mono mb-1">{t("hero.status")}</div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                      <span className="text-foreground text-sm font-mono font-medium">{t("hero.active")}</span>
                    </div>
                  </div>
                  <div className="bg-background/50 rounded p-3">
                    <div className="text-primary text-xs font-mono mb-1">{t("hero.projects")}</div>
                    <div className="text-foreground text-sm font-mono font-medium tabular-nums">{t("hero.projectsCount")}</div>
                  </div>
                  <div className="bg-background/50 rounded p-3">
                    <div className="text-primary text-xs font-mono mb-1">{t("hero.location")}</div>
                    <div className="text-foreground text-sm font-mono font-medium">{t("hero.locationValue")}</div>
                  </div>
                  <div className="bg-background/50 rounded p-3">
                    <div className="text-primary text-xs font-mono mb-1">{t("hero.time")}</div>
                    <div className="text-foreground text-sm font-mono font-medium tabular-nums">
                      {new Date().toLocaleTimeString(locale === "ar" ? 'ar-SA' : 'en-US', { hour12: false })}
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link href="/request">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-l from-primary to-accent text-white font-display text-sm tracking-widest uppercase overflow-hidden shadow-lg shadow-primary/30"
                  >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                    <RiHeartPulseLine className="relative z-10" size={20} />
                    <span className="relative z-10">{t("hero.startProject")}</span>
                    <RiArrowRightLine className="relative z-10 group-hover:-translate-x-2 transition-transform duration-500" size={18} />
                  </motion.button>
                </Link>
                <Link href="/pricing">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-3 px-10 py-5 border-2 border-primary/60 text-primary font-display text-sm tracking-widest uppercase hover:bg-primary/10 backdrop-blur-sm transition-all duration-500"
                  >
                    <RiHeartLine size={18} />
                    {t("hero.explorePlatform")}
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* RIGHT PANEL: Heart Monitor Display */}
          <div className="relative flex flex-col justify-center py-20 lg:py-0">
            <motion.div
              initial={{ opacity: 0, x: locale === "ar" ? 60 : -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              {/* Heart Rate Monitor */}
              <div className="bg-card border border-primary/30 rounded-lg p-5 border-r-4 border-r-primary shadow-lg shadow-primary/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                    <RiHeartPulseLine className="text-primary animate-pulse" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="text-primary text-[9px] font-mono mb-1 tracking-widest">{t("monitor.pulseRate")} #001</div>
                    <h3 className="text-foreground font-display font-bold text-lg mb-2">{t("monitor.nabdPlatform")}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {t("monitor.advancedTech")}
                    </p>
                  </div>
                </div>
              </div>

              {/* System Indicators */}
              <div className="bg-card border border-accent/30 rounded-lg p-5 border-r-4 border-r-accent shadow-lg shadow-accent/10">
                <div className="text-primary text-[10px] font-mono mb-3 tracking-wider">{t("monitor.systemData")}</div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-background/50 rounded p-2">
                    <div className="flex items-center gap-2">
                      <RiShieldCheckLine size={14} className="text-accent" />
                      <span className="text-foreground text-xs">{t("monitor.verified")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-success rounded-full" />
                      <span className="text-foreground text-xs font-mono font-medium">{locale === "ar" ? "١٠٠٪" : "100%"}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-background/50 rounded p-2">
                    <div className="flex items-center gap-2">
                      <RiHeartPulseLine size={14} className="text-accent" />
                      <span className="text-foreground text-xs">{t("hero.projects").replace(":", "")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-success rounded-full" />
                      <span className="text-foreground text-xs font-mono font-medium tabular-nums">{locale === "ar" ? "٥٠+" : "50+"}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-background/50 rounded p-2">
                    <div className="flex items-center gap-2">
                      <RiAwardLine size={14} className="text-accent" />
                      <span className="text-foreground text-xs">{t("monitor.successRate")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                      <span className="text-foreground text-xs font-mono font-medium">{locale === "ar" ? "٩٩٫٩٪" : "99.9%"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pulse Monitor */}
              <div className="bg-card border border-success/30 rounded-lg p-5 border-r-4 border-r-success shadow-lg shadow-success/10">
                <div className="text-primary text-[10px] font-mono mb-2 tracking-wider">{t("monitor.pulseMonitor")}</div>
                <div className="flex items-baseline gap-3 bg-background/50 rounded p-3">
                  <motion.div
                    className="text-3xl font-display font-bold text-primary tabular-nums"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    &#9829;
                  </motion.div>
                  <div className="text-foreground text-xs font-mono font-medium">{t("monitor.activeNow")}</div>
                </div>
                <div className="mt-3 h-1.5 bg-background/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-l from-primary to-success"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-12 right-8 lg:right-1/2 lg:translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">{t("hero.explore")}</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          >
            <RiArrowDownLine size={20} className="text-primary" />
          </motion.div>
        </motion.div>
      </section>

      {/* Section 2: Accolades - "Vital Signs Dashboard" 2x2 Grid */}
      <section className="py-20 bg-background border-y border-border relative overflow-hidden">
        <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-primary/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {accolades.map((item, i) => (
              <motion.div
                key={item.labelKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="text-center relative"
              >
                {/* Waveform background */}
                <div className="relative mx-auto w-32 h-32 mb-6">
                  <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
                    <motion.path
                      d="M0,50 L20,50 L25,30 L30,70 L35,30 L40,50 L100,50"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      className="text-primary"
                      animate={{ pathLength: [0, 1, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                  </svg>

                  {/* Beeping indicator */}
                  <div className="absolute -top-2 -left-2 w-4 h-4 bg-primary rounded-full animate-pulse" style={{ boxShadow: '0 0 12px oklch(0.55 0.22 25)' }} />
                </div>

                <div className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3 tabular-nums">
                  {item.metric}
                </div>
                <div className="text-muted-foreground text-xs tracking-[0.2em] uppercase font-mono">
                  {t(item.labelKey)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Services - "Arteries" 3 Branching Paths */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="mb-20 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-primary/30 bg-primary/5">
              <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">{t("services.title")}</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-light text-foreground mb-4">
              {t("services.arteries")} <span className="font-bold bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">{t("services.innovation")}</span>
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-l from-primary to-accent mx-auto mt-6" />
          </motion.div>

          {/* Heart with 3 arteries layout */}
          <div className="relative flex flex-col lg:flex-row items-center justify-center gap-8">
            {eliteServices.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 1 }}
                className="group relative w-full lg:w-80"
              >
                <div className="relative bg-card border-2 border-primary/30 rounded-xl p-8 hover:border-accent transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/20">
                  {/* Pulsing animation */}
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-primary/20"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />

                  <div className="relative z-10">
                    <div className="text-4xl font-display font-extralight text-primary/40 group-hover:text-primary transition-colors duration-700 mb-4">
                      {service.id}
                    </div>

                    <div className="mb-4">
                      <service.icon className="text-primary group-hover:text-accent transition-colors duration-500" size={40} />
                    </div>

                    <h3 className="text-xl md:text-2xl font-display font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-500 mb-4">
                      {t(service.titleKey)}
                    </h3>

                    <p className="text-muted-foreground font-light leading-relaxed text-sm mb-6">
                      {t(service.descKey)}
                    </p>

                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                      <span className="text-[10px] text-muted-foreground font-mono tracking-wider">{t("hero.active")}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Promise - "Lifeblood" Central Heart with Radiating Features */}
      <section className="py-32 bg-gradient-to-b from-background to-muted/30 overflow-hidden relative">
        <div className="relative max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-primary/30 bg-primary/5">
              <RiSparklingLine className="text-primary" size={14} />
              <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">{t("promise.title")}</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground leading-tight mb-8">
              {t("promise.headline")}
              <span className="block bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent font-bold mt-2">{t("promise.subheadline")}</span>
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-l from-primary to-accent mx-auto mb-8" />
            <p className="text-muted-foreground text-lg font-light leading-relaxed max-w-2xl mx-auto">
              {t("promise.description")}
            </p>
          </motion.div>

          {/* Heart with vessels pattern */}
          <div className="relative max-w-4xl mx-auto h-96 md:h-[500px]">
            {promiseFeatures.map((item, i) => (
              <motion.div
                key={item.titleKey}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                className="absolute"
                style={{ right: item.x, top: item.y, transform: 'translate(50%, -50%)' }}
              >
                <div className="relative">
                  <div className="absolute inset-0 w-24 h-24 translate-x-1/2 -translate-y-1/2 top-1/2 right-1/2 bg-primary/20 rounded-full blur-xl" />

                  <div className="relative bg-card border border-primary/30 p-6 rounded-xl hover:scale-105 transition-transform duration-500 w-48 md:w-56 shadow-lg">
                    <item.icon className="text-primary mb-4" size={32} />
                    <h3 className="font-display font-bold text-foreground mb-2 text-sm tracking-wide">{t(item.titleKey)}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">{t(item.descKey)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Partner CTA - "Syncing Hearts" */}
      <section className="py-32 bg-background border-y border-border relative overflow-hidden">
        <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Right side - Info */}
            <div className="lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-primary/30 bg-primary/5">
                <RiAwardLine className="text-primary" size={14} />
                <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">{t("partner.forSpecialists")}</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-light text-foreground leading-tight mb-6">
                {t("partner.bePartOf")}
                <span className="block font-bold bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent mt-2">{t("partner.eliteExperts")}</span>
              </h2>
              <div className="w-24 h-0.5 bg-gradient-to-l from-primary to-accent mb-8" />
              <p className="text-muted-foreground text-lg font-light leading-relaxed mb-8">
                {t("partner.description")}
              </p>
              <Link href="/become-partner">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group inline-flex items-center gap-3 px-10 py-5 bg-secondary text-secondary-foreground font-display text-sm tracking-widest uppercase shadow-lg shadow-secondary/20 hover:shadow-xl hover:shadow-secondary/30 transition-all duration-500"
                >
                  {t("partner.becomePartner")}
                  <RiArrowRightLine className="group-hover:-translate-x-1 transition-transform duration-500" size={18} />
                </motion.button>
              </Link>
            </div>

            {/* Left side - Syncing Hearts Animation */}
            <div className="lg:order-1 flex justify-center">
              <div className="relative w-64 h-64">
                {/* Two hearts beating together */}
                <motion.div
                  className="absolute top-1/2 right-1/4 w-20 h-20"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <RiHeartLine className="text-primary w-full h-full" />
                </motion.div>
                <motion.div
                  className="absolute top-1/2 left-1/4 w-20 h-20"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                >
                  <RiHeartLine className="text-accent w-full h-full" />
                </motion.div>

                {/* Connecting pulse */}
                <svg className="absolute inset-0 w-full h-full">
                  <motion.line
                    x1="35%" y1="50%" x2="65%" y2="50%"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary/50"
                    animate={{ strokeDasharray: ["0 100", "100 0"] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Final CTA - "Giant Pulsing Heart" */}
      <section className="py-40 bg-background border-t border-border relative overflow-hidden">
        <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-6 py-3 mb-12 border border-primary/30 bg-primary/5"
            >
              <RiSparklingLine className="text-primary" size={14} />
              <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium font-mono">{t("cta.limitedAvailability")}</span>
            </motion.div>

            <h2 className="font-display text-5xl md:text-7xl font-light text-foreground mb-4">
              {t("cta.joinThe")}
            </h2>
            <h2 className="font-display text-5xl md:text-7xl font-bold bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent mb-10">
              {t("cta.elite")}
            </h2>

            <div className="w-32 h-0.5 bg-gradient-to-l from-primary to-accent mx-auto mb-10" />

            <p className="text-muted-foreground text-lg md:text-xl font-light mb-14 max-w-3xl mx-auto leading-relaxed">
              {t("cta.quarterlyNote")}
              <span className="block mt-3 text-foreground/80">{t("cta.startJourney")}</span>
            </p>

            {/* Large pulsing heart button */}
            <Link href="/request">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative inline-block group"
              >
                <div className="absolute inset-0 -m-4 rounded-full border-4 border-primary/20 group-hover:border-accent/40 transition-colors duration-500" />

                <motion.button
                  className="relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-primary via-accent to-primary text-white font-display text-xl md:text-2xl tracking-widest uppercase shadow-2xl shadow-primary/40 overflow-hidden"
                  animate={{ boxShadow: ['0 0 40px oklch(0.55 0.22 25 / 40%)', '0 0 80px oklch(0.55 0.22 25 / 60%)', '0 0 40px oklch(0.55 0.22 25 / 40%)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="relative z-10 flex flex-col items-center justify-center h-full">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <RiHeartPulseLine className="mb-4" size={48} />
                    </motion.div>
                    <span>{t("cta.startNow")}</span>
                  </span>
                </motion.button>
              </motion.div>
            </Link>

            <p className="mt-12 text-sm text-muted-foreground tracking-wider">
              {t("cta.applyForPartnership")}
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
