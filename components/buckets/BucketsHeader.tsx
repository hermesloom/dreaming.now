"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import AddBucketButton from "@/components/buckets/AddBucketButton";

interface BucketsHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onCreateClick: () => void;
  hasBuckets: boolean;
  isAdmin: boolean;
}

export default function BucketsHeader({
  searchQuery,
  setSearchQuery,
  onCreateClick,
  hasBuckets,
  isAdmin,
}: BucketsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 mt-10 gap-3">
      <h2 className="text-xl font-semibold">Buckets</h2>

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
          {isAdmin ? <AddBucketButton onCreateClick={onCreateClick} /> : null}
        </div>
      )}
    </div>
  );
}
