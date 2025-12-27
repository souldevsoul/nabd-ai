"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { SlWallet, SlCreditCard, SlRefresh, SlCheck, SlStar, SlEnvolopeLetter } from "react-icons/sl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TopupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBalance: number;
  onSuccess: (newBalance: number) => void;
}

const quickAmounts = [
  { credits: 100, price: 10, label: "Бастауыш" },
  { credits: 500, price: 50, label: "Танымал", popular: true },
  { credits: 1000, price: 100, label: "Кәсіби" },
];

export function TopupModal({ open, onOpenChange, currentBalance, onSuccess }: TopupModalProps) {
  const { data: session } = useSession();
  const [customAmount, setCustomAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const effectiveAmount = selectedAmount || (customAmount ? parseInt(customAmount) : 0);
  const priceUsd = effectiveAmount / 10;

  // Check if user can purchase credits (test user or ADMIN role)
  const userEmail = session?.user?.email || "";
  const userRoles = (session?.user as any)?.roles || [];
  const canPurchaseCredits =
    userEmail.startsWith("test@") ||
    userRoles.includes("ADMIN");

  const handlePurchase = async () => {
    if (effectiveAmount < 10) return;

    setLoading(true);
    try {
      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: effectiveAmount,
          paymentMethod: "card",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccess(true);
        setTimeout(() => {
          onSuccess(data.balance);
          setSuccess(false);
          setSelectedAmount(null);
          setCustomAmount("");
        }, 1500);
      }
    } catch (error) {
      console.error("Purchase failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomChange = (value: string) => {
    setSelectedAmount(null);
    setCustomAmount(value.replace(/\D/g, ""));
  };

  const handleQuickSelect = (credits: number) => {
    setCustomAmount("");
    setSelectedAmount(credits);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <SlWallet className="w-5 h-5 text-amber-500" />
            Кредит қосу
          </DialogTitle>
          <DialogDescription>
            Фотосуреттерді сатып алу үшін кредит сатып алыңыз. 10 кредит = $1 USD
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="py-12 text-center"
            >
              <motion.div
                className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
              >
                <SlCheck className="w-8 h-8 text-emerald-500" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">Кредиттер қосылды!</h3>
              <p className="text-zinc-400">
                +{effectiveAmount.toLocaleString()} кредит әмиянға қосылды
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 py-4"
            >
              {/* Current Balance */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                <span className="text-sm text-zinc-400">Ағымдағы баланс</span>
                <span className="font-semibold text-white">
                  {currentBalance.toLocaleString()} кредит
                </span>
              </div>

              {/* Contact Support Message for Regular Users */}
              {!canPurchaseCredits && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center space-y-3"
                >
                  <SlEnvolopeLetter className="w-12 h-12 text-amber-500 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Кредит сатып алу үшін қолдау қызметіне хабарласыңыз
                    </h3>
                    <p className="text-sm text-zinc-300 mb-4">
                      Тіркелгіңізге кредит қосу үшін біздің қолдау тобымызға хабарласыңыз. Біз сізге қажетті кредиттерді алуға көмектесеміз.
                    </p>
                    <Button
                      onClick={() => window.location.href = "mailto:support@vertex.ai"}
                      className="bg-amber-500 hover:bg-amber-400 text-black font-semibold"
                    >
                      <SlEnvolopeLetter className="w-4 h-4 mr-2" />
                      Қолдау қызметіне хабарласу
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Quick Select - Only for test users and admins */}
              {canPurchaseCredits && (
              <>
              <div className="grid grid-cols-3 gap-3">
                {quickAmounts.map((option) => (
                  <motion.button
                    key={option.credits}
                    onClick={() => handleQuickSelect(option.credits)}
                    className={cn(
                      "relative p-4 rounded-xl border-2 transition-all",
                      selectedAmount === option.credits
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-zinc-700 hover:border-zinc-600 bg-zinc-800/50"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option.popular && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-500 text-black text-xs font-semibold">
                        Танымал
                      </span>
                    )}
                    <p className="text-2xl font-bold text-white">{option.credits}</p>
                    <p className="text-xs text-zinc-400">${option.price}</p>
                  </motion.button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Немесе өз мөлшеріңізді енгізіңіз</label>
                <div className="relative">
                  <SlWallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    type="text"
                    placeholder="Кредит енгізіңіз (мин 10)"
                    value={customAmount}
                    onChange={(e) => handleCustomChange(e.target.value)}
                    className="pl-10 bg-zinc-800 border-zinc-700"
                  />
                  {customAmount && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
                      = ${(parseInt(customAmount) / 10).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Summary */}
              {effectiveAmount >= 10 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-zinc-300">Кредиттер</span>
                    <span className="font-semibold text-white flex items-center gap-1">
                      <SlStar className="w-4 h-4 text-amber-500" />
                      {effectiveAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">Барлығы</span>
                    <span className="text-xl font-bold text-amber-500">
                      ${priceUsd.toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Purchase Button */}
              <Button
                onClick={handlePurchase}
                disabled={effectiveAmount < 10 || loading}
                className={cn(
                  "w-full h-12 font-semibold text-base",
                  effectiveAmount >= 10
                    ? "bg-amber-500 hover:bg-amber-400 text-black"
                    : "bg-zinc-700 text-zinc-400"
                )}
              >
                {loading ? (
                  <SlRefresh className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <SlCreditCard className="w-5 h-5 mr-2" />
                    {effectiveAmount >= 10
                      ? `$${priceUsd.toFixed(2)} төлеу`
                      : "Сомасын таңдаңыз"}
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-zinc-500">
                Қауіпсіз төлем өңдеу. Кредиттердің мерзімі бітпейді.
              </p>
              </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
