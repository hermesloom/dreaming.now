import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { withAuth } from "@/lib/auth";

const prisma = new PrismaClient();

// GET - List all budget items for a bucket
export const GET = withAuth(
  async (request: NextRequest, user, { bucketId }) => {
    try {
      const budgetItems = await prisma.budgetItem.findMany({
        where: { bucketId },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(budgetItems);
    } catch (error) {
      console.error("Error fetching budget items:", error);
      return NextResponse.json(
        { error: "Failed to fetch budget items" },
        { status: 500 }
      );
    }
  }
);

// POST - Create a new budget item
export const POST = withAuth(
  async (request: NextRequest, user, { bucketId }) => {
    try {
      const { description, amount } = await request.json();

      if (!description || !amount) {
        return NextResponse.json(
          { error: "Description and amount are required" },
          { status: 400 }
        );
      }

      // Validate the amount
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return NextResponse.json(
          { error: "Amount must be a positive number" },
          { status: 400 }
        );
      }

      // Get the bucket to ensure it exists
      const bucket = await prisma.bucket.findUnique({
        where: { id: bucketId },
      });

      if (!bucket) {
        return NextResponse.json(
          { error: "Bucket not found" },
          { status: 404 }
        );
      }

      const budgetItem = await prisma.budgetItem.create({
        data: {
          description,
          amount: parsedAmount,
          currency: "EUR", // Default currency
          bucket: {
            connect: { id: bucketId },
          },
        },
      });

      return NextResponse.json(budgetItem, { status: 201 });
    } catch (error) {
      console.error("Error creating budget item:", error);
      return NextResponse.json(
        { error: "Failed to create budget item" },
        { status: 500 }
      );
    }
  }
);
