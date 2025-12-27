import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        roles: true,
        telegramUserId: true,
        telegramUsername: true,
        telegramLinkedAt: true,
        photographerProfile: {
          select: {
            displayName: true,
            handle: true,
            bio: true,
            location: true,
            websiteUrl: true,
            socialInstagram: true,
            socialX: true,
            socialLinkedin: true,
            avatarUrl: true,
            isVerified: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch user settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, photographerProfile } = body;

    // Update user
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;

    const user = await db.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    // Update photographer profile if provided
    if (photographerProfile) {
      const existingProfile = await db.photographerProfile.findUnique({
        where: { userId: session.user.id },
      });

      if (existingProfile) {
        await db.photographerProfile.update({
          where: { userId: session.user.id },
          data: {
            displayName: photographerProfile.displayName,
            bio: photographerProfile.bio,
            location: photographerProfile.location,
            websiteUrl: photographerProfile.websiteUrl,
            socialInstagram: photographerProfile.socialInstagram,
            socialX: photographerProfile.socialX,
            socialLinkedin: photographerProfile.socialLinkedin,
          },
        });
      }
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error updating user settings:", error);
    return NextResponse.json(
      { error: "Failed to update user settings" },
      { status: 500 }
    );
  }
}
