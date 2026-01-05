import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { UserRole } from "@prisma/client";

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
    const currentUser = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser?.roles.includes("ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { roles } = body as { roles: UserRole[] };

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      return NextResponse.json(
        { error: "At least one role is required" },
        { status: 400 }
      );
    }

    // Validate roles
    const validRoles: UserRole[] = ["BUYER", "ADMIN", "SPECIALIST"];
    const invalidRoles = roles.filter((r) => !validRoles.includes(r));
    if (invalidRoles.length > 0) {
      return NextResponse.json(
        { error: `Invalid roles: ${invalidRoles.join(", ")}` },
        { status: 400 }
      );
    }

    // Update user roles
    const updatedUser = await db.user.update({
      where: { id },
      data: { roles },
      select: {
        id: true,
        email: true,
        name: true,
        roles: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch {
    return NextResponse.json(
      { error: "Failed to update roles" },
      { status: 500 }
    );
  }
}
