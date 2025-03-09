"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { typographyStyles } from "@/components/typography";

interface MarkdownProps {
  content: string;
  variant?: keyof typeof typographyStyles;
}

export function Markdown({ content, variant = "default" }: MarkdownProps) {
  return (
    <div className={typographyStyles[variant]}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
