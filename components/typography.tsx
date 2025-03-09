import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const typographyStyles = {
  default: cn(
    "prose dark:prose-invert",
    "prose-headings:font-sans prose-headings:font-medium",
    "prose-p:font-sans",
    "prose-a:font-sans prose-a:text-primary",
    "prose-strong:font-sans prose-strong:font-medium",
    "prose-code:font-mono prose-code:font-medium",
    "prose-pre:font-mono prose-pre:bg-muted prose-pre:text-muted-foreground"
  ),
  article: cn(
    "prose dark:prose-invert",
    "prose-headings:font-sans prose-headings:font-medium prose-headings:tracking-tighter",
    "prose-p:font-sans",
    "prose-a:font-sans prose-a:text-primary",
    "prose-strong:font-sans prose-strong:font-medium",
    "prose-code:font-mono prose-code:font-medium",
    "prose-pre:font-mono prose-pre:bg-muted prose-pre:text-muted-foreground",
    "prose-blockquote:font-sans prose-blockquote:not-italic"
  ),
};
