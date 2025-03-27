"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Home, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchAuth } from "@/lib/fetch";
import { Progress } from "@/components/ui/progress";
import ReactMarkdown from "react-markdown";

interface BudgetItem {
  id: string;
  description: string;
  amount: number;
  currency: string;
  createdAt: string;
}

interface Pledge {
  id: string;
  amount: number;
  currency: string;
  createdAt: string;
}

interface Bucket {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "CLOSED";
  createdAt: string;
  budgetItems: BudgetItem[];
  pledges: Pledge[];
  projectId: string;
}

interface Project {
  id: string;
  name: string;
  slug: string;
}

export default function BucketDetail() {
  const params = useParams();
  const projectSlug = params.slug as string;
  const bucketId = params.id as string;

  const [bucket, setBucket] = useState<Bucket | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate totals
  const totalBudget =
    bucket?.budgetItems.reduce((sum, item) => sum + item.amount, 0) || 0;

  const totalPledged =
    bucket?.pledges.reduce((sum, pledge) => sum + pledge.amount, 0) || 0;

  // Calculate progress percentage (capped at 100%)
  const progressPercentage =
    totalBudget > 0
      ? Math.min(Math.round((totalPledged / totalBudget) * 100), 100)
      : 0;

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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
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
              <Link
                href="/"
                className="flex items-center hover:text-foreground"
              >
                <Home className="mr-2 h-4 w-4" />
                Projects
              </Link>
              <ChevronRight className="mx-2 h-4 w-4" />
              <Link href={`/${projectSlug}`} className="hover:text-foreground">
                {project.name}
              </Link>
              <ChevronRight className="mx-2 h-4 w-4" />
              <span className="text-foreground font-medium">
                {bucket.title}
              </span>
            </nav>

            {/* Bucket Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">{bucket.title}</h1>
              <div className="flex items-center gap-2 mb-6">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    bucket.status === "OPEN"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {bucket.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    Funding Progress: {progressPercentage}%
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(totalPledged)} of{" "}
                    {formatCurrency(totalBudget)}
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
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
              <h2 className="text-xl font-semibold mb-4">Budget Items</h2>
              {bucket.budgetItems.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-muted/50 p-3 hidden md:flex text-sm font-medium text-muted-foreground">
                    <div className="flex-1">Description</div>
                    <div className="w-32 text-right">Amount</div>
                  </div>
                  <div className="divide-y">
                    {bucket.budgetItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 flex flex-col md:flex-row"
                      >
                        <div className="flex-1 mb-2 md:mb-0">
                          <div className="font-medium">{item.description}</div>
                        </div>
                        <div className="w-full md:w-32 text-left md:text-right font-medium">
                          {formatCurrency(item.amount, item.currency)}
                        </div>
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
      </main>
      <Footer />
    </div>
  );
}
