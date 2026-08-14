import type { Metadata } from "next";

// The page itself is a Client Component (it mounts WebGL), and a client module
// cannot export metadata — so the route's metadata lives here instead.
export const metadata: Metadata = {
  title: "Tiny Planet · Demaceo Vincent",
  description:
    "A tiny hand-built world that curls away at the horizon. Walk around, bend the planet, and run the sun from dawn to midnight.",
  openGraph: {
    title: "Tiny Planet · Demaceo Vincent",
    description:
      "A tiny hand-built world that curls away at the horizon. Walk around, bend the planet, and run the sun from dawn to midnight.",
  },
};

export default function TinyPlanetLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
