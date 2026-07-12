"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Texture } from "ogl";

// Ported from the "Rain Displacement" codepen (curtainsjs) to this project's
// existing WebGL library (ogl, already used by BackgroundBit/Iridescence) so
// the Desktop's frosted-glass surface gets an animated rain-on-glass look
// instead of adding a second WebGL dependency.
const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

#define PI2 6.28318530718
#define S(a,b,n) smoothstep(a,b,n)

varying vec2 vUv;

uniform float uTime;
uniform sampler2D tMap;
uniform vec2 uResolution;
uniform vec2 uImageResolution;

float N12(vec2 p){
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

vec3 Layer(vec2 uv0, float t){
  vec2 asp = vec2(2., 1.);
  vec2 uv1 = uv0 * 3. * asp;
  uv1.y += t * .25;

  vec2 gv = fract(uv1) - .5;
  vec2 id = floor(uv1);

  float n = N12(id);
  t += n * PI2;

  float w = uv0.y * 10.;
  float x = (n - .5) * .8;
  x += (.4 - abs(x)) * sin(3. * w) * pow(sin(w), 6.) * .45;
  float y = -sin(t + sin(t + sin(t) * .5)) * (.5 - .06);
  y -= (gv.x - x) * (gv.x - x);

  vec2 dropPos = (gv - vec2(x, y)) / asp;
  float drop = S(.03, .02, length(dropPos));

  vec2 trailPos = (gv - vec2(x, t * .25)) / asp;
  trailPos.y = (fract(trailPos.y * 8.) - .5) / 8.;
  float trail = S(.02, .015, length(trailPos));

  float fogTrail = S(-.05, .05, dropPos.y);
  fogTrail *= S(.5, y, gv.y);
  trail *= fogTrail;
  fogTrail *= S(.03, .015, abs(dropPos.x));

  vec2 off = drop * dropPos + trail * trailPos;
  return vec3(off, fogTrail);
}

void main() {
  // "background-size: cover" style UV fit so the source photo isn't stretched
  // to the container's aspect ratio.
  vec2 ratio = vec2(
    min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
    min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
  );
  vec2 uv = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  float dist = 5.;
  float t = mod(uTime * .03, 7200.);
  vec3 drops = Layer(uv, t);
  drops += Layer(uv * 1.25 + 7.54, t);
  drops += Layer(uv * 1.35 + 1.54, t);
  drops += Layer(uv * 1.57 - 7.54, t);

  float blur = 5. * 7. * (1. - drops.z) * .0005;
  vec2 rippled = uv + drops.xy * dist;

  vec4 col = vec4(0.);
  float a = N12(uv) * PI2;
  int numSamples = 16;
  for (int n = 0; n < 16; n++) {
    vec2 off = vec2(sin(a), cos(a)) * blur;
    float d = fract(sin((float(n) + 1.) * 546.) * 5424.);
    d = sqrt(d);
    off *= d;
    col += texture2D(tMap, rippled + off);
    a++;
  }
  col /= float(numSamples);

  gl_FragColor = col;
}
`;

/**
 * Animated rain-on-glass background for the `.desktop` surface, sampling the
 * same photo the frosted glass already blurs behind it. Renders nothing (and
 * leaves the existing CSS frosted-glass background untouched) when WebGL is
 * unavailable or the user prefers reduced motion.
 */
export default function DesktopRain() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const container = containerRef.current;

    let renderer: Renderer;
    try {
      renderer = new Renderer({ alpha: true });
    } catch (err) {
      console.error("[desktop-rain] WebGL init failed", err);
      return;
    }

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const image = new Image();
    image.src = "/images/palmtreeleaves-5.jpg";

    // GPU-side objects (buffers, textures, compiled programs) don't survive
    // a WebGL context loss — everything here gets rebuilt from scratch both
    // on first mount and again after "webglcontextrestored".
    let program: Program;
    let mesh: Mesh;
    function setupScene() {
      const geometry = new Triangle(gl);
      const texture = new Texture(gl, {
        generateMipmaps: false,
        minFilter: gl.LINEAR,
      });
      if (image.complete && image.naturalWidth) texture.image = image;

      program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        transparent: true,
        uniforms: {
          uTime: { value: 0 },
          tMap: { value: texture },
          uResolution: { value: [container.clientWidth, container.clientHeight] },
          uImageResolution: {
            value: image.complete
              ? [image.naturalWidth, image.naturalHeight]
              : [1, 1],
          },
        },
      });

      mesh = new Mesh(gl, { geometry, program });
    }
    setupScene();

    image.onload = () => {
      (program.uniforms.tMap.value as Texture).image = image;
      program.uniforms.uImageResolution.value = [
        image.naturalWidth,
        image.naturalHeight,
      ];
    };

    function resize() {
      renderer.setSize(container.clientWidth, container.clientHeight);
      program.uniforms.uResolution.value = [
        container.clientWidth,
        container.clientHeight,
      ];
    }
    window.addEventListener("resize", resize, false);
    resize();

    container.appendChild(gl.canvas);

    // Slows the whole rain animation (fall speed + drop bobbing) relative to
    // the ported codepen, which advanced uTime by a full frame each tick.
    const SPEED = 0.1;

    let disposed = false;
    let animationId: number | null = null;
    let frame = 0;
    function update() {
      animationId = requestAnimationFrame(update);
      frame += SPEED;
      program.uniforms.uTime.value = frame;
      renderer.render({ scene: mesh });
    }

    // Only animate while the tab is visible AND the desktop surface is on
    // screen. There's no reason to run a full-screen 16-tap blur every frame
    // when the canvas can't be seen — a background tab, or the ≤480px layout
    // where `.desktop` is `display: none` and this container collapses to zero
    // size (so the IntersectionObserver reports it as off-screen).
    let tabVisible = document.visibilityState === "visible";
    let onScreen = true;
    let contextLost = false;

    function sync() {
      const shouldRun = !disposed && !contextLost && tabVisible && onScreen;
      if (shouldRun && animationId === null) {
        animationId = requestAnimationFrame(update);
      } else if (!shouldRun && animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }

    function onVisibilityChange() {
      tabVisible = document.visibilityState === "visible";
      sync();
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    const observer = new IntersectionObserver((entries) => {
      onScreen = entries.some((entry) => entry.isIntersecting);
      sync();
    });
    observer.observe(container);

    // A lost context (GPU driver reset, tab backgrounded a long time, too
    // many WebGL contexts open) is unrecoverable unless the loss event is
    // told to allow restoration — without this, "webglcontextrestored"
    // never fires and the canvas stays blank for the rest of the session.
    function onContextLost(event: Event) {
      event.preventDefault();
      contextLost = true;
      sync();
    }
    function onContextRestored() {
      contextLost = false;
      setupScene();
      resize();
      sync();
    }
    gl.canvas.addEventListener("webglcontextlost", onContextLost, false);
    gl.canvas.addEventListener("webglcontextrestored", onContextRestored, false);

    sync();

    return () => {
      disposed = true;
      if (animationId !== null) cancelAnimationFrame(animationId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      gl.canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.canvas.removeEventListener("webglcontextrestored", onContextRestored);
      image.onload = null;
      if (gl.canvas.parentNode === container) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <div ref={containerRef} className="desktop-rain" aria-hidden="true" />;
}
