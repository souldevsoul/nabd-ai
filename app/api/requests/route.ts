import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - Get user's photo requests (sent or received)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "sent";

    const requests = await db.photoRequest.findMany({
      where: type === "sent"
        ? { buyerId: session.user.id }
        : { photographerId: session.user.id },
      include: {
        buyer: {
          select: { id: true, name: true, email: true, image: true },
        },
        photographer: {
          select: {
            id: true,
            name: true,
            email: true,
            photographerProfile: {
              select: { displayName: true, handle: true, avatarUrl: true },
            },
          },
        },
        deliveredPhoto: {
          select: { id: true, title: true, thumbnailUrl: true },
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

// POST - Create a new photo request to a photographer
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { photographerId, title, description, category, budget, deadline } = body;

    if (!photographerId || !title || !description) {
      return NextResponse.json(
        { error: "Photographer, title, and description are required" },
        { status: 400 }
      );
    }

    const photographer = await db.user.findFirst({
      where: {
        id: photographerId,
        roles: { has: "PHOTOGRAPHER" },
      },
    });

    if (!photographer) {
      return NextResponse.json(
        { error: "Photographer not found" },
        { status: 404 }
      );
    }

    const photoRequest = await db.photoRequest.create({
      data: {
        buyerId: session.user.id,
        photographerId,
        title,
        description,
        category,
        budget: budget ? parseInt(budget) : null,
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    return NextResponse.json({
      success: true,
      request: photoRequest,
    });
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 }
    );
  }
}
