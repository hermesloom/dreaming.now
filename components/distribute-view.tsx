"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useIdeas, Idea } from "@/context/ideas-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

export default function DistributeView() {
  const t = useTranslations("distribute");
  const { ideas, budgetLeft, totalBudget, allocateBudget } = useIdeas();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [amount, setAmount] = useState("0");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleAllocate = (idea: Idea) => {
    setSelectedIdea(idea);
    setAmount(idea.allocatedAmount.toString());
    setDialogOpen(true);
  };

  const handleSaveAllocation = () => {
    if (selectedIdea) {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount) && numAmount >= 0) {
        allocateBudget(selectedIdea.id, numAmount);
      }
    }
    setDialogOpen(false);
  };

  const handleFinalize = () => {
    setShowConfirmation(true);
  };

  return (
    <div className="space-y-8">
      <div className="bg-muted/50 p-4 rounded-lg flex justify-between items-center">
        <h2 className="text-lg font-medium">
          {t("budgetRemaining", { amount: formatCurrency(budgetLeft) })}
        </h2>
        <Button onClick={handleFinalize} variant="default">
          {t("finalizeSprint")}
        </Button>
      </div>

      <div className="space-y-4">
        {ideas.map((idea) => (
          <Card key={idea.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{idea.emoji}</div>
                  <div>
                    <h3 className="font-medium">{idea.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {idea.description}
                    </p>
                  </div>
                </div>
                <div className="font-medium">
                  {formatCurrency(idea.allocatedAmount)}
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 px-4 py-2 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAllocate(idea)}
                disabled={budgetLeft <= 0 && idea.allocatedAmount <= 0}
              >
                {idea.allocatedAmount > 0 ? t("adjust") : t("allocate")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Allocation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedIdea
                ? `${t("allocateTo")} ${selectedIdea.title}`
                : t("allocateFunds")}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              {t("amount")}
            </label>
            <div className="flex items-center gap-2">
              <span>€</span>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                max={
                  selectedIdea
                    ? (budgetLeft + selectedIdea.allocatedAmount).toString()
                    : budgetLeft.toString()
                }
                step="0.01"
              />
            </div>

            <div className="mt-2 text-sm text-muted-foreground">
              {t("maxAllocation", {
                amount: formatCurrency(
                  selectedIdea
                    ? budgetLeft + selectedIdea.allocatedAmount
                    : budgetLeft
                ),
              })}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSaveAllocation}>{t("save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Finalize Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("confirmFinalize")}</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p>{t("finalizeDescription")}</p>

            <div className="mt-4 bg-muted p-3 rounded-md">
              <div className="flex justify-between">
                <span>{t("allocated")}:</span>
                <span>{formatCurrency(totalBudget - budgetLeft)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>{t("remaining")}:</span>
                <span>{formatCurrency(budgetLeft)}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              {t("cancel")}
            </Button>
            <Button onClick={() => setShowConfirmation(false)}>
              {t("confirmFinalize")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
