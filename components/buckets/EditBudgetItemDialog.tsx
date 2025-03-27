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

interface BudgetItem {
  id: string;
  description: string;
  amount: number;
  currency: string;
  createdAt: string;
}

interface EditBudgetItemDialogProps {
  projectSlug: string;
  bucketId: string;
  budgetItem: BudgetItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBudgetItemUpdated: (budgetItem: BudgetItem) => void;
}

export default function EditBudgetItemDialog({
  projectSlug,
  bucketId,
  budgetItem,
  open,
  onOpenChange,
  onBudgetItemUpdated,
}: EditBudgetItemDialogProps) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (budgetItem) {
      setFormData({
        description: budgetItem.description,
        amount: budgetItem.amount.toString(),
      });
    }
  }, [budgetItem]);

  const handleUpdateBudgetItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budgetItem) return;

    setIsSubmitting(true);

    try {
      const response = await fetchAuth(
        `/api/projects/${projectSlug}/buckets/${bucketId}/budget-items/${budgetItem.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error");
      }

      const updatedBudgetItem = await response.json();
      onBudgetItemUpdated(updatedBudgetItem);
      onOpenChange(false);
      toast.success("Budget item updated successfully");
    } catch (error) {
      console.error("Error updating budget item:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update budget item"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Budget Item</DialogTitle>
          <DialogDescription>
            Update the details of this budget item.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpdateBudgetItem}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Item description"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Amount
              </label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  step="0.01"
                  min="0.01"
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
