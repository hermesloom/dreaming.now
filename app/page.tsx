"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { fetchAuth } from "@/lib/fetch";
import ProjectItem from "@/components/projects/ProjectItem";
import CreateProjectDialog from "@/components/projects/CreateProjectDialog";
import EditProjectDialog from "@/components/projects/EditProjectDialog";
import DeleteProjectDialog from "@/components/projects/DeleteProjectDialog";
import { Project } from "@/lib/types";

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

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

  // Update filtered projects when search query or projects change
  useEffect(() => {
    const filtered = projects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [projects, searchQuery]);

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle project CRUD operations
  const handleProjectCreated = (newProject: Project) => {
    setProjects([newProject, ...projects]);
  };

  const handleProjectUpdated = (updatedProject: Project) => {
    setProjects(
      projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
    setCurrentProject(null);
  };

  const handleProjectDeleted = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId));
    setCurrentProject(null);
  };

  const handleEdit = (project: Project) => {
    setCurrentProject(project);
    setEditDialogOpen(true);
  };

  const handleDelete = (project: Project) => {
    setCurrentProject(project);
    setDeleteDialogOpen(true);
  };

  return (
    <div>
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
            {/* <CreateProjectDialog onProjectCreated={handleProjectCreated} /> */}
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
          <p className="text-muted-foreground mb-4 px-4">
            {searchQuery
              ? "Try a different search term"
              : "As soon as you subscribe to the Divizend Companion, €10 in funds for you to distribute will be added to your account every month. Make sure that you log in here with the same Divizend account as in the Companion."}
          </p>
          {/*!searchQuery && projects.length === 0 && (
            <div className="flex justify-center">
              <CreateProjectDialog onProjectCreated={handleProjectCreated} />
            </div>
          )*/}
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <div className="bg-muted/50 p-3 hidden md:flex text-sm font-medium text-muted-foreground">
            <div className="w-1/3">Name</div>
            <div className="w-2/3">You can still decide over</div>
          </div>
          <div className="divide-y">
            {filteredProjects.map((project) => (
              <ProjectItem
                key={project.id}
                project={project}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Dialogs */}
      <EditProjectDialog
        project={currentProject}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onProjectUpdated={handleProjectUpdated}
      />

      <DeleteProjectDialog
        project={currentProject}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onProjectDeleted={handleProjectDeleted}
      />
    </div>
  );
}
