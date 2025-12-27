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
      },
    });

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    // Determine next status
    let nextStatus: "ACCEPTED" | "IN_PROGRESS";
    if (assignment.status === "PENDING") {
      nextStatus = "ACCEPTED";
    } else if (assignment.status === "ACCEPTED") {
      nextStatus = "IN_PROGRESS";
    } else {
      return NextResponse.json({ error: "Invalid status transition" }, { status: 400 });
    }

    // Update assignment
    const updated = await db.taskAssignment.update({
      where: { id },
      data: {
        status: nextStatus,
        startedAt: nextStatus === "IN_PROGRESS" ? new Date() : undefined,
      },
    });

    // Update task request status if starting work
    if (nextStatus === "IN_PROGRESS") {
      await db.taskRequest.update({
        where: { id: assignment.requestId },
        data: { status: "IN_PROGRESS" },
      });
    }

    return NextResponse.json({ assignment: updated });
  } catch (error) {
    console.error("Accept assignment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
