"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { TaskDetailDrawer } from "@/components/task-detail-drawer";
import {
  SlBulb,
  SlClock,
  SlCheck,
  SlRocket,
  SlStar,
} from "react-icons/sl";

interface Assignment {
  id: string;
  status: string;
  price: number;
  confidence: number | null;
  rating: number | null;
  specialist: {
    firstName: string;
    avatarSeed: string;
    hourlyRate: number;
  };
  request: {
    description: string;
    user: {
      name: string | null;
      email: string;
    };
    task: {
      displayName: string;
    } | null;
  };
}

interface Stats {
  pending: number;
  accepted: number;
  inProgress: number;
  completed: number;
  avgRating: number | null;
}

const statusConfig = {
  PENDING: {
    label: "Pending",
    icon: SlClock,
    color: "text-amber-500 bg-amber-500/10",
  },
  ACCEPTED: {
    label: "Accepted",
    icon: SlCheck,
    color: "text-blue-500 bg-blue-500/10",
  },
  IN_PROGRESS: {
    label: "In Progress",
    icon: SlRocket,
    color: "text-purple-500 bg-purple-500/10",
  },
  COMPLETED: {
    label: "Completed",
    icon: SlCheck,
    color: "text-emerald-500 bg-emerald-500/10",
  },
  RATED: {
    label: "Rated",
    icon: SlStar,
    color: "text-amber-500 bg-amber-500/10",
  },
};

export default function AssignmentsPage() {
  const { data: session } = useSession();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/assignments");
      if (res.ok) {
        const data = await res.json();
        setAssignments(data.assignments);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const openTaskDrawer = (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId);
    setDrawerOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Assignments</h1>
            <p className="text-slate-500 mt-1">Track specialist task assignments</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 animate-pulse">
              <div className="h-4 w-24 bg-slate-800 rounded mb-2" />
              <div className="h-8 w-16 bg-slate-800 rounded" />
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Assignments</h1>
          <p className="text-slate-500 mt-1">Track specialist task assignments</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
            <p className="text-sm text-slate-500 mb-1">Pending</p>
            <div className="flex items-center gap-2">
              <SlClock className="w-5 h-5 text-amber-500" />
              <span className="text-2xl font-bold text-white">{stats.pending}</span>
            </div>
          </div>
          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-6">
            <p className="text-sm text-slate-500 mb-1">Accepted</p>
            <div className="flex items-center gap-2">
              <SlCheck className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold text-white">{stats.accepted}</span>
            </div>
          </div>
          <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-6">
            <p className="text-sm text-slate-500 mb-1">In Progress</p>
            <div className="flex items-center gap-2">
              <SlRocket className="w-5 h-5 text-purple-500" />
              <span className="text-2xl font-bold text-white">{stats.inProgress}</span>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
            <p className="text-sm text-slate-500 mb-1">Completed</p>
            <div className="flex items-center gap-2">
              <SlCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-2xl font-bold text-white">{stats.completed}</span>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <p className="text-sm text-slate-500 mb-1">Avg. Rating</p>
            <div className="flex items-center gap-2">
              <SlStar className="w-5 h-5 text-amber-500" />
              <span className="text-2xl font-bold text-white">
                {stats.avgRating?.toFixed(1) || "N/A"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-white">All Assignments</h3>
          <span className="text-sm text-slate-500">{assignments.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Specialist
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {assignments.map((assignment) => {
                const status = statusConfig[assignment.status as keyof typeof statusConfig];
                const StatusIcon = status?.icon || SlBulb;
                return (
                  <tr
                    key={assignment.id}
                    className="hover:bg-slate-800/30 transition-colors cursor-pointer"
                    onClick={() => openTaskDrawer(assignment.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${assignment.specialist.avatarSeed}`}
                          alt={assignment.specialist.firstName}
                          className="w-10 h-10 rounded-full bg-slate-800"
                        />
                        <div>
                          <p className="font-medium text-white">{assignment.specialist.firstName}</p>
                          <p className="text-xs text-slate-500">
                            ${assignment.specialist.hourlyRate}/hr
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-white">
                          {assignment.request.task?.displayName || "Custom Task"}
                        </p>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {assignment.request.description.substring(0, 40)}...
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            {assignment.request.user.name?.[0] || assignment.request.user.email[0].toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-white">
                          {assignment.request.user.name || assignment.request.user.email.split("@")[0]}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status?.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status?.label || assignment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {assignment.confidence ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-500 rounded-full"
                              style={{ width: `${assignment.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-amber-500 font-medium">
                            {Math.round(assignment.confidence * 100)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">
                        ${assignment.price.toFixed(0)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {assignment.rating ? (
                        <div className="flex items-center gap-1">
                          <SlStar className="w-4 h-4 text-amber-500" />
                          <span className="text-white">{assignment.rating.toFixed(1)}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {assignments.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No assignments yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Detail Drawer */}
      {session?.user?.id && (
        <TaskDetailDrawer
          assignmentId={selectedAssignmentId}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          currentUserId={session.user.id}
          userRole="admin"
          onStatusChange={fetchData}
        />
      )}
    </div>
  );
}
