import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";

export const GET = withAuth(async (req: NextRequest, user) => {
  try {
    // User data is already available from withAuth
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user profile data
    return NextResponse.json({
      id: user.id,
      funds: user.funds,
    });
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
