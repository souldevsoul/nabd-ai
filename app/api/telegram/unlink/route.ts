import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Remove Telegram link from user
    await db.user.update({
      where: { id: session.user.id },
      data: {
        telegramUserId: null,
        telegramUsername: null,
        telegramLinkedAt: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unlinking Telegram:", error);
    return NextResponse.json(
      { error: "Failed to unlink Telegram" },
      { status: 500 }
    );
  }
}
