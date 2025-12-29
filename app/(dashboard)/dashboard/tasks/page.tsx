"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TaskDetailDrawer } from "@/components/task-detail-drawer";
import {
  TbRocket,
  TbClock,
  TbCheck,
  TbUser,
  TbPlus,
  TbLoader2,
  TbLayoutKanban,
  TbList,
  TbFlame,
  TbPlayerPlay,
} from "react-icons/tb";
import { SlStar, SlRefresh } from "react-icons/sl";

interface TaskAssignment {
  id: string;
  status: string;
  price: number;
  confidence: number | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  specialist: {
    id: string;
    firstName: string;
    avatarSeed: string;
    rating: number;
  };
  request: {
    id: string;
    description: string;
    task: {
      id: string;
      displayName: string;
      category: string;
    } | null;
  };
}

type ViewMode = "kanban" | "list";

const statusColumns = [
  {
    id: "pending",
    title: "قيد الانتظار",
    statuses: ["PENDING", "ACCEPTED"],
    icon: TbClock,
    color: "bg-pink-500",
    lightColor: "bg-amber-50 border-amber-200",
    textColor: "text-pink-600",
  },
  {
    id: "in_progress",
    title: "قيد التنفيذ",
    statuses: ["IN_PROGRESS"],
    icon: TbPlayerPlay,
    color: "bg-blue-500",
    lightColor: "bg-blue-50 border-blue-200",
    textColor: "text-blue-600",
  },
  {
    id: "completed",
    title: "مكتمل",
    statuses: ["COMPLETED", "RATED"],
    icon: TbCheck,
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50 border-emerald-200",
    textColor: "text-emerald-600",
  },
];

export default function TasksBoardPage() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<TaskAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/dashboard/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const openTaskDrawer = (taskId: string) => {
    setSelectedTaskId(taskId);
    setDrawerOpen(true);
  };

  const getTasksByStatus = (statuses: string[]) => {
    return tasks.filter((task) => statuses.includes(task.status));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-rose-50/30">
        <TbLoader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-slate-50 via-white to-rose-50/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <TbFlame className="w-10 h-10 text-rose-500" />
            <div>
              <h1 className="text-3xl font-display font-bold uppercase text-slate-900">
                لوحة المهام
              </h1>
              <p className="text-slate-600">
                تتبع وإدارة مشاريعك النشطة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("kanban")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "kanban"
                    ? "bg-white shadow-sm text-rose-500"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <TbLayoutKanban size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-rose-500"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <TbList size={20} />
              </button>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={fetchTasks}
              className="border-slate-300"
            >
              <SlRefresh className="w-4 h-4" />
            </Button>

            <Link href="/request">
              <Button className="gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-lg shadow-rose-500/25">
                <TbPlus size={18} />
                مشروع جديد
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {statusColumns.map((col) => {
            const count = getTasksByStatus(col.statuses).length;
            return (
              <div
                key={col.id}
                className={`p-4 rounded-xl border-2 ${col.lightColor}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${col.color} flex items-center justify-center text-white`}>
                    <col.icon size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{count}</div>
                    <div className={`text-sm font-medium ${col.textColor}`}>{col.title}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {tasks.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-100 flex items-center justify-center">
              <TbRocket className="w-10 h-10 text-rose-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">لا توجد مشاريع بعد</h2>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Start your first project by finding an expert to help you build something amazing.
            </p>
            <Link href="/request">
              <Button className="gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-lg shadow-rose-500/25">
                <TbRocket size={18} />
                بدء المشروع الأول
              </Button>
            </Link>
          </motion.div>
        ) : viewMode === "kanban" ? (
          /* Kanban View */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statusColumns.map((column) => {
              const columnTasks = getTasksByStatus(column.statuses);
              return (
                <div key={column.id} className="flex flex-col">
                  {/* Column header */}
                  <div className={`flex items-center gap-2 p-3 rounded-t-xl border-2 border-b-0 ${column.lightColor}`}>
                    <div className={`w-6 h-6 rounded-md ${column.color} flex items-center justify-center text-white`}>
                      <column.icon size={14} />
                    </div>
                    <span className={`font-bold text-sm uppercase tracking-wider ${column.textColor}`}>
                      {column.title}
                    </span>
                    <Badge variant="secondary" className="ml-auto bg-white">
                      {columnTasks.length}
                    </Badge>
                  </div>

                  {/* Column content */}
                  <div className="flex-1 bg-slate-50 border-2 border-t-0 border-slate-200 rounded-b-xl p-3 space-y-3 min-h-[400px]">
                    {columnTasks.length === 0 ? (
                      <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
                        لا توجد مهام
                      </div>
                    ) : (
                      columnTasks.map((task, index) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => openTaskDrawer(task.id)}
                          className="bg-white rounded-xl border-2 border-slate-200 p-4 cursor-pointer hover:border-rose-400 hover:shadow-md transition-all"
                        >
                          {/* Task title */}
                          <h3 className="font-bold text-slate-900 mb-2 line-clamp-1">
                            {task.request.task?.displayName || "Custom Task"}
                          </h3>

                          {/* Description preview */}
                          <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                            {task.request.description}
                          </p>

                          {/* Specialist */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center">
                              <TbUser size={14} className="text-rose-500" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">
                              {task.specialist.firstName}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-pink-500">
                              <SlStar size={10} className="fill-current" />
                              {task.specialist.rating.toFixed(1)}
                            </span>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>{formatDate(task.createdAt)}</span>
                            <span className="font-medium text-rose-500">
                              {Math.round(task.price)} cr
                            </span>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b-2 border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Specialist
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Credits
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map((task) => {
                  const column = statusColumns.find((c) =>
                    c.statuses.includes(task.status)
                  );
                  return (
                    <tr
                      key={task.id}
                      onClick={() => openTaskDrawer(task.id)}
                      className="hover:bg-rose-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">
                          {task.request.task?.displayName || "Custom Task"}
                        </div>
                        <div className="text-sm text-slate-500 line-clamp-1">
                          {task.request.description}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                            <TbUser size={16} className="text-rose-500" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">
                              {task.specialist.firstName}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-pink-500">
                              <SlStar size={10} className="fill-current" />
                              {task.specialist.rating.toFixed(1)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={`${column?.lightColor} ${column?.textColor} border`}
                        >
                          {column?.title}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-rose-500">
                          {Math.round(task.price)} cr
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {formatDate(task.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Task Detail Drawer */}
      {session?.user?.id && (
        <TaskDetailDrawer
          assignmentId={selectedTaskId}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          currentUserId={session.user.id}
          userRole="buyer"
          onStatusChange={fetchTasks}
        />
      )}
    </div>
  );
}
