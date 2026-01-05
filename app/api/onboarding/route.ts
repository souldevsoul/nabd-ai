import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

const onboardingSchema = z.object({
  // Profile
  displayName: z.string().min(2, "Display name is required"),
  bio: z.string().optional(),
  // AML/KYC
  fullLegalName: z.string().min(2, "Legal name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  country: z.string().min(1, "Country is required"),
  idType: z.enum(["passport", "drivers_license", "national_id"]),
  idNumber: z.string().min(1, "ID number is required"),
  // Agreements
  termsAccepted: z.literal(true, { message: "You must accept the terms" }),
  amlAccepted: z.literal(true, { message: "You must accept the AML policy" }),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = onboardingSchema.parse(body);

    // Update user profile
    const user = await db.user.update({
      where: { id: session.user.id },
      data: {
        name: validatedData.displayName,
        kycStatus: "IN_PROGRESS",
      },
    });

    // In a real application, you would:
    // 1. Store KYC data securely (encrypted)
    // 2. Integrate with a KYC/AML provider like Jumio, Onfido, etc.
    // 3. Create a verification request record
    // For this demo, we'll just log it
    console.log("KYC data submitted for user:", session.user.id, {
      fullLegalName: validatedData.fullLegalName,
      dateOfBirth: validatedData.dateOfBirth,
      country: validatedData.country,
      idType: validatedData.idType,
      // Never log actual ID numbers in production
      idNumberLength: validatedData.idNumber.length,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        kycStatus: user.kycStatus,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error completing onboarding:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}
