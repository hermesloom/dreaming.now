"use client";

import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComponentProps } from "react";

// Use ComponentProps to extract Button's props type
type ButtonProps = ComponentProps<typeof Button>;

interface AddBucketButtonProps extends ButtonProps {
  onCreateClick: () => void;
}

export default function AddBucketButton({
  onCreateClick,
  className,
  variant = "default",
  ...props
}: AddBucketButtonProps) {
  return (
    <Button
      onClick={onCreateClick}
      className={`flex items-center gap-1 ${className || ""}`}
      variant={variant}
      {...props}
    >
      <PlusCircle className="h-4 w-4" />
      Add Bucket
    </Button>
  );
}
