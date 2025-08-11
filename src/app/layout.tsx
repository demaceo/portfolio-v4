import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://demaceovincent.com"),
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
      <head>
        {/* Preload background images used for full-screen wallpapers */}
        <link rel="preload" as="image" href="/images/palmtreeleaves-5.jpg" />
        <link rel="preload" as="image" href="/images/palmtreeleaves-7.jpg" />
        {/* Preconnect to remote asset origins */}
        <link
          rel="preconnect"
          href="https://user-images.githubusercontent.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://media.giphy.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://media2.giphy.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://media3.giphy.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://image.pbs.org"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
