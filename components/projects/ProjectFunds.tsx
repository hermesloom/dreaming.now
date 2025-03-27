"use client";

import { useState } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
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
  // Ensure amount is a valid number
  const safeAmount = typeof amount === "number" && !isNaN(amount) ? amount : 0;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Handle reload button click
  const handleReload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onReload();
  };

  return (
    <div className="bg-card rounded-lg border p-6 mb-8">
      <div className="flex flex-col items-center text-center">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">
          Available funds to distribute
        </h3>
        <div className="flex items-center gap-2">
          <p className="text-3xl font-bold">{formatCurrency(safeAmount)}</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleReload}
                  disabled={isReloading || isLoading}
                  className="h-8 w-8"
                >
                  {isReloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  <span className="sr-only">Reload</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reload funds</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
