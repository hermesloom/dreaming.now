import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddProjectDialog({
  open,
  onOpenChange,
}: AddProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Feature Coming Soon</DialogTitle>
          <DialogDescription>
            This feature is not available yet. If you'd like to discuss your use
            case, please join the{" "}
            <Link
              href="https://discord.gg/4ArHzm3E"
              className="text-primary underline underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hermes' Loom Discord server
            </Link>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
