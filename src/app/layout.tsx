import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Demaceo Vincent's portfolio",
  description:
    "Welcome to my portfolio website showcasing my projects and skills.",
  icons: {
    icon: "/logos/PORTFOLIO_LOGO.png",
    apple: "/logos/PORTFOLIO_LOGO.png",
  },
  openGraph: {
    title: "Demaceo Vincent's portfolio",
    description:
      "Welcome to my portfolio website showcasing my projects and skills.",
    images: [
      {
        url: "/logos/PORTFOLIO_LOGO.png",
        width: 1200,
        height: 630,
        alt: "Demaceo Vincent's Portfolio Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
