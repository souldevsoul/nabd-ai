import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

const reviewSchema = z.object({
  decision: z.enum(["VERIFIED", "REJECTED", "NEEDS_INFO"]),
  notes: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user?.roles.includes("ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { decision, notes } = reviewSchema.parse(body);

    // Find the photo
    const photo = await db.photo.findUnique({
      where: { id },
    });

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    // Update photo status and create review record
    const [updatedPhoto, review] = await db.$transaction([
      db.photo.update({
        where: { id },
        data: {
          status: decision === "VERIFIED" ? "VERIFIED" : decision === "REJECTED" ? "REJECTED" : "PENDING_REVIEW",
          verifiedAt: decision === "VERIFIED" ? new Date() : null,
          verificationNotes: notes,
        },
      }),
      db.adminReview.create({
        data: {
          photoId: id,
          adminId: session.user.id,
          decision,
          notes,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      photo: updatedPhoto,
      review,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error reviewing photo:", error);
    return NextResponse.json(
      { error: "Failed to review photo" },
      { status: 500 }
    );
  }
}
