"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Project } from "@/lib/types";

interface ProjectItemProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export default function ProjectItem({
  project,
  onEdit,
  onDelete,
}: ProjectItemProps) {
  const router = useRouter();

  const navigateToProject = () => {
    router.push(`/${project.slug}`);
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string = "EUR") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(project);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(project);
  };

  return (
    <div
      onClick={navigateToProject}
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
            {project.fundsLeft === 0 ? null : (
              <Button
                variant="default"
                size="sm"
                className="inline-flex items-center gap-1 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToProject();
                }}
              >
                Distribute
                <ArrowRight size={14} />
              </Button>
            )}
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
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
  );
}
