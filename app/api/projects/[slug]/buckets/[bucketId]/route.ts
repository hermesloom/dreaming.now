import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { withAuth, withProjectAdminAuth } from "@/lib/auth";

const prisma = new PrismaClient();

// GET - Fetch a single bucket with all related data
export const GET = withAuth(
  async (request: NextRequest, user, { bucketId }) => {
    try {
      const bucket = await prisma.bucket.findUnique({
        where: { id: bucketId },
        include: {
          budgetItems: true,
          pledges: true,
        },
      });

      if (!bucket) {
        return NextResponse.json(
          { error: "Bucket not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(bucket);
    } catch (error) {
      console.error("Error fetching bucket:", error);
      return NextResponse.json(
        { error: "Failed to fetch bucket" },
        { status: 500 }
      );
    }
  }
);

// PUT - Update a bucket
export const PUT = withProjectAdminAuth(
  async (request: NextRequest, user, project, { bucketId }) => {
    try {
      const { title, description, status } = await request.json();

      if (!title && !description && !status) {
        return NextResponse.json(
          { error: "At least one field to update is required" },
          { status: 400 }
        );
      }

      const existingBucket = await prisma.bucket.findUnique({
        where: { id: bucketId },
      });

      if (!existingBucket) {
        return NextResponse.json(
          { error: "Bucket not found" },
          { status: 404 }
        );
      }

      const updatedBucket = await prisma.bucket.update({
        where: { id: bucketId },
        data: {
          title: title || existingBucket.title,
          description: description || existingBucket.description,
          status: status || existingBucket.status,
        },
      });

      return NextResponse.json(updatedBucket);
    } catch (error) {
      console.error("Error updating bucket:", error);
      return NextResponse.json(
        { error: "Failed to update bucket" },
        { status: 500 }
      );
    }
  }
);

// DELETE - Delete a bucket
export const DELETE = withProjectAdminAuth(
  async (request: NextRequest, user, project, { bucketId }) => {
    try {
      const existingBucket = await prisma.bucket.findUnique({
        where: { id: bucketId },
      });

      if (!existingBucket) {
        return NextResponse.json(
          { error: "Bucket not found" },
          { status: 404 }
        );
      }

      await prisma.bucket.delete({
        where: { id: bucketId },
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting bucket:", error);
      return NextResponse.json(
        { error: "Failed to delete bucket" },
        { status: 500 }
      );
    }
  }
);
