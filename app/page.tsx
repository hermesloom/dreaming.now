"use client";

import ProjectList from "@/components/projects/ProjectList";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <ProjectList />
      </main>
      <Footer />
    </div>
  );
}
