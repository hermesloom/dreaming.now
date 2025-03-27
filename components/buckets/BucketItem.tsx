"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import BucketStatusBadges from "@/components/buckets/BucketStatusBadges";
import { calculateBucketProgress } from "@/lib/utils";
import { Bucket } from "@/lib/types";

interface BucketItemProps {
  bucket: Bucket;
  projectSlug: string;
  onEdit: (bucket: Bucket) => void;
  onDelete: (bucket: Bucket) => void;
  isAdmin: boolean;
}

export default function BucketItem({
  bucket,
  projectSlug,
  onEdit,
  onDelete,
  isAdmin,
}: BucketItemProps) {
  const router = useRouter();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(bucket);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(bucket);
  };

  const navigateToBucket = () => {
    console.log("navigating!");
    router.push(`/${projectSlug}/${bucket.id}`);
  };

  // Calculate totals for the progress bar
  const totalBudget =
    bucket.budgetItems?.reduce((sum, item) => sum + item.amount, 0) || 0;

  // Add the progressPercentage calculation
  const progressPercentage = calculateBucketProgress(bucket);

  // Format currency function
  const formatCurrency = (amount: number, currency: string = "EUR") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div
      onClick={navigateToBucket}
      className="hover:bg-accent/50 cursor-pointer relative border-b last:border-b-0"
    >
      <div className="flex flex-col md:flex-row p-4 gap-3">
        <div className="flex-1">
          <div className="flex flex-col md:flex-row gap-2 md:items-center mb-1">
            <h3 className="font-medium">
              <Link
                href={`/${projectSlug}/${bucket.id}`}
                className="hover:underline"
              >
                {bucket.title}
              </Link>
            </h3>
            <div className="flex items-center gap-2">
              <BucketStatusBadges bucket={bucket} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {bucket.description}
          </p>

          {/* Funding info and assign button */}
          <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center mt-2 mb-1">
            <div className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {progressPercentage}% funded
              </span>{" "}
              · Budget: {formatCurrency(totalBudget)}
            </div>
          </div>
        </div>
        {isAdmin ? (
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-destructive focus:text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : null}
      </div>
    </div>
  );
}
