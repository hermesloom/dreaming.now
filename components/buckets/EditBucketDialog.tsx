"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { fetchAuth } from "@/lib/fetch";
import { Bucket } from "@/lib/types";

interface EditBucketDialogProps {
  projectSlug: string;
  bucket: Bucket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBucketUpdated: (bucket: Bucket) => void;
}

export default function EditBucketDialog({
  projectSlug,
  bucket,
  open,
  onOpenChange,
  onBucketUpdated,
}: EditBucketDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "OPEN" as "OPEN" | "CLOSED",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (bucket) {
      setFormData({
        title: bucket.title,
        description: bucket.description,
        status: bucket.status,
      });
    }
  }, [bucket]);

  const handleUpdateBucket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bucket) return;

    setIsSubmitting(true);

    try {
      const response = await fetchAuth(
        `/api/projects/${projectSlug}/buckets/${bucket.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(
          response.status < 500
            ? (await response.json()).error
            : "Unknown error"
        );
      }

      const updatedBucket = await response.json();
      onBucketUpdated(updatedBucket);
      onOpenChange(false);
      toast.success("Bucket updated successfully");
    } catch (error) {
      console.error("Error updating bucket:", error);
      toast.error(
        "Failed to update bucket" +
          (error instanceof Error ? ": " + error.message : "")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Edit Bucket</DialogTitle>
          <DialogDescription>
            Update the bucket details and status.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpdateBucket} className="flex flex-col flex-1">
          <div className="space-y-4 py-4 overflow-y-auto px-1">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Bucket title"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Bucket description"
                required
                className="min-h-[150px] max-h-[300px] resize-none overflow-y-auto"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as "OPEN" | "CLOSED",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex-shrink-0 pt-2">
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
