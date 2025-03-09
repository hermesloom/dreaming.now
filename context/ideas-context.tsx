"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";

export interface Issue {
  id: string;
  content: string;
  author: string;
  status: "pending" | "resolved" | "rejected";
  createdAt: string;
}

export interface Idea {
  id: string;
  emoji: string;
  title: string;
  description: string;
  markdownContent?: string;
  admin: {
    id: string;
    name: string;
  };
  issues: Issue[];
  allocatedAmount: number;
}

interface IdeasContextType {
  ideas: Idea[];
  addIdea: (idea: Omit<Idea, "id" | "issues" | "allocatedAmount">) => void;
  updateIdea: (id: string, updates: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
  addIssue: (ideaId: string, content: string, author: string) => void;
  resolveIssue: (
    ideaId: string,
    issueId: string,
    status: "resolved" | "rejected"
  ) => void;
  allocateBudget: (ideaId: string, amount: number) => void;
  budgetLeft: number;
  setBudgetLeft: (amount: number) => void;
  totalBudget: number;
}

const IdeasContext = createContext<IdeasContextType | undefined>(undefined);

const TOTAL_BUDGET = 20.0;

// Mock data
const initialIdeas: Idea[] = [
  {
    id: "1",
    emoji: "💡",
    title: "Corporate Matching Platform",
    description: "Build a platform to match corporate donations with needs",
    markdownContent:
      "# Corporate Matching Platform\n\nThis platform would allow corporations to find and match with charitable causes that align with their values.\n\n## Features\n- Corporate profiles\n- Charity needs database\n- Matching algorithm\n- Impact tracking",
    admin: { id: "1", name: "Sarah Johnson" },
    issues: [
      {
        id: "101",
        content: "How will you handle the matching algorithm?",
        author: "Mike",
        status: "pending",
        createdAt: "2025-02-15T14:22:00Z",
      },
    ],
    allocatedAmount: 0,
  },
  {
    id: "2",
    emoji: "🌱",
    title: "Eco-friendly Office Initiative",
    description: "Implement sustainable practices in our office spaces",
    markdownContent:
      "# Eco-friendly Office Initiative\n\nReducing our carbon footprint through sustainable office practices.\n\n## Key Areas\n- Reduced plastic usage\n- Energy-efficient equipment\n- Composting program\n- Remote work options",
    admin: { id: "2", name: "David Chen" },
    issues: [],
    allocatedAmount: 0,
  },
  {
    id: "3",
    emoji: "📱",
    title: "Mobile App Redesign",
    description: "Overhaul our mobile app to improve user experience",
    markdownContent:
      "# Mobile App Redesign\n\nA complete UX/UI overhaul of our mobile application.\n\n## Goals\n- Simplify navigation\n- Modernize design\n- Improve accessibility\n- Add new features based on user feedback",
    admin: { id: "3", name: "Emily Parker" },
    issues: [
      {
        id: "201",
        content: "Will this affect our existing users?",
        author: "Tom",
        status: "resolved",
        createdAt: "2025-02-12T09:45:00Z",
      },
      {
        id: "202",
        content: "Do we have budget for user testing?",
        author: "Lisa",
        status: "pending",
        createdAt: "2025-02-14T16:30:00Z",
      },
    ],
    allocatedAmount: 0,
  },
];

export function IdeasProvider({ children }: { children: ReactNode }) {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [budgetLeft, setBudgetLeft] = useState(TOTAL_BUDGET);

  const addIdea = (idea: Omit<Idea, "id" | "issues" | "allocatedAmount">) => {
    const newIdea: Idea = {
      ...idea,
      id: uuidv4(),
      issues: [],
      allocatedAmount: 0,
    };
    setIdeas((prev) => [...prev, newIdea]);
  };

  const updateIdea = (id: string, updates: Partial<Idea>) => {
    setIdeas((prev) =>
      prev.map((idea) => (idea.id === id ? { ...idea, ...updates } : idea))
    );
  };

  const deleteIdea = (id: string) => {
    // Return allocated amount back to budget
    const idea = ideas.find((i) => i.id === id);
    if (idea) {
      setBudgetLeft((prev) => prev + idea.allocatedAmount);
    }
    setIdeas((prev) => prev.filter((idea) => idea.id !== id));
  };

  const addIssue = (ideaId: string, content: string, author: string) => {
    const newIssue: Issue = {
      id: uuidv4(),
      content,
      author,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === ideaId
          ? { ...idea, issues: [...idea.issues, newIssue] }
          : idea
      )
    );
  };

  const resolveIssue = (
    ideaId: string,
    issueId: string,
    status: "resolved" | "rejected"
  ) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === ideaId
          ? {
              ...idea,
              issues: idea.issues.map((issue) =>
                issue.id === issueId ? { ...issue, status } : issue
              ),
            }
          : idea
      )
    );
  };

  const allocateBudget = (ideaId: string, amount: number) => {
    // Find the idea
    const idea = ideas.find((i) => i.id === ideaId);
    if (!idea) return;

    // Calculate how much is being added or removed
    const difference = amount - idea.allocatedAmount;

    // Check if we have enough budget left
    if (budgetLeft - difference < 0) return;

    // Update the idea's allocation and the budget left
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === ideaId ? { ...idea, allocatedAmount: amount } : idea
      )
    );

    setBudgetLeft((prev) => prev - difference);
  };

  return (
    <IdeasContext.Provider
      value={{
        ideas,
        addIdea,
        updateIdea,
        deleteIdea,
        addIssue,
        resolveIssue,
        allocateBudget,
        budgetLeft,
        setBudgetLeft,
        totalBudget: TOTAL_BUDGET,
      }}
    >
      {children}
    </IdeasContext.Provider>
  );
}

export function useIdeas() {
  const context = useContext(IdeasContext);
  if (context === undefined) {
    throw new Error("useIdeas must be used within an IdeasProvider");
  }
  return context;
}
