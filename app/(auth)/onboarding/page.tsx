"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlUser,
  SlDoc,
  SlShield,
  SlCheck,
  SlArrowRight,
  SlArrowLeft,
  SlLocationPin,
  SlGlobe,
  SlSocialInstagram,
  SlSocialTwitter,
  SlExclamation,
  SlPaperPlane,
  SlStar,
  SlEnergy,
  SlCamera,
  SlPicture,
  SlUser as SlBot,
  SlDocs,
  SlShareAlt,
} from "react-icons/sl";
import { Logo } from "@/components/brand/logo";

interface OnboardingData {
  // Step 1: Personal Info
  displayName: string;
  handle: string;
  bio: string;
  location: string;
  // Step 2: Social & Web
  websiteUrl: string;
  socialInstagram: string;
  socialX: string;
  // Step 3: Identity Verification (AML)
  fullLegalName: string;
  dateOfBirth: string;
  country: string;
  idType: string;
  idNumber: string;
  // Step 4: Agreement
  termsAccepted: boolean;
  amlAccepted: boolean;
}

const steps = [
  { id: 1, title: "Профиль", icon: SlUser, description: "Фотограф профилін жасаңыз" },
  { id: 2, title: "Байланысу", icon: SlGlobe, description: "Әлеуметтік желілерді байланыстырыңыз" },
  { id: 3, title: "Telegram", icon: SlPaperPlane, description: "Мобильді жүктеуді қосыңыз" },
  { id: 4, title: "Растау", icon: SlShield, description: "Жеке басты растаңыз" },
  { id: 5, title: "Іске қосу", icon: SlStar, description: "Қарап шығып, іске қосыңыз" },
];

