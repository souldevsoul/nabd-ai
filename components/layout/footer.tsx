"use client";

import Link from "next/link";
import { Logo } from "@/components/brand";

const footerLinks = {
  product: [
    { label: "خبراء متميزون", href: "/specialists" },
    { label: "طلب خدمة", href: "/request" },
    { label: "الأسعار المميزة", href: "/pricing" },
    { label: "واجهة برمجية", href: "/docs/api" },
  ],
  company: [
    { label: "عن نبض", href: "/about" },
    { label: "المدونة", href: "/blog" },
    { label: "اتصل بنا", href: "/contact" },
  ],
  legal: [
    { label: "الخصوصية", href: "/privacy" },
    { label: "الشروط", href: "/terms" },
    { label: "ملفات تعريف الارتباط", href: "/cookies" },
    { label: "سياسة الاسترجاع", href: "/refund" },
    { label: "اتفاقية الترخيص", href: "/license-agreement" },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-accent/30 bg-gradient-to-b from-primary to-primary/95 overflow-hidden">
      {/* Pulse pattern background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(220, 38, 38, 0.3) 40px, rgba(220, 38, 38, 0.3) 41px)',
      }} />

      {/* Heartbeat glow */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
            {/* Brand column */}
            <div className="col-span-2 lg:col-span-2">
              <Logo size="lg" />
              <p className="mt-4 max-w-xs text-sm text-white/70 leading-relaxed">
                منصة نبض للذكاء الاصطناعي في المملكة العربية السعودية. تواصل مع خبراء الذكاء الاصطناعي المعتمدين للحصول على نتائج استثنائية.
              </p>
              <div className="mt-6 text-xs text-accent/60 space-y-1 font-mono">
                <p>سجل تجاري: SA123456</p>
                <p>المنصة: نبض-٢٠٢٥</p>
                <p>الموقع: الرياض، السعودية</p>
              </div>
            </div>

            {/* Links columns */}
            <div>
              <h3 className="text-sm font-display font-bold uppercase tracking-[0.2em] text-accent mb-1">المنصة</h3>
              <div className="h-0.5 w-12 bg-gradient-to-l from-accent to-transparent mb-4" />
              <ul className="mt-4 space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-accent transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-accent/40 rounded-full group-hover:bg-accent transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-display font-bold uppercase tracking-[0.2em] text-accent mb-1">الشركة</h3>
              <div className="h-0.5 w-12 bg-gradient-to-l from-accent to-transparent mb-4" />
              <ul className="mt-4 space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-accent transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-accent/40 rounded-full group-hover:bg-accent transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-display font-bold uppercase tracking-[0.2em] text-accent mb-1">قانوني</h3>
              <div className="h-0.5 w-12 bg-gradient-to-l from-accent to-transparent mb-4" />
              <ul className="mt-4 space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-accent transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-accent/40 rounded-full group-hover:bg-accent transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-accent/20 py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <p className="text-xs text-white/50 font-mono">
                &copy; {new Date().getFullYear()} منصة نبض. شركة NewCo SA - المملكة العربية السعودية.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <p className="text-xs text-accent/60 uppercase tracking-[0.2em] font-semibold">معاملات آمنة ومشفرة</p>
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm border border-accent/20 rounded px-3 py-2 shadow-lg shadow-accent/10">
                  <img
                    src="/images/payment/visa.png"
                    alt="Visa"
                    width={48}
                    height={16}
                    className="h-4 w-auto object-contain opacity-80"
                  />
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-accent/20 rounded px-3 py-2 shadow-lg shadow-accent/10">
                  <img
                    src="/images/payment/mastercard.png"
                    alt="Mastercard"
                    width={32}
                    height={20}
                    className="h-5 w-auto object-contain opacity-80"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Saudi Arabia tagline */}
          <div className="mt-4 text-center">
            <p className="text-xs text-accent/40 tracking-widest font-mono">
              نبض الذكاء الاصطناعي من قلب المملكة العربية السعودية
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
