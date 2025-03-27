"use client";

import { useState } from "react";
import { BadgeEuro } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AssignFundsDialog from "@/components/buckets/AssignFundsDialog";

interface AssignFundsButtonProps {
  projectSlug: string;
  bucketId: string;
  bucketTitle: string;
  status: "OPEN" | "CLOSED";
  userFunds: number;
  onFundsAssigned?: () => void;
  size?: "default" | "sm"; // Allow different sizes
  className?: string;
  stopPropagation?: boolean; // Useful when inside clickable containers
}

export default function AssignFundsButton({
  projectSlug,
  bucketId,
  bucketTitle,
  status,
  userFunds,
  onFundsAssigned,
  size = "default",
  className = "",
  stopPropagation = true, // Set default to true
}: AssignFundsButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (stopPropagation) {
      e.stopPropagation();
    }
    setDialogOpen(true);
  };

  // Adjust styles based on size
  const buttonStyles = {
    default: "flex items-center gap-2",
    sm: "flex items-center gap-1 h-7 text-xs",
  };

  const iconStyles = {
    default: "h-4 w-4",
    sm: "h-3.5 w-3.5",
  };

  // Stop propagation handler for wrapper div
  const handleWrapperClick = (e: React.MouseEvent) => {
    if (stopPropagation) {
      e.stopPropagation();
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div onClick={handleWrapperClick}>
              <Button
                size={size}
                variant="outline"
                className={`${buttonStyles[size]} ${className}`}
                onClick={handleClick}
                disabled={status !== "OPEN" || userFunds <= 0}
              >
                <BadgeEuro className={iconStyles[size]} />
                Assign Funds
              </Button>
            </div>
          </TooltipTrigger>
          {status !== "OPEN" ? (
            <TooltipContent onClick={handleWrapperClick}>
              <p>This bucket is closed and not accepting funds</p>
            </TooltipContent>
          ) : userFunds <= 0 ? (
            <TooltipContent onClick={handleWrapperClick}>
              <p>You don't have any funds available in this project</p>
            </TooltipContent>
          ) : null}
        </Tooltip>
      </TooltipProvider>

      <AssignFundsDialog
        projectSlug={projectSlug}
        bucketId={bucketId}
        bucketTitle={bucketTitle}
        availableFunds={userFunds}
        currency="EUR"
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => {
          if (onFundsAssigned) onFundsAssigned();
        }}
      />
    </>
  );
}
