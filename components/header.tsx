"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/language-selector";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";

export default function Header() {
  const t = useTranslations("header");
  const { user, logout } = useAuth();

  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="https://divizend.com/divizend.svg"
            alt="Divizend logo"
            width={140}
            height={40}
            className="h-8 w-auto"
          />
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <LanguageSelector />

          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              {t("logout")}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={logout}
          >
            <LogOutIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

function LogOutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
