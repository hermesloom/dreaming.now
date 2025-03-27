import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Interface for the expected request body
interface AddFundsPayload {
  userId: string;
  amount: number;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Get the project to check the webhook secret
    const project = await prisma.project.findUnique({
      where: { slug },
      select: { id: true, webhookSecret: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Validate the webhook secret
    const authHeader = request.headers.get("X-Webhook-Secret");
    if (authHeader !== project.webhookSecret) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid webhook secret" },
        { status: 401 }
      );
    }

    // Parse the request body
    const payload: AddFundsPayload = await request.json();

    // Validate payload
    if (!payload.userId || typeof payload.amount !== "number") {
      return NextResponse.json(
        { error: "Bad request: userId and amount are required" },
        { status: 400 }
      );
    }

    if (payload.amount <= 0) {
      return NextResponse.json(
        { error: "Bad request: amount must be positive" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the UserProjectFunds record already exists
    const existingFunds = await prisma.userProjectFunds.findUnique({
      where: {
        userId_projectId: {
          userId: payload.userId,
          projectId: project.id,
        },
      },
    });

    if (existingFunds) {
      // Update existing record
      await prisma.userProjectFunds.update({
        where: { id: existingFunds.id },
        data: {
          fundsLeft: { increment: payload.amount },
        },
      });
    } else {
      // Create new record
      await prisma.userProjectFunds.create({
        data: {
          user: { connect: { id: payload.userId } },
          project: { connect: { id: project.id } },
          fundsLeft: payload.amount,
          currency: "EUR", // Default currency
        },
      });
    }

    // Return success response
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
