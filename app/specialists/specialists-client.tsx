"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { RiUser3Line, RiSparklingLine, RiArrowRightLine, RiCheckLine } from "react-icons/ri";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { SlStar, SlBadge, SlBriefcase } from "react-icons/sl";
import { useTranslation } from "@/lib/i18n";

interface Specialist {
  id: string;
  firstName: string;
  lastName?: string | null;
  bio: string | null;
  hourlyRate: number;
  rating: number;
  completedTasks: number;
  isAvailable: boolean;
  tasks: {
    id: string;
    task: {
      id: string;
      name: string;
      displayName: string;
    };
  }[];
}

interface SpecialistsClientProps {
  specialists: Specialist[];
  categories: string[];
}

export function SpecialistsClient({ specialists, categories }: SpecialistsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { t } = useTranslation();

  const filteredSpecialists = selectedCategory
    ? specialists.filter((s) =>
        s.tasks.some((t) => t.task.displayName.toLowerCase().includes(selectedCategory.toLowerCase()))
      )
    : specialists;

  return (
    <div className="min-h-screen bg-background starfield">
      <Header />

      {/* Hero - LEFT-ALIGNED with Medical Professional Silhouette */}
      <section className="pt-40 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient pointer-events-none" />

        {/* Medical professional silhouette decoration on right */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-0 top-20 w-1/3 h-full hidden lg:block"
        >
          <div className="relative w-full h-full opacity-10">
            <div className="absolute top-20 right-20 w-64 h-64 border-4 border-primary/30 rounded-full" />
            <div className="absolute top-32 right-32 w-40 h-40 border-2 border-aurora/20 rounded-full" />
            <div className="absolute top-48 right-16 w-32 h-48 border-2 border-primary/20" />
            <RiUser3Line className="absolute top-24 right-24 w-56 h-56 text-primary/20" />
          </div>
        </motion.div>

        <div className="relative mx-auto max-w-7xl px-8">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-primary/30 bg-primary/5">
              <RiSparklingLine className="text-primary" size={14} />
              <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">{t("specialists.roster")}</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-foreground leading-[0.95] mb-6">
              {t("specialists.elite")}
              <span className="block font-bold gradient-text mt-2">{t("specialists.experts")}</span>
            </h1>

            <div className="w-32 h-1 cosmic-line mb-8" />

            <p className="text-muted-foreground text-xl font-light leading-relaxed mb-4">
              {t("specialists.description")}
            </p>
            <p className="text-foreground/70 text-lg font-light leading-relaxed">
              {t("specialists.tagline")}
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <Link href="/request">
                <Button
                  size="lg"
                  className="px-10 py-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-display tracking-wider uppercase text-sm shadow-lg shadow-secondary/20"
                >
                  <SlBriefcase size={18} />
                  {t("specialists.requestConsultation")}
                  <RiArrowRightLine size={16} />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      {categories.length > 0 && (
        <section className="pb-12">
          <div className="mx-auto max-w-7xl px-8">
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={`font-display tracking-wider uppercase text-xs transition-all duration-300 ${
                  selectedCategory === null
                    ? "bg-secondary text-secondary-foreground"
                    : "border-border hover:border-primary hover:text-primary"
                }`}
              >
                {t("specialists.allSpecialists")} ({specialists.length})
              </Button>
              {categories.slice(0, 8).map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`font-display tracking-wider uppercase text-xs transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-secondary text-secondary-foreground"
                      : "border-border hover:border-primary hover:text-primary"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Specialists Grid */}
      <section className="py-12 pb-32">
        <div className="mx-auto max-w-7xl px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredSpecialists.map((specialist, i) => (
              <motion.div
                key={specialist.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.6 }}
                className="elite-card group relative rocket-hover"
              >
                {/* Verified badge decoration */}
                <div className="absolute top-4 right-4 w-8 h-8 border border-primary/30 rounded-full flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                </div>
                {/* Avatar & Name */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 mb-4 flex items-center justify-center border-2 border-border group-hover:border-primary/40 transition-all duration-500 cosmic-glow-pulse">
                    <RiUser3Line size={48} className="text-primary/60" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-1">
                    {specialist.firstName} {specialist.lastName?.[0]}.
                  </h3>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <div className="flex items-center gap-1 text-sm">
                      <SlStar size={14} className="text-primary fill-primary" />
                      <span className="font-semibold text-foreground">{specialist.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-muted-foreground text-sm">•</span>
                    <span className="text-sm text-muted-foreground font-light">
                      {specialist.completedTasks} {t("specialists.consultations")}
                    </span>
                  </div>
                </div>

                {/* Bio */}
                {specialist.bio && (
                  <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6 text-center line-clamp-2 min-h-[2.5rem]">
                    {specialist.bio}
                  </p>
                )}

                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-2 justify-center mb-6 min-h-[2rem]">
                  {specialist.tasks.slice(0, 3).map((st) => (
                    <span
                      key={st.id}
                      className="px-3 py-1 text-xs font-medium tracking-wide bg-primary/5 text-primary border border-primary/20 transition-colors duration-300"
                    >
                      {st.task.displayName}
                    </span>
                  ))}
                  {specialist.tasks.length > 3 && (
                    <span className="px-3 py-1 text-xs text-muted-foreground font-light">
                      +{specialist.tasks.length - 3}
                    </span>
                  )}
                </div>

                {/* Rate & CTA */}
                <div className="pt-6 border-t border-border flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground font-light mb-1 font-mono">{t("specialists.rate")}</div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-2xl font-bold text-foreground">
                        ${specialist.hourlyRate}
                      </span>
                      <span className="text-sm text-muted-foreground">/{t("specialists.perConsultation")}</span>
                    </div>
                  </div>
                  <Link href={`/request?specialist=${specialist.id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="font-display tracking-wider uppercase text-xs gap-1 border-border hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300"
                    >
                      {t("specialists.engage")}
                      <RiArrowRightLine size={12} />
                    </Button>
                  </Link>
                </div>

                {/* Verified Badge */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-8 h-8 rounded-full bg-success/10 border border-success/30 flex items-center justify-center">
                    <RiCheckLine size={16} className="text-success" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredSpecialists.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <SlBadge size={64} className="mx-auto text-muted-foreground/40 mb-6" />
              <h3 className="font-display text-2xl font-light text-foreground mb-3">
                {t("specialists.noSpecialists")}
              </h3>
              <p className="text-muted-foreground font-light mb-8">
                {t("specialists.noSpecialistsDesc")}
              </p>
              <Button
                variant="outline"
                onClick={() => setSelectedCategory(null)}
                className="font-display tracking-wider uppercase text-xs"
              >
                {t("specialists.viewAllSpecialists")}
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Bespoke Solutions CTA - Enhanced with Medical Pulse Graphics */}
      <section className="py-32 bg-gradient-to-br from-navy/40 via-background to-navy/30 border-t border-primary/20 relative overflow-hidden">
        {/* Pulse background */}
        <div className="absolute inset-0 constellation opacity-40" />

        {/* Heartbeat pulse graphic */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 0.15 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 hidden lg:block"
        >
          <div className="relative w-full h-full">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-64 border-l-4 border-r-4 border-primary/30" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-32 border-t-4 border-primary/20" />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-48 bg-gradient-to-t from-primary/30 via-aurora/20 to-transparent blur-2xl"
            />
          </div>
        </motion.div>

        <div className="mx-auto max-w-4xl px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 mb-8 border-2 border-primary/40 bg-primary/10 backdrop-blur-sm">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <RiSparklingLine className="text-primary" size={16} />
              </motion.div>
              <span className="text-xs tracking-[0.4em] uppercase text-primary font-bold">{t("specialists.bespoke")}</span>
            </div>

            <h2 className="font-display text-4xl md:text-6xl font-light text-foreground mb-6 leading-tight">
              {t("specialists.customConsultation")}
              <span className="block font-bold gradient-text mt-2">{t("specialists.needed")}</span>
            </h2>

            <div className="w-32 h-1 cosmic-line mx-auto mb-8" />

            <p className="text-muted-foreground text-lg font-light mb-4 leading-relaxed max-w-2xl mx-auto">
              {t("specialists.ctaDescription")}
            </p>
            <p className="text-foreground/60 text-base font-light mb-12 leading-relaxed max-w-xl mx-auto">
              {t("specialists.ctaTagline")}
            </p>

            <Link href="/request">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="px-12 py-7 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-display tracking-[0.2em] uppercase text-sm shadow-2xl shadow-secondary/30 border border-secondary/50">
                  {t("specialists.requestConsultation")}
                  <RiArrowRightLine className="ml-3" size={18} />
                </Button>
              </motion.div>
            </Link>

            <div className="mt-10 flex items-center justify-center gap-8 text-xs text-muted-foreground font-mono">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span>{t("specialists.availability247")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-aurora rounded-full animate-pulse" />
                <span>{t("specialists.fastResponse")}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
