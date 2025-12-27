import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { RequestStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as RequestStatus | null;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [requests, total] = await Promise.all([
      db.licenseRequest.findMany({
        where,
        include: {
          photo: {
            select: {
              id: true,
              title: true,
              thumbnailUrl: true,
              fileUrl: true,
            },
          },
          buyer: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
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
        skip,
        take: limit,
      }),
      db.licenseRequest.count({ where }),
    ]);

    return NextResponse.json({
      requests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching license requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch license requests" },
      { status: 500 }
    );
  }
}
