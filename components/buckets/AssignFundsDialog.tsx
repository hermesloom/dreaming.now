"use client";

import { useState, useEffect } from "react";
import { Loader2, BadgeEuro } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { fetchAuth } from "@/lib/fetch";

interface AssignFundsDialogProps {
  projectSlug: string;
  bucketId: string;
  bucketTitle: string;
  fundsLeft: number;
  currentPledgeAmount?: number;
  currency: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function AssignFundsDialog({
  projectSlug,
  bucketId,
  bucketTitle,
  fundsLeft,
  currentPledgeAmount = 0,
  currency,
  open,
  onOpenChange,
  onSuccess,
}: AssignFundsDialogProps) {
  const [amount, setAmount] = useState<number | "">(currentPledgeAmount);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingPledge, setIsFetchingPledge] = useState(false);

  // Fetch current pledge when dialog opens
  useEffect(() => {
    if (open) {
      fetchCurrentPledge();
    }
  }, [open, bucketId]);

  const fetchCurrentPledge = async () => {
    setIsFetchingPledge(true);
    try {
      const response = await fetchAuth(
        `/api/projects/${projectSlug}/buckets/${bucketId}/pledge`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch current pledge");
      }

      const data = await response.json();
      setAmount(data.amount || 0);
    } catch (error) {
      console.error("Error fetching pledge:", error);
      // Don't show error toast as this is not a critical failure
    } finally {
      setIsFetchingPledge(false);
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Calculate total available funds including current pledge
  const totalAvailable = fundsLeft + currentPledgeAmount;

  const handleAssignFunds = async (e: React.FormEvent) => {
    e.preventDefault();

    if (amount === "" || amount < 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (amount > totalAvailable) {
      toast.error("Amount exceeds your available funds");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetchAuth(
        `/api/projects/${projectSlug}/buckets/${bucketId}/pledge`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to assign funds");
      }

      await response.json();
      toast.success("Funds assigned successfully");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error assigning funds:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to assign funds"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Block propagation for dialog clicks
  const blockPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" onClick={blockPropagation}>
        <DialogHeader>
          <DialogTitle>
            {currentPledgeAmount > 0 ? "Update Funds" : "Assign Funds"}
          </DialogTitle>
          <DialogDescription>
            {currentPledgeAmount > 0
              ? `Adjust your assigned funds for "${bucketTitle}"`
              : `Assign your available funds to "${bucketTitle}"`}
          </DialogDescription>
        </DialogHeader>
        {isFetchingPledge ? (
          <div className="py-4 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={handleAssignFunds}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="amount" className="text-sm font-medium">
                    Amount
                  </label>
                  <span className="text-sm text-muted-foreground">
                    Available: {formatCurrency(totalAvailable)}
                  </span>
                </div>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    value={amount === "" ? "" : amount}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAmount(val === "" ? "" : parseFloat(val));
                    }}
                    step="0.01"
                    min="0"
                    max={totalAvailable}
                    placeholder="0.00"
                    className="pl-8"
                    required
                  />
                  <BadgeEuro className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  (typeof amount === "number" &&
                    (amount < 0 || amount > totalAvailable)) ||
                  amount === ""
                }
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {currentPledgeAmount > 0
                      ? amount === 0
                        ? "Removing..."
                        : "Updating..."
                      : "Assigning..."}
                  </>
                ) : currentPledgeAmount > 0 ? (
                  amount === 0 ? (
                    "Remove Funds"
                  ) : (
                    "Update Funds"
                  )
                ) : (
                  "Assign Funds"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
