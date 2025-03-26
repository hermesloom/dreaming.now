"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useSession } from "@/contexts/SessionContext";

export default function LoginButton() {
  const { profile, profileLoading, refreshProfile, logout } = useSession();

  // Show loading indicator while profile is loading
  if (profileLoading) {
    return (
      <Button variant="outline" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  if (profile) {
    return (
      <Button variant="outline" onClick={logout}>
        Logout
      </Button>
    );
  }

  const environment =
    process.env.NODE_ENV === "production" ? "dreaming.now" : "local-dev";

  return (
    <a href={`https://api.divizend.com/v1/auth?app=${environment}`}>
      <Button variant="default">Login with Divizend</Button>
    </a>
  );
}
