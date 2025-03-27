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
  availableFunds: number;
  currency: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function AssignFundsDialog({
  projectSlug,
  bucketId,
  bucketTitle,
  availableFunds,
  currency,
  open,
  onOpenChange,
  onSuccess,
}: AssignFundsDialogProps) {
  const [amount, setAmount] = useState<number | "">(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleAssignFunds = async (e: React.FormEvent) => {
    e.preventDefault();

    if (amount === "" || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (amount > availableFunds) {
      toast.error("Amount exceeds your available funds");
      return;
    }

    setIsSubmitting(true);

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
      setIsSubmitting(false);
    }
  };

  // Add this function to block all click events from propagating
  const blockPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" onClick={blockPropagation}>
        <DialogHeader>
          <DialogTitle>Assign Funds</DialogTitle>
          <DialogDescription>
            Assign your available funds to "{bucketTitle}"
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAssignFunds}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="amount" className="text-sm font-medium">
                  Amount
                </label>
                <span className="text-sm text-muted-foreground">
                  Available: {formatCurrency(availableFunds)}
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
                  min="0.01"
                  max={availableFunds}
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
              disabled={isSubmitting || amount <= 0 || amount > availableFunds}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                "Assign Funds"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
