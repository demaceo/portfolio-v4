"use client";

import { useEffect } from "react";
import { recoverFromChunkError } from "@/lib/utils/chunkErrorRecovery";

// Catches render-time failures anywhere under this page — including a
// stale chunk (from a tab left open across a new deployment) failing to
// load when a lazily-loaded view (Projects, About, Services, ...) actually
// opens, not just during a hover preload. Chunk errors self-heal via a
// one-time reload; anything else falls back to a manual retry.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    recoverFromChunkError(error);
  }, [error]);

  return (
    <div
      role="alert"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        minHeight: "100vh",
        padding: "2rem",
        textAlign: "center",
        fontFamily: "var(--font-primary, sans-serif)",
        color: "#e4e2e2",
        background: "#1e1e1e",
      }}
    >
      <p>Something went wrong loading this view.</p>
      <button
        type="button"
        onClick={() => reset()}
        style={{
          padding: "0.5rem 1.25rem",
          borderRadius: "6px",
          border: "1px solid currentColor",
          background: "transparent",
          color: "inherit",
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}
