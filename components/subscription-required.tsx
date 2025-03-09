"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function SubscriptionRequired() {
  const t = useTranslations("subscription");
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-background/90">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg border border-border">
        <div className="flex justify-center">
          <Image
            src="https://divizend.com/divizend.svg"
            alt="Divizend logo"
            width={180}
            height={60}
            className="h-12 w-auto"
          />
        </div>

        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-bold">{t("subscriptionRequired")}</h1>
          <p className="text-muted-foreground">
            {t("subscriptionDescription")}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Button
            variant="default"
            className="w-full"
            onClick={() =>
              window.open("https://divizend.com/pricing", "_blank")
            }
          >
            {t("upgrade")}
          </Button>

          <Button variant="outline" className="w-full" onClick={logout}>
            {t("logout")}
          </Button>
        </div>
      </div>
    </div>
  );
}
