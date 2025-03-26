import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

// The webhook secret key that must be provided in the header
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "your-webhook-secret-key";

// Interface for the expected request body
interface AddFundsPayload {
  userId: string;
  amount: number;
}

export async function POST(request: NextRequest) {
  // Validate the webhook secret
  const authHeader = request.headers.get("X-Webhook-Secret");

  if (authHeader !== WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid webhook secret" },
      { status: 401 }
    );
  }

  try {
    const prisma = new PrismaClient();

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

    // Update user funds
    /*const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: {
        funds: { increment: payload.amount },
      },
    });*/

    // Return the updated user data
    return NextResponse.json({
      success: true,
      /*user: {
        id: updatedUser.id,
        funds: updatedUser.funds,
      },*/
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
