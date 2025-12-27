"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { TaskDetailDrawer } from "@/components/task-detail-drawer";
import {
  SlBriefcase,
  SlCheck,
  SlClock,
  SlRocket,
  SlWallet,
  SlBell,
  SlArrowRight,
} from "react-icons/sl";

interface Assignment {
  id: string;
  status: string;
  price: number;
  confidence: number | null;
  reasoning: string | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  request: {
    id: string;
    description: string;
    status: string;
    user: {
      name: string | null;
      email: string;
    };
    task: {
      displayName: string;
    } | null;
  };
}

interface ExecutorData {
  specialist: {
    id: string;
    firstName: string;
    avatarSeed: string;
    rating: number;
    hourlyRate: number;
    totalTasks: number;
    completedTasks: number;
    telegramLinkedAt: string | null;
  } | null;
  assignments: Assignment[];
  stats: {
    pending: number;
    inProgress: number;
    completed: number;
    totalEarnings: number;
  };
}

export default function ExecutorDashboard() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<ExecutorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openTaskDrawer = (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId);
    setDrawerOpen(true);
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/executor/dashboard");
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error("Failed to fetch executor data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (assignmentId: string) => {
    setActionLoading(assignmentId);
    try {
      const res = await fetch(`/api/executor/assignments/${assignmentId}/accept`, {
        method: "POST",
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to accept:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (assignmentId: string) => {
    setActionLoading(assignmentId);
    try {
      const res = await fetch(`/api/executor/assignments/${assignmentId}/complete`, {
        method: "POST",
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to complete:", error);
    } finally {
      setActionLoading(null);
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
            <h1 className="text-3xl font-display font-bold mb-4">Орыдаушы басқару тақта</h1>
            <p className="text-muted-foreground mb-8">قم بتسجيل الدخول للوصول إلى لوحة تحكم المنفذ.</p>
            <Link href="/login">
              <Button>Кіру</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!data?.specialist) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h1 className="text-3xl font-display font-bold mb-4">Мама емес</h1>
            <p className="text-muted-foreground mb-8">
              حسابك غير مرتبط بملف متخصص. اتصل بالإدارة لتصبح منفذاً.
            </p>
            <Link href="/dashboard">
              <Button>Басқару тақтаа оралу</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { specialist, assignments, stats } = data;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${specialist.avatarSeed}`}
                alt={specialist.firstName}
                className="w-16 h-16 rounded-full bg-muted"
              />
              <div>
                <h1 className="text-2xl font-display font-bold">
                  مرحباً بك, {specialist.firstName}
                </h1>
                <p className="text-muted-foreground">
                  Орыдаушы тақта • {specialist.rating.toFixed(1)} ★ Рейтиг
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              {!specialist.telegramLinkedAt && (
                <Link href="/executor/telegram">
                  <Button variant="outline" className="gap-2">
                    <SlBell className="w-4 h-4" />
                    توصيل Telegram
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sexy-card"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <SlClock className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Күтуде</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="sexy-card"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <SlRocket className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">قيد التنفيذ</p>
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sexy-card"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <SlCheck className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Аяқтал</p>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="sexy-card"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <SlWallet className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Табыс</p>
                  <p className="text-2xl font-bold">${stats.totalEarnings}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Assignments */}
          <div className="sexy-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-display font-bold">Сіздің тапрмаларыңыз</h2>
              <span className="text-sm text-muted-foreground">
                {assignments.length} жалпы
              </span>
            </div>

            {assignments.length === 0 ? (
              <div className="text-center py-12">
                <SlBriefcase className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">Тапрмалар жоқ</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  جديد тапрмалар ода көрсетіледі
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {assignments.map((assignment, i) => (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => openTaskDrawer(assignment.id)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-display font-bold">
                            {assignment.request.task?.displayName || "Custom Task"}
                          </span>
                          <StatusBadge status={assignment.status} />
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {assignment.request.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Тапрыс беруші: {assignment.request.user.name || assignment.request.user.email}</span>
                          <span>•</span>
                          <span>${assignment.price.toFixed(0)} кредит</span>
                          {assignment.confidence && (
                            <>
                              <span>•</span>
                              <span className="text-primary">{Math.round(assignment.confidence * 100)}% сәйкестік</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        {assignment.status === "PENDING" && (
                          <Button
                            size="sm"
                            onClick={() => handleAccept(assignment.id)}
                            disabled={actionLoading === assignment.id}
                          >
                            {actionLoading === assignment.id ? "..." : "Қабылдау"}
                          </Button>
                        )}
                        {assignment.status === "ACCEPTED" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAccept(assignment.id)}
                            disabled={actionLoading === assignment.id}
                          >
                            {actionLoading === assignment.id ? "..." : "Жұмысты бастау"}
                          </Button>
                        )}
                        {assignment.status === "IN_PROGRESS" && (
                          <Button
                            size="sm"
                            onClick={() => handleComplete(assignment.id)}
                            disabled={actionLoading === assignment.id}
                            className="bg-emerald-500 hover:bg-emerald-600"
                          >
                            {actionLoading === assignment.id ? "..." : "Аяқтал деп белгілеу"}
                          </Button>
                        )}
                        {assignment.status === "COMPLETED" && (
                          <div className="flex items-center gap-1 text-emerald-500 text-sm">
                            <SlCheck className="w-4 h-4" />
                            مكتمل
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Telegram CTA */}
          {!specialist.telegramLinkedAt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 sexy-card bg-gradient-to-r from-primary/10 to-transparent border-primary/20"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-display font-bold mb-1">Хабарتمрулар үші توصيل Telegram</h3>
                  <p className="text-sm text-muted-foreground">
                    جديد тапрмалар таإلىйыдалإلىда жедел хабарتمрулар алыңыз жәе тапрмалар тікелей Telegram арқылы басқарыңыз.
                  </p>
                </div>
                <Link href="/executor/telegram">
                  <Button className="gap-2">
                    توصيل Telegram
                    <SlArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />

      {/* Task Detail Drawer */}
      <TaskDetailDrawer
        assignmentId={selectedAssignmentId}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        currentUserId={session.user.id}
        userRole="specialist"
        onStatusChange={fetchData}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    PENDING: { label: "Pending", className: "bg-amber-500/10 text-amber-500" },
    ACCEPTED: { label: "Accepted", className: "bg-blue-500/10 text-blue-500" },
    IN_PROGRESS: { label: "In Progress", className: "bg-purple-500/10 text-purple-500" },
    COMPLETED: { label: "Completed", className: "bg-emerald-500/10 text-emerald-500" },
    RATED: { label: "Rated", className: "bg-amber-500/10 text-amber-500" },
  };

  const { label, className } = config[status] || { label: status, className: "bg-muted" };

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${className}`}>
      {label}
    </span>
  );
}
