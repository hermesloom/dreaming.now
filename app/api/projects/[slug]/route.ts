import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// Helper function to validate slug format
function validateSlug(slug: string): boolean {
  // Only allow lowercase letters, numbers, and hyphens
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

// GET - Get a single project by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const project = await prisma.project.findUnique({
      where: { slug },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// PUT - Update a project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { name, description, newSlug } = await request.json();

    if (!name && !description && !newSlug) {
      return NextResponse.json(
        { error: "At least one field to update is required" },
        { status: 400 }
      );
    }

    const existingProject = await prisma.project.findUnique({
      where: { slug },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
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
          { error: "This slug is already in use. Please choose another one." },
          { status: 400 }
        );
      }
    }

    const updatedProject = await prisma.project.update({
      where: { slug },
      data: {
        name: name || existingProject.name,
        description: description || existingProject.description,
        ...(newSlug && newSlug !== slug ? { slug: newSlug } : {}),
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const existingProject = await prisma.project.findUnique({
      where: { slug },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

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
