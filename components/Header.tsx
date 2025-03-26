"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import LoginButton from "@/components/LoginButton";

interface HeaderProps {
  onAddProject: () => void;
}

export default function Header({ onAddProject }: HeaderProps) {
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              Divizend Live
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Divizend Live</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onAddProject}>
              <Plus size={16} className="mr-2" />
              Add your own project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-4">
        <LoginButton />
      </div>
    </header>
  );
}
