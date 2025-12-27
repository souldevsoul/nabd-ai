import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - Get user's purchases
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const purchases = await db.purchase.findMany({
      where: { buyerId: session.user.id },
      include: {
        photo: {
          select: {
            id: true,
            title: true,
            thumbnailUrl: true,
            fileUrl: true,
            photographer: {
              select: {
                name: true,
                photographerProfile: {
                  select: { displayName: true, handle: true },
                },
              },
            },
          },
        },
        licenseOption: {
          select: {
            type: true,
            name: true,
            usageTerms: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ purchases });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchases" },
      { status: 500 }
    );
  }
}
