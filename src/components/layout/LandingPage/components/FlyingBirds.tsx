"use client";

import { useEffect, useRef } from "react";

// Ported from the "Flying Birds" codepen in the codepenz repo. Rendered as
// the first child of .macintosh-container (see LandingPage.tsx) so it paints
// over the wallpaper but behind .mac-screen with no z-index needed — birds
// are visible in the wallpaper margin and hidden wherever the desktop's own
// opaque surfaces (e.g. the rain canvas) sit in front of them.
interface Bird {
  x: number;
  y: number;
  size: number;
  speed: number;
  flap: number;
  flapSpeed: number;
  driftSeed: number;
  turnSeed: number;
  opacity: number;
}

const BIRD_COUNT = 28;
const START_DELAY_MS = 6000;

function createBirds(width: number): Bird[] {
  return Array.from({ length: BIRD_COUNT }, () => ({
    x: Math.random() * width,
    y: 80 + Math.random() * 220,
    size: 1.2 + Math.random() * 3.2,
    // Source pen had this at 15 + Math.random() * .45 — birds would rocket
    // across at ~40x the speed they get reset to on wraparound below.
    // Matching the wraparound speed here instead so the very first pass
    // looks the same as every pass after it.
    speed: 0.15 + Math.random() * 0.45,
    flap: Math.random() * Math.PI * 2,
    flapSpeed: 0.08 + Math.random() * 0.15,
    driftSeed: Math.random() * 5000,
    turnSeed: Math.random() * 5000,
    opacity: 0.25 + Math.random() * 0.6,
  }));
}

export default function FlyingBirds() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    const parentEl = canvasEl?.parentElement;
    if (!canvasEl || !parentEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = canvasEl.getContext("2d");
    if (!context) return;

    const canvas = canvasEl;
    const container = parentEl;
    const ctx = context;

    let width = container.clientWidth;
    let height = container.clientHeight;
    const birds = createBirds(width);

    function resize() {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    function drawBird(bird: Bird, time: number) {
      const wing = Math.sin(bird.flap) * bird.size * 0.9;
      ctx.save();
      ctx.translate(bird.x, bird.y);
      const heading = Math.sin(time * 0.00012 + bird.turnSeed) * 0.25;
      ctx.rotate(heading);
      ctx.strokeStyle = `rgba(25,25,25,${bird.opacity})`;
      ctx.lineWidth = 1.2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-bird.size, wing);
      ctx.lineTo(0, 0);
      ctx.lineTo(bird.size, wing);
      ctx.stroke();
      ctx.restore();
    }

    let frameId: number;
    function animate(time: number) {
      ctx.clearRect(0, 0, width, height);
      birds.forEach((bird) => {
        bird.flap += bird.flapSpeed;
        bird.x += bird.speed;
        bird.y += Math.sin(time * 0.0006 + bird.driftSeed) * 0.18;
        if (bird.x > width + 20) {
          bird.x = -20;
          bird.y = 80 + Math.random() * 250;
          bird.speed = 0.15 + Math.random() * 0.45;
        }
        drawBird(bird, time);
      });
      frameId = requestAnimationFrame(animate);
    }

    const startTimeout = window.setTimeout(() => {
      frameId = requestAnimationFrame(animate);
    }, START_DELAY_MS);

    return () => {
      window.clearTimeout(startTimeout);
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="flying-birds-canvas"
      aria-hidden="true"
    />
  );
}
