import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get all task assignments for this user
    const tasks = await db.taskAssignment.findMany({
      where: {
        request: { userId },
      },
      orderBy: { createdAt: "desc" },
      include: {
        specialist: {
          select: {
            id: true,
            firstName: true,
            avatarSeed: true,
            rating: true,
          },
        },
        request: {
          include: {
            task: {
              select: {
                id: true,
                displayName: true,
                category: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      tasks: tasks.map((task) => ({
        id: task.id,
        status: task.status,
        price: task.price,
        confidence: task.confidence,
        createdAt: task.createdAt.toISOString(),
        startedAt: task.startedAt?.toISOString() || null,
        completedAt: task.completedAt?.toISOString() || null,
        specialist: {
          id: task.specialist.id,
          firstName: task.specialist.firstName,
          avatarSeed: task.specialist.avatarSeed,
          rating: task.specialist.rating,
        },
        request: {
          id: task.request.id,
          description: task.request.description,
          task: task.request.task
            ? {
                id: task.request.task.id,
                displayName: task.request.task.displayName,
                category: task.request.task.category,
              }
            : null,
        },
      })),
    });
  } catch (error) {
    console.error("Dashboard tasks API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
