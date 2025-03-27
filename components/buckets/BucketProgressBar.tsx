"use client";

import { Progress } from "@/components/ui/progress";
import { calculateProgressPercentage } from "@/lib/utils";

interface BucketProgressBarProps {
  totalBudget: number;
  totalPledged: number;
  size?: "default" | "small";
  showAmounts?: boolean;
  currency?: string;
}

export default function BucketProgressBar({
  totalBudget,
  totalPledged,
  size = "default",
  showAmounts = true,
  currency = "EUR",
}: BucketProgressBarProps) {
  // Calculate progress percentage (capped at 100%)
  const progressPercentage = calculateProgressPercentage(
    totalBudget,
    totalPledged
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="w-full">
      {showAmounts && (
        <div className="flex justify-between items-center mb-2">
          <span
            className={size === "small" ? "text-xs" : "text-sm font-medium"}
          >
            Funding Progress: {progressPercentage}%
          </span>
          <span
            className={`${
              size === "small" ? "text-xs" : "text-sm"
            } text-muted-foreground`}
          >
            {formatCurrency(totalPledged)} of {formatCurrency(totalBudget)}
          </span>
        </div>
      )}
      <Progress
        value={progressPercentage}
        className={size === "small" ? "h-1" : "h-2"}
      />
    </div>
  );
}
