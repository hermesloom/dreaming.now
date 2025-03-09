"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LoginScreen() {
  const t = useTranslations("login");
  const { login } = useAuth();

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
          <h1 className="text-2xl font-bold">{t("welcome")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        <Button onClick={login} className="w-full py-6 text-base" size="lg">
          {t("loginButton")}
        </Button>
      </div>
    </div>
  );
}
