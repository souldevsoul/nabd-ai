import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getConversationAccess } from "@/lib/auth-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: assignmentId } = await params;

    // Check access
    const access = await getConversationAccess(
      session.user.id,
      session.user.roles,
      assignmentId
    );

    if (!access.canView) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Fetch full assignment details
    const assignment = await db.taskAssignment.findUnique({
      where: { id: assignmentId },
      include: {
        request: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
            task: true,
          },
        },
        specialist: {
          select: {
            id: true,
            firstName: true,
            avatarSeed: true,
            rating: true,
            bio: true,
            hourlyRate: true,
            completedTasks: true,
          },
        },
        messages: {
          orderBy: { createdAt: "asc" },
          take: 50,
          include: {
            sender: {
              select: { id: true, name: true, image: true },
            },
          },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      assignment,
      access: {
        canSend: access.canSend,
        role: access.role,
      },
    });
  } catch (error) {
    console.error("Get assignment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
