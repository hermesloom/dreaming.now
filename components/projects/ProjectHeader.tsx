"use client";

interface ProjectHeaderProps {
  projectName: string;
}

export default function ProjectHeader({ projectName }: ProjectHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">{projectName}</h1>
    </div>
  );
}
