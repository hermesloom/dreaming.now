import { NextResponse } from "next/server";
import { AuthRequest, AuthOrigin, DivizendProfile } from "@/lib/auth";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const authRequest: AuthRequest = await request.json();

    // currently only divizend is supported
    if (authRequest.origin === AuthOrigin.Divizend) {
      // convert the code to a session token
      const divizendSessionTokenRequest = await fetch(
        "https://api.divizend.com/v1/auth/sessionToken/" +
          authRequest.payload.code
      );
      if (!divizendSessionTokenRequest.ok) {
        throw new Error("Failed to fetch session token");
      }
      const divizendSessionToken: string = (
        await divizendSessionTokenRequest.json()
      ).sessionToken;

      // fetch the user's profile to get the user ID
      const divizendProfileRequest = await fetch(
        "https://api.divizend.com/v1/users/me",
        {
          headers: {
            "X-SessionToken": divizendSessionToken,
          },
        }
      );
      if (!divizendProfileRequest.ok) {
        throw new Error("Failed to fetch profile");
      }
      const divizendProfile: DivizendProfile =
        await divizendProfileRequest.json();

      // check if the user exists in the database. If not, create a new user
      let user = await prisma.user.findUnique({
        where: {
          id: divizendProfile.id,
        },
      });
      if (!user) {
        user = await prisma.user.create({
          data: {
            id: divizendProfile.id,
          },
        });
      }

      // create a session for the user
      const session = await prisma.session.create({
        data: {
          userId: user.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        },
      });

      // return the session token
      return NextResponse.json({ sessionToken: session.token });
    }

    return NextResponse.json({ error: "Invalid origin" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
