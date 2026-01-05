"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";
import {
  TbRocket,
  TbSearch,
  TbSparkles,
  TbUser,
  TbCheck,
  TbClock,
  TbPlus,
  TbMinus,
  TbHistory,
  TbX,
  TbArrowRight,
  TbLoader2,
  TbBolt,
  TbBrain,
  TbChartLine,
  TbCode,
  TbRobot,
  TbMessageChatbot,
  TbDeviceAnalytics,
  TbTargetArrow,
} from "react-icons/tb";
import { SlStar } from "react-icons/sl";

// Template keys for presets - actual text comes from translations
const REQUEST_PRESET_KEYS = [
  {
    id: "mvp",
    titleKey: "request.templates.mvp.title",
    descriptionKey: "request.templates.mvp.description",
    icon: TbRocket,
    promptKey: "request.templates.mvp.prompt",
    categoryKey: "request.categories.product",
  },
  {
    id: "ai-integration",
    titleKey: "request.templates.aiIntegration.title",
    descriptionKey: "request.templates.aiIntegration.description",
    icon: TbBrain,
    promptKey: "request.templates.aiIntegration.prompt",
    categoryKey: "request.categories.ai",
  },
  {
    id: "growth",
    titleKey: "request.templates.growth.title",
    descriptionKey: "request.templates.growth.description",
    icon: TbChartLine,
    promptKey: "request.templates.growth.prompt",
    categoryKey: "request.categories.growth",
  },
  {
    id: "chatbot",
    titleKey: "request.templates.chatbot.title",
    descriptionKey: "request.templates.chatbot.description",
    icon: TbMessageChatbot,
    promptKey: "request.templates.chatbot.prompt",
    categoryKey: "request.categories.automation",
  },
  {
    id: "automation",
    titleKey: "request.templates.automation.title",
    descriptionKey: "request.templates.automation.description",
    icon: TbRobot,
    promptKey: "request.templates.automation.prompt",
    categoryKey: "request.categories.automation",
  },
  {
    id: "pitch",
    titleKey: "request.templates.pitch.title",
    descriptionKey: "request.templates.pitch.description",
    icon: TbTargetArrow,
    promptKey: "request.templates.pitch.prompt",
    categoryKey: "request.categories.fundraising",
  },
];

interface MatchedSpecialist {
  id: string;
  specialist: {
    id: string;
    firstName: string;
    avatarSeed: string;
    rating: number;
    completedTasks: number;
    hourlyRate?: number;
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

interface SavedSearch {
  id: string;
  description: string;
  timestamp: number;
  result?: MatchResult;
}

// Helper to detect template placeholders like [describe your tech]
const hasPlaceholders = (text: string): boolean => {
  return /\[[^\]]+\]/.test(text);
};

// Extract placeholders for display
const extractPlaceholders = (text: string): string[] => {
  const matches = text.match(/\[[^\]]+\]/g);
  return matches || [];
};

function RequestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { t } = useTranslation();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [hiring, setHiring] = useState<string | null>(null);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);
  const [hireError, setHireError] = useState<{ message: string; required?: number; available?: number } | null>(null);

  // Check for template placeholders
  const placeholdersInDescription = extractPlaceholders(description);
  const hasUnfilledPlaceholders = placeholdersInDescription.length > 0;
  const canSearch = description.length >= 10 && !hasUnfilledPlaceholders;

  // Load saved searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("nabd_searches");
    if (saved) {
      setSavedSearches(JSON.parse(saved));
    }
  }, []);

  // Auto-submit if returning from login with query
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && !hasAutoSubmitted && !result) {
      setDescription(q);
      setHasAutoSubmitted(true);
      handleSearch(q);
    }
  }, [searchParams, hasAutoSubmitted, result]);

  const saveSearch = (desc: string, searchResult: MatchResult) => {
    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      description: desc.substring(0, 100),
      timestamp: Date.now(),
      result: searchResult,
    };
    // Remove any existing search with same description
    const filtered = savedSearches.filter(s => s.description !== desc.substring(0, 100));
    const updated = [newSearch, ...filtered.slice(0, 4)];
    setSavedSearches(updated);
    localStorage.setItem("nabd_searches", JSON.stringify(updated));
  };

  const handleSearch = async (desc?: string) => {
    const searchDesc = desc || description;
    if (!searchDesc || searchDesc.length < 10) return;

    // Don't search if there are unfilled placeholders
    if (hasPlaceholders(searchDesc)) {
      setError(t("request.fillPlaceholders"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/match-specialists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: searchDesc }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to match specialists");
      }

      const data = await response.json();
      setResult(data);
      saveSearch(searchDesc, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSearch();
  };

  const handlePresetClick = (presetKey: typeof REQUEST_PRESET_KEYS[0]) => {
    setDescription(t(presetKey.promptKey));
  };

  const handleHire = async (assignmentId: string, price: number) => {
    if (!session?.user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/request?q=${encodeURIComponent(description)}`)}`);
      return;
    }

    setHiring(assignmentId);
    setHireError(null);

    try {
      const response = await fetch(`/api/assignments/${assignmentId}/hire`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "Insufficient رصيد") {
          setHireError({
            message: t("request.notEnoughCredits"),
            required: data.required,
            available: data.available,
          });
          toast.error(`${t("request.required")}: ${data.required}, ${t("request.available")}: ${data.available}`, {
            action: {
              label: t("dashboard.addCredits"),
              onClick: () => router.push("/dashboard/wallet"),
            },
          });
        } else {
          setHireError({ message: data.error || t("request.hireFailed") });
          toast.error(data.error || t("request.hireFailed"));
        }
        return;
      }

      toast.success(t("request.projectStarted"));
      router.push(`/dashboard/tasks/${assignmentId}`);
    } catch (err) {
      setHireError({ message: t("request.hireFailed") });
      toast.error(t("request.hireFailed"));
    } finally {
      setHiring(null);
    }
  };

  const selectedMatch = result?.matches.find(m => m.id === selectedSpecialist);
  const totalCost = selectedMatch ? Math.round(selectedMatch.price) * quantity : 0;

  return (
    <section className="pt-24 pb-20 min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Header */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-rose-100 border border-orange-200"
                >
                  <TbRocket className="w-5 h-5 text-rose-500" />
                  <span className="text-orange-700 text-sm font-bold uppercase tracking-wider">{t("request.launchPad")}</span>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl lg:text-5xl font-display font-bold uppercase tracking-tight text-slate-900 mb-4"
                >
                  {t("request.whatBuilding")}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg text-slate-600 max-w-2xl mx-auto"
                >
                  {t("request.description")}
                </motion.p>
              </div>

              {/* Presets Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">{t("request.quickStart")}</h2>
                  {savedSearches.length > 0 && (
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      className="flex items-center gap-1 text-sm text-rose-500 hover:text-rose-600"
                    >
                      <TbHistory size={16} />
                      {t("request.recentSearches")}
                    </button>
                  )}
                </div>

                {showHistory && savedSearches.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-6 p-4 bg-slate-100 rounded-xl border border-slate-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">{t("request.previousSearches")}</span>
                      <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-600">
                        <TbX size={16} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {savedSearches.map((search) => (
                        <button
                          key={search.id}
                          onClick={() => {
                            setDescription(search.description);
                            setShowHistory(false);
                            // If we have cached results, restore them directly
                            if (search.result && search.result.matches.length > 0) {
                              setResult(search.result);
                            }
                          }}
                          className="w-full text-left p-2 rounded-lg hover:bg-white text-sm text-slate-600 flex items-center gap-2"
                        >
                          <span className="flex-1 truncate">{search.description}</span>
                          {search.result && search.result.matches.length > 0 && (
                            <span className="text-xs text-rose-500 font-medium flex-shrink-0">
                              {search.result.matches.length} {t("request.matchesCount")}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {REQUEST_PRESET_KEYS.map((preset, i) => (
                    <motion.button
                      key={preset.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      onClick={() => handlePresetClick(preset)}
                      className="group p-4 bg-white rounded-2xl border-2 border-slate-200 hover:border-rose-400 transition-all text-left hover:shadow-lg"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                          <preset.icon size={20} />
                        </div>
                        <span className="text-xs font-medium text-rose-500 uppercase tracking-wider">{t(preset.categoryKey)}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 mb-1">{t(preset.titleKey)}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2">{t(preset.descriptionKey)}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Search Form */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-lg"
              >
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("request.placeholder")}
                  className="min-h-[180px] text-base resize-none border-slate-200 focus:border-rose-500 focus:ring-rose-500 rounded-xl"
                  disabled={loading}
                />

                {error && (
                  <div className="mt-4 p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200">
                    {error}
                  </div>
                )}

                {hasUnfilledPlaceholders && (
                  <div className="mt-4 p-4 rounded-xl bg-amber-50 text-amber-700 text-sm border border-amber-200">
                    <div className="flex items-start gap-2">
                      <TbSparkles size={18} className="flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium mb-1">{t("request.fillPlaceholdersTitle")}</p>
                        <p className="text-pink-600">
                          {t("request.replacePlaceholders")}: {placeholdersInDescription.join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold gap-2 text-base py-6 shadow-lg shadow-rose-500/25"
                    disabled={loading || !canSearch}
                  >
                    {loading ? (
                      <>
                        <TbLoader2 size={20} className="animate-spin" />
                        {t("request.findingMatches")}
                      </>
                    ) : (
                      <>
                        <TbSearch size={20} />
                        {t("request.findMyExperts")}
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-slate-500 text-center mt-3">
                  {hasUnfilledPlaceholders
                    ? t("request.fillPlaceholders")
                    : t("request.noCommitment")}
                </p>
              </motion.form>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 grid grid-cols-3 gap-4 text-center"
              >
                {[
                  { icon: TbSparkles, labelKey: "request.aiMatching", descKey: "request.smartAlgorithms" },
                  { icon: TbClock, labelKey: "request.turnaround", descKey: "request.fastDelivery" },
                  { icon: TbCheck, labelKey: "request.payForResults", descKey: "request.satisfactionGuaranteed" },
                ].map((item) => (
                  <div key={item.labelKey} className="p-4 rounded-xl bg-white border border-slate-200">
                    <item.icon className="w-6 h-6 mx-auto mb-2 text-rose-500" />
                    <div className="font-medium text-slate-900 text-sm">{t(item.labelKey)}</div>
                    <div className="text-xs text-slate-500">{t(item.descKey)}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              {/* Results List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {result.matches.length} {t("request.expertsFound")}
                    </h2>
                    <p className="text-slate-600">{t("request.selectToStart")}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setResult(null);
                      setSelectedSpecialist(null);
                    }}
                    className="border-slate-300"
                  >
                    {t("request.newSearch")}
                  </Button>
                </div>

                {result.matches.map((match, index) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      setSelectedSpecialist(match.id);
                      setHireError(null);
                    }}
                    className={`bg-white rounded-2xl border-2 p-5 cursor-pointer transition-all ${
                      selectedSpecialist === match.id
                        ? "border-rose-500 shadow-lg shadow-rose-500/10"
                        : "border-slate-200 hover:border-orange-300"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-full bg-rose-100 flex-shrink-0 flex items-center justify-center text-rose-500">
                        <TbUser size={28} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-slate-900">{match.specialist.firstName}</h3>
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 text-xs font-medium">
                            {Math.round(match.confidence * 100)}% {t("request.match")}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <SlStar size={12} className="text-pink-400 fill-pink-400" />
                            {match.specialist.rating.toFixed(1)}
                          </span>
                          <span>{match.specialist.completedTasks} {t("request.projects")}</span>
                          <span className="text-rose-500 font-medium">{match.taskName}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">{Math.round(match.price)}</div>
                        <div className="text-xs text-slate-500">{t("request.credits")}</div>
                      </div>
                    </div>

                    {selectedSpecialist === match.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 pt-4 border-t border-slate-200"
                      >
                        <p className="text-sm text-slate-600 mb-4">{match.reasoning}</p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Sidebar - Hire Panel */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg">
                  {selectedMatch ? (
                    <>
                      <h3 className="font-bold text-lg text-slate-900 mb-4">{t("request.confirmHire")}</h3>

                      <div className="space-y-4 mb-6">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">{t("request.specialist")}</span>
                          <span className="font-medium text-slate-900">{selectedMatch.specialist.firstName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">{t("request.task")}</span>
                          <span className="font-medium text-slate-900">{selectedMatch.taskName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">{t("request.unitPrice")}</span>
                          <span className="font-medium text-slate-900">{Math.round(selectedMatch.price)} {t("request.credits")}</span>
                        </div>

                        <div className="pt-4 border-t border-slate-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-600">{t("request.quantity")}</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                              >
                                <TbMinus size={16} />
                              </button>
                              <span className="w-8 text-center font-medium">{quantity}</span>
                              <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                              >
                                <TbPlus size={16} />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200">
                          <div className="flex items-center justify-between text-lg">
                            <span className="font-bold text-slate-900">{t("request.total")}</span>
                            <span className="font-bold text-rose-500">{totalCost} {t("request.credits")}</span>
                          </div>
                          <div className="text-xs text-slate-500 text-right">
                            ≈ ${(totalCost / 10).toFixed(2)} {t("common.usd")}
                          </div>
                        </div>
                      </div>

                      {/* Hire Error Display */}
                      {hireError && (
                        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200">
                          <p className="text-sm font-medium text-red-700 mb-1">{hireError.message}</p>
                          {hireError.required && hireError.available !== undefined && (
                            <div className="text-xs text-red-600">
                              <p>{t("request.required")}: <span className="font-bold">{hireError.required}</span> {t("request.credits")}</p>
                              <p>{t("request.available")}: <span className="font-bold">{hireError.available}</span> {t("request.credits")}</p>
                              <p className="mt-2">{t("request.missing")}: <span className="font-bold">{hireError.required - hireError.available}</span> {t("request.credits")}</p>
                            </div>
                          )}
                          <Link href="/dashboard/wallet" className="mt-2 inline-flex items-center gap-1 text-xs text-rose-600 font-medium hover:text-orange-700">
                            {t("dashboard.addCredits")} <TbArrowRight size={12} />
                          </Link>
                        </div>
                      )}

                      <Button
                        onClick={() => handleHire(selectedMatch.id, totalCost)}
                        disabled={hiring === selectedMatch.id}
                        className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold py-6 shadow-lg shadow-rose-500/25"
                      >
                        {hiring === selectedMatch.id ? (
                          <>
                            <TbLoader2 size={20} className="animate-spin mr-2" />
                            {t("request.processing")}
                          </>
                        ) : result.isAuthenticated ? (
                          <>
                            <TbRocket size={20} className="mr-2" />
                            {t("request.startProject")}
                          </>
                        ) : (
                          <>
                            <TbArrowRight size={20} className="mr-2" />
                            {t("request.signInToStart")}
                          </>
                        )}
                      </Button>

                      {!result.isAuthenticated && (
                        <p className="text-xs text-slate-500 text-center mt-3">
                          {t("request.redirectToSignIn")}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-100 flex items-center justify-center">
                        <TbUser size={32} className="text-rose-500" />
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">{t("request.selectExpert")}</h3>
                      <p className="text-sm text-slate-500">
                        {t("request.clickToSeeDetails")}
                      </p>
                    </div>
                  )}
                </div>
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
    <section className="pt-32 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    </section>
  );
}

export default function RequestPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={<RequestLoading />}>
        <RequestContent />
      </Suspense>
      <Footer />
    </div>
  );
}
