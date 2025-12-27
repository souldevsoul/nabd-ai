import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { photoId, licenseOptionId, message, intendedUse } = body;

    if (!photoId || !licenseOptionId) {
      return NextResponse.json(
        { error: "Photo ID and License Option ID are required" },
        { status: 400 }
      );
    }

    // Verify photo exists and is verified
    const photo = await db.photo.findUnique({
      where: { id: photoId, status: "VERIFIED" },
      include: {
        licenseOptions: {
          where: { id: licenseOptionId, isActive: true },
        },
      },
    });

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    if (photo.licenseOptions.length === 0) {
      return NextResponse.json(
        { error: "License option not available" },
        { status: 400 }
      );
    }

    // Check if user already has a pending request for this photo/license
    const existingRequest = await db.licenseRequest.findFirst({
      where: {
        photoId,
        buyerId: session.user.id,
        licenseOptionId,
        status: { in: ["OPEN", "IN_REVIEW"] },
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "You already have a pending request for this license" },
        { status: 409 }
      );
    }

    // Create the license request
    const licenseRequest = await db.licenseRequest.create({
      data: {
        photoId,
        buyerId: session.user.id,
        licenseOptionId,
        message,
        intendedUse,
        status: "OPEN",
      },
      include: {
        photo: {
          select: {
            id: true,
            title: true,
            thumbnailUrl: true,
          },
        },
        licenseOption: {
          select: {
            id: true,
            name: true,
            type: true,
            priceCents: true,
            currency: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      request: licenseRequest,
    });
  } catch (error) {
    console.error("License request error:", error);
    return NextResponse.json(
      { error: "Failed to create license request" },
      { status: 500 }
    );
  }
}

// GET - fetch user's license requests
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requests = await db.licenseRequest.findMany({
      where: { buyerId: session.user.id },
      include: {
        photo: {
          select: {
            id: true,
            title: true,
            thumbnailUrl: true,
            fileUrl: true,
          },
        },
        licenseOption: {
          select: {
            id: true,
            name: true,
            type: true,
            priceCents: true,
            currency: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Error fetching license requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch license requests" },
      { status: 500 }
    );
  }
}
