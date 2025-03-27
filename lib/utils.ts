import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate the funding progress percentage for a bucket
 * @param totalBudget The total budget amount
 * @param totalPledged The total pledged amount
 * @returns Progress percentage (not capped at 100%)
 */
export function calculateProgressPercentage(
  totalBudget: number,
  totalPledged: number
): number {
  if (totalBudget <= 0) return 100; // If no budget is set, consider it 100% funded
  return Math.round((totalPledged / totalBudget) * 100);
}

/**
 * Calculate the funding progress percentage from a bucket object
 * @param bucket The bucket object containing budgetItems and pledges
 * @returns Progress percentage (not capped at 100%)
 */
export function calculateBucketProgress(bucket: {
  budgetItems?: Array<{ amount: number }>;
  pledges?: Array<{ amount: number }>;
}): number {
  const totalBudget =
    bucket.budgetItems?.reduce((sum, item) => sum + item.amount, 0) || 0;

  const totalPledged =
    bucket.pledges?.reduce((sum, pledge) => sum + pledge.amount, 0) || 0;

  return calculateProgressPercentage(totalBudget, totalPledged);
}
