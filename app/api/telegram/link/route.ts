import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { randomBytes } from "crypto";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate a random token
    const token = randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Invalidate any existing tokens for this user
    await db.telegramLinkToken.updateMany({
      where: {
        userId: session.user.id,
        used: false,
      },
      data: {
        used: true,
      },
    });

    // Create new token
    const linkToken = await db.telegramLinkToken.create({
      data: {
        userId: session.user.id,
        token,
        expiresAt,
      },
    });

    return NextResponse.json({
      token: linkToken.token,
      expiresAt: linkToken.expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Error generating Telegram link token:", error);
    return NextResponse.json(
      { error: "Failed to generate link token" },
      { status: 500 }
    );
  }
}
