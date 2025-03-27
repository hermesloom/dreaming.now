import { NextRequest, NextResponse } from "next/server";
import { withAuth, withProjectAdminAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - List all buckets for a project
export const GET = withAuth(async (request: NextRequest, user, { slug }) => {
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const buckets = await prisma.bucket.findMany({
      where: { projectId: project.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(buckets);
  } catch (error) {
    console.error("Error fetching buckets:", error);
    return NextResponse.json(
      { error: "Failed to fetch buckets" },
      { status: 500 }
    );
  }
});

// POST - Create a new bucket
export const POST = withProjectAdminAuth(
  async (request: NextRequest, user, project, { slug }) => {
    try {
      const { title, description } = await request.json();

      if (!title || !description) {
        return NextResponse.json(
          { error: "Title and description are required" },
          { status: 400 }
        );
      }

      const newBucket = await prisma.bucket.create({
        data: {
          title,
          description,
          projectId: project.id,
        },
      });

      return NextResponse.json(newBucket);
    } catch (error) {
      console.error("Error creating bucket:", error);
      return NextResponse.json(
        { error: "Failed to create bucket" },
        { status: 500 }
      );
    }
  }
);
