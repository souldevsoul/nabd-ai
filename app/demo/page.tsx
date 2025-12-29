"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  SlRocket,
  SlBadge,
  SlWallet,
  SlPeople,
  SlCheck,
  SlEnergy,
  SlLayers,
  SlScreen,
} from "react-icons/sl";

const features = [
  {
    icon: SlEnergy,
    title: "AI-Powered Matching",
    description: "Smart algorithm matches you with the perfect specialist",
  },
  {
    icon: SlWallet,
    title: "Credit Economy",
    description: "No subscriptions. Pay only for what you use. 10 credits = $1",
  },
  {
    icon: SlBadge,
    title: "Verified Experts",
    description: "All specialists pass verification with 4.8+ average rating",
  },
  {
    icon: SlLayers,
    title: "Visual Task Board",
    description: "Kanban-style board to track progress from pending to completed",
  },
  {
    icon: SlScreen,
    title: "Real-time Updates",
    description: "Instant notifications and live project status updates",
  },
  {
    icon: SlPeople,
    title: "Direct Communication",
    description: "Built-in chat with specialists, share files and requirements",
  },
];

const credentials = [
  {
    role: "Buyer",
    email: "hospital@nabd.ai",
    password: "buyer123456",
    description: "Purchase credits, submit requests"
  },
  {
    role: "Specialist",
    email: "executor@example.com",
    password: "testpassword123",
    description: "Accept tasks, earn credits"
  },
  {
    role: "Admin",
    email: "admin@example.com",
    password: "testpassword123",
    description: "Platform management"
  },
];

const techStack = [
  "Next.js 16",
  "TypeScript",
  "PostgreSQL",
  "Prisma ORM",
  "NextAuth v5",
  "Tailwind CSS v4",
  "Framer Motion",
  "Vercel",
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50/30" dir="rtl">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-pink-600/10" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-600 text-sm font-medium mb-6">
              <SlRocket className="w-4 h-4" />
              Product Demo
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
                نبض
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-4">
              سوق الذكاء الاصطناعي في السعودية
            </p>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
              Saudi AI Marketplace
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <SlRocket className="w-5 h-5" />
                Visit Live Site
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-semibold hover:border-rose-400 transition-all"
              >
                Try Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
            <p className="text-lg text-slate-600">What makes this platform stand out</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-2xl border-2 border-slate-100 hover:border-rose-200 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-rose-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Model */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Business Model</h2>
            <p className="text-lg text-slate-400">Simple, transparent pricing</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center"
            >
              <div className="text-5xl font-bold text-rose-400 mb-2">10</div>
              <p className="text-slate-400 mb-4">credits = $1 USD</p>
              <p className="text-sm text-slate-300">Buy credits upfront, pay per task</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center"
            >
              <div className="text-5xl font-bold text-green-400 mb-2">80%</div>
              <p className="text-slate-400 mb-4">to Specialists</p>
              <p className="text-sm text-slate-300">20% platform fee</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center"
            >
              <div className="text-5xl font-bold text-blue-400 mb-2">0</div>
              <p className="text-slate-400 mb-4">Subscriptions</p>
              <p className="text-sm text-slate-300">Credits never expire</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Demo Credentials */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Demo Credentials</h2>
            <p className="text-lg text-slate-600">Try the platform yourself</p>
          </motion.div>

          <div className="space-y-4">
            {credentials.map((cred, i) => (
              <motion.div
                key={cred.role}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border-2 border-slate-200 hover:border-rose-300 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      cred.role === "Buyer" ? "bg-blue-100 text-blue-600" :
                      cred.role === "Specialist" ? "bg-green-100 text-green-600" :
                      "bg-purple-100 text-purple-600"
                    }`}>
                      {cred.role}
                    </span>
                    <span className="ml-2 text-sm text-slate-500">{cred.description}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 font-mono text-sm">
                    <code className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700">{cred.email}</code>
                    <code className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700">{cred.password}</code>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              <SlRocket className="w-6 h-6" />
              Try Demo Now
            </Link>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold mb-2">Tech Stack</h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-gradient-to-r from-rose-500 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-white/90 mb-8">Join our growing community of AI specialists and clients</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-slate-900 font-semibold shadow-xl hover:shadow-2xl transition-all"
            >
              <SlRocket className="w-5 h-5" />
              Get Started Free
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/20 text-white font-semibold border-2 border-white/30 hover:bg-white/30 transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
