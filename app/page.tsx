"use client";

import { useEffect, useState } from "react";
import ProjectList from "@/components/ProjectList";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSession } from "@/contexts/SessionContext";
import LoginButton from "@/components/LoginButton";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { profile, profileLoading } = useSession();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {profileLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : profile ? (
          <ProjectList />
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4 border rounded-lg my-8">
            <h2 className="text-2xl font-bold mb-4">Welcome to dreaming.now</h2>
            <p className="text-muted-foreground max-w-md mb-8">
              To view projects and distribute funds, please login with your
              Divizend account.
            </p>
            <LoginButton />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
