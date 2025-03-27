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
import { toast } from "sonner";
import { fetchAuth } from "@/lib/fetch";
import { Project } from "@/lib/types";

interface EditProjectDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectUpdated: (updatedProject: Project) => void;
}

export default function EditProjectDialog({
  project,
  open,
  onOpenChange,
  onProjectUpdated,
}: EditProjectDialogProps) {
  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    slug: project?.slug || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        slug: project.slug,
      });
    }
  }, [project]);

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    setIsSubmitting(true);

    try {
      const response = await fetchAuth(`/api/projects/${project.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          newSlug: formData.slug !== project.slug ? formData.slug : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(
          response.status < 500
            ? (await response.json()).error
            : "Unknown error"
        );
      }

      const updatedProject = await response.json();

      // If the slug was changed, we might need to navigate to the new URL
      if (formData.slug !== project.slug) {
        toast.success("Project updated successfully. The URL has changed.");
      } else {
        toast.success("Project updated successfully");
      }

      onProjectUpdated(updatedProject);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error(
        "Failed to update project" +
          (error instanceof Error ? ": " + error.message : "")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Make changes to your project. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEditProject}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Name
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="slug"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                URL Slug
              </label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                  })
                }
                pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                required
              />
              <p className="text-sm text-muted-foreground">
                The URL slug must contain only lowercase letters, numbers, and
                hyphens.
              </p>
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
