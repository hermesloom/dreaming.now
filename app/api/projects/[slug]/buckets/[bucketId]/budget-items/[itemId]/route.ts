import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { withAuth } from "@/lib/auth";

const prisma = new PrismaClient();

// GET - Fetch a single budget item
export const GET = withAuth(async (request: NextRequest, user, { itemId }) => {
  try {
    const budgetItem = await prisma.budgetItem.findUnique({
      where: { id: itemId },
    });

    if (!budgetItem) {
      return NextResponse.json(
        { error: "Budget item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(budgetItem);
  } catch (error) {
    console.error("Error fetching budget item:", error);
    return NextResponse.json(
      { error: "Failed to fetch budget item" },
      { status: 500 }
    );
  }
});

// PUT - Update a budget item
export const PUT = withAuth(async (request: NextRequest, user, { itemId }) => {
  try {
    const { description, amount } = await request.json();

    if (!description && !amount) {
      return NextResponse.json(
        { error: "At least one field to update is required" },
        { status: 400 }
      );
    }

    // Get existing item
    const existingItem = await prisma.budgetItem.findUnique({
      where: { id: itemId },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Budget item not found" },
        { status: 404 }
      );
    }

    // Validate the amount if provided
    let parsedAmount;
    if (amount !== undefined) {
      parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return NextResponse.json(
          { error: "Amount must be a positive number" },
          { status: 400 }
        );
      }
    }

    // Update the budget item
    const updatedItem = await prisma.budgetItem.update({
      where: { id: itemId },
      data: {
        description: description || existingItem.description,
        amount: parsedAmount !== undefined ? parsedAmount : existingItem.amount,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating budget item:", error);
    return NextResponse.json(
      { error: "Failed to update budget item" },
      { status: 500 }
    );
  }
});

// DELETE - Delete a budget item
export const DELETE = withAuth(
  async (request: NextRequest, user, { itemId }) => {
    try {
      const existingItem = await prisma.budgetItem.findUnique({
        where: { id: itemId },
      });

      if (!existingItem) {
        return NextResponse.json(
          { error: "Budget item not found" },
          { status: 404 }
        );
      }

      await prisma.budgetItem.delete({
        where: { id: itemId },
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting budget item:", error);
      return NextResponse.json(
        { error: "Failed to delete budget item" },
        { status: 500 }
      );
    }
  }
);
