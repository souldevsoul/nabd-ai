import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get wallet balance and user's task orders
    const [
      wallet,
      activeOrders,
      completedOrders,
      recentOrders,
      topSpecialists,
    ] = await Promise.all([
      // Get wallet
      db.wallet.findUnique({
        where: { userId },
      }),
      // Active orders count (IN_PROGRESS status)
      db.taskAssignment.count({
        where: {
          request: { userId },
          status: { in: ["PENDING", "ACCEPTED", "IN_PROGRESS"] },
        },
      }),
      // Completed orders count
      db.taskAssignment.count({
        where: {
          request: { userId },
          status: { in: ["COMPLETED", "RATED"] },
        },
      }),
      // Recent orders (last 5)
      db.taskAssignment.findMany({
        where: {
          request: { userId },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          specialist: {
            select: {
              id: true,
              firstName: true,
              avatarSeed: true,
            },
          },
          request: {
            include: {
              task: {
                select: {
                  displayName: true,
                },
              },
            },
          },
        },
      }),
      // Top rated specialists (limit 5)
      db.specialist.findMany({
        where: { isAvailable: true },
        orderBy: { rating: "desc" },
        take: 5,
        select: {
          id: true,
          firstName: true,
          avatarSeed: true,
          bio: true,
          rating: true,
          hourlyRate: true,
        },
      }),
    ]);

    // Format recent orders
    const formattedOrders = recentOrders.map((order) => {
      // Calculate relative time
      const now = new Date();
      const created = new Date(order.createdAt);
      const diffMs = now.getTime() - created.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      let createdAt;
      if (diffHours < 1) {
        createdAt = "Just now";
      } else if (diffHours < 24) {
        createdAt = `${diffHours}h ago`;
      } else {
        createdAt = `${diffDays}d ago`;
      }

      return {
        id: order.id,
        specialist: {
          firstName: order.specialist.firstName,
          avatarSeed: order.specialist.avatarSeed,
        },
        task: {
          displayName: order.request.task?.displayName || "Custom Task",
        },
        status: order.status,
        credits: Math.round(order.price),
        createdAt,
      };
    });

    return NextResponse.json({
      stats: {
        walletBalance: wallet?.balance || 0,
        activeOrders,
        completedOrders,
        totalSpent: wallet?.totalSpent || 0,
      },
      recentOrders: formattedOrders,
      recommendedSpecialists: topSpecialists,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
