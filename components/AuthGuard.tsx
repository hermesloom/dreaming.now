"use client";

import { useSession } from "@/contexts/SessionContext";
import { Loader2 } from "lucide-react";
import LoginButton from "@/components/LoginButton";
import { usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { profile, profileLoading } = useSession();
  const pathname = usePathname();

  // Skip auth check for the auth callback route
  if (pathname?.startsWith("/auth/")) {
    return <>{children}</>;
  }

  if (profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Welcome to dreaming.now
            </h1>
            <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              A platform for collaborative dreaming and resource allocation.
            </p>
          </div>
          <div className="flex justify-center">
            <LoginButton />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
