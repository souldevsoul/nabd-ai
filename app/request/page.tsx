"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RiSparklingLine, RiCheckLine, RiSearchLine, RiArrowRightLine, RiStarFill, RiUser3Line } from "react-icons/ri";

interface MatchedSpecialist {
  id: string;
  specialist: {
    id: string;
    firstName: string;
    avatarSeed: string;
    rating: number;
    completedTasks: number;
  };
  taskName: string;
  price: number;
  confidence: number;
  reasoning: string;
}

interface MatchResult {
  requestId: string | null;
  isAuthenticated: boolean;
  matches: MatchedSpecialist[];
  suggestedTasks: string[];
}

function RequestContent() {
  const searchParams = useSearchParams();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState<string | null>(null);
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);

  // Auto-submit if returning from login with query
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && !hasAutoSubmitted && !result) {
      setDescription(q);
      setHasAutoSubmitted(true);
      const autoSubmit = async () => {
        setLoading(true);
        try {
          const response = await fetch("/api/match-specialists", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description: q }),
          });
          if (response.ok) {
            const data = await response.json();
            setResult(data);
          }
        } catch {
          // Ignore errors for auto-submit
        } finally {
          setLoading(false);
        }
      };
      autoSubmit();
    }
  }, [searchParams, hasAutoSubmitted, result]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/match-specialists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to match specialists");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-32 pb-24">
      {/* SPLIT Hero Layout - 50/50 */}
      <div className="mx-auto max-w-7xl px-8 mb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-primary/30 bg-primary/5">
              <RiSparklingLine className="text-primary" size={14} />
              <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">Миссия Брифингі</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-foreground leading-[0.95] mb-8">
              Экипажды
              <span className="block font-bold gradient-text mt-2">Сұрау</span>
            </h1>

            <div className="w-32 h-1 cosmic-line mb-8" />

            <p className="text-muted-foreground text-xl font-light leading-relaxed mb-4">
              Миссия параметрлеріңіз туралы бізге хабарлаңыз.
            </p>
            <p className="text-foreground/70 text-lg font-light leading-relaxed mb-8">
              Біздің ғарышкерлер оңтайлы траекторияны жұлдызды миссия сәттілігі үшін сызады.
            </p>

            <div className="flex flex-col gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-primary/30 flex items-center justify-center">
                  <span className="text-primary font-mono">01</span>
                </div>
                <span>Миссия параметрлерін сипаттаңыз</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-primary/30 flex items-center justify-center">
                  <span className="text-primary font-mono">02</span>
                </div>
                <span>AI сәйкес ғарышкерлерді табады</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-primary/30 flex items-center justify-center">
                  <span className="text-primary font-mono">03</span>
                </div>
                <span>Экипаж мүшесін таңдап, миссияны бастаңыз</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Visual Element */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-96 lg:h-[500px]"
          >
            <div className="absolute inset-0 border-2 border-primary/20 backdrop-blur-sm bg-muted/10">
              {/* Orbital diagram */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  className="w-full h-full border-2 border-primary/30 rounded-full relative"
                >
                  <div className="absolute top-1/2 left-0 w-4 h-4 bg-primary rounded-full -translate-y-1/2 -translate-x-1/2" />
                </motion.div>

                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 border-2 border-aurora/30 rounded-full"
                >
                  <div className="absolute top-0 left-1/2 w-3 h-3 bg-aurora rounded-full -translate-x-1/2 -translate-y-1/2" />
                </motion.div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-primary bg-primary/10 rounded-full flex items-center justify-center">
                  <RiSparklingLine className="text-primary" size={24} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-8">

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="elite-card"
            >
              <label className="block text-sm font-display font-medium tracking-wide mb-4 font-mono">
                Миссия Параметрлері
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Миссия мақсаты: Ұйым үшін AI трансформация жүйесін орналастыру. Талаптар: Стратегиялық траектория жоспарлау, озық аналитика жүктемесі, миссияға маңызды сенімділікпен арнайы іске асыру..."
                className="min-h-[200px] text-base resize-none bg-muted border-border focus:border-primary focus:ring-2 focus:ring-primary/20 mb-6 font-mono"
                disabled={loading}
              />

              {error && (
                <div className="mb-6 p-4 border border-destructive/30 bg-destructive/5 text-destructive text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full py-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-display tracking-wider uppercase text-sm shadow-lg shadow-secondary/20"
                disabled={loading || description.length < 10}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <RiSearchLine size={18} />
                    </motion.div>
                    Экипаж Тізімін Сканерлеу...
                  </>
                ) : (
                  <>
                    Сұрауды Іске Қосу
                    <RiArrowRightLine className="ml-2" size={18} />
                  </>
                )}
              </Button>
            </motion.form>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Success message */}
              <div className="elite-card text-center relative overflow-hidden">
                <div className="absolute inset-0 cosmic-glow-pulse opacity-20" />
                <div className="inline-flex items-center justify-center w-14 h-14 border border-primary/30 bg-primary/5 mb-6 relative">
                  <RiCheckLine size={28} className="text-primary" />
                </div>
                <h2 className="font-display text-2xl font-bold tracking-wide mb-3">
                  МИССИЯ РАСТАЛДЫ - {result.matches.length} Ғарышкер Тағайындалды
                </h2>
                <p className="text-muted-foreground text-sm font-mono">
                  Докингке және миссияны бастауға оңтайлы экипаж мүшесін таңдаңыз.
                </p>
              </div>

              {/* Matched specialists */}
              <div className="space-y-4">
                {result.matches.map((match, index) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedSpecialist(match.id)}
                    className={`elite-card cursor-pointer transition-all duration-300 relative rocket-hover ${
                      selectedSpecialist === match.id
                        ? "ring-1 ring-primary border-primary/30 cosmic-glow-pulse"
                        : "hover:border-primary/20"
                    }`}
                  >
                    <div className="flex items-start gap-5">
                      {/* Avatar */}
                      <div className="w-16 h-16 flex items-center justify-center border border-border bg-muted/30 flex-shrink-0 relative">
                        <RiUser3Line size={28} className="text-muted-foreground" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white animate-pulse" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-display font-bold text-lg tracking-wide">
                            {match.specialist.firstName}
                          </h3>
                          <span className="px-3 py-1 border border-primary/30 bg-primary/5 text-primary text-xs font-medium tracking-wider">
                            {match.taskName}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3 font-mono">
                          <span className="flex items-center gap-1">
                            <RiStarFill size={14} className="text-primary" />
                            {match.specialist.rating.toFixed(1)}
                          </span>
                          <span>{match.specialist.completedTasks} миссия аяқталды</span>
                          <span className="text-primary font-medium">
                            {Math.round(match.confidence * 100)}% траектория сәйкестігі
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground font-light line-clamp-2">
                          {match.reasoning}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        <div className="font-display text-2xl font-bold text-foreground">${match.price}</div>
                        <div className="text-xs text-muted-foreground font-mono">миссия үшін</div>
                      </div>
                    </div>

                    {selectedSpecialist === match.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-6 pt-6 border-t border-border"
                      >
                        {result.isAuthenticated ? (
                          <Link href={`/dashboard/wallet`}>
                            <Button className="w-full py-5 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-display tracking-wider uppercase text-sm shadow-lg shadow-secondary/20">
                              {match.specialist.firstName} бен Орналастыру
                              <RiArrowRightLine className="ml-2" size={16} />
                            </Button>
                          </Link>
                        ) : (
                          <Link href={`/login?callbackUrl=${encodeURIComponent(`/request?q=${encodeURIComponent(description)}`)}`}>
                            <Button className="w-full py-5 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-display tracking-wider uppercase text-sm shadow-lg shadow-secondary/20">
                              {match.specialist.firstName} бен Орналастыру үшін Кіру
                              <RiArrowRightLine className="ml-2" size={16} />
                            </Button>
                          </Link>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* New search */}
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setResult(null);
                    setSelectedSpecialist(null);
                  }}
                  className="font-display tracking-wider uppercase text-xs border-border hover:border-primary hover:text-primary"
                >
                  Жаңа Миссияны Жоспарлау
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function RequestLoading() {
  return (
    <section className="pt-40 pb-24">
      <div className="mx-auto max-w-4xl px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-primary/30 bg-primary/5">
            <RiSparklingLine className="text-primary" size={14} />
            <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">Миссия Брифингі</span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl font-light text-foreground leading-tight mb-6">
            Экипажды
            <span className="block font-bold gradient-text">Сұрау</span>
          </h1>

          <div className="w-24 h-0.5 cosmic-line mx-auto mb-8" />
        </div>

        <div className="elite-card">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-[200px] bg-muted rounded"></div>
            <div className="h-14 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function RequestPage() {
  return (
    <div className="min-h-screen bg-background starfield">
      <Header />
      <Suspense fallback={<RequestLoading />}>
        <RequestContent />
      </Suspense>
      <Footer />
    </div>
  );
}
