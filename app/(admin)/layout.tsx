"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import {
  SlGrid,
  SlPeople,
  SlDoc,
  SlSettings,
  SlMenu,
  SlShield,
  SlBell,
  SlLogout,
  SlArrowRight,
  SlChart,
  SlExclamation,
  SlCheck,
  SlBulb,
} from "react-icons/sl";
import { Logo } from "@/components/brand/logo";

const navItems = [
  {
    label: "Executive Overview",
    href: "/admin",
    icon: SlGrid,
  },
  {
    label: "Elite Partners",
    href: "/admin/specialists",
    icon: SlPeople,
  },
  {
    label: "Consultation Requests",
    href: "/admin/requests",
    icon: SlDoc,
  },
  {
    label: "Engagements",
    href: "/admin/assignments",
    icon: SlBulb,
  },
  {
    label: "Members",
    href: "/admin/users",
    icon: SlPeople,
  },
  {
    label: "Intelligence",
    href: "/admin/analytics",
    icon: SlChart,
  },
  {
    label: "Configuration",
    href: "/admin/settings",
    icon: SlSettings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    toast.success("Signing out...");
    await signOut({ callbackUrl: "/login" });
  };

  const notifications = [
    { id: 1, title: "New photo pending review", time: "5 min ago", unread: true },
    { id: 2, title: "License request approved", time: "1 hour ago", unread: true },
    { id: 3, title: "New user registered", time: "2 hours ago", unread: false },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        <motion.aside
          initial={false}
          animate={{ width: sidebarOpen ? 280 : 80 }}
          className="fixed left-0 top-0 z-40 h-screen bg-slate-900/50 backdrop-blur-xl border-r border-slate-800"
        >
          {/* Logo Section */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
            <Link href="/admin" className="flex items-center gap-3">
              <Logo size="sm" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex flex-col"
                  >
                    <span className="text-white font-bold text-lg">Vertex Elite</span>
                    <span className="text-amber-500 text-xs font-medium flex items-center gap-1">
                      <SlShield className="w-3 h-3" /> Executive Suite
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              {sidebarOpen ? (
                <SlArrowRight className="w-5 h-5 text-slate-400" />
              ) : (
                <SlMenu className="w-5 h-5 text-slate-400" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive
                      ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-amber-500" : ""}`} />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </nav>

          {/* Quick Stats (when expanded) */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-20 left-4 right-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50"
              >
                <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-3">Portfolio Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-400">
                      <SlExclamation className="w-4 h-4 text-amber-500" />
                      Pending Requests
                    </span>
                    <span className="text-white font-semibold">5</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-400">
                      <SlCheck className="w-4 h-4 text-emerald-500" />
                      Active Partners
                    </span>
                    <span className="text-white font-semibold">20</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* User Section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <span className="text-black font-bold">A</span>
              </div>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1"
                  >
                    <p className="text-white font-medium text-sm">Executive Director</p>
                    <p className="text-slate-500 text-xs">Chief Administrator</p>
                  </motion.div>
                )}
              </AnimatePresence>
              {sidebarOpen && (
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <SlLogout className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-[280px]" : "ml-[80px]"
        }`}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">
              {navItems.find(item => item.href === pathname)?.label || "Admin"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <SlBell className="w-5 h-5" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
                )}
              </button>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 py-2 rounded-xl bg-slate-800 border border-slate-700 shadow-xl z-50">
                    <div className="px-4 py-2 border-b border-slate-700">
                      <h3 className="text-white font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => {
                            setShowNotifications(false);
                            toast.info(notification.title);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-slate-700/50 transition-colors ${
                            notification.unread ? "bg-amber-500/5" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {notification.unread && (
                              <span className="mt-1.5 w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />
                            )}
                            <div className={notification.unread ? "" : "ml-5"}>
                              <p className="text-sm text-white">{notification.title}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{notification.time}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="px-4 py-2 border-t border-slate-700">
                      <button
                        onClick={() => {
                          setShowNotifications(false);
                          toast.info("Viewing all notifications");
                        }}
                        className="text-sm text-amber-400 hover:text-amber-300"
                      >
                        View all notifications
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <span className="text-sm text-slate-400">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
