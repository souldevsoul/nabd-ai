import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const photos = await db.photo.findMany({
      where: { status: "VERIFIED" },
      include: {
        photographer: {
          select: {
            name: true,
            photographerProfile: {
              select: {
                handle: true,
                displayName: true,
              },
            },
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}