function StepIndicator({
  currentStep,
}: {
  currentStep: number;
}) {
  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {steps.map((step, idx) => (
        <div key={step.id} className="flex items-center">
          <motion.div
            initial={false}
            animate={{
              scale: idx + 1 === currentStep ? 1.1 : 1,
              boxShadow: idx + 1 === currentStep ? "0 0 20px rgba(245, 158, 11, 0.4)" : "none",
            }}
            className={`
              relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-500
              ${idx + 1 < currentStep
                ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white"
                : idx + 1 === currentStep
                ? "bg-gradient-to-br from-amber-400 to-amber-600 text-black"
                : "bg-slate-800/80 text-slate-500 border border-slate-700"
              }
            `}
          >
            {idx + 1 < currentStep ? (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <SlCheck className="w-5 h-5" />
              </motion.div>
            ) : (
              <step.icon className="w-5 h-5" />
            )}
          </motion.div>
          {idx < steps.length - 1 && (
            <div className="relative w-8 h-1 mx-1">
              <div className="absolute inset-0 bg-slate-800 rounded-full" />
              <motion.div
                initial={false}
                animate={{ width: idx + 1 < currentStep ? "100%" : "0%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [telegramToken, setTelegramToken] = useState<string | null>(null);
  const [telegramLinked, setTelegramLinked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    displayName: "",
    handle: "",
    bio: "",
    location: "",
    websiteUrl: "",
    socialInstagram: "",
    socialX: "",
    fullLegalName: "",
    dateOfBirth: "",
    country: "",
    idType: "passport",
    idNumber: "",
    termsAccepted: false,
    amlAccepted: false,
  });

  // Generate Telegram link token when reaching step 3
  useEffect(() => {
    const generateTelegramToken = async () => {
      try {
        const res = await fetch("/api/telegram/link", { method: "POST" });
        if (res.ok) {
          const { token } = await res.json();
          setTelegramToken(token);
        }
      } catch (error) {
        console.error("Failed to generate Telegram token:", error);
      }
    };

    if (currentStep === 3 && !telegramToken) {
      generateTelegramToken();
    }
  }, [currentStep, telegramToken]);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateData = (field: keyof OnboardingData, value: string | boolean) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!data.displayName.trim()) newErrors.displayName = "Display name is required";
        if (!data.handle.trim()) newErrors.handle = "Handle is required";
        if (data.handle && !/^[a-z0-9_]+$/.test(data.handle)) {
          newErrors.handle = "Handle can only contain lowercase letters, numbers, and underscores";
        }
        break;
      case 2:
        // Social links are optional
        break;
      case 3:
        // Telegram is optional
        break;
      case 4:
        if (!data.fullLegalName.trim()) newErrors.fullLegalName = "Legal name is required";
        if (!data.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
        if (!data.country) newErrors.country = "Country is required";
        if (!data.idNumber.trim()) newErrors.idNumber = "ID number is required";
        break;
      case 5:
        if (!data.termsAccepted) newErrors.termsAccepted = "You must accept the terms";
        if (!data.amlAccepted) newErrors.amlAccepted = "You must accept the AML policy";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const error = await res.json();
        setErrors({ submit: error.message || "Failed to complete onboarding" });
      }
    } catch {
      setErrors({ submit: "An unexpected error occurred" });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Card */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8"
        >
          {/* Step Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">{steps[currentStep - 1].title}</h2>
            <p className="text-slate-500 mt-1">{steps[currentStep - 1].description}</p>
          </div>

          {/* Step Content */}
          <div className="space-y-6">
            {currentStep === 1 && (
              <>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Көрсетілетін аты *</label>
                  <input
                    type="text"
                    value={data.displayName}
                    onChange={(e) => updateData("displayName", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-800 border ${errors.displayName ? "border-red-500" : "border-slate-700"} text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                    placeholder="Жон Доу Фотография"
                  />
                  {errors.displayName && (
                    <p className="text-red-400 text-sm mt-1">{errors.displayName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Тегі * (бірегей URL)</label>
                  <div className={`flex items-center px-4 py-3 rounded-xl bg-slate-800 border ${errors.handle ? "border-red-500" : "border-slate-700"}`}>
                    <span className="text-slate-500">vertex.com/@</span>
                    <input
                      type="text"
                      value={data.handle}
                      onChange={(e) => updateData("handle", e.target.value.toLowerCase())}
                      className="flex-1 bg-transparent text-white placeholder:text-slate-500 focus:outline-none ml-1"
                      placeholder="жондоу"
                    />
                  </div>
                  {errors.handle && (
                    <p className="text-red-400 text-sm mt-1">{errors.handle}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Өмірбаян</label>
                  <textarea
                    value={data.bio}
                    onChange={(e) => updateData("bio", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                    placeholder="Фотосуретіңіз туралы әлемге айтыңыз..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Орналасқан жері</label>
                  <div className="flex items-center px-4 py-3 rounded-xl bg-slate-800 border border-slate-700">
                    <SlLocationPin className="w-5 h-5 text-slate-500 mr-2" />
                    <input
                      type="text"
                      value={data.location}
                      onChange={(e) => updateData("location", e.target.value)}
                      className="flex-1 bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                      placeholder="Алматы, Қазақстан"
                    />
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Веб-сайт</label>
                  <div className="flex items-center px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 transition-all focus-within:ring-2 focus-within:ring-amber-500/50 focus-within:border-amber-500/50">
                    <SlGlobe className="w-5 h-5 text-slate-500 mr-2" />
                    <input
                      type="url"
                      value={data.websiteUrl}
                      onChange={(e) => updateData("websiteUrl", e.target.value)}
                      className="flex-1 bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Instagram</label>
                  <div className="flex items-center px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 transition-all focus-within:ring-2 focus-within:ring-pink-500/50 focus-within:border-pink-500/50">
                    <SlSocialInstagram className="w-5 h-5 text-pink-400 mr-2" />
                    <span className="text-slate-500">instagram.com/</span>
                    <input
                      type="text"
                      value={data.socialInstagram}
                      onChange={(e) => updateData("socialInstagram", e.target.value)}
                      className="flex-1 bg-transparent text-white placeholder:text-slate-500 focus:outline-none ml-1"
                      placeholder="yourhandle"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">X (Twitter)</label>
                  <div className="flex items-center px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 transition-all focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500/50">
                    <SlSocialTwitter className="w-5 h-5 text-blue-400 mr-2" />
                    <span className="text-slate-500">x.com/</span>
                    <input
                      type="text"
                      value={data.socialX}
                      onChange={(e) => updateData("socialX", e.target.value)}
                      className="flex-1 bg-transparent text-white placeholder:text-slate-500 focus:outline-none ml-1"
                      placeholder="yourhandle"
                    />
                  </div>
                </div>

                <p className="text-sm text-slate-500 text-center">
                  Әлеуметтік сілтемелер міндетті емес, бірақ сатып алушылардың сенімін арттырады
                </p>
              </>
            )}

            {currentStep === 3 && (
              <>
                {/* Telegram Integration Step */}
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 mb-4"
                  >
                    <SlPaperPlane className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">Telegram арқылы жүктеу</h3>
                  <p className="text-slate-400 text-sm max-w-md mx-auto">
                    Телефоныңыздан тікелей фотосуреттерді жүктеу үшін Telegram-ды қосыңыз.
                    Ботымызға фотосуреттер жіберіңіз, олар тақтаңызда пайда болады!
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Features list */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { icon: SlCamera, title: "Лездік жүктеу", desc: "Фотоларды тікелей жіберіңіз" },
                      { icon: SlBot, title: "AI авто-тег", desc: "GPT-4.1 көрінісін талдау" },
                      { icon: SlEnergy, title: "Жылдам басқару", desc: "Статистика мен сұрауларды көру" },
                    ].map((feature, idx) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center"
                      >
                        <feature.icon className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                        <p className="text-white text-sm font-medium">{feature.title}</p>
                        <p className="text-slate-500 text-xs">{feature.desc}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Connection instructions */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
                    <p className="text-sm text-slate-400 mb-3">
                      <span className="text-blue-400 font-medium">1-қадам:</span> Telegram-ды ашып, ботымызбен чатты бастаңыз
                    </p>
                    <a
                      href="https://t.me/VertexBot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold transition-colors"
                    >
                      <SlPaperPlane className="w-5 h-5" />
                      @VertexBot-ты ашу
                      <SlShareAlt className="w-4 h-4" />
                    </a>
                  </div>

                  {telegramToken && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-5 rounded-xl bg-slate-800/50 border border-slate-700"
                    >
                      <p className="text-sm text-slate-400 mb-3">
                        <span className="text-amber-400 font-medium">2-қадам:</span> Бұл кодты ботқа жіберіңіз
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 font-mono text-lg tracking-wider text-center">
                          /link {telegramToken}
                        </code>
                        <button
                          onClick={() => copyToClipboard(`/link ${telegramToken}`)}
                          className="p-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
                        >
                          {copied ? (
                            <SlCheck className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <SlDocs className="w-5 h-5 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {telegramLinked ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3"
                    >
                      <SlCheck className="w-6 h-6 text-emerald-400" />
                      <div>
                        <p className="text-emerald-400 font-medium">Telegram қосылды!</p>
                        <p className="text-slate-400 text-sm">Енді Telegram арқылы фотосуреттерді жүктей аласыз</p>
                      </div>
                    </motion.div>
                  ) : (
                    <p className="text-sm text-slate-500 text-center">
                      Бұл қадамды өткізіп жіберіп, кейінірек тақтадан Telegram-ды қосуға болады
                    </p>
                  )}
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
                  <div className="flex items-start gap-3">
                    <SlExclamation className="w-5 h-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="text-amber-400 font-semibold">Жеке басты растау қажет</h4>
                      <p className="text-sm text-slate-400 mt-1">
                        AML (ақша жылыстауға қарсы) талаптарына сәйкес, жеке басыңызды растауымыз керек. Бұл ақпарат қауіпсіз сақталады және ешқашан бөліспейді.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Толық заңды аты-жөні *</label>
                  <input
                    type="text"
                    value={data.fullLegalName}
                    onChange={(e) => updateData("fullLegalName", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-800 border ${errors.fullLegalName ? "border-red-500" : "border-slate-700"} text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                    placeholder="Куәлігіңізде көрсетілгендей"
                  />
                  {errors.fullLegalName && (
                    <p className="text-red-400 text-sm mt-1">{errors.fullLegalName}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Туған күні *</label>
                    <input
                      type="date"
                      value={data.dateOfBirth}
                      onChange={(e) => updateData("dateOfBirth", e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-800 border ${errors.dateOfBirth ? "border-red-500" : "border-slate-700"} text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-red-400 text-sm mt-1">{errors.dateOfBirth}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Тұратын елі *</label>
                    <select
                      value={data.country}
                      onChange={(e) => updateData("country", e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-800 border ${errors.country ? "border-red-500" : "border-slate-700"} text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                    >
                      <option value="">Елді таңдаңыз</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="JP">Japan</option>
                      <option value="OTHER">Other</option>
                    </select>
                    {errors.country && (
                      <p className="text-red-400 text-sm mt-1">{errors.country}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Куәлік түрі *</label>
                    <select
                      value={data.idType}
                      onChange={(e) => updateData("idType", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    >
                      <option value="passport">Паспорт</option>
                      <option value="drivers_license">Жүргізуші куәлігі</option>
                      <option value="national_id">Ұлттық куәлік</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Куәлік нөмірі *</label>
                    <input
                      type="text"
                      value={data.idNumber}
                      onChange={(e) => updateData("idNumber", e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-800 border ${errors.idNumber ? "border-red-500" : "border-slate-700"} text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                      placeholder="Куәлік нөмірі"
                    />
                    {errors.idNumber && (
                      <p className="text-red-400 text-sm mt-1">{errors.idNumber}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {currentStep === 5 && (
              <>
                {/* Launch / Final Step */}
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 mb-4"
                  >
                    <SlStar className="w-10 h-10 text-black" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">Іске қосуға дайын!</h3>
                  <p className="text-slate-400 text-sm">
                    Фотограф профилін аяқтау үшін шарттарымызды қабылдаңыз
                  </p>
                </div>

                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`p-4 rounded-xl border transition-all ${errors.termsAccepted ? "border-red-500 bg-red-500/5" : data.termsAccepted ? "border-emerald-500/50 bg-emerald-500/5" : "border-slate-700 bg-slate-800/50"}`}
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      <div className="relative mt-0.5">
                        <input
                          type="checkbox"
                          checked={data.termsAccepted}
                          onChange={(e) => updateData("termsAccepted", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className={`w-6 h-6 rounded-lg border-2 transition-all ${data.termsAccepted ? "bg-emerald-500 border-emerald-500" : "bg-slate-800 border-slate-600"}`}>
                          {data.termsAccepted && <SlCheck className="w-5 h-5 text-white m-auto" />}
                        </div>
                      </div>
                      <div>
                        <p className="text-white font-medium">Қызмет шарттары</p>
                        <p className="text-sm text-slate-400 mt-1">
                          Мен Vertex-тің Қызмет шарттарымен, Құпиялылық саясатымен және Фотосурет лицензиялау келісімімен келісемін.
                        </p>
                        <a href="/terms" className="text-amber-500 text-sm hover:underline mt-2 inline-block">
                          Толық шарттарды оқу →
                        </a>
                      </div>
                    </label>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`p-4 rounded-xl border transition-all ${errors.amlAccepted ? "border-red-500 bg-red-500/5" : data.amlAccepted ? "border-emerald-500/50 bg-emerald-500/5" : "border-slate-700 bg-slate-800/50"}`}
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      <div className="relative mt-0.5">
                        <input
                          type="checkbox"
                          checked={data.amlAccepted}
                          onChange={(e) => updateData("amlAccepted", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className={`w-6 h-6 rounded-lg border-2 transition-all ${data.amlAccepted ? "bg-emerald-500 border-emerald-500" : "bg-slate-800 border-slate-600"}`}>
                          {data.amlAccepted && <SlCheck className="w-5 h-5 text-white m-auto" />}
                        </div>
                      </div>
                      <div>
                        <p className="text-white font-medium">AML және KYC сәйкестігі</p>
                        <p className="text-sm text-slate-400 mt-1">
                          Мен ақша жылыстауға қарсы (AML) талаптарына жеке басты растауға келісемін.
                        </p>
                        <a href="/terms" className="text-amber-500 text-sm hover:underline mt-2 inline-block">
                          AML саясатын оқу →
                        </a>
                      </div>
                    </label>
                  </motion.div>
                </div>

                {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 mt-4"
                  >
                    <p className="text-red-400 text-sm">{errors.submit}</p>
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-800">
            {currentStep > 1 ? (
              <button
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-700 text-white hover:bg-slate-800 transition-colors"
              >
                <SlArrowLeft className="w-4 h-4" />
                Артқа
              </button>
            ) : (
              <div />
            )}

            {currentStep < steps.length ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold transition-colors"
              >
                Жалғастыру
                <SlArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Өңдеу жүріп жатыр...
                  </>
                ) : (
                  <>
                    Орнатуды аяқтау
                    <SlCheck className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>

        {/* Security Note */}
        <p className="text-center text-sm text-slate-600 mt-6">
          <SlShield className="w-4 h-4 inline mr-1" />
          Деректеріңіз шифрланған және қауіпсіз сақталады
        </p>
      </div>
    </div>
  );
}
