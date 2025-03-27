"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { fetchAuth } from "@/lib/fetch";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface BudgetItem {
  id: string;
  description: string;
  amount: number;
}

interface DeleteBudgetItemDialogProps {
  projectSlug: string;
  bucketId: string;
  budgetItem: BudgetItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBudgetItemDeleted: (id: string) => void;
}

export default function DeleteBudgetItemDialog({
  projectSlug,
  bucketId,
  budgetItem,
  open,
  onOpenChange,
  onBudgetItemDeleted,
}: DeleteBudgetItemDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!budgetItem) return;

    setIsDeleting(true);

    try {
      const response = await fetchAuth(
        `/api/projects/${projectSlug}/buckets/${bucketId}/budget-items/${budgetItem.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete budget item");
      }

      await response.json();
      onBudgetItemDeleted(budgetItem.id);
      toast.success("Budget item deleted successfully");
    } catch (error) {
      console.error("Error deleting budget item:", error);
      toast.error("Failed to delete budget item");
    } finally {
      setIsDeleting(false);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Budget Item</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this budget item? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="bg-destructive text-white hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
