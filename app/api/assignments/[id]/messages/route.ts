import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getConversationAccess } from "@/lib/auth-helpers";

// GET - Fetch messages for assignment
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

    // Parse pagination params
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

    // Fetch messages
    const messages = await db.taskMessage.findMany({
      where: { assignmentId },
      include: {
        sender: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { createdAt: "asc" },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const hasMore = messages.length > limit;
    const results = hasMore ? messages.slice(0, -1) : messages;
    const nextCursor = hasMore ? results[results.length - 1]?.id : null;

    return NextResponse.json({
      messages: results,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Send a new message
export async function POST(
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

    if (!access.canSend) {
      return NextResponse.json(
        { error: "Cannot send messages to this task" },
        { status: 403 }
      );
    }

    // Parse body
    const body = await request.json();
    const content = body.content?.trim();

    if (!content || content.length === 0) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    if (content.length > 5000) {
      return NextResponse.json(
        { error: "Message too long (max 5000 characters)" },
        { status: 400 }
      );
    }

    // Rate limiting: max 10 messages per minute
    const recentCount = await db.taskMessage.count({
      where: {
        senderId: session.user.id,
        createdAt: { gte: new Date(Date.now() - 60000) },
      },
    });

    if (recentCount >= 10) {
      return NextResponse.json(
        { error: "Too many messages. Please wait." },
        { status: 429 }
      );
    }

    // Determine sender role
    let senderRole: string;
    if (access.role === "admin") {
      senderRole = "ADMIN";
    } else if (access.role === "specialist") {
      senderRole = "SPECIALIST";
    } else {
      senderRole = "BUYER";
    }

    // Create message
    const message = await db.taskMessage.create({
      data: {
        assignmentId,
        senderId: session.user.id,
        senderRole,
        content,
      },
      include: {
        sender: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
