"use client";

import { useState } from "react";
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
import { toast } from "sonner";
import { fetchAuth } from "@/lib/fetch";

interface Bucket {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "CLOSED";
  createdAt: string;
}

interface CreateBucketDialogProps {
  projectSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBucketCreated: (bucket: Bucket) => void;
}

export default function CreateBucketDialog({
  projectSlug,
  open,
  onOpenChange,
  onBucketCreated,
}: CreateBucketDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateBucket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetchAuth(`/api/projects/${projectSlug}/buckets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          response.status < 500
            ? (await response.json()).error
            : "Unknown error"
        );
      }

      const newBucket = await response.json();
      onBucketCreated(newBucket);
      setFormData({ title: "", description: "" });
      onOpenChange(false);
      toast.success("Bucket created successfully");
    } catch (error) {
      console.error("Error creating bucket:", error);
      toast.error(
        "Failed to create bucket" +
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
          <DialogTitle>Create New Bucket</DialogTitle>
          <DialogDescription>
            Create a new bucket to collect ideas for the project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateBucket} className="flex flex-col flex-1">
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
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
