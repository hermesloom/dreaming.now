"use client";

import { useState, useEffect } from "react";
import { BadgeEuro, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AssignFundsDialog from "@/components/buckets/AssignFundsDialog";
import { fetchAuth } from "@/lib/fetch";

interface AssignFundsButtonProps {
  projectSlug: string;
  bucketId: string;
  bucketTitle: string;
  status: "OPEN" | "CLOSED";
  fundsLeft: number;
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
  fundsLeft,
  onFundsAssigned,
  size = "default",
  className = "",
  stopPropagation = true, // Set default to true
}: AssignFundsButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPledge, setCurrentPledge] = useState<{ amount: number } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the user's current pledge for this bucket
  useEffect(() => {
    const fetchPledge = async () => {
      setIsLoading(true);
      try {
        const response = await fetchAuth(
          `/api/projects/${projectSlug}/buckets/${bucketId}/pledge`
        );

        if (response.ok) {
          const data = await response.json();
          setCurrentPledge(data.amount > 0 ? data : null);
        }
      } catch (error) {
        console.error("Error fetching pledge:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPledge();
  }, [projectSlug, bucketId]);

  const handleClick = (e: React.MouseEvent) => {
    if (stopPropagation) {
      e.stopPropagation();
    }
    setDialogOpen(true);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(amount);
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

  if (isLoading) {
    return (
      <Button
        size={size}
        variant="outline"
        className={`${buttonStyles[size]} ${className}`}
        disabled
      >
        Loading...
      </Button>
    );
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div onClick={handleWrapperClick}>
              <Button
                size={size}
                variant={currentPledge ? "default" : "outline"}
                className={`${buttonStyles[size]} ${className}`}
                onClick={handleClick}
                disabled={
                  status !== "OPEN" || (fundsLeft <= 0 && !currentPledge)
                }
              >
                {currentPledge ? (
                  <>
                    <Edit className={iconStyles[size]} />
                    Assigned {formatCurrency(currentPledge.amount)}
                  </>
                ) : (
                  <>
                    <BadgeEuro className={iconStyles[size]} />
                    Assign Funds
                  </>
                )}
              </Button>
            </div>
          </TooltipTrigger>
          {status !== "OPEN" ? (
            <TooltipContent onClick={handleWrapperClick}>
              <p>This bucket is closed and not accepting funds</p>
            </TooltipContent>
          ) : fundsLeft <= 0 && !currentPledge ? (
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
        fundsLeft={fundsLeft}
        currentPledgeAmount={currentPledge?.amount || 0}
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
