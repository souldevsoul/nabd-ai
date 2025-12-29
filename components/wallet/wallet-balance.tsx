"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlWallet, SlPlus, SlRefresh } from "react-icons/sl";
import { Button } from "@/components/ui/button";
import { BuyCreditsModal } from "./buy-credits-modal";
import { cn } from "@/lib/utils";

interface WalletBalanceProps {
  variant?: "header" | "full";
  className?: string;
}

export function WalletBalance({ variant = "header", className }: WalletBalanceProps) {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTopup, setShowTopup] = useState(false);

  const fetchBalance = async () => {
    try {
      const res = await fetch("/api/wallet");
      if (res.ok) {
        const data = await res.json();
        setBalance(data.balance);
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleTopupSuccess = (newBalance: number) => {
    setBalance(newBalance);
    setShowTopup(false);
  };

  if (variant === "header") {
    return (
      <>
        <motion.button
          onClick={() => setShowTopup(true)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full",
            "bg-amber-500/10 border border-amber-500/20",
            "hover:bg-amber-500/20 transition-all duration-200",
            "text-amber-500 font-medium text-sm",
            className
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <SlWallet className="w-4 h-4" />
          {loading ? (
            <SlRefresh className="w-3 h-3 animate-spin" />
          ) : (
            <motion.span
              key={balance}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {balance?.toLocaleString() || 0}
            </motion.span>
          )}
          <SlPlus className="w-3 h-3 opacity-60" />
        </motion.button>

        <BuyCreditsModal
          open={showTopup}
          onOpenChange={setShowTopup}
          currentBalance={balance || 0}
          onSuccess={handleTopupSuccess}
        />
      </>
    );
  }

  return (
    <>
      <motion.div
        className={cn(
          "p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5",
          "border border-amber-500/20",
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400 mb-1">Сіздің баتمңыз</p>
            <div className="flex items-center gap-3">
              <SlWallet className="w-8 h-8 text-amber-500" />
              {loading ? (
                <SlRefresh className="w-6 h-6 animate-spin text-amber-500" />
              ) : (
                <motion.span
                  key={balance}
                  className="text-4xl font-bold text-white"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {balance?.toLocaleString() || 0}
                </motion.span>
              )}
              <span className="text-zinc-500 text-lg">кредит</span>
            </div>
          </div>
          <Button
            onClick={() => setShowTopup(true)}
            className="bg-amber-500 hover:bg-amber-400 text-black font-semibold"
          >
            <SlPlus className="w-4 h-4 mr-2" />
            إضافة رصيد
          </Button>
        </div>
      </motion.div>

      <BuyCreditsModal
        open={showTopup}
        onOpenChange={setShowTopup}
        currentBalance={balance || 0}
        onSuccess={handleTopupSuccess}
      />
    </>
  );
}
