"use client";

import { cn } from "@/lib/utils";
import { SlCheck, SlShield, SlCamera } from "react-icons/sl";

type BadgeVariant = "verified" | "pending" | "rejected" | "photographer";
type BadgeSize = "sm" | "md" | "lg";

interface VerifiedBadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  showLabel?: boolean;
  className?: string;
}

const variantConfig = {
  verified: {
    icon: SlShield,
    label: "تم التحقق адам",
    classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    iconClass: "text-emerald-400",
  },
  pending: {
    icon: SlCamera,
    label: "Тексеру күтілуде",
    classes: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    iconClass: "text-amber-400",
  },
  rejected: {
    icon: SlCheck,
    label: "Расталмаإلى",
    classes: "bg-red-500/15 text-red-400 border-red-500/30",
    iconClass: "text-red-400",
  },
  photographer: {
    icon: SlCamera,
    label: "تم التحقق фотограф",
    classes: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    iconClass: "text-amber-400",
  },
};

const sizeConfig = {
  sm: {
    container: "px-2 py-0.5 text-xs gap-1",
    icon: 12,
  },
  md: {
    container: "px-3 py-1 text-sm gap-1.5",
    icon: 14,
  },
  lg: {
    container: "px-4 py-1.5 text-base gap-2",
    icon: 16,
  },
};

export function VerifiedBadge({
  variant = "verified",
  size = "md",
  showLabel = true,
  className,
}: VerifiedBadgeProps) {
  const { icon: Icon, label, classes, iconClass } = variantConfig[variant];
  const { container, icon: iconSize } = sizeConfig[size];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        container,
        classes,
        className
      )}
    >
      <Icon size={iconSize} className={iconClass} />
      {showLabel && <span>{label}</span>}
    </span>
  );
}

// Standalone verification shield for photo overlays
export function VerificationShield({
  className,
  size = 24,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full",
        "bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/40",
        "p-1.5",
        className
      )}
    >
      <SlShield size={size} className="text-emerald-400" />
    </div>
  );
}
