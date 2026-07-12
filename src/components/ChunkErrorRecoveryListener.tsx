"use client";

import { useEffect } from "react";
import { initChunkErrorRecovery } from "@/lib/utils/chunkErrorRecovery";

// Mounted once at the root so a stale tab (left open across a new
// deployment) recovers automatically instead of leaving dead
// hover/click interactions and console errors behind.
export default function ChunkErrorRecoveryListener() {
  useEffect(() => initChunkErrorRecovery(), []);
  return null;
}
