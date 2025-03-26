"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthOrigin, AuthRequest } from "@/lib/auth";
import { useSession } from "@/contexts/SessionContext";

export default function AuthCode() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  const [loading, setLoading] = useState(true);
  const { refreshProfile } = useSession();

  useEffect(() => {
    async function fetchSessionToken() {
      try {
        const authRequest: AuthRequest = {
          origin: AuthOrigin.Divizend,
          payload: { code },
        };

        setLoading(true);
        const response = await fetch(`/api/auth`, {
          method: "POST",
          body: JSON.stringify(authRequest),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }

        const data = await response.json();
        console.log("Session token data:", data);

        // Redirect to root page on success
        toast.success("Login successful");
        localStorage.setItem("sessionToken", data.sessionToken);
        refreshProfile();
        router.push("/");
      } catch (err) {
        console.error("Error fetching session token:", err);
        // Show toast notification for error
        toast.error(err instanceof Error ? err.message : "Login failed");
        setLoading(false);
      }
    }

    if (code) {
      fetchSessionToken();
    }
  }, [code, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {loading && (
        <>
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">
            You are being signed in...
          </p>
        </>
      )}
    </div>
  );
}
