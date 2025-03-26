import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, User } from "@/generated/prisma";

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
export function withAuth(
  handler: (req: NextRequest, user: User) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const prisma = new PrismaClient();

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
      return handler(req, session.user);
    } catch (error) {
      console.error("Authentication error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
