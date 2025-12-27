import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find specialist linked to this user
    const specialist = await db.specialist.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        firstName: true,
        avatarSeed: true,
        rating: true,
        hourlyRate: true,
        totalTasks: true,
        completedTasks: true,
        telegramLinkedAt: true,
      },
    });

    if (!specialist) {
      return NextResponse.json({ specialist: null, assignments: [], stats: {} });
    }

    // Get assignments
    const assignments = await db.taskAssignment.findMany({
      where: { specialistId: specialist.id },
      orderBy: { createdAt: "desc" },
      include: {
        request: {
          include: {
            user: {
              select: { name: true, email: true },
            },
            task: {
              select: { displayName: true },
            },
          },
        },
      },
    });

    // Calculate stats
    const stats = {
      pending: assignments.filter(a => a.status === "PENDING" || a.status === "ACCEPTED").length,
      inProgress: assignments.filter(a => a.status === "IN_PROGRESS").length,
      completed: assignments.filter(a => a.status === "COMPLETED" || a.status === "RATED").length,
      totalEarnings: assignments
        .filter(a => a.status === "COMPLETED" || a.status === "RATED")
        .reduce((sum, a) => sum + a.price, 0),
    };

    return NextResponse.json({
      specialist,
      assignments,
      stats,
    });
  } catch (error) {
    console.error("Executor dashboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
