"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchAuth } from "@/lib/fetch";
import ProjectHeader from "@/components/projects/ProjectHeader";
import ProjectFunds from "@/components/projects/ProjectFunds";
import BucketItem from "@/components/buckets/BucketItem";
import CreateBucketDialog from "@/components/buckets/CreateBucketDialog";
import EditBucketDialog from "@/components/buckets/EditBucketDialog";
import DeleteBucketDialog from "@/components/buckets/DeleteBucketDialog";
import AddBucketButton from "@/components/buckets/AddBucketButton";
import ReactMarkdown from "react-markdown";
import { Project, Bucket } from "@/lib/types";
import BucketsHeader from "@/components/buckets/BucketsHeader";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

export default function ProjectDetail() {
  const params = useParams();
  const slug = params.slug as string;

  const [project, setProject] = useState<Project | null>(null);
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentBucket, setCurrentBucket] = useState<Bucket | null>(null);
  const [isReloading, setIsReloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch project and buckets
  const fetchProject = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAuth(`/api/projects/${slug}`);
      if (!response.ok) {
        throw new Error("Failed to fetch project");
      }
      const projectData = await response.json();
      setProject(projectData);
      setBuckets(projectData.buckets || []);
    } catch (error) {
      console.error("Error fetching project:", error);
      toast.error("Failed to load project");
      setError("Failed to load project");
    } finally {
      setIsLoading(false);
      setIsReloading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [slug]);

  // Filter buckets based on search query
  const filteredBuckets = buckets.filter(
    (bucket) =>
      bucket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bucket.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle bucket CRUD operations
  const handleCreateBucket = (newBucket: Bucket) => {
    setBuckets([newBucket, ...buckets]);
  };

  const handleUpdateBucket = (updatedBucket: Bucket) => {
    setBuckets(
      buckets.map((b) => (b.id === updatedBucket.id ? updatedBucket : b))
    );
    setCurrentBucket(null);
  };

  const handleBucketDeleted = (bucketId: string) => {
    setCurrentBucket(null);
    setBuckets(buckets.filter((b) => b.id !== bucketId));
    setDeleteDialogOpen(true);
  };

  // Handle dialog actions
  const handleEditBucket = (bucket: Bucket) => {
    setCurrentBucket(bucket);
    setEditDialogOpen(true);
  };

  const handleDeleteBucket = (bucket: Bucket) => {
    setCurrentBucket(bucket);
    setDeleteDialogOpen(true);
  };

  // Handle project reload
  const handleReload = () => {
    setIsReloading(true);
    fetchProject();
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
        </div>
      ) : project ? (
        <>
          {/* Breadcrumbs */}
          <nav className="flex mb-4 items-center text-sm text-muted-foreground">
            <Link href="/" className="flex items-center hover:text-foreground">
              <Home className="mr-2 h-4 w-4" />
              Projects
            </Link>
            <ChevronRight className="mx-2 h-4 w-4" />
            <span className="text-foreground font-medium">{project.name}</span>
          </nav>

          <ProjectHeader projectName={project.name} />

          {project.description && (
            <div className="mb-6 prose max-w-none">
              <div className="border rounded-md p-4 bg-card mb-4">
                <div className="prose min-w-full">
                  <ReactMarkdown>{project.description}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}

          <BucketsHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onCreateClick={() => setCreateDialogOpen(true)}
            hasBuckets={buckets.length > 0}
            isAdmin={project.isAdmin}
          />

          <ProjectFunds
            amount={project.fundsLeft || 0}
            onReload={handleReload}
            isReloading={isReloading}
            isLoading={isLoading}
          />

          {filteredBuckets.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <h3 className="text-lg font-medium">
                {searchQuery
                  ? "No matching buckets found."
                  : "No buckets created yet."}
              </h3>
              {project.isAdmin ? (
                <>
                  <p className="text-muted-foreground mb-4 mt-2">
                    {searchQuery
                      ? "Try a different search term"
                      : "Create your first bucket to get started."}
                  </p>
                  {!searchQuery && buckets.length === 0 && (
                    <div className="flex justify-center">
                      <AddBucketButton
                        onCreateClick={() => setCreateDialogOpen(true)}
                      />
                    </div>
                  )}
                </>
              ) : null}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden divide-y">
              {filteredBuckets.map((bucket) => (
                <BucketItem
                  key={bucket.id}
                  bucket={bucket}
                  projectSlug={project.slug}
                  onEdit={() => handleEditBucket(bucket)}
                  onDelete={() => handleDeleteBucket(bucket)}
                  isAdmin={project.isAdmin}
                />
              ))}
            </div>
          )}

          {/* Dialogs */}
          <CreateBucketDialog
            projectSlug={slug}
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}
            onBucketCreated={handleCreateBucket}
          />

          <EditBucketDialog
            projectSlug={slug}
            bucket={currentBucket}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onBucketUpdated={handleUpdateBucket}
          />

          <DeleteBucketDialog
            projectSlug={slug}
            bucket={currentBucket}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onBucketDeleted={handleBucketDeleted}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Project not found</h3>
          <p className="text-muted-foreground">
            The project you're looking for doesn't exist.
          </p>
        </div>
      )}
    </>
  );
}
