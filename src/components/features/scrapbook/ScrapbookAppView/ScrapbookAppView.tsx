"use client";

import { useEffect, useState } from "react";
import { AppView } from "@/components/features/shell";
import DomeGallery from "../DomeGallery/DomeGallery";
import styles from "./ScrapbookAppView.module.css";

interface ScrapbookAppViewProps {
  onClose: () => void;
}

export default function ScrapbookAppView({ onClose }: ScrapbookAppViewProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadImages() {
      try {
        const response = await fetch("/api/scrapbook-images", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Scrapbook image request failed: ${response.status}`);
        }

        const data: { images?: string[] } = await response.json();
        const nextImages = Array.isArray(data.images) ? data.images : [];
        setImages(nextImages);
      } catch {
        if (controller.signal.aborted) return;
        setImages([]);
        setFailed(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadImages();

    return () => controller.abort();
  }, []);

  return (
    <AppView onClose={onClose} title="Scrapbook" titleId="scrapbook-title">
      <div className={styles.root}>
        <div className={styles.stage}>
          {loading ? (
            <p className={styles.stateMessage} role="status" aria-live="polite">
              Loading scrapbook images...
            </p>
          ) : images.length > 0 ? (
            <div className={styles.galleryWrap}>
              <DomeGallery images={images} />
            </div>
          ) : (
            <div className={styles.stateMessage} role="status" aria-live="polite">
              {failed
                ? "Could not load local scrapbook images."
                : "No .jpg or .jpeg images were found in public/scrapbook/."}
            </div>
          )}
        </div>
      </div>
    </AppView>
  );
}
