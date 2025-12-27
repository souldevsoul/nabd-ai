import { db } from "@/lib/db";
import { Suspense } from "react";
import Link from "next/link";
import {
  SlPeople,
  SlDoc,
  SlGraph,
  SlClock,
  SlCheck,
  SlExclamation,
  SlBulb,
  SlRocket,
  SlBadge,
} from "react-icons/sl";

async function getStats() {
  const [
    totalSpecialists,
    activeSpecialists,
    totalTasks,
    pendingRequests,
    matchedRequests,
    inProgressRequests,
    completedRequests,
    totalUsers,
    totalBuyers,
    recentRequests,
    recentAssignments,
  ] = await Promise.all([
    db.specialist.count(),
    db.specialist.count({ where: { isAvailable: true } }),
    db.task.count(),
    db.taskRequest.count({ where: { status: "PENDING" } }),
    db.taskRequest.count({ where: { status: "MATCHED" } }),
    db.taskRequest.count({ where: { status: "IN_PROGRESS" } }),
    db.taskRequest.count({ where: { status: "COMPLETED" } }),
    db.user.count(),
    db.user.count({ where: { roles: { has: "BUYER" } } }),
    db.taskRequest.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true, task: true },
    }),
    db.taskAssignment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { specialist: true, request: { include: { user: true } } },
    }),
  ]);

  return {
    totalSpecialists,
    activeSpecialists,
    totalTasks,
    pendingRequests,
    matchedRequests,
    inProgressRequests,
    completedRequests,
    totalUsers,
    totalBuyers,
    recentRequests,
    recentAssignments,
  };
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  variant = "default",
}: {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: number;
  trendLabel?: string;
  variant?: "default" | "warning" | "success" | "danger";
}) {
  const variantStyles = {
    default: "border-slate-800 bg-slate-900/50",
    warning: "border-amber-500/30 bg-amber-500/5",
    success: "border-emerald-500/30 bg-emerald-500/5",
    danger: "border-red-500/30 bg-red-500/5",
  };

  const iconStyles = {
    default: "text-slate-400",
    warning: "text-amber-500",
    success: "text-emerald-500",
    danger: "text-red-500",
  };

  return (
    <div className={`rounded-2xl border p-6 ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <SlGraph className={`w-4 h-4 ${trend >= 0 ? "text-emerald-500" : "text-red-500"}`} />
              <span className={`text-sm ${trend >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                {trend >= 0 ? "+" : ""}{trend}%
              </span>
              {trendLabel && <span className="text-xs text-slate-500 ml-1">{trendLabel}</span>}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-slate-800/50 ${iconStyles[variant]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

function ActivityItem({
  type,
  title,
  description,
  time,
  status,
}: {
  type: "request" | "assignment" | "specialist";
  title: string;
  description: string;
  time: string;
  status?: "pending" | "matched" | "in_progress" | "completed";
}) {
  const icons = {
    request: SlDoc,
    assignment: SlBulb,
    specialist: SlPeople,
  };
  const Icon = icons[type];

  const statusColors = {
    pending: "text-amber-500 bg-amber-500/10",
    matched: "text-blue-500 bg-blue-500/10",
    in_progress: "text-purple-500 bg-purple-500/10",
    completed: "text-emerald-500 bg-emerald-500/10",
  };

  const statusIcons = {
    pending: SlClock,
    matched: SlBadge,
    in_progress: SlRocket,
    completed: SlCheck,
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-800/30 transition-colors">
      <div className="p-2 rounded-lg bg-slate-800/50 text-slate-400">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate">{title}</p>
        <p className="text-sm text-slate-500 truncate">{description}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs text-slate-500">{time}</span>
        {status && (
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${statusColors[status]}`}>
            {(() => {
              const StatusIcon = statusIcons[status];
              return <StatusIcon className="w-3 h-3" />;
            })()}
            <span className="text-xs capitalize">{status.replace("_", " ")}</span>
          </div>
        )}
      </div>
    </div>
  );
}

async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/20 p-8">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome back, Admin
          </h2>
          <p className="text-slate-400 max-w-lg">
            You have <span className="text-amber-500 font-semibold">{stats.pendingRequests} task requests</span> pending AI matching
            and <span className="text-amber-500 font-semibold">{stats.inProgressRequests} tasks</span> currently in progress.
          </p>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
          <SlBulb className="w-32 h-32 text-amber-500" />
        </div>
      </div>

      {/* Stats Grid - Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon={SlClock}
          variant="warning"
        />
        <StatCard
          title="Matched (Awaiting Payment)"
          value={stats.matchedRequests}
          icon={SlBadge}
        />
        <StatCard
          title="In Progress"
          value={stats.inProgressRequests}
          icon={SlRocket}
          variant="success"
        />
        <StatCard
          title="Completed"
          value={stats.completedRequests}
          icon={SlCheck}
          variant="success"
        />
      </div>

      {/* Stats Grid - Specialists & Users */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Specialists"
          value={stats.totalSpecialists}
          icon={SlPeople}
        />
        <StatCard
          title="Active Specialists"
          value={stats.activeSpecialists}
          icon={SlPeople}
          variant="success"
        />
        <StatCard
          title="Task Types"
          value={stats.totalTasks}
          icon={SlDoc}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={SlPeople}
        />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Task Requests */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-800">
            <h3 className="text-lg font-semibold text-white">Recent Task Requests</h3>
            <Link
              href="/admin/requests"
              className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-zinc-800/50">
            {stats.recentRequests.length > 0 ? (
              stats.recentRequests.map((request) => (
                <ActivityItem
                  key={request.id}
                  type="request"
                  title={request.task?.displayName || "Task Request"}
                  description={`By ${request.user.name || request.user.email} • ${request.description.substring(0, 50)}...`}
                  time={new Date(request.createdAt).toLocaleDateString()}
                  status={
                    request.status === "PENDING"
                      ? "pending"
                      : request.status === "MATCHED"
                      ? "matched"
                      : request.status === "IN_PROGRESS"
                      ? "in_progress"
                      : "completed"
                  }
                />
              ))
            ) : (
              <div className="p-6 text-center text-slate-500">
                No task requests yet
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/admin/specialists"
              className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
            >
              <SlPeople className="w-5 h-5" />
              <div>
                <p className="font-medium">Manage Specialists</p>
                <p className="text-xs text-emerald-500/70">{stats.activeSpecialists} active</p>
              </div>
            </Link>
            <Link
              href="/admin/requests?status=pending"
              className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500/20 transition-colors"
            >
              <SlExclamation className="w-5 h-5" />
              <div>
                <p className="font-medium">Pending Requests</p>
                <p className="text-xs text-amber-500/70">{stats.pendingRequests} awaiting match</p>
              </div>
            </Link>
            <Link
              href="/admin/assignments"
              className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white hover:bg-slate-800 transition-colors"
            >
              <SlBulb className="w-5 h-5" />
              <div>
                <p className="font-medium">View Assignments</p>
                <p className="text-xs text-slate-500">{stats.inProgressRequests} in progress</p>
              </div>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white hover:bg-slate-800 transition-colors"
            >
              <SlPeople className="w-5 h-5" />
              <div>
                <p className="font-medium">Manage Users</p>
                <p className="text-xs text-slate-500">{stats.totalUsers} total users</p>
              </div>
            </Link>
          </div>

          {/* Recent Assignments */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <h4 className="text-sm text-slate-500 uppercase tracking-wider mb-3">Recent Assignments</h4>
            <div className="space-y-2">
              {stats.recentAssignments.slice(0, 3).map((assignment) => (
                <div key={assignment.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-black">
                      {assignment.specialist.firstName[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{assignment.specialist.firstName}</p>
                    <p className="text-xs text-slate-500 capitalize">{assignment.status.toLowerCase().replace("_", " ")}</p>
                  </div>
                  {assignment.confidence && (
                    <span className="text-xs text-amber-500 font-medium">
                      {Math.round(assignment.confidence * 100)}%
                    </span>
                  )}
                </div>
              ))}
              {stats.recentAssignments.length === 0 && (
                <p className="text-sm text-slate-500">No assignments yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[50vh]">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AdminDashboard />
    </Suspense>
  );
}
