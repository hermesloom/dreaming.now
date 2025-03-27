"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  MoreHorizontal,
  Search,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import CreateProjectDialog from "./CreateProjectDialog";
import DeleteProjectDialog from "./DeleteProjectDialog";

interface Project {
  id: string;
  name: string;
  description: string;
  slug: string;
  createdAt: string;
  fundsLeft: number;
  currency: string;
}

export default function ProjectList() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAuth("/api/projects");
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();

      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects based on search query
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update project
  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;

    setIsSubmitting(true);

    try {
      const response = await fetchAuth(`/api/projects/${currentProject.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          newSlug:
            formData.slug !== currentProject.slug ? formData.slug : undefined,
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

      // If the slug was changed, we need to update the list with the new slug
      setProjects(
        projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
      );

      // If the slug changed, we might need to navigate to the new URL
      if (formData.slug !== currentProject.slug) {
        toast.success("Project updated successfully. The URL has changed.");
      } else {
        toast.success("Project updated successfully");
      }

      setCurrentProject(null);
      setFormData({ name: "", description: "", slug: "" });
      setEditDialogOpen(false);
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

  // Handle project delete completion
  const handleProjectDeleted = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId));
    setCurrentProject(null);
  };

  const handleEdit = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      slug: project.slug,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentProject(project);
    setDeleteDialogOpen(true);
  };

  const navigateToProject = (slug: string) => {
    router.push(`/${slug}`);
  };

  const handleDistribute = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success(`Starting distribution for ${project.name}!`);
    // Here you would implement the actual distribution logic
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string = "EUR") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Handler for when a new project is created by the dialog component
  const handleProjectCreated = (newProject: Project) => {
    setProjects([newProject, ...projects]);
  };

  return (
    <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Projects</h1>

        {/* Only show search and new project button when projects exist */}
        {projects.length > 0 && (
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            <CreateProjectDialog onProjectCreated={handleProjectCreated} />
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <h3 className="text-lg font-medium mb-2">
            {searchQuery ? "No matching projects found" : "No projects yet"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "Try a different search term"
              : "Create your first project to get started."}
          </p>
          {!searchQuery && projects.length === 0 && (
            <div className="flex justify-center">
              <CreateProjectDialog onProjectCreated={handleProjectCreated} />
            </div>
          )}
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <div className="bg-muted/50 p-3 hidden md:flex text-sm font-medium text-muted-foreground">
            <div className="w-1/3">Name</div>
            <div className="w-2/3">You can still decide over</div>
          </div>
          <div className="divide-y">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigateToProject(project.slug)}
                className="hover:bg-accent/50 cursor-pointer relative"
              >
                <div className="flex flex-col md:flex-row p-3 items-center">
                  {/* Project Name */}
                  <div className="w-full md:w-1/3 mb-2 md:mb-0 flex items-center">
                    <div className="font-medium">{project.name}</div>
                  </div>

                  {/* Amount and Distribute Button */}
                  <div className="w-full md:w-2/3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="font-medium">
                        {formatCurrency(project.fundsLeft, project.currency)}
                      </div>
                      <Button
                        variant="default"
                        size="sm"
                        className="inline-flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToProject(project.slug);
                        }}
                      >
                        Distribute
                        <ArrowRight size={14} />
                      </Button>
                    </div>

                    {/* Actions Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={(e) => handleEdit(project, e)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => handleDelete(project, e)}
                            className="text-destructive focus:text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Project Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update your project details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditProject}>
            <div className="space-y-4 my-4">
              <div className="space-y-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Project name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="edit-description"
                  className="text-sm font-medium"
                >
                  Description
                </label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Project description"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-slug" className="text-sm font-medium">
                  Slug
                </label>
                <div className="space-y-1">
                  <Input
                    id="edit-slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, ""),
                      })
                    }
                    placeholder="project-slug"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    URL-friendly identifier. Changing this will update the
                    project's URL.
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
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

      {/* Delete Confirmation Dialog - updated onOpenChange handler */}
      <DeleteProjectDialog
        project={currentProject}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onProjectDeleted={handleProjectDeleted}
      />
    </main>
  );
}
