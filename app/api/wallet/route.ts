import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - Get user's wallet balance
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get or create wallet
    let wallet = await db.wallet.findUnique({
      where: { userId: session.user.id },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!wallet) {
      wallet = await db.wallet.create({
        data: { userId: session.user.id },
        include: {
          transactions: {
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      });
    }

    return NextResponse.json({
      balance: wallet.balance,
      totalSpent: wallet.totalSpent,
      totalEarnings: wallet.totalEarnings,
      pendingPayout: wallet.pendingPayout,
      recentTransactions: wallet.transactions,
    });
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet" },
      { status: 500 }
    );
  }
}

// POST - Add credits to wallet (any amount, $1 = 10 credits)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { amount, paymentMethod } = body;

    // Validate amount (minimum $1 = 10 credits)
    if (!amount || amount < 10) {
      return NextResponse.json(
        { error: "Minimum purchase is 10 credits ($1)" },
        { status: 400 }
      );
    }

    // Get or create wallet
    let wallet = await db.wallet.findUnique({
      where: { userId: session.user.id },
    });

    if (!wallet) {
      wallet = await db.wallet.create({
        data: { userId: session.user.id },
      });
    }

    // Calculate new balance
    const newBalance = wallet.balance + amount;

    // Update wallet and create transaction
    const [updatedWallet, transaction] = await db.$transaction([
      db.wallet.update({
        where: { id: wallet.id },
        data: { balance: newBalance },
      }),
      db.creditTransaction.create({
        data: {
          walletId: wallet.id,
          type: "CREDIT_PURCHASE",
          amount: amount,
          balance: newBalance,
          description: `Purchased ${amount} credits`,
          metadata: {
            paymentMethod: paymentMethod || "card",
            amountUsd: (amount / 10).toFixed(2),
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      balance: updatedWallet.balance,
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        description: transaction.description,
      },
    });
  } catch (error) {
    console.error("Error adding credits:", error);
    return NextResponse.json(
      { error: "Failed to add credits" },
      { status: 500 }
    );
  }
}
