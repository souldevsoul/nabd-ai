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
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { RiMailLine, RiLockLine, RiEyeLine, RiArrowLeftLine, RiLoader4Line, RiUserLine, RiVipCrownLine, RiImageLine, RiShoppingBagLine, RiRocketLine } from "react-icons/ri";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") || "buyer";
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"PHOTOGRAPHER" | "BUYER">(
    defaultRole === "photographer" ? "PHOTOGRAPHER" : "BUYER"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: selectedRole },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role: selectedRole }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Registration failed");

      toast.success("ОРБИТА ЖЕТІЛДІ - Миссия дайын, экипажға қош келдіңіз!");

      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Тіркеу сәтсіз аяқталды");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (role: "PHOTOGRAPHER" | "BUYER") => {
    setSelectedRole(role);
    setValue("role", role);
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

      {/* Rocket stages indicator - right side */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 space-y-6 hidden lg:block">
        {['Іске қосуға дейін', 'Ұшыру', 'Орбита'].map((stage, idx) => (
          <div key={stage} className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-aurora animate-pulse' : 'bg-aurora/20'}`} />
            <span className="text-xs text-background/40 tracking-cosmos uppercase">{stage}</span>
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-lg mx-4">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-background/60 hover:text-background transition-colors mb-8"
        >
          <RiArrowLeftLine size={16} />
          <span className="tracking-cosmos uppercase text-xs">Іске қосуды тоқтату</span>
        </Link>

        <div className="p-10 space-window backdrop-blur-xl relative overflow-hidden">
          {/* Scanline effect */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="w-full h-full bg-gradient-to-b from-transparent via-aurora/20 to-transparent animate-pulse" />
          </div>

          {/* Logo & Header */}
          <div className="text-center mb-8 relative">
            <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-aurora/60 rounded-sm mb-6 cosmic-glow-pulse">
              <RiRocketLine size={28} className="text-aurora" />
            </div>
            <Logo size="lg" className="justify-center mb-4" />
            <h1 className="text-2xl font-display font-bold text-background tracking-cosmos uppercase mb-2">
              Экипажды тіркеу
            </h1>
            <p className="text-xs text-aurora/80 tracking-widest uppercase">Қабылдау тізбегін бастау</p>
            <div className="w-24 h-px bg-aurora/60 mx-auto mt-6" />
          </div>

          {/* Role Selection - Mission Type */}
          <div className="grid grid-cols-2 gap-4 mb-8 relative">
            <button
              type="button"
              onClick={() => handleRoleChange("PHOTOGRAPHER")}
              className={cn(
                "flex flex-col items-center gap-3 p-5 border-2 transition-all relative overflow-hidden group",
                selectedRole === "PHOTOGRAPHER"
                  ? "border-aurora bg-aurora/10"
                  : "border-aurora/20 hover:border-aurora/40"
              )}
            >
              <RiImageLine
                size={24}
                className={selectedRole === "PHOTOGRAPHER" ? "text-aurora" : "text-background/40"}
              />
              <span className={cn(
                "text-xs tracking-cosmos uppercase",
                selectedRole === "PHOTOGRAPHER" ? "text-background" : "text-background/50"
              )}>
                Жасаушы
              </span>
              {selectedRole === "PHOTOGRAPHER" && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-aurora animate-pulse" />
              )}
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("BUYER")}
              className={cn(
                "flex flex-col items-center gap-3 p-5 border-2 transition-all relative overflow-hidden group",
                selectedRole === "BUYER"
                  ? "border-aurora bg-aurora/10"
                  : "border-aurora/20 hover:border-aurora/40"
              )}
            >
              <RiShoppingBagLine
                size={24}
                className={selectedRole === "BUYER" ? "text-aurora" : "text-background/40"}
              />
              <span className={cn(
                "text-xs tracking-cosmos uppercase",
                selectedRole === "BUYER" ? "text-background" : "text-background/50"
              )}>
                Коллекционер
              </span>
              {selectedRole === "BUYER" && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-aurora animate-pulse" />
              )}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative">
            <div className="space-y-2">
              <Label className="text-xs text-background/70 uppercase tracking-cosmos flex items-center gap-2">
                <span className="text-aurora">▸</span> Шақыру белгісі
              </Label>
              <div className="relative group">
                <RiUserLine size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-aurora/60 group-focus-within:text-aurora transition-colors" />
                <Input
                  type="text"
                  placeholder="Экипаж мүшесінің аты"
                  className="pl-12 h-14 bg-navy/50 border-aurora/30 focus:border-aurora text-background placeholder:text-background/30 tracking-wide transition-all focus:shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                  {...register("name")}
                />
              </div>
              {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-background/70 uppercase tracking-cosmos flex items-center gap-2">
                <span className="text-aurora">▸</span> Байланыс арнасы
              </Label>
              <div className="relative group">
                <RiMailLine size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-aurora/60 group-focus-within:text-aurora transition-colors" />
                <Input
                  type="email"
                  placeholder="астронавт@orbita.space"
                  className="pl-12 h-14 bg-navy/50 border-aurora/30 focus:border-aurora text-background placeholder:text-background/30 tracking-wide transition-all focus:shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-background/70 uppercase tracking-cosmos flex items-center gap-2">
                  <span className="text-aurora">▸</span> Қауіпсіздік кілті
                </Label>
                <div className="relative group">
                  <RiLockLine size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-aurora/60 group-focus-within:text-aurora transition-colors" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-12 h-14 bg-navy/50 border-aurora/30 focus:border-aurora text-background placeholder:text-background/30 transition-all focus:shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                    {...register("password")}
                  />
                </div>
                {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-background/70 uppercase tracking-cosmos flex items-center gap-2">
                    <span className="text-aurora">▸</span> Кілтті растау
                  </Label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-aurora/60 hover:text-aurora transition-colors"
                  >
                    <RiEyeLine size={14} />
                  </button>
                </div>
                <div className="relative group">
                  <RiLockLine size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-aurora/60 group-focus-within:text-aurora transition-colors" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-12 h-14 bg-navy/50 border-aurora/30 focus:border-aurora text-background placeholder:text-background/30 transition-all focus:shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                    {...register("confirmPassword")}
                  />
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-display text-sm tracking-cosmos uppercase mt-6 transition-all hover:shadow-[0_0_30px_rgba(30,64,175,0.5)] relative overflow-hidden group"
              disabled={isLoading}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <RiLoader4Line size={20} className="animate-spin" />
                  Іске қосу жүріп жатыр...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <RiRocketLine size={18} />
                  Іске қосу тізбегін бастау
                </span>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center relative">
            <div className="w-24 h-px bg-aurora/30 mx-auto mb-6" />
            <p className="text-xs text-background/60 tracking-cosmos uppercase">
              Экипаж мүшесісіз бе?{" "}
              <Link href="/login" className="text-aurora hover:text-aurora/80 transition-colors">
                Порталға кіру
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-background/40 leading-relaxed">
            Тіркелу арқылы сіз біздің{" "}
            <Link href="/terms" className="underline hover:text-aurora/60">Шарттарымызбен</Link>
            {" "}және{" "}
            <Link href="/privacy" className="underline hover:text-aurora/60">Құпиялылық саясатымен</Link> келісесіз
          </p>
        </div>

        {/* Status indicator */}
        <div className="mt-8 text-center">
          <p className="text-xs text-aurora/40 tracking-cosmos uppercase flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-aurora rounded-full animate-pulse" />
            Іске қосуға дейінгі кезең белсенді
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-foreground flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
