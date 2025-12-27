import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - Download purchased photo
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token } = await params;

    // Find purchase by download token
    const purchase = await db.purchase.findUnique({
      where: { downloadToken: token },
      include: {
        photo: true,
        licenseOption: true,
        buyer: {
          select: { id: true, email: true },
        },
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: "Invalid download token" },
        { status: 404 }
      );
    }

    // Verify buyer owns this purchase
    if (purchase.buyerId !== session.user.id) {
      return NextResponse.json(
        { error: "You do not own this purchase" },
        { status: 403 }
      );
    }

    // Check purchase status
    if (purchase.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Purchase not completed" },
        { status: 400 }
      );
    }

    // Check download limit
    if (purchase.downloadCount >= purchase.maxDownloads) {
      return NextResponse.json(
        { error: "Download limit reached", maxDownloads: purchase.maxDownloads },
        { status: 403 }
      );
    }

    // Increment download count
    await db.purchase.update({
      where: { id: purchase.id },
      data: { downloadCount: { increment: 1 } },
    });

    // Return download info (in production, would redirect to signed URL)
    return NextResponse.json({
      success: true,
      download: {
        url: purchase.photo.fileUrl,
        filename: `${purchase.photo.title.replace(/[^a-z0-9]/gi, '_')}_${purchase.licenseOption.type.toLowerCase()}.jpg`,
        mimeType: purchase.photo.mimeType || "image/jpeg",
        license: {
          type: purchase.licenseOption.type,
          name: purchase.licenseOption.name,
          usageTerms: purchase.licenseOption.usageTerms,
        },
      },
      remainingDownloads: purchase.maxDownloads - purchase.downloadCount - 1,
    });
  } catch (error) {
    console.error("Error downloading photo:", error);
    return NextResponse.json(
      { error: "Failed to process download" },
      { status: 500 }
    );
  }
}
