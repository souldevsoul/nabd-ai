"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskChat } from "@/components/task-chat";
import {
  SlClose,
  SlStar,
  SlClock,
  SlCheck,
  SlUser,
  SlRocket,
  SlBadge,
} from "react-icons/sl";
import { useTranslation } from "@/lib/i18n";

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

interface TaskDetailDrawerProps {
  assignmentId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: string;
  userRole: "buyer" | "specialist" | "admin";
  onStatusChange?: () => void;
}

const statusConfig: Record<string, { labelKey: string; color: string }> = {
  PENDING: { labelKey: "taskStatus.pending", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  ACCEPTED: { labelKey: "taskStatus.accepted", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  IN_PROGRESS: { labelKey: "taskStatus.inProgress", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  COMPLETED: { labelKey: "taskStatus.completed", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  RATED: { labelKey: "taskStatus.rated", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
};

export function TaskDetailDrawer({
  assignmentId,
  open,
  onOpenChange,
  currentUserId,
  userRole,
  onStatusChange,
}: TaskDetailDrawerProps) {
  const { t } = useTranslation();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canSend, setCanSend] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (open && assignmentId) {
      fetchAssignment();
    } else {
      setAssignment(null);
      setError(null);
    }
  }, [open, assignmentId]);

  const fetchAssignment = async () => {
    if (!assignmentId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/assignments/${assignmentId}`);
      if (res.ok) {
        const data = await res.json();
        setAssignment(data.assignment);
        setCanSend(data.access.canSend);
      } else if (res.status === 404) {
        setError(t("taskDetail.notFound"));
      } else {
        setError(t("taskDetail.loadFailed"));
      }
    } catch (err) {
      setError(t("taskDetail.loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: "accept" | "complete") => {
    if (!assignmentId) return;
    setActionLoading(true);

    try {
      const endpoint =
        action === "accept"
          ? `/api/executor/assignments/${assignmentId}/accept`
          : `/api/executor/assignments/${assignmentId}/complete`;

      const res = await fetch(endpoint, { method: "POST" });
      if (res.ok) {
        await fetchAssignment();
        onStatusChange?.();
      } else {
        const data = await res.json();
        alert(data.error || `Failed to ${action} task`);
      }
    } catch (err) {
      alert(`Failed to ${action} task`);
    } finally {
      setActionLoading(false);
    }
  };

  const status = assignment
    ? statusConfig[assignment.status] || statusConfig.PENDING
    : null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full w-full sm:max-w-[500px] md:max-w-[600px]">
        {/* Header */}
        <DrawerHeader className="border-b border-border">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <DrawerTitle className="text-xl font-display">
                {assignment?.request.task?.displayName || t("taskDetail.title")}
              </DrawerTitle>
              <DrawerDescription>
                {assignment?.request.task?.category || t("taskDetail.customTask")}
              </DrawerDescription>
            </div>
            <div className="flex items-center gap-2">
              {status && (
                <Badge variant="outline" className={status.color}>
                  {t(status.labelKey)}
                </Badge>
              )}
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" aria-label="Close drawer" onClick={() => {}}>
                  <SlClose className="w-4 h-4" />
                </Button>
              </DrawerClose>
            </div>
          </div>
        </DrawerHeader>

        {/* Content */}
        <ScrollArea className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button variant="outline" onClick={fetchAssignment}>
                {t("dashboard.retry")}
              </Button>
            </div>
          ) : assignment ? (
            <div className="p-4 space-y-6">
              {/* Specialist info (for buyer/admin) */}
              {(userRole === "buyer" || userRole === "admin") && (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                  <img
                    src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${assignment.specialist.avatarSeed}`}
                    alt={assignment.specialist.firstName}
                    className="w-14 h-14 rounded-full bg-muted"
                  />
                  <div className="flex-1">
                    <h3 className="font-display font-bold">
                      {assignment.specialist.firstName}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1 text-amber-500">
                        <SlStar className="w-3 h-3 fill-current" />
                        {assignment.specialist.rating.toFixed(1)}
                      </span>
                      <span className="flex items-center gap-1">
                        <SlCheck className="w-3 h-3" />
                        {assignment.specialist.completedTasks} {t("taskDetail.completed")}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      ${assignment.price}
                    </div>
                    {assignment.confidence && (
                      <div className="text-xs text-muted-foreground">
                        {Math.round(assignment.confidence * 100)}% {t("taskDetail.match")}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Client info (for specialist/admin) */}
              {(userRole === "specialist" || userRole === "admin") && (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <SlUser className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold">
                      {assignment.request.user.name || t("taskDetail.client")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {assignment.request.user.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      ${assignment.price}
                    </div>
                  </div>
                </div>
              )}

              {/* Task description */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {t("taskDetail.description")}
                </h3>
                <p className="text-sm whitespace-pre-wrap">
                  {assignment.request.description}
                </p>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  {t("taskDetail.timeline")}
                </h3>
                <div className="space-y-2">
                  <TimelineItem
                    icon={<SlClock className="w-3 h-3" />}
                    label={t("taskDetail.created")}
                    date={assignment.createdAt}
                    completed
                  />
                  <TimelineItem
                    icon={<SlRocket className="w-3 h-3" />}
                    label={t("taskDetail.started")}
                    date={assignment.startedAt}
                    completed={!!assignment.startedAt}
                  />
                  <TimelineItem
                    icon={<SlBadge className="w-3 h-3" />}
                    label={t("taskDetail.completedLabel")}
                    date={assignment.completedAt}
                    completed={!!assignment.completedAt}
                  />
                </div>
              </div>

              {/* Action buttons (for specialist) */}
              {userRole === "specialist" && (
                <div className="flex gap-2">
                  {assignment.status === "PENDING" && (
                    <Button
                      onClick={() => handleAction("accept")}
                      disabled={actionLoading}
                      className="flex-1"
                    >
                      {actionLoading ? t("request.processing") : t("taskDetail.acceptTask")}
                    </Button>
                  )}
                  {assignment.status === "ACCEPTED" && (
                    <Button
                      onClick={() => handleAction("accept")}
                      disabled={actionLoading}
                      className="flex-1"
                    >
                      {actionLoading ? t("request.processing") : t("taskDetail.startWork")}
                    </Button>
                  )}
                  {assignment.status === "IN_PROGRESS" && (
                    <Button
                      onClick={() => handleAction("complete")}
                      disabled={actionLoading}
                      className="flex-1"
                    >
                      {actionLoading ? t("request.processing") : t("taskDetail.markComplete")}
                    </Button>
                  )}
                </div>
              )}

              {/* Chat section */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  {t("taskDetail.chat")}
                </h3>
                <TaskChat
                  assignmentId={assignment.id}
                  currentUserId={currentUserId}
                  canSend={canSend}
                  initialMessages={assignment.messages}
                  specialistName={
                    userRole === "buyer"
                      ? assignment.specialist.firstName
                      : assignment.request.user.name || t("taskDetail.client")
                  }
                />
              </div>
            </div>
          ) : null}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}

function TimelineItem({
  icon,
  label,
  date,
  completed,
}: {
  icon: React.ReactNode;
  label: string;
  date: string | null;
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center ${
          completed
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">{label}</div>
      </div>
      {date && (
        <div className="text-xs text-muted-foreground">
          {new Date(date).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
