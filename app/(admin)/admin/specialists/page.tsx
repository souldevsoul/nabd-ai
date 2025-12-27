import { db } from "@/lib/db";
import { Suspense } from "react";
import {
  SlPeople,
  SlCheck,
  SlClose,
  SlStar,
  SlBriefcase,
} from "react-icons/sl";

async function getSpecialists() {
  const specialists = await db.specialist.findMany({
    orderBy: { rating: "desc" },
    include: {
      tasks: {
        include: { task: true },
      },
      assignments: {
        where: { status: "COMPLETED" },
      },
    },
  });

  return specialists;
}

async function SpecialistsTable() {
  const specialists = await getSpecialists();

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-slate-800">
        <h3 className="text-lg font-semibold text-white">All Specialists</h3>
        <span className="text-sm text-slate-500">{specialists.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Specialist
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Skills
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Rate
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tasks
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {specialists.map((specialist) => (
              <tr
                key={specialist.id}
                className="hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${specialist.avatarSeed}`}
                      alt={specialist.firstName}
                      className="w-10 h-10 rounded-full bg-slate-800"
                    />
                    <div>
                      <p className="font-medium text-white">{specialist.firstName}</p>
                      <p className="text-sm text-slate-500 line-clamp-1">
                        {specialist.bio?.substring(0, 50) || "No bio"}...
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {specialist.tasks.slice(0, 3).map((st) => (
                      <span
                        key={st.id}
                        className="px-2 py-0.5 text-xs bg-slate-800 text-slate-300 rounded-full"
                      >
                        {st.task.displayName}
                      </span>
                    ))}
                    {specialist.tasks.length > 3 && (
                      <span className="px-2 py-0.5 text-xs bg-slate-800 text-slate-500 rounded-full">
                        +{specialist.tasks.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-white font-medium">
                    ${specialist.hourlyRate}/hr
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <SlStar className="w-4 h-4 text-amber-500" />
                    <span className="text-white">{specialist.rating.toFixed(1)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <SlBriefcase className="w-4 h-4 text-slate-500" />
                    <span className="text-white">{specialist.completedTasks}</span>
                    <span className="text-slate-500">/ {specialist.totalTasks}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {specialist.isAvailable ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium">
                      <SlCheck className="w-3 h-3" />
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-medium">
                      <SlClose className="w-3 h-3" />
                      Unavailable
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {specialists.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  No specialists found. Add specialists to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SpecialistsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Specialists</h1>
          <p className="text-slate-500 mt-1">Manage AI specialists and their skills</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Suspense fallback={<StatSkeleton />}>
          <SpecialistStats />
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
        <SpecialistsTable />
      </Suspense>
    </div>
  );
}

function StatSkeleton() {
  return (
    <>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 animate-pulse">
          <div className="h-4 w-24 bg-slate-800 rounded mb-2" />
          <div className="h-8 w-16 bg-slate-800 rounded" />
        </div>
      ))}
    </>
  );
}

async function SpecialistStats() {
  const [total, active, avgRating, topPerformer] = await Promise.all([
    db.specialist.count(),
    db.specialist.count({ where: { isAvailable: true } }),
    db.specialist.aggregate({ _avg: { rating: true } }),
    db.specialist.findFirst({ orderBy: { completedTasks: "desc" } }),
  ]);

  return (
    <>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <p className="text-sm text-slate-500 mb-1">Total Specialists</p>
        <div className="flex items-center gap-2">
          <SlPeople className="w-5 h-5 text-slate-400" />
          <span className="text-2xl font-bold text-white">{total}</span>
        </div>
      </div>
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
        <p className="text-sm text-slate-500 mb-1">Active Now</p>
        <div className="flex items-center gap-2">
          <SlCheck className="w-5 h-5 text-emerald-500" />
          <span className="text-2xl font-bold text-white">{active}</span>
        </div>
      </div>
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
        <p className="text-sm text-slate-500 mb-1">Avg. Rating</p>
        <div className="flex items-center gap-2">
          <SlStar className="w-5 h-5 text-amber-500" />
          <span className="text-2xl font-bold text-white">
            {avgRating._avg.rating?.toFixed(1) || "N/A"}
          </span>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <p className="text-sm text-slate-500 mb-1">Top Performer</p>
        <div className="flex items-center gap-2">
          <SlBriefcase className="w-5 h-5 text-slate-400" />
          <span className="text-lg font-bold text-white truncate">
            {topPerformer?.firstName || "N/A"}
          </span>
        </div>
      </div>
    </>
  );
}
