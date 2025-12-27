"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  SlArrowLeft,
  SlCheck,
  SlBell,
} from "react-icons/sl";

export default function ExecutorTelegramPage() {
  const { data: session, status } = useSession();
  const [isLinked, setIsLinked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      checkTelegramStatus();
    }
  }, [status]);

  const checkTelegramStatus = async () => {
    try {
      const res = await fetch("/api/executor/dashboard");
      if (res.ok) {
        const data = await res.json();
        setIsLinked(!!data.specialist?.telegramLinkedAt);
      }
    } catch (error) {
      console.error("Failed to check Telegram status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h1 className="text-3xl font-display font-bold mb-4">Telegram қосу</h1>
            <p className="text-muted-foreground mb-8">Telegram аккаунтын қосу үшін кіріңіз.</p>
            <Link href="/login">
              <Button>Кіру</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-2xl px-4">
          {/* Back link */}
          <Link
            href="/executor"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <SlArrowLeft className="w-4 h-4" />
            Басқару тақтасына оралу
          </Link>

          <div className="sexy-card">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-primary/10">
                <SlBell className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold">Telegram қосу</h1>
                <p className="text-muted-foreground">
                  Жаңа тапсырмалар үшін жедел хабарландырулар алыңыз
                </p>
              </div>
            </div>

            {isLinked ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <SlCheck className="w-5 h-5 text-emerald-500" />
                  <div>
                    <p className="font-medium text-emerald-500">Telegram қосылды!</p>
                    <p className="text-sm text-muted-foreground">
                      Жаңа тапсырмалар үшін хабарландырулар аласыз.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-muted/50">
                  <h3 className="font-medium mb-4">Telegram-ды қалай қосуға болады:</h3>
                  <ol className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                        1
                      </span>
                      <span>
                        Telegram ашып, <strong>@VertexExecutorBot</strong> іздеңіз
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                        2
                      </span>
                      <span>
                        <strong>Бастау</strong> түймесін басып әңгімені бастаңыз
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                        3
                      </span>
                      <span>
                        <code className="px-1.5 py-0.5 rounded bg-muted text-foreground">/link</code> командасын жіберіңіз
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                        4
                      </span>
                      <span>
                        Байланысты аяқтау үшін боттың нұсқауларын орындаңыз
                      </span>
                    </li>
                  </ol>
                </div>

                <div className="flex flex-col gap-3">
                  <a
                    href="https://t.me/VertexExecutorBot"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full gap-2">
                      <SlBell className="w-4 h-4" />
                      Telegram ботын ашу
                    </Button>
                  </a>
                  <Button
                    variant="outline"
                    onClick={checkTelegramStatus}
                    className="w-full"
                  >
                    Байланыс күйін тексеру
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  <p>Байланыстырғаннан кейін тапсырмаларды тікелей Telegram арқылы басқара аласыз:</p>
                  <p className="mt-1">
                    <code>/tasks</code> · <code>/accept</code> · <code>/start</code> · <code>/complete</code> · <code>/stats</code>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
