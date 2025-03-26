"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { Session, Profile } from "@/lib/types";
import { toast } from "sonner";

const SessionContext = createContext<Session | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const logout = async () => {
    localStorage.removeItem("sessionToken");
    setProfile(null);
    setProfileLoading(false);
    toast.success("Logged out successfully");
  };

  const refreshProfile = async () => {
    const sessionToken = localStorage.getItem("sessionToken");
    if (!sessionToken) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }
    try {
      setProfileLoading(true);
      console.log("Refreshing profile");
      const response = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      if (!response.ok) {
        logout();
        return;
      }
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  return (
    <SessionContext.Provider
      value={{
        profile,
        profileLoading,
        refreshProfile,
        logout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): Session {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
