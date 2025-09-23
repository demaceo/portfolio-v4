"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./woozyx3.module.css";
import { CurvedLoop } from "@/components/woozyx3";
import BackgroundBit from "@/components/woozyx3/BackgroundBit/Background";
import DomeGallery from "@/components/woozyx3/DomeGallery/DomeGallery";

export default function WoozyX3Page() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/woozyx3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setMessage(data.message);
      } else {
        setError(data.error || "Invalid code");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.container}>
      <BackgroundBit
        color={[1, 1, 1]}
        mouseReact={false}
        amplitude={0.1}
        speed={1.0}
      />

      {/* Show DomeGallery and CurvedLoop when message is available */}
      {message && (
        <div className={styles.successContainer}>
          <div className={styles.curvedLoopContainer}>
            <CurvedLoop marqueeText={message} />
          </div>
          <div className={styles.domeGalleryContainer}>
            <DomeGallery />
          </div>
        </div>
      )}

      {!message && (
        <>
          {" "}
          <div className={styles.hero}>
            <h1 className={styles.title}>{"Woozy's 3rd Birthday"}</h1>
            <p className={styles.subtitle}>
              Enter your unique code to reveal a message.
            </p>
          </div>
          <div className={styles.card}>
            <form onSubmit={handleSubmit} className={styles.formRow}>
              <input
                ref={inputRef}
                className={styles.input}
                aria-label="entry code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code from polaroid"
                autoComplete="off"
              />
              <button
                className={styles.btn}
                type="submit"
                disabled={loading || !code.trim()}
              >
                {loading ? "Checking..." : "Submit"}
              </button>
            </form>
            {/* 
            {message && (
              <div className={`${styles.message} ${styles.success}`}>
                <h2 style={{ marginTop: 0 }}>Message</h2>
                <p style={{ margin: 0 }}>{message}</p>
              </div>
            )} */}

            {error && (
              <div className={`${styles.message} ${styles.error}`}>{error}</div>
            )}

            {!message && !error && (
              <div className={styles.hint}>
                Tip: If you do not see your message, double-check code spelling
                and capitalization.
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}
