"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useIdeas, Idea } from "@/context/ideas-context";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import IdeaCard from "@/components/idea-card";
import IdeaDetailDialog from "@/components/idea-detail-dialog";

export default function BrainstormView() {
  const t = useTranslations("brainstorm");
  const { ideas, addIdea } = useIdeas();
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleAddNew = () => {
    setIsCreating(true);
  };

  const handleCloseDialog = () => {
    setSelectedIdea(null);
    setIsCreating(false);
  };

  const handleSaveNewIdea = (
    idea: Omit<Idea, "id" | "issues" | "allocatedAmount">
  ) => {
    addIdea(idea);
    setIsCreating(false);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((idea) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            onClick={() => setSelectedIdea(idea)}
          />
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <div className="flex flex-col items-center">
          <span className="text-sm text-muted-foreground mb-2">
            {t("missingIdea")}
          </span>
          <Button onClick={handleAddNew} className="gap-2">
            <PlusIcon className="h-4 w-4" />
            {t("addNew")}
          </Button>
        </div>
      </div>

      {selectedIdea && (
        <IdeaDetailDialog
          idea={selectedIdea}
          open={!!selectedIdea}
          onClose={handleCloseDialog}
          mode="view"
        />
      )}

      {isCreating && (
        <IdeaDetailDialog
          open={isCreating}
          onClose={handleCloseDialog}
          onSave={handleSaveNewIdea}
          mode="create"
        />
      )}
    </div>
  );
}
