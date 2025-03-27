"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Home,
  ChevronRight,
  Loader2,
  PlusCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchAuth } from "@/lib/fetch";
import ReactMarkdown from "react-markdown";
import BucketProgressBar from "@/components/buckets/BucketProgressBar";
import { Button } from "@/components/ui/button";
import AssignFundsButton from "@/components/buckets/AssignFundsButton";
import AddBudgetItemDialog from "@/components/buckets/AddBudgetItemDialog";
import EditBudgetItemDialog from "@/components/buckets/EditBudgetItemDialog";
import DeleteBudgetItemDialog from "@/components/buckets/DeleteBudgetItemDialog";
import BucketStatusBadges from "@/components/buckets/BucketStatusBadges";
import { BudgetItem, Bucket, Project } from "@/lib/types";

export default function BucketDetail() {
  const params = useParams();
  const projectSlug = params.slug as string;
  const bucketId = params.bucketId as string;

  const [bucket, setBucket] = useState<Bucket | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addBudgetItemOpen, setAddBudgetItemOpen] = useState(false);
  const [editBudgetItemOpen, setEditBudgetItemOpen] = useState(false);
  const [deleteBudgetItemOpen, setDeleteBudgetItemOpen] = useState(false);
  const [currentBudgetItem, setCurrentBudgetItem] = useState<BudgetItem | null>(
    null
  );

  // Calculate totals
  const totalBudget =
    bucket?.budgetItems.reduce((sum, item) => sum + item.amount, 0) || 0;

  const totalPledged =
    bucket?.pledges.reduce((sum, pledge) => sum + pledge.amount, 0) || 0;

  // Format currency
  const formatCurrency = (amount: number, currency: string = "EUR") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Fetch bucket and project details
  const fetchBucketDetails = async () => {
    try {
      setIsLoading(true);

      // First fetch the project to get the name for breadcrumbs
      const projectResponse = await fetchAuth(`/api/projects/${projectSlug}`);
      if (!projectResponse.ok) {
        throw new Error("Failed to fetch project");
      }
      const projectData = await projectResponse.json();
      setProject(projectData);

      // Then fetch the bucket details
      const bucketResponse = await fetchAuth(
        `/api/projects/${projectSlug}/buckets/${bucketId}`
      );
      if (!bucketResponse.ok) {
        throw new Error("Failed to fetch bucket");
      }
      const bucketData = await bucketResponse.json();
      setBucket(bucketData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load bucket details");
      setError("Failed to load bucket details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBucketDetails();
  }, [projectSlug, bucketId]);

  const handleEditBudgetItem = (item: BudgetItem) => {
    setCurrentBudgetItem(item);
    setEditBudgetItemOpen(true);
  };

  const handleDeleteBudgetItem = (item: BudgetItem) => {
    setCurrentBudgetItem(item);
    setDeleteBudgetItemOpen(true);
  };

  const handleCreateBudgetItem = (item: BudgetItem) => {
    setBucket((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        budgetItems: [item, ...prev.budgetItems],
      };
    });
  };

  const handleUpdateBudgetItem = (updatedItem: BudgetItem) => {
    setBucket((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        budgetItems: prev.budgetItems.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        ),
      };
    });
  };

  const handleDeleteBudgetItemSuccess = (deletedId: string) => {
    setBucket((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        budgetItems: prev.budgetItems.filter((item) => item.id !== deletedId),
      };
    });
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
      ) : bucket && project ? (
        <>
          {/* Breadcrumbs */}
          <nav className="flex mb-4 items-center text-sm text-muted-foreground">
            <Link href="/" className="flex items-center hover:text-foreground">
              <Home className="mr-2 h-4 w-4" />
              Projects
            </Link>
            <ChevronRight className="mx-2 h-4 w-4" />
            <Link href={`/${projectSlug}`} className="hover:text-foreground">
              {project.name}
            </Link>
            <ChevronRight className="mx-2 h-4 w-4" />
            <span className="text-foreground font-medium">{bucket.title}</span>
          </nav>

          {/* Bucket Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">{bucket.title}</h1>
            <BucketStatusBadges bucket={bucket} className="mb-6" />

            {/* Progress Bar */}
            <div className="mb-6">
              <BucketProgressBar
                totalBudget={totalBudget}
                totalPledged={totalPledged}
              />
            </div>

            {/* Assign Funds Button */}
            <div className="mt-4">
              <AssignFundsButton
                projectSlug={projectSlug}
                bucketId={bucketId}
                bucketTitle={bucket?.title || ""}
                status={bucket?.status || "CLOSED"}
                fundsLeft={project?.fundsLeft || 0}
                onFundsAssigned={fetchBucketDetails}
              />
            </div>
          </div>

          {/* Bucket Description */}
          <div className="mb-8 prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">About this Bucket</h2>
            <div className="border rounded-md p-4 bg-card">
              <div className="prose min-w-full">
                <ReactMarkdown>{bucket.description}</ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Budget Items */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Budget Items</h2>
              {project.isAdmin ? (
                <Button
                  size="sm"
                  onClick={() => setAddBudgetItemOpen(true)}
                  disabled={bucket.status !== "OPEN"}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              ) : null}
            </div>

            {bucket.budgetItems.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <div className="bg-muted/50 p-3 hidden md:flex text-sm font-medium text-muted-foreground">
                  <div className="flex-1">Description</div>
                  <div className="w-32 text-right">Amount</div>
                  {bucket.status === "OPEN" && project.isAdmin && (
                    <div className="w-24"></div>
                  )}
                </div>
                <div className="divide-y">
                  {bucket.budgetItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 flex flex-col md:flex-row items-center"
                    >
                      <div className="flex-1 mb-2 md:mb-0 w-full md:w-auto">
                        <div className="font-medium">{item.description}</div>
                      </div>
                      <div className="w-full md:w-32 text-left md:text-right font-medium mb-2 md:mb-0">
                        {formatCurrency(item.amount, item.currency)}
                      </div>
                      {bucket.status === "OPEN" && project.isAdmin && (
                        <div className="w-full md:w-24 flex justify-start space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditBudgetItem(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteBudgetItem(item)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">
                  No budget items created yet
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Bucket not found</h3>
          <p className="text-muted-foreground">
            The bucket you're looking for doesn't exist.
          </p>
        </div>
      )}
      <AddBudgetItemDialog
        projectSlug={projectSlug}
        bucketId={bucketId}
        open={addBudgetItemOpen}
        onOpenChange={setAddBudgetItemOpen}
        onBudgetItemCreated={handleCreateBudgetItem}
      />
      <EditBudgetItemDialog
        projectSlug={projectSlug}
        bucketId={bucketId}
        budgetItem={currentBudgetItem}
        open={editBudgetItemOpen}
        onOpenChange={setEditBudgetItemOpen}
        onBudgetItemUpdated={handleUpdateBudgetItem}
      />
      <DeleteBudgetItemDialog
        projectSlug={projectSlug}
        bucketId={bucketId}
        budgetItem={currentBudgetItem}
        open={deleteBudgetItemOpen}
        onOpenChange={setDeleteBudgetItemOpen}
        onBudgetItemDeleted={handleDeleteBudgetItemSuccess}
      />
    </>
  );
}
