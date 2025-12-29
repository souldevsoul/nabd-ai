import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// POST - Hire a specialist (pay and start project)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: assignmentId } = await params;
    const body = await request.json();
    const { quantity = 1 } = body;

    // Get the assignment with related data
    const assignment = await db.taskAssignment.findUnique({
      where: { id: assignmentId },
      include: {
        request: {
          include: {
            user: true,
            task: true,
          },
        },
        specialist: true,
      },
    });

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    // Verify user owns this request
    if (assignment.request.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Check assignment is in correct state
    if (assignment.status !== "PENDING") {
      return NextResponse.json(
        { error: `Cannot hire - assignment is already ${assignment.status}` },
        { status: 400 }
      );
    }

    // Calculate total cost
    const unitPrice = Math.round(assignment.price);
    const totalCredits = unitPrice * quantity;

    // Get user wallet
    const wallet = await db.wallet.findUnique({
      where: { userId: session.user.id },
    });

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet not found. Please add credits first." },
        { status: 400 }
      );
    }

    // Check sufficient balance
    if (wallet.balance < totalCredits) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          required: totalCredits,
          available: wallet.balance,
        },
        { status: 400 }
      );
    }

    // Perform the hire transaction
    const newBalance = wallet.balance - totalCredits;
    const taskName = assignment.request.task?.displayName || "Custom Task";
    const specialistName = assignment.specialist.firstName;

    const [updatedWallet, updatedAssignment, transaction] = await db.$transaction([
      // Deduct credits from wallet
      db.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: newBalance,
          totalSpent: wallet.totalSpent + totalCredits,
        },
      }),
      // Update assignment to IN_PROGRESS
      db.taskAssignment.update({
        where: { id: assignmentId },
        data: {
          status: "IN_PROGRESS",
          startedAt: new Date(),
        },
      }),
      // Create credit transaction
      db.creditTransaction.create({
        data: {
          walletId: wallet.id,
          type: "PHOTO_PURCHASE", // Using existing type for task purchases
          amount: -totalCredits,
          balance: newBalance,
          description: `Hired ${specialistName} for ${taskName}${quantity > 1 ? ` (x${quantity})` : ""}`,
          metadata: {
            assignmentId,
            specialistId: assignment.specialistId,
            taskId: assignment.request.taskId,
            quantity,
            unitPrice,
          },
        },
      }),
    ]);

    // Update task request status to PAID
    await db.taskRequest.update({
      where: { id: assignment.requestId },
      data: { status: "PAID" },
    });

    // Decline other pending assignments for this request
    await db.taskAssignment.updateMany({
      where: {
        requestId: assignment.requestId,
        id: { not: assignmentId },
        status: "PENDING",
      },
      data: { status: "PENDING" }, // Keep as pending but user chose another
    });

    // Create initial message
    await db.taskMessage.create({
      data: {
        assignmentId,
        senderId: session.user.id,
        senderRole: "BUYER",
        content: `Project started! Looking forward to working with you on ${taskName}.`,
      },
    });

    return NextResponse.json({
      success: true,
      assignment: {
        id: updatedAssignment.id,
        status: updatedAssignment.status,
        specialist: specialistName,
        task: taskName,
      },
      transaction: {
        id: transaction.id,
        amount: totalCredits,
        newBalance: updatedWallet.balance,
      },
    });
  } catch (error) {
    console.error("Hire error:", error);
    return NextResponse.json(
      { error: "Failed to complete hire" },
      { status: 500 }
    );
  }
}
