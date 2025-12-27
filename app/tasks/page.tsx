import { Suspense } from "react";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { TasksClient } from "./tasks-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mission Catalog - ORBITA",
  description: "Explore our mission-critical AI catalog. Stellar solutions for orbital success.",
};

async function getTasks() {
  const tasks = await db.task.findMany({
    orderBy: [
      { category: "asc" },
      { basePrice: "desc" },
    ],
    include: {
      _count: {
        select: { specialists: true },
      },
    },
  });
  return tasks;
}

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <Suspense fallback={<TasksLoading />}>
      <TasksClient tasks={tasks} />
    </Suspense>
  );
}

function TasksLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground font-light tracking-wide">
        Loading mission catalog...
      </div>
    </div>
  );
}
