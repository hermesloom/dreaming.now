import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import { Profile } from "@/lib/types";

export const GET = withAuth(async (req: NextRequest, user) => {
  try {
    // User data is already available from withAuth
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user profile data
    const profile: Profile = {
      id: user.id,
      isAdmin: user.isAdmin,
    };
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
