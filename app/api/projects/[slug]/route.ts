import { NextRequest, NextResponse } from "next/server";
import { withAuth, withProjectAdminAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Helper function to validate slug format
function validateSlug(slug: string): boolean {
  // Only allow lowercase letters, numbers, and hyphens
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

// GET - Get a single project by slug
export const GET = withAuth(async (request: NextRequest, user, { slug }) => {
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        buckets: {
          orderBy: { createdAt: "desc" },
          include: {
            budgetItems: {
              select: {
                id: true,
                amount: true,
              },
            },
            pledges: {
              select: {
                id: true,
                amount: true,
              },
            },
          },
        },
        userFunds: {
          where: { userId: user.id },
          select: {
            fundsLeft: true,
            isAdmin: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Calculate total funds left for the user in this project
    const fundsLeft = project.userFunds[0]?.fundsLeft || 0;
    const isAdmin = project.userFunds[0]?.isAdmin || false;

    return NextResponse.json({
      ...project,
      fundsLeft,
      isAdmin,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
});

// PUT - Update a project
export const PUT = withProjectAdminAuth(
  async (request: NextRequest, user, project, { slug }) => {
    try {
      const { name, description, newSlug } = await request.json();

      if (!name && !description && !newSlug) {
        return NextResponse.json(
          { error: "At least one field to update is required" },
          { status: 400 }
        );
      }

      // If slug is being updated, validate it
      if (newSlug && newSlug !== slug) {
        // Validate the slug format
        if (!validateSlug(newSlug)) {
          return NextResponse.json(
            {
              error:
                "Slug must contain only lowercase letters, numbers, and hyphens. Cannot start or end with a hyphen.",
            },
            { status: 400 }
          );
        }

        // Check if the new slug is already in use
        const slugExists = await prisma.project.findUnique({
          where: { slug: newSlug },
        });

        if (slugExists) {
          return NextResponse.json(
            {
              error: "This slug is already in use. Please choose another one.",
            },
            { status: 400 }
          );
        }
      }

      const updatedProject = await prisma.project.update({
        where: { slug },
        data: {
          name: name || project.name,
          description: description || project.description,
          ...(newSlug && newSlug !== slug ? { slug: newSlug } : {}),
        },
        include: {
          buckets: true,
        },
      });

      const projectWithFunds = await prisma.userProjectFunds.findFirst({
        where: {
          projectId: updatedProject.id,
          userId: user.id,
        },
        select: {
          fundsLeft: true,
          isAdmin: true,
        },
      });

      return NextResponse.json({
        ...updatedProject,
        fundsLeft: projectWithFunds?.fundsLeft || 0,
        isAdmin: projectWithFunds?.isAdmin || false,
      });
    } catch (error) {
      console.error("Error updating project:", error);
      return NextResponse.json(
        { error: "Failed to update project" },
        { status: 500 }
      );
    }
  }
);

// DELETE - Delete a project
export const DELETE = withProjectAdminAuth(
  async (request: NextRequest, user, project, { slug }) => {
    try {
      await prisma.project.delete({
        where: { slug },
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting project:", error);
      return NextResponse.json(
        { error: "Failed to delete project" },
        { status: 500 }
      );
    }
  }
);
