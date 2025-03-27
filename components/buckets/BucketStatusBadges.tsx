"use client";

import { Badge } from "@/components/ui/badge";
import { calculateBucketProgress } from "@/lib/utils";
import { Bucket } from "@/lib/types";

interface BucketStatusBadgesProps {
  bucket: Bucket;
  className?: string;
  showDate?: boolean;
  // Allow overriding progress if needed
  overrideProgress?: number;
}

export default function BucketStatusBadges({
  bucket,
  className = "",
  showDate = true,
  overrideProgress,
}: BucketStatusBadgesProps) {
  // Calculate progress percentage from the bucket data
  const progressPercentage =
    overrideProgress !== undefined
      ? overrideProgress
      : calculateBucketProgress(bucket);

  const getStatusBadge = (status: string) => {
    if (status === "OPEN") {
      return <Badge className="bg-blue-500">Open</Badge>;
    }
    return <Badge variant="secondary">Closed</Badge>;
  };

  const getFundingBadge = (percentage: number) => {
    // Get total budget to check if it's actually zero
    const totalBudget =
      bucket.budgetItems?.reduce((sum, item) => sum + item.amount, 0) || 0;

    if (totalBudget === 0) {
      return <Badge className="bg-green-500">No Funding Required</Badge>;
    } else if (percentage >= 100) {
      return <Badge className="bg-green-500">Fully Funded</Badge>;
    }
    return (
      <Badge variant="outline" className="text-amber-600 border-amber-500">
        Partially Funded
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {getStatusBadge(bucket.status)}
      {getFundingBadge(progressPercentage)}
      {showDate && bucket.createdAt && (
        <span className="text-xs text-muted-foreground">
          Created on {formatDate(bucket.createdAt)}
        </span>
      )}
    </div>
  );
}
