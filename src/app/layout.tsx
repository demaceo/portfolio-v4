import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Demaceo Vincent's portfolio",
  description:
    "Welcome to my portfolio website showcasing my projects and skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
