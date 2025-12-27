import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["OPEN", "IN_REVIEW", "APPROVED", "DECLINED", "COMPLETED"]),
  adminNotes: z.string().optional(),
});

export async function PATCH(
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
    const { status, adminNotes } = updateSchema.parse(body);

    // Find the license request
    const licenseRequest = await db.licenseRequest.findUnique({
      where: { id },
    });

    if (!licenseRequest) {
      return NextResponse.json({ error: "License request not found" }, { status: 404 });
    }

    // Update the license request
    const updatedRequest = await db.licenseRequest.update({
      where: { id },
      data: {
        status,
        adminNotes: adminNotes || undefined,
      },
      include: {
        photo: true,
        buyer: true,
        licenseOption: true,
      },
    });

    return NextResponse.json({
      success: true,
      request: updatedRequest,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating license request:", error);
    return NextResponse.json(
      { error: "Failed to update license request" },
      { status: 500 }
    );
  }
}

export async function GET(
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

    const licenseRequest = await db.licenseRequest.findUnique({
      where: { id },
      include: {
        photo: {
          include: {
            photographer: true,
          },
        },
        buyer: true,
        licenseOption: true,
      },
    });

    if (!licenseRequest) {
      return NextResponse.json({ error: "License request not found" }, { status: 404 });
    }

    return NextResponse.json({ request: licenseRequest });
  } catch (error) {
    console.error("Error fetching license request:", error);
    return NextResponse.json(
      { error: "Failed to fetch license request" },
      { status: 500 }
    );
  }
}
