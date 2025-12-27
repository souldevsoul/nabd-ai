import { db } from "@/lib/db";
import { Suspense } from "react";
import Link from "next/link";
import {
  SlDoc,
  SlClock,
  SlCheck,
  SlRocket,
  SlBadge,
  SlClose,
  SlPeople,
} from "react-icons/sl";

async function getRequests() {
  const requests = await db.taskRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      task: true,
      assignments: {
        include: { specialist: true },
      },
    },
  });

  return requests;
}

const statusConfig = {
  PENDING: {
    label: "Pending",
    icon: SlClock,
    color: "text-amber-500 bg-amber-500/10",
  },
  MATCHED: {
    label: "Matched",
    icon: SlBadge,
    color: "text-blue-500 bg-blue-500/10",
  },
  PAID: {
    label: "Paid",
    icon: SlCheck,
    color: "text-emerald-500 bg-emerald-500/10",
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
  CANCELLED: {
    label: "Cancelled",
    icon: SlClose,
    color: "text-red-500 bg-red-500/10",
  },
};

async function RequestsTable() {
  const requests = await getRequests();

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-slate-800">
        <h3 className="text-lg font-semibold text-white">All Task Requests</h3>
        <span className="text-sm text-slate-500">{requests.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Request
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                User
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Task Type
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Matches
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {requests.map((request) => {
              const status = statusConfig[request.status as keyof typeof statusConfig];
              const StatusIcon = status?.icon || SlDoc;
              return (
                <tr
                  key={request.id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="font-medium text-white line-clamp-1">
                        {request.description.substring(0, 60)}...
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        ID: {request.id.substring(0, 8)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {request.user.name?.[0] || request.user.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-white">{request.user.name || "Anonymous"}</p>
                        <p className="text-xs text-slate-500">{request.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {request.task ? (
                      <span className="px-2 py-1 text-xs bg-slate-800 text-slate-300 rounded-full">
                        {request.task.displayName}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-sm">Not matched</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status?.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status?.label || request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <SlPeople className="w-4 h-4 text-slate-500" />
                      <span className="text-white">{request.assignments.length}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              );
            })}
            {requests.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  No task requests yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function RequestsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Task Requests</h1>
          <p className="text-slate-500 mt-1">View and manage incoming task requests</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Suspense fallback={<StatSkeleton />}>
          <RequestStats />
        </Suspense>
      </div>

      {/* Table */}
      <Suspense
        fallback={
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <RequestsTable />
      </Suspense>
    </div>
  );
}

function StatSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 animate-pulse">
          <div className="h-4 w-24 bg-slate-800 rounded mb-2" />
          <div className="h-8 w-16 bg-slate-800 rounded" />
        </div>
      ))}
    </>
  );
}

async function RequestStats() {
  const [pending, matched, inProgress, completed, cancelled] = await Promise.all([
    db.taskRequest.count({ where: { status: "PENDING" } }),
    db.taskRequest.count({ where: { status: "MATCHED" } }),
    db.taskRequest.count({ where: { status: "IN_PROGRESS" } }),
    db.taskRequest.count({ where: { status: "COMPLETED" } }),
    db.taskRequest.count({ where: { status: "CANCELLED" } }),
  ]);

  return (
    <>
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
        <p className="text-sm text-slate-500 mb-1">Pending</p>
        <div className="flex items-center gap-2">
          <SlClock className="w-5 h-5 text-amber-500" />
          <span className="text-2xl font-bold text-white">{pending}</span>
        </div>
      </div>
      <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-6">
        <p className="text-sm text-slate-500 mb-1">Matched</p>
        <div className="flex items-center gap-2">
          <SlBadge className="w-5 h-5 text-blue-500" />
          <span className="text-2xl font-bold text-white">{matched}</span>
        </div>
      </div>
      <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-6">
        <p className="text-sm text-slate-500 mb-1">In Progress</p>
        <div className="flex items-center gap-2">
          <SlRocket className="w-5 h-5 text-purple-500" />
          <span className="text-2xl font-bold text-white">{inProgress}</span>
        </div>
      </div>
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
        <p className="text-sm text-slate-500 mb-1">Completed</p>
        <div className="flex items-center gap-2">
          <SlCheck className="w-5 h-5 text-emerald-500" />
          <span className="text-2xl font-bold text-white">{completed}</span>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <p className="text-sm text-slate-500 mb-1">Cancelled</p>
        <div className="flex items-center gap-2">
          <SlClose className="w-5 h-5 text-slate-500" />
          <span className="text-2xl font-bold text-white">{cancelled}</span>
        </div>
      </div>
    </>
  );
}
