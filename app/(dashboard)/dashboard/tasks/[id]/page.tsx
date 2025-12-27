"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TaskChat } from "@/components/task-chat";
import {
  SlArrowLeft,
  SlStar,
  SlClock,
  SlCheck,
  SlUser,
} from "react-icons/sl";

interface Assignment {
  id: string;
  createdAt: string;
  status: string;
  price: number;
  confidence: number | null;
  startedAt: string | null;
  completedAt: string | null;
  request: {
    id: string;
    description: string;
    status: string;
    user: {
      id: string;
      name: string | null;
      email: string;
    };
    task: {
      id: string;
      displayName: string;
      category: string;
    } | null;
  };
  specialist: {
    id: string;
    firstName: string;
    avatarSeed: string;
    rating: number;
    bio: string | null;
    completedTasks: number;
  };
  messages: Array<{
    id: string;
    createdAt: string;
    content: string;
    senderRole: string;
    sender: {
      id: string;
      name: string | null;
      image: string | null;
    };
  }>;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "bg-amber-500/10 text-amber-500" },
  ACCEPTED: { label: "Accepted", color: "bg-blue-500/10 text-blue-500" },
  IN_PROGRESS: { label: "In Progress", color: "bg-purple-500/10 text-purple-500" },
  COMPLETED: { label: "Completed", color: "bg-emerald-500/10 text-emerald-500" },
  RATED: { label: "Rated", color: "bg-emerald-500/10 text-emerald-500" },
};

export default function BuyerTaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session, status: authStatus } = useSession();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canSend, setCanSend] = useState(false);

  useEffect(() => {
    if (authStatus === "authenticated") {
      fetchAssignment();
    }
  }, [authStatus, id]);

  const fetchAssignment = async () => {
    try {
      const res = await fetch(`/api/assignments/${id}`);
      if (res.ok) {
        const data = await res.json();
        setAssignment(data.assignment);
        setCanSend(data.access.canSend);
      } else if (res.status === 404) {
        setError("Task not found");
      } else {
        setError("Failed to load task");
      }
    } catch (err) {
      setError("Failed to load task");
    } finally {
      setLoading(false);
    }
  };

  if (authStatus === "loading" || loading) {
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
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-3xl font-display font-bold mb-4">Кіру қажет</h1>
            <p className="text-muted-foreground mb-8">Бұл тапсырманы көру үшін кіріңіз.</p>
            <Link href="/login">
              <Button>Кіру</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-3xl font-display font-bold mb-4">
              {error || "Task Not Found"}
            </h1>
            <Link href="/dashboard">
              <Button>Басқару тақтасына оралу</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const status = statusConfig[assignment.status] || statusConfig.PENDING;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-4">
          {/* Back link */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <SlArrowLeft className="w-4 h-4" />
            Басқару тақтасына оралу
          </Link>

          <div className="grid lg:grid-cols-[1fr,320px] gap-6">
            {/* Main content */}
            <div className="space-y-6">
              {/* Task header */}
              <div className="sexy-card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-display font-bold">
                      {assignment.request.task?.displayName || "Custom Task"}
                    </h1>
                    {assignment.request.task?.category && (
                      <p className="text-muted-foreground">
                        {assignment.request.task.category}
                      </p>
                    )}
                  </div>
                  <Badge className={status.color}>{status.label}</Badge>
                </div>

                <div className="prose prose-sm max-w-none">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Тапсырма сипаттамасы
                  </h3>
                  <p className="text-foreground whitespace-pre-wrap">
                    {assignment.request.description}
                  </p>
                </div>

                <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-2">
                    <SlClock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Created {new Date(assignment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-primary">
                    ${assignment.price}
                  </div>
                </div>
              </div>

              {/* Chat section */}
              <div className="sexy-card">
                <h2 className="text-lg font-display font-bold mb-4">
                  Әңгіме
                </h2>
                <TaskChat
                  assignmentId={assignment.id}
                  currentUserId={session.user.id}
                  canSend={canSend}
                  initialMessages={assignment.messages}
                  specialistName={assignment.specialist.firstName}
                />
              </div>
            </div>

            {/* Sidebar - Specialist info */}
            <div className="space-y-6">
              <div className="sexy-card">
                <h2 className="text-sm font-medium text-muted-foreground mb-4">
                  Тағайындалған маман
                </h2>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${assignment.specialist.avatarSeed}`}
                    alt={assignment.specialist.firstName}
                    className="w-16 h-16 rounded-full bg-muted"
                  />
                  <div>
                    <h3 className="font-display font-bold text-lg">
                      {assignment.specialist.firstName}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-500">
                      <SlStar className="w-4 h-4 fill-current" />
                      <span className="font-medium">
                        {assignment.specialist.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {assignment.specialist.bio && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {assignment.specialist.bio}
                  </p>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <SlCheck className="w-4 h-4" />
                  <span>{assignment.specialist.completedTasks} тапсырма аяқталды</span>
                </div>

                {assignment.confidence && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="text-xs text-muted-foreground mb-1">
                      AI сәйкестік сенімділігі
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${assignment.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {Math.round(assignment.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Status timeline */}
              <div className="sexy-card">
                <h2 className="text-sm font-medium text-muted-foreground mb-4">
                  Уақыт желісі
                </h2>
                <div className="space-y-3">
                  <TimelineItem
                    label="Құрылды"
                    date={assignment.createdAt}
                    completed
                  />
                  <TimelineItem
                    label="Басталды"
                    date={assignment.startedAt}
                    completed={!!assignment.startedAt}
                  />
                  <TimelineItem
                    label="Аяқталды"
                    date={assignment.completedAt}
                    completed={!!assignment.completedAt}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function TimelineItem({
  label,
  date,
  completed,
}: {
  label: string;
  date: string | null;
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-3 h-3 rounded-full ${
          completed ? "bg-primary" : "bg-muted"
        }`}
      />
      <div className="flex-1">
        <div className="text-sm font-medium">{label}</div>
        {date && (
          <div className="text-xs text-muted-foreground">
            {new Date(date).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}
