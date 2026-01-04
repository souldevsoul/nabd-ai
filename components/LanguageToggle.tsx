"use client";

import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { SlGlobe } from "react-icons/sl";

interface LanguageToggleProps {
  variant?: "default" | "compact" | "mobile";
  className?: string;
}

export function LanguageToggle({ variant = "default", className = "" }: LanguageToggleProps) {
  const { locale, setLocale, t } = useTranslation();

  const toggleLanguage = () => {
    setLocale(locale === "ar" ? "en" : "ar");
  };

  if (variant === "mobile") {
    return (
      <button
        onClick={toggleLanguage}
        className={`flex items-center gap-2 py-4 text-lg tracking-wider uppercase border-b border-border w-full text-muted-foreground hover:text-foreground transition-all duration-300 ${className}`}
      >
        <SlGlobe size={18} />
        {locale === "ar" ? "English" : t("language.ar")}
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleLanguage}
        className={`text-white/70 hover:text-accent hover:bg-white/10 ${className}`}
        aria-label={locale === "ar" ? "Switch to English" : "Switch to Arabic"}
      >
        <SlGlobe size={16} />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className={`gap-2 text-white/70 hover:text-accent hover:bg-white/10 tracking-wider uppercase text-xs border border-white/20 ${className}`}
    >
      <SlGlobe size={14} />
      <span>{locale === "ar" ? "EN" : t("language.ar")}</span>
    </Button>
  );
}
