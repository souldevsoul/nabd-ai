"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { RiUser3Line } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskDetailDrawer } from "@/components/task-detail-drawer";
import { useTranslation } from "@/lib/i18n";
import {
  SlWallet,
  SlPeople,
  SlBriefcase,
  SlRocket,
  SlGraph,
  SlClock,
  SlCheck,
  SlArrowRight,
  SlRefresh,
  SlPlus,
} from "react-icons/sl";

interface DashboardData {
  stats: {
    walletBalance: number;
    activeOrders: number;
    completedOrders: number;
    totalSpent: number;
  };
  recentOrders: Array<{
    id: string;
    specialist: {
      firstName: string;
      avatarSeed: string;
    };
    task: {
      displayName: string;
    };
    status: string;
    credits: number;
    createdAt: string;
  }>;
  recommendedSpecialists: Array<{
    id: string;
    firstName: string;
    avatarSeed: string;
    bio: string;
    rating: number;
    hourlyRate: number;
  }>;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  IN_PROGRESS: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  COMPLETED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { t } = useTranslation();

  const openTaskDrawer = (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId);
    setDrawerOpen(true);
  };

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch("/api/dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SlRefresh className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || t("dashboard.loadFailed")}</p>
          <Button onClick={() => window.location.reload()}>{t("dashboard.retry")}</Button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: t("dashboard.walletValue"),
      value: `${data.stats.walletBalance.toLocaleString()} ${t("common.credits")}`,
      change: `$${(data.stats.walletBalance / 10).toFixed(2)} ${t("common.usd")}`,
      icon: SlWallet,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: t("dashboard.activeOrders"),
      value: data.stats.activeOrders.toString(),
      change: t("dashboard.inProgress"),
      icon: SlRocket,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: t("dashboard.consultations"),
      value: data.stats.completedOrders.toString(),
      change: t("dashboard.completed"),
      icon: SlCheck,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: t("dashboard.investment"),
      value: `${data.stats.totalSpent.toLocaleString()}`,
      change: t("dashboard.creditsAllocated"),
      icon: SlGraph,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold uppercase">{t("dashboard.title")}</h1>
          <p className="mt-2 text-muted-foreground font-body">
            {t("dashboard.welcome")}
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-wrap gap-4"
        >
          <Link href="/specialists">
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <SlPeople size={18} />
              {t("dashboard.viewSpecialists")}
            </Button>
          </Link>
          <Link href="/request">
            <Button variant="outline" className="gap-2 border-border hover:border-primary/50">
              <SlBriefcase size={18} />
              {t("dashboard.newConsultation")}
            </Button>
          </Link>
          <Link href="/dashboard/wallet">
            <Button variant="outline" className="gap-2 border-border hover:border-primary/50">
              <SlPlus size={18} />
              {t("dashboard.addCredits")}
            </Button>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <Card className="glass border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="mt-2 text-2xl font-display font-bold">{stat.value}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {stat.change}
                      </p>
                    </div>
                    <div className={`rounded-xl p-3 ${stat.bgColor}`}>
                      <stat.icon size={24} className={stat.color} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  {t("dashboard.recentOrders")}
                </CardTitle>
                <Link
                  href="/dashboard/purchases"
                  className="text-sm text-primary hover:text-primary/80"
                >
                  {t("dashboard.viewAll")}
                </Link>
              </CardHeader>
              <CardContent>
                {data.recentOrders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <SlBriefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>{t("dashboard.noOrders")}</p>
                    <Link href="/specialists" className="text-primary text-sm hover:underline">
                      {t("dashboard.browseSpecialists")}
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.recentOrders.map((order) => (
                      <div
                        key={order.id}
                        onClick={() => openTaskDrawer(order.id)}
                        className="group flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-muted/50 cursor-pointer"
                      >
                        <div className="relative h-12 w-12 overflow-hidden rounded-full bg-muted flex items-center justify-center">
                          <RiUser3Line size={24} className="text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {order.task.displayName}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {order.specialist.firstName} · {order.credits} credits
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${
                              statusColors[order.status] || "bg-muted text-muted-foreground"
                            }`}
                          >
                            {order.status === "COMPLETED" && (
                              <SlCheck size={10} className="mr-1" />
                            )}
                            {order.status === "IN_PROGRESS" && (
                              <SlClock size={10} className="mr-1" />
                            )}
                            {order.status.replace("_", " ")}
                          </span>
                        </div>
                        <SlArrowRight
                          size={16}
                          className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recommended Specialists */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  {t("dashboard.qualifiedPartners")}
                </CardTitle>
                <Link
                  href="/specialists"
                  className="text-sm text-primary hover:text-primary/80"
                >
                  {t("dashboard.viewAll")}
                </Link>
              </CardHeader>
              <CardContent>
                {data.recommendedSpecialists.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <SlPeople className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>{t("dashboard.noSpecialists")}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.recommendedSpecialists.map((specialist) => (
                      <Link
                        key={specialist.id}
                        href={`/specialists/${specialist.id}`}
                        className="group flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-muted/50"
                      >
                        <div className="relative h-12 w-12 overflow-hidden rounded-full bg-muted flex items-center justify-center">
                          <RiUser3Line size={24} className="text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{specialist.firstName}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {specialist.bio.substring(0, 50)}...
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{specialist.rating.toFixed(1)} ★</p>
                          <p className="text-xs text-muted-foreground">
                            {specialist.hourlyRate} cr/hr
                          </p>
                        </div>
                        <SlArrowRight
                          size={16}
                          className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Get Started Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="glass border-primary/20 bg-primary/5">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-xl bg-primary/20 p-3">
                <SlRocket size={24} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{t("dashboard.readyForExcellence")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("dashboard.submitMission")}
                </p>
              </div>
              <Link href="/request">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  {t("dashboard.requestConsultation")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Task Detail Drawer */}
      {session?.user?.id && (
        <TaskDetailDrawer
          assignmentId={selectedAssignmentId}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          currentUserId={session.user.id}
          userRole="buyer"
        />
      )}
    </div>
  );
}
