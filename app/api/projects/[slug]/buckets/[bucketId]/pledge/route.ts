import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST - Create, update or delete a pledge
export const POST = withAuth(
  async (request: NextRequest, user, { bucketId }) => {
    try {
      const { amount } = await request.json();

      // Ensure amount is a number
      const numAmount = Number(amount);

      if (isNaN(numAmount) || numAmount < 0) {
        return NextResponse.json(
          { error: "Amount must be a non-negative number" },
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
          { error: "Cannot modify pledge for a closed bucket" },
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

      // Check if user already has a pledge for this bucket
      const existingPledge = await prisma.pledge.findFirst({
        where: {
          userId: user.id,
          bucketId: bucketId,
        },
      });

      // If amount is 0 and there's an existing pledge, we'll delete it
      if (numAmount === 0 && existingPledge) {
        // Return all pledged funds to the user
        await prisma.$transaction(async (tx) => {
          // Delete the pledge
          await tx.pledge.delete({
            where: { id: existingPledge.id },
          });

          // Update user's funds (return the pledged amount)
          await tx.userProjectFunds.update({
            where: {
              userId_projectId: {
                userId: user.id,
                projectId: bucket.projectId,
              },
            },
            data: {
              fundsLeft: userFunds.fundsLeft + existingPledge.amount,
            },
          });
        });

        return NextResponse.json(
          { success: true, deleted: true },
          { status: 200 }
        );
      }

      // For non-zero amounts, proceed with create/update logic

      // Calculate the change in amount if updating
      const amountChange = existingPledge
        ? numAmount - existingPledge.amount
        : numAmount;

      if (userFunds.fundsLeft < amountChange) {
        return NextResponse.json(
          { error: "Insufficient funds" },
          { status: 400 }
        );
      }

      // Create or update the pledge and update user funds in a transaction
      const result = await prisma.$transaction(async (tx) => {
        let pledge;

        if (existingPledge) {
          // Update existing pledge
          pledge = await tx.pledge.update({
            where: { id: existingPledge.id },
            data: {
              amount: numAmount,
              updatedAt: new Date(),
            },
          });
        } else {
          // Create new pledge
          pledge = await tx.pledge.create({
            data: {
              amount: numAmount,
              currency: userFunds.currency,
              user: { connect: { id: user.id } },
              bucket: { connect: { id: bucketId } },
            },
          });
        }

        // Update user's funds
        await tx.userProjectFunds.update({
          where: {
            userId_projectId: {
              userId: user.id,
              projectId: bucket.projectId,
            },
          },
          data: {
            fundsLeft: userFunds.fundsLeft - amountChange,
          },
        });

        return pledge;
      });

      return NextResponse.json(result, { status: 201 });
    } catch (error) {
      console.error("Error managing pledge:", error);
      return NextResponse.json(
        { error: "Failed to manage pledge" },
        { status: 500 }
      );
    }
  }
);

// GET - Get a user's current pledge for a bucket
export const GET = withAuth(
  async (request: NextRequest, user, { bucketId }) => {
    try {
      const pledge = await prisma.pledge.findFirst({
        where: {
          userId: user.id,
          bucketId: bucketId,
        },
      });

      return NextResponse.json(pledge || { amount: 0 });
    } catch (error) {
      console.error("Error fetching pledge:", error);
      return NextResponse.json(
        { error: "Failed to fetch pledge" },
        { status: 500 }
      );
    }
  }
);
