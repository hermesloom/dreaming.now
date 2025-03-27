import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { withAuth } from "@/lib/auth";

const prisma = new PrismaClient();

// POST - Create a new pledge
export const POST = withAuth(
  async (request: NextRequest, user, { slug, bucketId }) => {
    try {
      const { amount } = await request.json();

      if (!amount || amount <= 0) {
        return NextResponse.json(
          { error: "Amount must be a positive number" },
          { status: 400 }
        );
      }

      // Get the bucket to check if it's still open
      const bucket = await prisma.bucket.findUnique({
        where: { id: bucketId },
        include: { project: true },
      });

      if (!bucket) {
        return NextResponse.json(
          { error: "Bucket not found" },
          { status: 404 }
        );
      }

      if (bucket.status !== "OPEN") {
        return NextResponse.json(
          { error: "Cannot pledge to a closed bucket" },
          { status: 400 }
        );
      }

      // Get user's funds for this project
      const userFunds = await prisma.userProjectFunds.findUnique({
        where: {
          userId_projectId: {
            userId: user.id,
            projectId: bucket.projectId,
          },
        },
      });

      if (!userFunds) {
        return NextResponse.json(
          { error: "You don't have access to this project" },
          { status: 403 }
        );
      }

      if (userFunds.fundsLeft < amount) {
        return NextResponse.json(
          { error: "Insufficient funds" },
          { status: 400 }
        );
      }

      // Create the pledge and update user funds in a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create the pledge
        const pledge = await tx.pledge.create({
          data: {
            amount,
            currency: userFunds.currency,
            user: { connect: { id: user.id } },
            bucket: { connect: { id: bucketId } },
          },
        });

        // Update user's funds
        await tx.userProjectFunds.update({
          where: {
            userId_projectId: {
              userId: user.id,
              projectId: bucket.projectId,
            },
          },
          data: {
            fundsLeft: userFunds.fundsLeft - amount,
          },
        });

        return pledge;
      });

      return NextResponse.json(result, { status: 201 });
    } catch (error) {
      console.error("Error creating pledge:", error);
      return NextResponse.json(
        { error: "Failed to create pledge" },
        { status: 500 }
      );
    }
  }
);
