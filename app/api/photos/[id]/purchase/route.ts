import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// POST - Purchase a photo with credits
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: photoId } = await params;
    const body = await request.json();
    const { licenseOptionId } = body;

    if (!licenseOptionId) {
      return NextResponse.json(
        { error: "License option required" },
        { status: 400 }
      );
    }

    // Get photo with license option
    const photo = await db.photo.findUnique({
      where: { id: photoId, status: "VERIFIED" },
      include: {
        photographer: true,
        licenseOptions: {
          where: { id: licenseOptionId, isActive: true },
        },
      },
    });

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    const licenseOption = photo.licenseOptions[0];
    if (!licenseOption) {
      return NextResponse.json(
        { error: "License option not available" },
        { status: 400 }
      );
    }

    // Check if user already purchased this photo with this license
    const existingPurchase = await db.purchase.findFirst({
      where: {
        buyerId: session.user.id,
        photoId,
        licenseOptionId,
        status: "COMPLETED",
      },
    });

    if (existingPurchase) {
      return NextResponse.json({
        success: true,
        alreadyPurchased: true,
        purchase: existingPurchase,
        message: "You already own this license",
      });
    }

    // Calculate credits cost (use credits field or convert from cents)
    const creditsCost = licenseOption.credits > 0
      ? licenseOption.credits
      : Math.ceil(licenseOption.priceCents / 10); // $1 = 10 credits

    // Get buyer's wallet
    let buyerWallet = await db.wallet.findUnique({
      where: { userId: session.user.id },
    });

    if (!buyerWallet) {
      buyerWallet = await db.wallet.create({
        data: { userId: session.user.id },
      });
    }

    // Check balance
    if (buyerWallet.balance < creditsCost) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          required: creditsCost,
          balance: buyerWallet.balance,
          shortfall: creditsCost - buyerWallet.balance,
        },
        { status: 402 }
      );
    }

    // Calculate splits (80% photographer, 20% platform)
    const photographerCut = Math.floor(creditsCost * 0.8);
    const platformCut = creditsCost - photographerCut;

    // Get or create photographer's wallet
    let photographerWallet = await db.wallet.findUnique({
      where: { userId: photo.photographerId },
    });

    if (!photographerWallet) {
      photographerWallet = await db.wallet.create({
        data: { userId: photo.photographerId },
      });
    }

    // Execute purchase transaction
    const newBuyerBalance = buyerWallet.balance - creditsCost;
    const newPhotographerBalance = photographerWallet.balance + photographerCut;

    const result = await db.$transaction(async (tx) => {
      // Create purchase
      const purchase = await tx.purchase.create({
        data: {
          buyerId: session.user.id,
          photoId,
          licenseOptionId,
          creditsCost,
          photographerCut,
          platformCut,
          status: "COMPLETED",
        },
      });

      // Deduct from buyer
      await tx.wallet.update({
        where: { id: buyerWallet.id },
        data: {
          balance: newBuyerBalance,
          totalSpent: { increment: creditsCost },
        },
      });

      // Buyer transaction
      await tx.creditTransaction.create({
        data: {
          walletId: buyerWallet.id,
          type: "PHOTO_PURCHASE",
          amount: -creditsCost,
          balance: newBuyerBalance,
          description: `Purchased "${photo.title}" - ${licenseOption.name}`,
          purchaseId: purchase.id,
          metadata: {
            photoId,
            photoTitle: photo.title,
            licenseType: licenseOption.type,
          },
        },
      });

      // Credit photographer
      await tx.wallet.update({
        where: { id: photographerWallet.id },
        data: {
          balance: newPhotographerBalance,
          totalEarnings: { increment: photographerCut },
        },
      });

      // Photographer transaction
      await tx.creditTransaction.create({
        data: {
          walletId: photographerWallet.id,
          type: "PHOTOGRAPHER_EARNING",
          amount: photographerCut,
          balance: newPhotographerBalance,
          description: `Sale: "${photo.title}" - ${licenseOption.name}`,
          purchaseId: purchase.id,
          metadata: {
            photoId,
            buyerId: session.user.id,
            licenseType: licenseOption.type,
          },
        },
      });

      return purchase;
    });

    return NextResponse.json({
      success: true,
      purchase: {
        id: result.id,
        downloadToken: result.downloadToken,
        creditsCost,
        photo: {
          id: photo.id,
          title: photo.title,
        },
        license: {
          type: licenseOption.type,
          name: licenseOption.name,
        },
      },
      newBalance: newBuyerBalance,
    });
  } catch (error) {
    console.error("Error purchasing photo:", error);
    return NextResponse.json(
      { error: "Failed to complete purchase" },
      { status: 500 }
    );
  }
}
