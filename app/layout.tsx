import type { Metadata } from "next";
import { Tajawal, Cairo } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";
import "./globals.css";

const tajawal = Tajawal({
  variable: "--font-display",
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800", "900"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-body",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "نبض | سوق الذكاء الاصطناعي في السعودية",
    template: "%s | نبض",
  },
  description:
    "سوق نبض للذكاء الاصطناعي في المملكة العربية السعودية. تواصل مع أفضل خبراء الذكاء الاصطناعي واحصل على خدمات متميزة.",
  keywords: [
    "ذكاء اصطناعي السعودية",
    "نبض AI",
    "خبراء الذكاء الاصطناعي",
    "تعلم آلي",
    "الرياض AI",
    "سوق الذكاء الاصطناعي",
  ],
  authors: [{ name: "نبض" }],
  creator: "نبض",
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://nabd.ai",
    siteName: "نبض",
    title: "نبض | سوق الذكاء الاصطناعي في السعودية",
    description:
      "سوق نبض للذكاء الاصطناعي في المملكة العربية السعودية. تواصل مع أفضل خبراء الذكاء الاصطناعي.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "نبض - سوق الذكاء الاصطناعي في السعودية",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "نبض | سوق الذكاء الاصطناعي في السعودية",
    description:
      "سوق نبض للذكاء الاصطناعي في المملكة العربية السعودية.",
    images: ["/og-image.png"],
    creator: "@nabd_ai",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${tajawal.variable} ${cairo.variable} font-body antialiased min-h-screen bg-background text-foreground`}
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
          </div>
          <Toaster position="bottom-left" richColors />
        </Providers>
      </body>
    </html>
  );
}
