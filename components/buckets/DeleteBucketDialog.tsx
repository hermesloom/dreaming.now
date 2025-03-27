"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
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
import { toast } from "sonner";
import { fetchAuth } from "@/lib/fetch";

interface Bucket {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "CLOSED";
  createdAt: string;
}

interface DeleteBucketDialogProps {
  projectSlug: string;
  bucket: Bucket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBucketDeleted: (bucketId: string) => void;
}

export default function DeleteBucketDialog({
  projectSlug,
  bucket,
  open,
  onOpenChange,
  onBucketDeleted,
}: DeleteBucketDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteBucket = async () => {
    if (!bucket) return;

    setIsSubmitting(true);

    try {
      const response = await fetchAuth(
        `/api/projects/${projectSlug}/buckets/${bucket.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete bucket");
      }

      toast.success("Bucket deleted successfully");
      onBucketDeleted(bucket.id);

      // Only close the dialog after the operation is complete
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting bucket:", error);
      toast.error("Failed to delete bucket");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom handler that prevents dialog from closing during submission
  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      onOpenChange(newOpen);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the bucket "{bucket?.title}". This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDeleteBucket();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
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
