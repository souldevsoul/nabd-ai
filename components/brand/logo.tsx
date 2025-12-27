"use client";
import { cn } from "@/lib/utils";

const sizeMap = { sm: 24, md: 32, lg: 40, xl: 56 };

export function Logo({ className, size = "md", animated = false }: { className?: string; size?: "sm" | "md" | "lg" | "xl"; animated?: boolean }) {
  const s = sizeMap[size];
  return (
    <div className={cn("group inline-flex items-center gap-3", className)}>
      <div className="relative">
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={cn("transition-transform", animated && "group-hover:scale-110")}>
          {/* Heart background with gradient */}
          <path d="M16 28C16 28 4 20 4 12C4 8.686 6.686 6 10 6C12.4 6 14.5 7.3 16 9.2C17.5 7.3 19.6 6 22 6C25.314 6 28 8.686 28 12C28 20 16 28 16 28Z" fill="url(#heartGradient)"/>

          {/* Heartbeat line - animated */}
          <path d="M6 16 L10 16 L12 12 L14 20 L16 16 L18 16 L20 12 L22 20 L24 16 L26 16"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9">
            <animate attributeName="stroke-dasharray"
                     values="0 100; 100 0"
                     dur="2s"
                     repeatCount="indefinite"/>
          </path>

          {/* Pulsing glow effect */}
          <circle cx="16" cy="16" r="14" fill="#DC2626" opacity="0.2">
            <animate attributeName="r" values="14;16;14" dur="1.5s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.2;0.4;0.2" dur="1.5s" repeatCount="indefinite"/>
          </circle>

          {/* Gold accent dots - heartbeat monitors */}
          <circle cx="12" cy="16" r="1.5" fill="#D97706">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" begin="0s" repeatCount="indefinite"/>
          </circle>
          <circle cx="20" cy="16" r="1.5" fill="#D97706">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" begin="0.75s" repeatCount="indefinite"/>
          </circle>

          {/* Gradients */}
          <defs>
            <radialGradient id="heartGradient" cx="50%" cy="40%">
              <stop offset="0%" stopColor="#DC2626" stopOpacity="1"/>
              <stop offset="100%" stopColor="#991B1B" stopOpacity="1"/>
            </radialGradient>
          </defs>
        </svg>
        {/* Pulse glow */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl -z-10 group-hover:bg-primary/40 transition-all duration-500" />
      </div>
      <div className="flex flex-col">
        <span className="font-display font-black text-xl uppercase tracking-widest bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">نبض</span>
        <span className="text-[8px] tracking-[0.2em] text-primary/60 uppercase font-semibold -mt-1">منصة الذكاء الاصطناعي</span>
      </div>
    </div>
  );
}

export function LogoIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#1A0B0B"/>
      {/* Heart */}
      <path d="M16 26C16 26 6 19 6 12C6 9.239 8.239 7 11 7C12.8 7 14.4 8 15.5 9.5C16.6 8 18.2 7 20 7C22.761 7 25 9.239 25 12C25 19 16 26 16 26Z" fill="#DC2626"/>
      {/* Heartbeat line */}
      <path d="M8 16 L11 16 L13 13 L15 19 L17 16 L19 16" stroke="#FFFFFF" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Pulse glow */}
      <circle cx="16" cy="16" r="12" fill="#DC2626" fillOpacity="0.15"/>
      {/* Gold accent */}
      <circle cx="13" cy="16" r="1" fill="#D97706"/>
      <circle cx="19" cy="16" r="1" fill="#D97706"/>
    </svg>
  );
}
