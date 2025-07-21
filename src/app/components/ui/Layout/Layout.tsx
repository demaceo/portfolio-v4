"use client";

import React from "react";
import NavBar from "../NavBar/NavBar";
import Contact from "@/components/features/contact/Contact/Contact";

interface LayoutProps {
  readonly children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <section className="portfolio-container">
      <NavBar />
      {children}
      <Contact />
    </section>
  );
}
