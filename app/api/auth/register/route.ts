import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validations";
import type { UserRole } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, 12);

    // Create user
    const user = await db.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        passwordHash,
        roles: [validatedData.role as UserRole],
      },
    });

    // Create wallet for new user
    await db.wallet.create({
      data: {
        userId: user.id,
        balance: 0,
      },
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          roles: user.roles,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
