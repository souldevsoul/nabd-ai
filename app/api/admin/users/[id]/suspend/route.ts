import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

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
    const currentUser = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser?.roles.includes("ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Prevent self-suspension
    if (id === session.user.id) {
      return NextResponse.json(
        { error: "Cannot suspend your own account" },
        { status: 400 }
      );
    }

    // Suspend user by removing all roles (effectively revoking access)
    const updatedUser = await db.user.update({
      where: { id },
      data: {
        roles: [],
      },
      select: {
        id: true,
        email: true,
        name: true,
        roles: true,
      },
    });

    return NextResponse.json({
      user: updatedUser,
      message: "User suspended successfully"
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to suspend user" },
      { status: 500 }
    );
  }
}
