import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - Get user's task requests
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const requests = await db.taskRequest.findMany({
      where: {
        userId: session.user.id,
        ...(status ? { status: status as any } : {}),
      },
      include: {
        task: {
          select: { id: true, name: true, displayName: true, category: true },
        },
        assignments: {
          include: {
            specialist: {
              select: { id: true, firstName: true, avatarSeed: true, rating: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}

// POST - Create a new task request
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { description, taskId } = body;

    if (!description) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    const taskRequest = await db.taskRequest.create({
      data: {
        userId: session.user.id,
        description,
        taskId: taskId || null,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      request: taskRequest,
    });
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 }
    );
  }
}
