"use client";

import { SlShare } from "react-icons/sl";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";

interface ShareButtonProps {
  title: string;
  url: string;
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const { t } = useTranslation();

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : url;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} | Nabd`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed, fall back to clipboard
        if ((err as Error).name !== "AbortError") {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t("share.linkCopied"));
    } catch {
      toast.error(t("share.copyFailed"));
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
      aria-label={t("share.shareButton")}
    >
      <SlShare className="w-5 h-5" />
    </button>
  );
}
