import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth, isAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (!isAdmin(session.user.roles)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all assignments with related data
    const assignments = await db.taskAssignment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        specialist: {
          select: {
            firstName: true,
            avatarSeed: true,
            hourlyRate: true,
          },
        },
        request: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            task: {
              select: {
                displayName: true,
              },
            },
          },
        },
      },
    });

    // Get stats
    const [pending, accepted, inProgress, completed, avgRating] = await Promise.all([
      db.taskAssignment.count({ where: { status: "PENDING" } }),
      db.taskAssignment.count({ where: { status: "ACCEPTED" } }),
      db.taskAssignment.count({ where: { status: "IN_PROGRESS" } }),
      db.taskAssignment.count({ where: { status: "COMPLETED" } }),
      db.taskAssignment.aggregate({
        _avg: { rating: true },
        where: { rating: { not: null } },
      }),
    ]);

    return NextResponse.json({
      assignments,
      stats: {
        pending,
        accepted,
        inProgress,
        completed,
        avgRating: avgRating._avg.rating,
      },
    });
  } catch (error) {
    console.error("Error fetching admin assignments:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignments" },
      { status: 500 }
    );
  }
}
