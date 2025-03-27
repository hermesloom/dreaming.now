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

interface Bucket {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "CLOSED";
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  slug: string;
  createdAt: string;
  buckets: Bucket[];
  userFunds: number;
}

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

  const handleDeleteBucket = (bucketId: string) => {
    setBuckets(buckets.filter((b) => b.id !== bucketId));
    setCurrentBucket(null);
  };

  // Handle dialog actions
  const handleEditBucket = (bucket: Bucket) => {
    setCurrentBucket(bucket);
    setEditDialogOpen(true);
  };

  const handleDeleteBucketAction = (bucket: Bucket) => {
    setCurrentBucket(bucket);
    setDeleteDialogOpen(true);
  };

  // Handle project reload
  const handleReload = () => {
    setIsReloading(true);
    fetchProject();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : project ? (
          <>
            <ProjectHeader
              projectName={project.name}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onCreateClick={() => setCreateDialogOpen(true)}
              hasBuckets={buckets.length > 0}
            />

            <ProjectFunds
              amount={project.userFunds || 0}
              onReload={handleReload}
              isReloading={isReloading}
              isLoading={isLoading}
            />

            {filteredBuckets.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">
                  {searchQuery
                    ? "No matching buckets found"
                    : "No buckets created yet"}
                </h3>
                <p className="text-muted-foreground mb-4">
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
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden divide-y">
                {filteredBuckets.map((bucket) => (
                  <BucketItem
                    key={bucket.id}
                    bucket={bucket}
                    projectSlug={slug}
                    onEdit={handleEditBucket}
                    onDelete={handleDeleteBucketAction}
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
              onBucketDeleted={handleDeleteBucket}
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
      </main>
      <Footer />
    </div>
  );
}
