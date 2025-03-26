"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddProjectDialog from "@/components/AddProjectDialog";
import MainContent from "@/components/MainContent";

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header onAddProject={() => setDialogOpen(true)} />

      <AddProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      <MainContent />

      <Footer />
    </div>
  );
}
