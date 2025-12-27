import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Find specialist linked to this user
    const specialist = await db.specialist.findUnique({
      where: { userId: session.user.id },
    });

    if (!specialist) {
      return NextResponse.json({ error: "Not a specialist" }, { status: 403 });
    }

    // Find the assignment
    const assignment = await db.taskAssignment.findFirst({
      where: {
        id,
        specialistId: specialist.id,
        status: "IN_PROGRESS",
      },
    });

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found or not in progress" }, { status: 404 });
    }

    // Update assignment to completed
    const updated = await db.taskAssignment.update({
      where: { id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    // Update specialist stats
    await db.specialist.update({
      where: { id: specialist.id },
      data: {
        completedTasks: { increment: 1 },
      },
    });

    // Update task request status
    await db.taskRequest.update({
      where: { id: assignment.requestId },
      data: { status: "COMPLETED" },
    });

    return NextResponse.json({ assignment: updated });
  } catch (error) {
    console.error("Complete assignment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
