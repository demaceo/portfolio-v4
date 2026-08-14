"use client";

import dynamic from "next/dynamic";
import styles from "./tiny-planet.module.css";

// The world is generated procedurally, so without a seed every visitor would
// land in a different village. Pinning one means the layout you see is the
// layout everyone sees.
const WORLD_SEED = 20260814;

// WebGL only ever runs in the browser, so the whole experience is loaded
// client-side. That keeps three.js out of every other route's bundle and means
// there is no server render to mismatch against on hydration.
const TinyPlanetShowcase = dynamic(
  () => import("@/components/features/tinyPlanet").then((m) => m.TinyPlanetShowcase),
  {
    ssr: false,
    loading: () => <div className={styles.placeholder} aria-hidden="true" />,
  }
);

export default function TinyPlanetPage() {
  return (
    <main className={styles.container}>
      <TinyPlanetShowcase
        className={styles.themed}
        seed={WORLD_SEED}
        title="Tiny Planet"
        subtitle="Drag to spin a tiny hand-built world."
      />
    </main>
  );
}
