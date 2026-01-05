"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlWallet,
  SlCreditCard,
  SlRefresh,
  SlCheck,
  SlClose,
  SlEnvolopeLetter,
  SlLock,
  SlStar,
} from "react-icons/sl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

interface BuyCreditsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBalance: number;
  onSuccess: (newBalance: number) => void;
}

const creditPackages = [
  { credits: 100, price: 10, labelKey: "buyCredits.starter" },
  { credits: 500, price: 50, labelKey: "buyCredits.popular", popular: true },
  { credits: 1000, price: 100, labelKey: "buyCredits.pro" },
];

type PaymentStep = "select" | "card" | "processing" | "3ds" | "success" | "error";

interface CardData {
  number: string;
  expMonth: string;
  expYear: string;
  cvv: string;
  holder: string;
}

export function BuyCreditsModal({
  open,
  onOpenChange,
  currentBalance,
  onSuccess,
}: BuyCreditsModalProps) {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [step, setStep] = useState<PaymentStep>("select");
  const [selectedCredits, setSelectedCredits] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [cardData, setCardData] = useState<CardData>({
    number: "",
    expMonth: "",
    expYear: "",
    cvv: "",
    holder: "",
  });
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newBalance, setNewBalance] = useState<number | null>(null);

  // 3DS refs to prevent duplicate handling
  const has3DSHandledRef = useRef(false);
  const hasChallengeHandledRef = useRef(false);
  const iframeContainerRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Permission check - only test users and admins can purchase
  const userEmail = session?.user?.email || "";
  const userRoles = (session?.user as Record<string, unknown>)?.roles as string[] || [];
  const canPurchaseCredits =
    userEmail.startsWith("test@") || userRoles.includes("ADMIN");

  const effectiveCredits = selectedCredits || (customAmount ? parseInt(customAmount) : 0);
  const priceInCents = effectiveCredits * 10; // 10 credits = $1 = 100 cents
  const priceUsd = priceInCents / 100;

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setStep("select");
      setSelectedCredits(null);
      setCustomAmount("");
      setCardData({ number: "", expMonth: "", expYear: "", cvv: "", holder: "" });
      setPaymentId(null);
      setError(null);
      setNewBalance(null);
      has3DSHandledRef.current = false;
      hasChallengeHandledRef.current = false;
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }
  }, [open]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Listen for 3DS completion postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "3ds_complete") {
        // 3DS completed, poll for status
        if (paymentId) {
          pollPaymentStatus();
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [paymentId]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\D/g, "").slice(0, 16);
    const parts = [];
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.slice(i, i + 4));
    }
    return parts.join(" ");
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardData((prev) => ({ ...prev, number: formatted }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (value.length >= 2) {
      const month = value.slice(0, 2);
      const year = value.slice(2);
      setCardData((prev) => ({ ...prev, expMonth: month, expYear: year }));
    } else {
      setCardData((prev) => ({ ...prev, expMonth: value, expYear: "" }));
    }
  };

  const getExpiryDisplay = () => {
    if (cardData.expMonth && cardData.expYear) {
      return `${cardData.expMonth}/${cardData.expYear}`;
    }
    return cardData.expMonth;
  };

  const isCardValid = () => {
    const cardNum = cardData.number.replace(/\s/g, "");
    return (
      cardNum.length >= 13 &&
      cardNum.length <= 19 &&
      cardData.expMonth.length === 2 &&
      cardData.expYear.length === 2 &&
      cardData.cvv.length >= 3 &&
      cardData.holder.trim().length >= 2
    );
  };

  const pollPaymentStatus = useCallback(async () => {
    if (!paymentId) return;

    try {
      const res = await fetch(`/api/payments/gate/status?payment_id=${paymentId}`);
      const data = await res.json();

      if (data.status === "success") {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        setNewBalance(data.balance);
        setStep("success");
        return;
      }

      if (data.status === "decline") {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        setError(data.message || "Payment declined");
        setStep("error");
        return;
      }

      // Handle 3DS requirements
      if (data.status === "3ds_required") {
        // Extended 3DS with fingerprinting iframe
        if (data.extended_3ds && data.iframe_url && !has3DSHandledRef.current) {
          has3DSHandledRef.current = true;
          setStep("3ds");

          // Create hidden iframe for fingerprinting
          setTimeout(() => {
            if (iframeContainerRef.current) {
              const iframe = document.createElement("iframe");
              iframe.name = "threeds-iframe";
              iframe.id = "threeds-iframe";
              iframe.style.width = "0";
              iframe.style.height = "0";
              iframe.style.border = "none";
              iframe.style.visibility = "hidden";
              iframeContainerRef.current.appendChild(iframe);

              // Create form to post to iframe
              const form = document.createElement("form");
              form.method = "POST";
              form.action = data.iframe_url;
              form.target = "threeds-iframe";

              if (data.threeds_method_data) {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = "threeDSMethodData";
                input.value = data.threeds_method_data;
                form.appendChild(input);
              }

              document.body.appendChild(form);
              form.submit();
              document.body.removeChild(form);

              // Notify 3DS completion after timeout (fingerprinting typically takes 1-3 seconds)
              setTimeout(async () => {
                await fetch(`/api/payments/gate/3ds-notify?payment_id=${paymentId}`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ payment_id: paymentId }),
                });
              }, 3000);
            }
          }, 100);
          return;
        }

        // 3DS2 Challenge redirect
        if (data.threeds2_challenge && data.redirect_url && !hasChallengeHandledRef.current) {
          hasChallengeHandledRef.current = true;
          setStep("3ds");

          setTimeout(() => {
            if (iframeContainerRef.current) {
              // Clear previous content
              iframeContainerRef.current.innerHTML = "";

              const iframe = document.createElement("iframe");
              iframe.name = "challenge-iframe";
              iframe.id = "challenge-iframe";
              iframe.style.width = "100%";
              iframe.style.height = "400px";
              iframe.style.border = "1px solid #333";
              iframe.style.borderRadius = "8px";
              iframeContainerRef.current.appendChild(iframe);

              const form = document.createElement("form");
              form.method = "POST";
              form.action = data.redirect_url;
              form.target = "challenge-iframe";

              if (data.creq) {
                const creqInput = document.createElement("input");
                creqInput.type = "hidden";
                creqInput.name = "creq";
                creqInput.value = data.creq;
                form.appendChild(creqInput);
              }

              if (data.threeds_session_data) {
                const sessionInput = document.createElement("input");
                sessionInput.type = "hidden";
                sessionInput.name = "threeDSSessionData";
                sessionInput.value = data.threeds_session_data;
                form.appendChild(sessionInput);
              }

              document.body.appendChild(form);
              form.submit();
              document.body.removeChild(form);
            }
          }, 100);
          return;
        }

        // Basic 3DS (ACS redirect)
        if (data.acs_url && !has3DSHandledRef.current) {
          has3DSHandledRef.current = true;
          setStep("3ds");

          setTimeout(() => {
            if (iframeContainerRef.current) {
              iframeContainerRef.current.innerHTML = "";

              const iframe = document.createElement("iframe");
              iframe.name = "acs-iframe";
              iframe.id = "acs-iframe";
              iframe.style.width = "100%";
              iframe.style.height = "400px";
              iframe.style.border = "1px solid #333";
              iframe.style.borderRadius = "8px";
              iframeContainerRef.current.appendChild(iframe);

              const form = document.createElement("form");
              form.method = "POST";
              form.action = data.acs_url;
              form.target = "acs-iframe";

              const paReqInput = document.createElement("input");
              paReqInput.type = "hidden";
              paReqInput.name = "PaReq";
              paReqInput.value = data.pa_req;
              form.appendChild(paReqInput);

              const mdInput = document.createElement("input");
              mdInput.type = "hidden";
              mdInput.name = "MD";
              mdInput.value = data.md || paymentId;
              form.appendChild(mdInput);

              const termUrlInput = document.createElement("input");
              termUrlInput.type = "hidden";
              termUrlInput.name = "TermUrl";
              termUrlInput.value =
                data.term_url || `${window.location.origin}/api/payments/gate/3ds-return?payment_id=${paymentId}`;
              form.appendChild(termUrlInput);

              document.body.appendChild(form);
              form.submit();
              document.body.removeChild(form);
            }
          }, 100);
          return;
        }
      }
    } catch (err) {
      // Continue polling on error
    }
  }, [paymentId]);

  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    pollingIntervalRef.current = setInterval(pollPaymentStatus, 2000);
    // Also poll immediately
    pollPaymentStatus();
  }, [pollPaymentStatus]);

  const handleSubmitPayment = async () => {
    if (!isCardValid() || effectiveCredits < 10) return;

    setStep("processing");
    setError(null);
    has3DSHandledRef.current = false;
    hasChallengeHandledRef.current = false;

    try {
      const res = await fetch("/api/payments/gate/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credits: effectiveCredits,
          amount: priceInCents,
          currency: "EUR",
          cardNumber: cardData.number.replace(/\s/g, ""),
          expiryMonth: cardData.expMonth,
          expiryYear: cardData.expYear,
          cvv: cardData.cvv,
          cardHolder: cardData.holder.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.message || "Payment failed");
        setStep("error");
        return;
      }

      setPaymentId(data.paymentId);

      if (data.status === "success") {
        // Immediate success (rare, no 3DS)
        const balanceRes = await fetch("/api/wallet");
        const balanceData = await balanceRes.json();
        setNewBalance(balanceData.balance);
        setStep("success");
        return;
      }

      if (data.status === "3ds_required") {
        setStep("3ds");

        // Extended 3DS (fingerprinting iframe first)
        if (data.extended_3ds && data.iframe_url) {
          has3DSHandledRef.current = true;

          setTimeout(() => {
            if (iframeContainerRef.current) {
              const iframe = document.createElement("iframe");
              iframe.name = "threeds-iframe";
              iframe.id = "threeds-iframe";
              iframe.style.width = "0";
              iframe.style.height = "0";
              iframe.style.border = "none";
              iframe.style.visibility = "hidden";
              iframeContainerRef.current.appendChild(iframe);

              const form = document.createElement("form");
              form.method = "POST";
              form.action = data.iframe_url;
              form.target = "threeds-iframe";

              if (data.threeds_method_data) {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = "threeDSMethodData";
                input.value = data.threeds_method_data;
                form.appendChild(input);
              }

              document.body.appendChild(form);
              form.submit();
              document.body.removeChild(form);

              // Notify completion after fingerprinting
              setTimeout(async () => {
                await fetch(`/api/payments/gate/3ds-notify?payment_id=${data.paymentId}`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ payment_id: data.paymentId }),
                });
                // Start polling after fingerprinting notification
                startPolling();
              }, 3000);
            }
          }, 100);
          return;
        }

        // Basic 3DS (ACS redirect)
        if (data.acs_url) {
          has3DSHandledRef.current = true;

          setTimeout(() => {
            if (iframeContainerRef.current) {
              iframeContainerRef.current.innerHTML = "";

              const iframe = document.createElement("iframe");
              iframe.name = "acs-iframe";
              iframe.id = "acs-iframe";
              iframe.style.width = "100%";
              iframe.style.height = "400px";
              iframe.style.border = "1px solid #333";
              iframe.style.borderRadius = "8px";
              iframeContainerRef.current.appendChild(iframe);

              const form = document.createElement("form");
              form.method = "POST";
              form.action = data.acs_url;
              form.target = "acs-iframe";

              const paReqInput = document.createElement("input");
              paReqInput.type = "hidden";
              paReqInput.name = "PaReq";
              paReqInput.value = data.pa_req;
              form.appendChild(paReqInput);

              const mdInput = document.createElement("input");
              mdInput.type = "hidden";
              mdInput.name = "MD";
              mdInput.value = data.md || data.paymentId;
              form.appendChild(mdInput);

              const termUrlInput = document.createElement("input");
              termUrlInput.type = "hidden";
              termUrlInput.name = "TermUrl";
              termUrlInput.value =
                data.term_url || `${window.location.origin}/api/payments/gate/3ds-return?payment_id=${data.paymentId}`;
              form.appendChild(termUrlInput);

              document.body.appendChild(form);
              form.submit();
              document.body.removeChild(form);
            }
          }, 100);

          // Start polling for ACS completion
          startPolling();
          return;
        }
      }

      // Pending status - start polling
      if (data.status === "pending") {
        setStep("processing");
        startPolling();
      }
    } catch (err) {
      setError("Payment initialization failed. Please try again.");
      setStep("error");
    }
  };

  const handleSuccessClose = () => {
    if (newBalance !== null) {
      onSuccess(newBalance);
    }
    onOpenChange(false);
  };

  const handleRetry = () => {
    setStep("card");
    setError(null);
    setPaymentId(null);
    has3DSHandledRef.current = false;
    hasChallengeHandledRef.current = false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800" showCloseButton={step !== "processing" && step !== "3ds"}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <SlWallet className="w-5 h-5 text-pink-500" />
            {step === "success" ? t("buyCredits.paymentComplete") : t("buyCredits.addCredits")}
          </DialogTitle>
          {step !== "success" && (
            <DialogDescription>
              {t("buyCredits.purchaseDescription")}
            </DialogDescription>
          )}
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* Contact Support for Non-Eligible Users */}
          {!canPurchaseCredits ? (
            <motion.div
              key="contact-support"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8"
            >
              <div className="p-3 rounded-lg bg-zinc-800/50 mb-6 flex items-center justify-between">
                <span className="text-sm text-zinc-400">{t("wallet.currentBalance")}</span>
                <span className="font-semibold text-white">
                  {currentBalance.toLocaleString()} {t("common.credits")}
                </span>
              </div>

              <div className="p-6 rounded-xl bg-pink-500/10 border border-pink-500/20 text-center space-y-4">
                <SlEnvolopeLetter className="w-14 h-14 text-pink-500 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {t("buyCredits.contactSupport")}
                  </h3>
                  <p className="text-sm text-zinc-300 mb-1">
                    {t("buyCredits.purchaseDisabled")}
                  </p>
                  <p className="text-sm text-zinc-400 mb-4">
                    {t("buyCredits.contactSupportDesc")}
                  </p>
                  <Button
                    onClick={() => window.location.href = "mailto:support@nabd.ai"}
                    className="bg-pink-500 hover:bg-pink-400 text-black font-semibold"
                  >
                    <SlEnvolopeLetter className="w-4 h-4 mr-2" />
                    {t("buyCredits.contactSupport")}
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : step === "select" ? (
            <motion.div
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 py-4"
            >
              {/* Current Balance */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                <span className="text-sm text-zinc-400">{t("wallet.currentBalance")}</span>
                <span className="font-semibold text-white">
                  {currentBalance.toLocaleString()} {t("common.credits")}
                </span>
              </div>

              {/* Credit Packages */}
              <div className="grid grid-cols-3 gap-3">
                {creditPackages.map((pkg) => (
                  <motion.button
                    key={pkg.credits}
                    onClick={() => {
                      setSelectedCredits(pkg.credits);
                      setCustomAmount("");
                    }}
                    className={cn(
                      "relative p-4 rounded-xl border-2 transition-all",
                      selectedCredits === pkg.credits
                        ? "border-pink-500 bg-pink-500/10"
                        : "border-zinc-700 hover:border-zinc-600 bg-zinc-800/50"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-pink-500 text-black text-xs font-semibold">
                        {t("buyCredits.popular")}
                      </span>
                    )}
                    <p className="text-2xl font-bold text-white">{pkg.credits}</p>
                    <p className="text-xs text-zinc-400">${pkg.price}</p>
                  </motion.button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="space-y-2">
                <Label className="text-sm text-zinc-400">{t("buyCredits.orEnterCustom")}</Label>
                <div className="relative">
                  <SlWallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    type="text"
                    placeholder={t("buyCredits.enterCreditsMin")}
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value.replace(/\D/g, ""));
                      setSelectedCredits(null);
                    }}
                    className="pl-10 bg-zinc-800 border-zinc-700"
                  />
                  {customAmount && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
                      = ${(parseInt(customAmount) / 10).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Continue Button */}
              <Button
                onClick={() => setStep("card")}
                disabled={effectiveCredits < 10}
                className={cn(
                  "w-full h-12 font-semibold text-base",
                  effectiveCredits >= 10
                    ? "bg-pink-500 hover:bg-pink-400 text-black"
                    : "bg-zinc-700 text-zinc-400"
                )}
              >
                {t("buyCredits.continueToPayment")}
              </Button>
            </motion.div>
          ) : step === "card" ? (
            <motion.div
              key="card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5 py-4"
            >
              {/* Summary */}
              <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-300">{t("common.credits")}</span>
                  <span className="font-semibold text-white flex items-center gap-1">
                    <SlStar className="w-4 h-4 text-pink-500" />
                    {effectiveCredits.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-zinc-300">{t("buyCredits.total")}</span>
                  <span className="text-xl font-bold text-pink-500">
                    ${priceUsd.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Card Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("buyCredits.cardNumber")}</Label>
                  <div className="relative">
                    <SlCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardData.number}
                      onChange={handleCardNumberChange}
                      className="pl-10 bg-zinc-800 border-zinc-700 font-mono"
                      maxLength={19}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("buyCredits.expiryDate")}</Label>
                    <Input
                      type="text"
                      placeholder="MM/YY"
                      value={getExpiryDisplay()}
                      onChange={handleExpiryChange}
                      className="bg-zinc-800 border-zinc-700 font-mono"
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("buyCredits.cvv")}</Label>
                    <div className="relative">
                      <SlLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <Input
                        type="password"
                        placeholder="123"
                        value={cardData.cvv}
                        onChange={(e) =>
                          setCardData((prev) => ({
                            ...prev,
                            cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                          }))
                        }
                        className="pl-10 bg-zinc-800 border-zinc-700 font-mono"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("buyCredits.cardholderName")}</Label>
                  <Input
                    type="text"
                    placeholder="JOHN DOE"
                    value={cardData.holder}
                    onChange={(e) =>
                      setCardData((prev) => ({
                        ...prev,
                        holder: e.target.value.toUpperCase(),
                      }))
                    }
                    className="bg-zinc-800 border-zinc-700 uppercase"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("select")}
                  className="flex-1 border-zinc-700"
                >
                  {t("common.back")}
                </Button>
                <Button
                  onClick={handleSubmitPayment}
                  disabled={!isCardValid()}
                  className={cn(
                    "flex-1 font-semibold",
                    isCardValid()
                      ? "bg-pink-500 hover:bg-pink-400 text-black"
                      : "bg-zinc-700 text-zinc-400"
                  )}
                >
                  <SlLock className="w-4 h-4 mr-2" />
                  {t("buyCredits.pay")} ${priceUsd.toFixed(2)}
                </Button>
              </div>

              <p className="text-xs text-center text-zinc-500">
                {t("buyCredits.securePayment")}
              </p>
            </motion.div>
          ) : step === "processing" ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center"
            >
              <SlRefresh className="w-12 h-12 text-pink-500 mx-auto animate-spin mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {t("buyCredits.processingPayment")}
              </h3>
              <p className="text-sm text-zinc-400">
                {t("buyCredits.pleaseWait")}
              </p>
            </motion.div>
          ) : step === "3ds" ? (
            <motion.div
              key="3ds"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-4"
            >
              <div className="text-center mb-4">
                <SlLock className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-white">
                  {t("buyCredits.verifyPayment")}
                </h3>
                <p className="text-sm text-zinc-400">
                  {t("buyCredits.completeVerification")}
                </p>
              </div>

              {/* 3DS iframe container */}
              <div
                ref={iframeContainerRef}
                className="min-h-[200px] bg-zinc-800 rounded-lg overflow-hidden"
              />

              <p className="text-xs text-center text-zinc-500 mt-4">
                {t("buyCredits.bankVerification")}
              </p>
            </motion.div>
          ) : step === "success" ? (
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
              <h3 className="text-xl font-semibold text-white mb-2">
                {t("buyCredits.creditsAdded")}
              </h3>
              <p className="text-zinc-400 mb-6">
                +{effectiveCredits.toLocaleString()} {t("buyCredits.creditsAddedToWallet")}
              </p>
              <Button
                onClick={handleSuccessClose}
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold"
              >
                <SlCheck className="w-4 h-4 mr-2" />
                {t("buyCredits.done")}
              </Button>
            </motion.div>
          ) : step === "error" ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center"
            >
              <motion.div
                className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <SlClose className="w-8 h-8 text-red-500" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {t("buyCredits.paymentFailed")}
              </h3>
              <p className="text-zinc-400 mb-6">{error || t("common.error")}</p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="border-zinc-700"
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  onClick={handleRetry}
                  className="bg-pink-500 hover:bg-pink-400 text-black font-semibold"
                >
                  {t("buyCredits.tryAgain")}
                </Button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
