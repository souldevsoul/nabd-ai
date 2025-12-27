"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { RiMailLine, RiLockLine, RiEyeLine, RiArrowLeftLine, RiLoader4Line, RiSparkling2Line } from "react-icons/ri";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("المصادقة сәтсіз аяқтал - بيانات غير صالحة");
      } else {
        toast.success("ҚОЛ ЖЕТКІЗУ РҰҚСАТ ЕТІЛДІ - مرحباً بك, رائد فضاء");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      toast.error("Бірдеңе дұрыс болма.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen starfield flex items-center justify-center overflow-hidden">
      {/* HUD Corner Brackets */}
      <div className="absolute top-8 left-8 w-20 h-20 border-t-2 border-l-2 border-aurora pointer-events-none opacity-40" />
      <div className="absolute top-8 right-8 w-20 h-20 border-t-2 border-r-2 border-aurora pointer-events-none opacity-40" />
      <div className="absolute bottom-8 left-8 w-20 h-20 border-b-2 border-l-2 border-aurora pointer-events-none opacity-40" />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-b-2 border-r-2 border-aurora pointer-events-none opacity-40" />

      {/* Aurora effect */}
      <div className="aurora" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-background/60 hover:text-background transition-colors mb-8"
        >
          <RiArrowLeftLine size={16} />
          <span className="tracking-cosmos uppercase text-xs">Базаإلى қайту</span>
        </Link>

        <div className="p-10 space-window backdrop-blur-xl relative overflow-hidden">
          {/* Scanline effect */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="w-full h-full bg-gradient-to-b from-transparent via-aurora/20 to-transparent animate-pulse" />
          </div>

          {/* Logo & Header */}
          <div className="text-center mb-10 relative">
            <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-aurora/60 rounded-sm mb-6 cosmic-glow-pulse">
              <RiSparkling2Line size={28} className="text-aurora" />
            </div>
            <Logo size="lg" className="justify-center mb-4" />
            <h1 className="text-2xl font-display font-bold text-background tracking-cosmos uppercase mb-2">
              الطاقمң аутетификация
            </h1>
            <p className="text-xs text-aurora/80 tracking-widest uppercase">المهمةمطلوب للوصول إلى</p>
            <div className="w-24 h-px bg-aurora/60 mx-auto mt-6" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative">
            <div className="space-y-2">
              <Label className="text-xs text-background/70 uppercase tracking-cosmos flex items-center gap-2">
                <span className="text-aurora">▸</span> Экипаж ID
              </Label>
              <div className="relative group">
                <RiMailLine
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-aurora/60 group-focus-within:text-aurora transition-colors"
                />
                <Input
                  type="email"
                  placeholder="رائد فضاء@orbita.space"
                  className="pl-12 h-14 bg-navy/50 border-aurora/30 focus:border-aurora text-background placeholder:text-background/30 tracking-wide transition-all focus:shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-background/70 uppercase tracking-cosmos flex items-center gap-2">
                  <span className="text-aurora">▸</span> رمز الوصول
                </Label>
                <button
                  type="button"
                  onClick={() => toast.info("لاستعادة الرمز مهمة бақылауыمع اتصل.")}
                  className="text-xs text-aurora/60 hover:text-aurora tracking-cosmos uppercase transition-colors"
                >
                  استعادة؟
                </button>
              </div>
              <div className="relative group">
                <RiLockLine
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-aurora/60 group-focus-within:text-aurora transition-colors"
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-12 pr-12 h-14 bg-navy/50 border-aurora/30 focus:border-aurora text-background placeholder:text-background/30 transition-all focus:shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-aurora/60 hover:text-aurora transition-colors"
                >
                  <RiEyeLine size={18} />
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-display text-sm tracking-cosmos uppercase mt-4 transition-all hover:shadow-[0_0_30px_rgba(30,64,175,0.5)] relative overflow-hidden group"
              disabled={isLoading}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <RiLoader4Line size={20} className="animate-spin" />
                  المصادقة жүріп жатыр...
                </span>
              ) : (
                "بدء تسلسل الوصول"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center relative">
            <div className="w-24 h-px bg-aurora/30 mx-auto mb-6" />
            <p className="text-xs text-background/60 tracking-cosmos uppercase">
              جديد жұмысшы?{" "}
              <Link href="/register" className="text-aurora hover:text-aurora/80 transition-colors">
                Рұқсат сұрау
              </Link>
            </p>
          </div>
        </div>

        {/* Status indicator */}
        <div className="mt-8 text-center">
          <p className="text-xs text-aurora/40 tracking-cosmos uppercase flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-aurora rounded-full animate-pulse" />
            Қауіпсіз ара белседі
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-foreground flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
