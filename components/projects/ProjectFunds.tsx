"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProjectFundsProps {
  amount: number;
  currency?: string;
  onReload: () => void;
  isReloading: boolean;
  isLoading: boolean;
}

export default function ProjectFunds({
  amount,
  currency = "EUR",
  onReload,
  isReloading,
  isLoading,
}: ProjectFundsProps) {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Handle reload button click
  const handleReload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onReload();
  };

  return (
    <div className="text-center mb-8 p-6 border rounded-md">
      <div className="flex justify-center items-center gap-2 mb-2">
        <p className="text-muted-foreground">Available funds to distribute</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleReload}
                disabled={isReloading || isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isReloading ? "animate-spin" : ""}`}
                />
                <span className="sr-only">Reload project</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh project data</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="text-4xl font-bold">{formatCurrency(amount)}</p>
    </div>
  );
}
