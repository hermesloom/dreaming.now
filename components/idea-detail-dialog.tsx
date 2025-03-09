"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/auth-context";
import { useIdeas, Idea } from "@/context/ideas-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EmojiPicker from "@/components/emoji-picker";
import { Markdown } from "@/components/markdown";

interface IdeaDetailDialogProps {
  idea?: Idea;
  open: boolean;
  onClose: () => void;
  onSave?: (idea: Omit<Idea, "id" | "issues" | "allocatedAmount">) => void;
  mode: "view" | "edit" | "create";
}

export default function IdeaDetailDialog({
  idea,
  open,
  onClose,
  onSave,
  mode: initialMode = "view",
}: IdeaDetailDialogProps) {
  const t = useTranslations("ideaDetail");
  const { user } = useAuth();
  const { updateIdea, addIssue, resolveIssue } = useIdeas();

  const [mode, setMode] = useState(initialMode);
  const [activeTab, setActiveTab] = useState("details");
  const [newIssue, setNewIssue] = useState("");

  // Form state
  const [title, setTitle] = useState(idea?.title || "");
  const [emoji, setEmoji] = useState(idea?.emoji || "💡");
  const [description, setDescription] = useState(idea?.description || "");
  const [markdownContent, setMarkdownContent] = useState(
    idea?.markdownContent || ""
  );

  // Reset form when idea changes
  useEffect(() => {
    if (idea) {
      setTitle(idea.title);
      setEmoji(idea.emoji);
      setDescription(idea.description);
      setMarkdownContent(idea.markdownContent || "");
    }
  }, [idea]);

  const isAdmin = idea?.admin.id === user?.id;

  const handleSave = () => {
    if (mode === "create" && onSave) {
      onSave({
        title,
        emoji,
        description,
        markdownContent,
        admin: {
          id: user?.id || "0",
          name: user?.name || "Anonymous",
        },
      });
    } else if (mode === "edit" && idea) {
      updateIdea(idea.id, {
        title,
        emoji,
        description,
        markdownContent,
      });
      setMode("view");
    }
  };

  const handleSubmitIssue = () => {
    if (idea && newIssue.trim()) {
      addIssue(idea.id, newIssue, user?.name || "Anonymous");
      setNewIssue("");
    }
  };

  const handleResolveIssue = (
    issueId: string,
    status: "resolved" | "rejected"
  ) => {
    if (idea) {
      resolveIssue(idea.id, issueId, status);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        {mode === "view" && (
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{idea?.emoji}</span>
              {idea?.title}
            </DialogTitle>
          </DialogHeader>
        )}

        <Tabs
          defaultValue="details"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="details">{t("details")}</TabsTrigger>
            <TabsTrigger value="issues" disabled={mode !== "view"}>
              {t("issues")}{" "}
              {idea?.issues.length ? `(${idea.issues.length})` : ""}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="pt-4">
            {mode === "edit" || mode === "create" ? (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-16">
                    <EmojiPicker value={emoji} onChange={setEmoji} />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">
                      {t("title")}
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={t("titlePlaceholder")}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t("description")}
                  </label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t("descriptionPlaceholder")}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t("content")} (Markdown)
                  </label>
                  <Textarea
                    value={markdownContent}
                    onChange={(e) => setMarkdownContent(e.target.value)}
                    placeholder={t("contentPlaceholder")}
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2 text-muted-foreground">
                    {t("description")}
                  </h3>
                  <p>{idea?.description}</p>
                </div>

                {idea?.markdownContent && (
                  <div className="prose dark:prose-invert prose-sm max-w-none">
                    <Markdown content={idea.markdownContent} />
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{t("admin")}:</span>
                  <span>{idea?.admin.name}</span>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="issues" className="pt-4">
            <div className="space-y-6">
              <div className="space-y-4">
                {idea?.issues.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    {t("noIssues")}
                  </p>
                ) : (
                  idea?.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className={`p-4 rounded-lg border ${
                        issue.status === "pending"
                          ? "bg-muted/30"
                          : issue.status === "resolved"
                          ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900"
                          : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900"
                      }`}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{issue.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mb-3">{issue.content}</p>

                      {issue.status === "pending" && isAdmin && (
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleResolveIssue(issue.id, "resolved")
                            }
                            className="text-green-600 dark:text-green-400 border-green-200 hover:bg-green-50 dark:hover:bg-green-950/50"
                          >
                            {t("resolve")}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleResolveIssue(issue.id, "rejected")
                            }
                            className="text-red-600 dark:text-red-400 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/50"
                          >
                            {t("reject")}
                          </Button>
                        </div>
                      )}

                      {issue.status !== "pending" && (
                        <div className="flex justify-end">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              issue.status === "resolved"
                                ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                                : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                            }`}
                          >
                            {issue.status === "resolved"
                              ? t("resolved")
                              : t("rejected")}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="pt-4 border-t">
                <label className="text-sm font-medium mb-2 block">
                  {t("addIssue")}
                </label>
                <div className="flex gap-2">
                  <Textarea
                    value={newIssue}
                    onChange={(e) => setNewIssue(e.target.value)}
                    placeholder={t("issuePlaceholder")}
                    className="flex-1"
                  />
                  <Button
                    className="self-end"
                    onClick={handleSubmitIssue}
                    disabled={!newIssue.trim()}
                  >
                    {t("submit")}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 sm:gap-0">
          {mode === "view" && isAdmin && (
            <Button
              variant="outline"
              onClick={() => setMode("edit")}
              className="sm:mr-auto"
            >
              {t("edit")}
            </Button>
          )}

          {mode === "edit" || mode === "create" ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  if (mode === "edit") {
                    setMode("view");
                  } else {
                    onClose();
                  }
                }}
              >
                {t("cancel")}
              </Button>
              <Button onClick={handleSave}>
                {mode === "create" ? t("create") : t("save")}
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={onClose}>
              {t("close")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
