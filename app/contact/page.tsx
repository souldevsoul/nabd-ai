"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SlEnvelopeOpen, SlLocationPin, SlClock, SlPaperPlane, SlBubble, SlBriefcase, SlQuestion } from "react-icons/sl";
import { toast } from "sonner";

const contactReasons = [
  { id: "general", label: "ЖАЛПЫ СҰРАУ", icon: SlBubble },
  { id: "support", label: "ТЕХНИКАЛЫҚ ҚОЛДАУ", icon: SlQuestion },
  { id: "business", label: "БИЗНЕС", icon: SlBriefcase },
  { id: "press", label: "БАСПАСӨЗ ЖӘНЕ МЕДИА", icon: SlEnvelopeOpen },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedReason, setSelectedReason] = useState("general");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("ТРАНСЛЯЦИЯ ҚАБЫЛДАНДЫ - Жер басқаруы хабарламаңызды растады");
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen starfield">
      <Header />

      {/* Hero - Ground Control */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* HUD Corner Brackets */}
        <div className="absolute top-32 left-8 w-16 h-16 border-t-2 border-l-2 border-aurora pointer-events-none opacity-30" />
        <div className="absolute top-32 right-8 w-16 h-16 border-t-2 border-r-2 border-aurora pointer-events-none opacity-30" />

        <div className="aurora" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 border-2 border-aurora/40 bg-aurora/5 mb-6">
              <span className="w-2 h-2 bg-aurora rounded-full animate-pulse" />
              <span className="text-xs tracking-cosmos uppercase text-aurora font-semibold">Байланыс Арнасы Ашық</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold uppercase tracking-tight text-background">
              ЖЕР <span className="gradient-text">БАСҚАРУЫ</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-background/70 font-body font-light">
              Миссия басқарумен байланыс реттілігін бастау. Жауап уақыты: 24 сағаттық орбиталық терезе.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info - Transmission Interface */}
      <section className="pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Form - Radio Transmission Interface */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-window p-8 relative overflow-hidden"
            >
              {/* Static/noise effect overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(56,189,248,0.3)_2px,rgba(56,189,248,0.3)_4px)]" />
              </div>

              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 border-2 border-aurora/60 rounded-sm flex items-center justify-center">
                    <SlPaperPlane size={20} className="text-aurora" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold uppercase tracking-cosmos text-background">
                      Трансляция Формасы
                    </h2>
                    <p className="text-xs text-aurora/80 tracking-cosmos uppercase">Байланыс Реттілігін Бастау</p>
                  </div>
                </div>

                {/* Reason Selection - HUD Style */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {contactReasons.map((reason) => (
                    <button
                      key={reason.id}
                      type="button"
                      onClick={() => setSelectedReason(reason.id)}
                      className={`flex items-center gap-2 p-3 border-2 transition-all duration-300 ${
                        selectedReason === reason.id
                          ? "border-aurora bg-aurora/10 text-aurora"
                          : "border-aurora/20 hover:border-aurora/40 text-background/60"
                      } relative`}
                    >
                      <reason.icon size={18} />
                      <span className="text-xs font-display font-bold uppercase tracking-wide">{reason.label}</span>
                      {selectedReason === reason.id && (
                        <div className="absolute top-0 right-0 w-2 h-2 bg-aurora animate-pulse" />
                      )}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name" className="font-display font-bold uppercase tracking-cosmos text-xs text-background/70 flex items-center gap-2">
                        <span className="text-aurora">▸</span> Шақыру Белгісі
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="атыңыз"
                        required
                        className="mt-1.5 h-12 bg-navy/50 border-aurora/30 focus:border-aurora text-background placeholder:text-background/30 transition-all focus:shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="font-display font-bold uppercase tracking-cosmos text-xs text-background/70 flex items-center gap-2">
                        <span className="text-aurora">▸</span> Байланыс Сілтемесі
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="signal@orbita.space"
                        required
                        className="mt-1.5 h-12 bg-navy/50 border-aurora/30 focus:border-aurora text-background placeholder:text-background/30 transition-all focus:shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="font-display font-bold uppercase tracking-cosmos text-xs text-background/70 flex items-center gap-2">
                      <span className="text-aurora">▸</span> Тақырып Коды
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="трансляция тақырыбы"
                      required
                      className="mt-1.5 h-12 bg-navy/50 border-aurora/30 focus:border-aurora text-background placeholder:text-background/30 transition-all focus:shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="font-display font-bold uppercase tracking-cosmos text-xs text-background/70 flex items-center gap-2">
                      <span className="text-aurora">▸</span> Хабарлама Жүктемесі
                    </Label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="хабарламаңызды жіберіңіз..."
                      required
                      className="mt-1.5 w-full px-4 py-3 bg-navy/50 border-2 border-aurora/30 focus:border-aurora text-background placeholder:text-background/30 transition-all focus:shadow-[0_0_20px_rgba(56,189,248,0.3)] resize-none focus:outline-none focus:ring-0"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-display font-bold uppercase tracking-cosmos gap-2 transition-all hover:shadow-[0_0_30px_rgba(30,64,175,0.5)] relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Жіберілуде...
                      </span>
                    ) : (
                      <>
                        <SlPaperPlane size={18} />
                        Трансляцияны Жіберу
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Contact Info - Telemetry Displays */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="space-window p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border-2 border-aurora/60 flex items-center justify-center">
                    <SlEnvelopeOpen size={24} className="text-aurora" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold uppercase tracking-cosmos mb-1 text-background">Тікелей Арна</h3>
                    <p className="text-background/60 text-sm font-light mb-2">
                      миссияға маңызды байланыстар үшін
                    </p>
                    <a
                      href="mailto:control@orbita.space"
                      className="text-aurora hover:underline font-medium transition-colors"
                    >
                      control@orbita.space
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-window p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border-2 border-aurora/60 flex items-center justify-center">
                    <SlLocationPin size={24} className="text-aurora" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold uppercase tracking-cosmos mb-1 text-background">Координаттар</h3>
                    <p className="text-background/60 text-sm font-light mb-2">
                      таратылған миссия басқару желісі
                    </p>
                    <p className="text-sm font-light text-background/80">
                      Байқоңыр ғарыш айлағы, Қазақстан<br />
                      Кеннеди ғарыш орталығы, FL<br />
                      Гвиана ғарыш орталығы, Француз Гвианасы
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-window p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border-2 border-aurora/60 flex items-center justify-center">
                    <SlClock size={24} className="text-aurora" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold uppercase tracking-cosmos mb-1 text-background">Жауап Терезесі</h3>
                    <p className="text-background/60 text-sm font-light mb-2">
                      орбиталық байланыс кестесі
                    </p>
                    <p className="text-sm font-light text-background/80">
                      Жалпы: 24 сағаттық орбита ішінде<br />
                      Қолдау: 4 сағаттық терезе ішінде<br />
                      Миссияға Маңызды: Лезде
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-window p-6 border-2 border-primary/40 bg-primary/5">
                <h3 className="font-display font-bold uppercase tracking-cosmos mb-2 text-background">
                  <span className="text-aurora">◆</span> Кәсіпорын Миссиялары
                </h3>
                <p className="text-sm text-background/70 font-light mb-4">
                  Терең ғарыш экспедициялары, арнайы жүктеме конфигурациялары, немесе ақ белгі миссия басқаруы?
                  Біздің кәсіпорын флотымыз күтуде тұр.
                </p>
                <Link href="/contact?type=business">
                  <Button variant="outline" className="border-2 border-aurora/40 hover:bg-aurora/5 hover:border-aurora font-display font-bold uppercase tracking-cosmos text-aurora">
                    Флот Қолбасшылығымен Байланысу
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
