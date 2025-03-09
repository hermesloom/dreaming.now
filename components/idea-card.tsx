"use client";

import { Idea } from "@/context/ideas-context";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface IdeaCardProps {
  idea: Idea;
  onClick: () => void;
}

export default function IdeaCard({ idea, onClick }: IdeaCardProps) {
  return (
    <Card
      className="overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">{idea.emoji}</div>
          <div>
            <h3 className="font-medium text-lg mb-1">{idea.title}</h3>
            <p className="text-sm text-muted-foreground">{idea.description}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 px-6 py-3 flex justify-between text-sm">
        <div>{idea.admin.name}</div>
        <div>
          {idea.issues.length > 0
            ? `${idea.issues.length} ${
                idea.issues.length === 1 ? "issue" : "issues"
              }`
            : "No issues"}
        </div>
      </CardFooter>
    </Card>
  );
}
