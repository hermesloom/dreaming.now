"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/auth-context";
import LoginScreen from "@/components/login-screen";
import SubscriptionRequired from "@/components/subscription-required";
import Header from "@/components/header";
import BrainstormView from "@/components/brainstorm-view";
import DistributeView from "@/components/distribute-view";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ViewMode = "brainstorm" | "distribute";

export default function MainApp() {
  const t = useTranslations("app");
  const { user, isLoading } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("brainstorm");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (!user.isSubscribed) {
    return <SubscriptionRequired />;
  }

  // Dates for the phases
  const brainstormEndDate = "2025-03-14";
  const distributeEndDate = "2025-03-28";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <Tabs
            defaultValue={viewMode}
            onValueChange={(v) => setViewMode(v as ViewMode)}
            className="w-full"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <TabsList>
                <TabsTrigger value="brainstorm">{t("brainstorm")}</TabsTrigger>
                <TabsTrigger value="distribute">{t("distribute")}</TabsTrigger>
              </TabsList>

              <div className="text-sm text-muted-foreground mt-2 sm:mt-0">
                {viewMode === "brainstorm"
                  ? t("until", { date: brainstormEndDate })
                  : t("until", { date: distributeEndDate })}
              </div>
            </div>
          </Tabs>
        </div>

        {viewMode === "brainstorm" ? <BrainstormView /> : <DistributeView />}
      </main>
    </div>
  );
}
