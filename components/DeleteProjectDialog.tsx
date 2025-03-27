"use client";

import { useState } from "react";
import { fetchAuth } from "@/lib/fetch";
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

interface Project {
  id: string;
  name: string;
  description: string;
  slug: string;
  createdAt: string;
}

interface DeleteProjectDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectDeleted: (projectId: string) => void;
}

export default function DeleteProjectDialog({
  project,
  open,
  onOpenChange,
  onProjectDeleted,
}: DeleteProjectDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete project
  const handleDeleteProject = async () => {
    if (!project) return;

    setIsSubmitting(true);

    try {
      const response = await fetchAuth(`/api/projects/${project.slug}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      toast.success("Project deleted successfully");

      // Call the callback to update the parent component's state
      onProjectDeleted(project.id);

      // Only after successful deletion and state update, close the dialog
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
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
            This will permanently delete the project "{project?.name}". This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDeleteProject();
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
