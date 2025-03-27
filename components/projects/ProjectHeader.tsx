"use client";

import Link from "next/link";
import { Home, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import AddBucketButton from "@/components/buckets/AddBucketButton";

interface ProjectHeaderProps {
  projectName: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onCreateClick: () => void;
  hasBuckets: boolean;
}

export default function ProjectHeader({
  projectName,
  searchQuery,
  setSearchQuery,
  onCreateClick,
  hasBuckets,
}: ProjectHeaderProps) {
  return (
    <>
      {/* Breadcrumbs */}
      <nav className="flex mb-4 items-center text-sm text-muted-foreground">
        <Link href="/" className="flex items-center hover:text-foreground">
          <Home className="mr-2 h-4 w-4" />
          Projects
        </Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <span className="text-foreground font-medium">{projectName}</span>
      </nav>

      {/* Header with search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">{projectName}</h1>
        {hasBuckets && (
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search buckets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            <AddBucketButton onCreateClick={onCreateClick} />
          </div>
        )}
      </div>
    </>
  );
}
