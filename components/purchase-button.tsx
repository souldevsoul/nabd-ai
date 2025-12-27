"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlWallet, SlCloudDownload, SlRefresh, SlCheck, SlBag, SlExclamation } from "react-icons/sl";
import { Button } from "@/components/ui/button";
import { TopupModal } from "@/components/wallet/topup-modal";
import { cn } from "@/lib/utils";

interface LicenseOption {
  id: string;
  type: string;
  name: string;
  priceCents: number;
  credits: number;
  description: string | null;
}

interface PurchaseButtonProps {
  photoId: string;
  licenseOption: LicenseOption;
  isAuthenticated: boolean;
  isPurchased?: boolean;
  downloadToken?: string;
}

export function PurchaseButton({
  photoId,
  licenseOption,
  isAuthenticated,
  isPurchased = false,
  downloadToken,
}: PurchaseButtonProps) {
  const [loading, setLoading] = useState(false);
  const [purchased, setPurchased] = useState(isPurchased);
  const [token, setToken] = useState(downloadToken);
  const [error, setError] = useState<string | null>(null);
  const [insufficientFunds, setInsufficientFunds] = useState<{ required: number; balance: number } | null>(null);
  const [showTopup, setShowTopup] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  // Calculate credits (use credits field or convert from cents)
  const creditsCost = licenseOption.credits > 0
    ? licenseOption.credits
    : Math.ceil(licenseOption.priceCents / 10);

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      window.location.href = `/login?callbackUrl=/gallery/${photoId}`;
      return;
    }

    setLoading(true);
    setError(null);
    setInsufficientFunds(null);

    try {
      const res = await fetch(`/api/photos/${photoId}/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseOptionId: licenseOption.id }),
      });

      const data = await res.json();

      if (res.status === 402) {
        // Insufficient credits
        setInsufficientFunds({
          required: data.required,
          balance: data.balance,
        });
        setWalletBalance(data.balance);
        return;
      }

      if (!res.ok) {
        setError(data.error || "Сатып алу сәтсіз аяқтал");
        return;
      }

      if (data.alreadyPurchased) {
        setPurchased(true);
        setToken(data.purchase.downloadToken);
        return;
      }

      setPurchased(true);
      setToken(data.purchase.downloadToken);
    } catch (err) {
      setError("Бірдеңе дұрыс болма");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!token) return;

    try {
      const res = await fetch(`/api/photos/download/${token}`);
      const data = await res.json();

      if (res.ok && data.download?.url) {
        // Create download link
        const link = document.createElement("a");
        link.href = data.download.url;
        link.download = data.download.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const handleTopupSuccess = (newBalance: number) => {
    setWalletBalance(newBalance);
    setInsufficientFunds(null);
    setShowTopup(false);
  };

  return (
    <>
      <motion.div
        className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-white">{licenseOption.name}</h4>
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <SlWallet className="w-4 h-4" />
            {creditsCost}
          </div>
        </div>

        {licenseOption.description && (
          <p className="text-sm text-zinc-400 mb-3">{licenseOption.description}</p>
        )}

        <AnimatePresence mode="wait">
          {purchased ? (
            <motion.div
              key="purchased"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2 text-emerald-500 text-sm mb-2">
                <SlCheck className="w-4 h-4" />
                <span>Сатып алы</span>
              </div>
              <Button
                onClick={handleDownload}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                <SlCloudDownload className="w-4 h-4 mr-2" />
                تحميل
              </Button>
            </motion.div>
          ) : insufficientFunds ? (
            <motion.div
              key="insufficient"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <SlExclamation className="w-4 h-4 text-red-400 mt-0.5" />
                <div className="text-sm">
                  <p className="text-red-400 font-medium">Кредиттер жеткіліксіз</p>
                  <p className="text-zinc-400">
                    المزيد {insufficientFunds.required - insufficientFunds.balance} кредит қажет
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowTopup(true)}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold"
              >
                <SlWallet className="w-4 h-4 mr-2" />
                إضافة رصيد
              </Button>
            </motion.div>
          ) : (
            <motion.div key="buy" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {error && (
                <p className="text-sm text-red-400 mb-2">{error}</p>
              )}
              <Button
                onClick={handlePurchase}
                disabled={loading}
                className={cn(
                  "w-full font-semibold",
                  "bg-amber-500 hover:bg-amber-400 text-black"
                )}
              >
                {loading ? (
                  <SlRefresh className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <SlBag className="w-4 h-4 mr-2" />
                    شراء الآن
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <TopupModal
        open={showTopup}
        onOpenChange={setShowTopup}
        currentBalance={walletBalance}
        onSuccess={handleTopupSuccess}
      />
    </>
  );
}
