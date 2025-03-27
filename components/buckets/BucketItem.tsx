"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Bucket {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "CLOSED";
  createdAt: string;
}

interface BucketItemProps {
  bucket: Bucket;
  projectSlug: string;
  onEdit: (bucket: Bucket) => void;
  onDelete: (bucket: Bucket) => void;
}

export default function BucketItem({
  bucket,
  projectSlug,
  onEdit,
  onDelete,
}: BucketItemProps) {
  const router = useRouter();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(bucket);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(bucket);
  };

  const navigateToBucket = () => {
    router.push(`/${projectSlug}/${bucket.id}`);
  };

  const getStatusBadge = (status: string) => {
    if (status === "OPEN") {
      return <Badge className="bg-green-500">Open</Badge>;
    }
    return <Badge variant="secondary">Closed</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      onClick={navigateToBucket}
      className="hover:bg-accent/50 cursor-pointer relative border-b last:border-b-0"
    >
      <div className="flex flex-col md:flex-row p-4 gap-3">
        <div className="flex-1">
          <div className="flex flex-col md:flex-row gap-2 md:items-center mb-1">
            <h3 className="font-medium">{bucket.title}</h3>
            <div className="flex items-center gap-2">
              {getStatusBadge(bucket.status)}
              <span className="text-xs text-muted-foreground">
                Created on {formatDate(bucket.createdAt)}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {bucket.description}
          </p>
        </div>
        <div className="flex items-center justify-end">
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
