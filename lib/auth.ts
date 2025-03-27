import { NextRequest, NextResponse } from "next/server";
import { User, Project } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export enum AuthOrigin {
  Divizend = "divizend",
}

export interface AuthRequest {
  origin: AuthOrigin;
  payload: {
    code: string;
  };
}

// Higher-order function to protect API routes with authentication
export function withAuth<Params extends Record<string, string>>(
  handler: (
    req: NextRequest,
    user: User,
    params: Params
  ) => Promise<NextResponse>
) {
  return async (req: NextRequest, { params }: { params: Promise<Params> }) => {
    const actualParams = await params;

    try {
      // Get the Authorization header
      const authHeader = req.headers.get("Authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
          { error: "Unauthorized: No valid token provided" },
          { status: 401 }
        );
      }

      // Extract the token
      const token = authHeader.split(" ")[1];

      // Find the session with this token
      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
      });

      // Check if session exists and hasn't expired
      if (
        !session ||
        (session.expiresAt && new Date(session.expiresAt) < new Date())
      ) {
        return NextResponse.json(
          { error: "Unauthorized: Invalid or expired token" },
          { status: 401 }
        );
      }

      // Pass the user data to the handler
      return handler(req, session.user, actualParams);
    } catch (error) {
      console.error("Authentication error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

// Higher-order function that checks if the user is a project admin
export function withProjectAdminAuth<
  Params extends Record<string, string> & { slug: string }
>(
  handler: (
    req: NextRequest,
    user: User,
    project: Project,
    params: Params
  ) => Promise<NextResponse>
) {
  // Use withAuth as the base and add additional project admin check
  return withAuth(async (req: NextRequest, user: User, params: Params) => {
    try {
      // Extract the slug from params
      const { slug } = params;

      if (!slug) {
        return NextResponse.json(
          { error: "Project slug is required" },
          { status: 400 }
        );
      }

      // Find the project
      const project = await prisma.project.findUnique({
        where: { slug },
      });

      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }

      // Check if the user is an admin for this project
      const userProjectFunds = await prisma.userProjectFunds.findFirst({
        where: {
          projectId: project.id,
          userId: user.id,
        },
      });

      if (!userProjectFunds || !userProjectFunds.isAdmin) {
        return NextResponse.json(
          {
            error:
              "Unauthorized: You must be a project admin to perform this action",
          },
          { status: 403 }
        );
      }

      // If the user is an admin, pass the request to the handler
      return handler(req, user, project, params);
    } catch (error) {
      console.error("Project admin authentication error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
