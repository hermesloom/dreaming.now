import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Helper function to create a URL-friendly slug
function validateSlug(slug: string): boolean {
  // Only allow lowercase letters, numbers, and hyphens
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

// GET - List all projects where the user has funds
export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    // Get all UserProjectFunds for the current user with their related projects
    const userProjectFunds = await prisma.userProjectFunds.findMany({
      where: { userId: user.id },
      include: {
        project: true,
      },
      orderBy: {
        project: {
          createdAt: "desc",
        },
      },
    });

    // Transform the data to return projects with their funds information
    const projects = userProjectFunds.map((fund) => ({
      ...fund.project,
      fundsLeft: fund.fundsLeft,
      currency: fund.currency,
      isAdmin: fund.isAdmin,
      webhookSecret: undefined,
    }));

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
});

// POST - Create a new project
export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const { name, description, slug } = await request.json();

    if (!name || !description || !slug) {
      return NextResponse.json(
        { error: "Name, description, and slug are required" },
        { status: 400 }
      );
    }

    // Validate the slug format
    if (!validateSlug(slug)) {
      return NextResponse.json(
        {
          error:
            "Slug must contain only lowercase letters, numbers, and hyphens. Cannot start or end with a hyphen.",
        },
        { status: 400 }
      );
    }

    // Check if slug is already in use
    const existingProject = await prisma.project.findUnique({
      where: { slug },
    });

    if (existingProject) {
      return NextResponse.json(
        { error: "This slug is already in use. Please choose another one." },
        { status: 400 }
      );
    }

    // Create the project and the admin UserProjectFunds in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create project
      const project = await tx.project.create({
        data: {
          name,
          description,
          slug,
        },
      });

      // Create UserProjectFunds with admin rights for the creator
      await tx.userProjectFunds.create({
        data: {
          user: { connect: { id: user.id } },
          project: { connect: { id: project.id } },
          fundsLeft: 0,
          currency: "EUR",
          isAdmin: true,
        },
      });

      return {
        ...project,
        fundsLeft: 0,
        currency: "EUR",
        isAdmin: true,
        webhookSecret: undefined,
      };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
});
