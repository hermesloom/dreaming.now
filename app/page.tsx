"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectList from "@/components/ProjectList";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <ProjectList />
      <Footer />
    </div>
  );
}
