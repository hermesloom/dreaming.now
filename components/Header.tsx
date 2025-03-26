"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import LoginButton from "@/components/LoginButton";
import { useSession } from "@/contexts/SessionContext";

interface HeaderProps {
  onAddProject: () => void;
}

export default function Header({ onAddProject }: HeaderProps) {
  const { profile } = useSession();

  return (
    <header className="w-full py-4 px-6 border-b flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image
          src="/dreaming.now.svg"
          alt="Dreaming Now Logo"
          width={150}
          height={40}
          priority
          className="mr-4"
        />
      </div>

      <div className="flex items-center gap-4">
        {profile?.isAdmin && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-primary">
                  <Shield size={20} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>You have admin access</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <LoginButton />
      </div>
    </header>
  );
}
