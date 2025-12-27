import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

const onboardingSchema = z.object({
  // Profile
  displayName: z.string().min(2, "Display name is required"),
  handle: z.string().min(2, "Handle is required").regex(/^[a-z0-9_]+$/, "Handle can only contain lowercase letters, numbers, and underscores"),
  bio: z.string().optional(),
  location: z.string().optional(),
  // Social
  websiteUrl: z.string().url().optional().or(z.literal("")),
  socialInstagram: z.string().optional(),
  socialX: z.string().optional(),
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

    // Check if handle is already taken
    const existingHandle = await db.photographerProfile.findUnique({
      where: { handle: validatedData.handle },
    });

    if (existingHandle) {
      return NextResponse.json(
        { error: "Handle is already taken" },
        { status: 400 }
      );
    }

    // Create or update photographer profile
    const photographerProfile = await db.photographerProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        displayName: validatedData.displayName,
        handle: validatedData.handle,
        bio: validatedData.bio || null,
        location: validatedData.location || null,
        websiteUrl: validatedData.websiteUrl || null,
        socialInstagram: validatedData.socialInstagram || null,
        socialX: validatedData.socialX || null,
      },
      update: {
        displayName: validatedData.displayName,
        handle: validatedData.handle,
        bio: validatedData.bio || null,
        location: validatedData.location || null,
        websiteUrl: validatedData.websiteUrl || null,
        socialInstagram: validatedData.socialInstagram || null,
        socialX: validatedData.socialX || null,
      },
    });

    // Add PHOTOGRAPHER role if not already present
    await db.user.update({
      where: { id: session.user.id },
      data: {
        roles: {
          push: "PHOTOGRAPHER",
        },
        name: validatedData.displayName,
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
      profile: photographerProfile,
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
