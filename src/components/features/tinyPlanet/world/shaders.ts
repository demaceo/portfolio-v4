/**
 * GLSL for the Tiny Planet world, lifted verbatim from `world/engine.js`.
 *
 * These strings are the effect and are copied byte-for-byte — `verify-shaders.mjs`
 * asserts they still match the reference engine. The shared `vert` snippet is what
 * makes the planet: the world is a flat plane, and every vertex is simply lowered
 * by the square of its horizontal distance from the player. Because the same
 * snippet runs in every world material, the whole scene bends as one.
 */
export const vert = `
    uniform vec3 uPlayer; uniform float uCurvature;
    varying vec3 vNormalW; varying vec3 vWorldPos; varying float vFogDepth; varying float vUp;
    void main(){
      vec4 wp = modelMatrix * vec4(position, 1.0);
      float d = distance(wp.xz, uPlayer.xz);
      wp.y -= d * d * uCurvature;
      vWorldPos = wp.xyz;
      vNormalW = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
      vUp = vNormalW.y;
      vec4 mv = viewMatrix * wp; vFogDepth = -mv.z;
      gl_Position = projectionMatrix * mv;
    }`;
export const fragLit = `
    precision highp float;
    uniform vec3 uColor, uLightDir, uLightColor, uAmbient, uFog; uniform float uFogNear, uFogFar;
    varying vec3 vNormalW; varying float vFogDepth; varying float vUp;
    void main(){
      vec3 N = normalize(vNormalW); float diff = max(dot(N, normalize(uLightDir)), 0.0);
      float light = smoothstep(0.12, 0.5, diff);
      vec3 col = uColor * (uAmbient * (0.78 + 0.22*vUp) + uLightColor * light);
      col = col / (1.0 + col * 0.6);
      float lum = dot(col, vec3(0.299, 0.587, 0.114));
      col = clamp(mix(vec3(lum), col, 1.35), 0.0, 1.0);
      float f = clamp((vFogDepth - uFogNear)/(uFogFar - uFogNear), 0.0, 1.0);
      gl_FragColor = vec4(mix(col, uFog, f), 1.0);
    }`;
export const fragGround = `
    precision highp float;
    uniform vec3 uLightDir, uLightColor, uAmbient, uFog; uniform float uFogNear, uFogFar;
    varying vec3 vNormalW; varying vec3 vWorldPos; varying float vFogDepth; varying float vUp;
    void main(){
      vec3 N = normalize(vNormalW); float diff = max(dot(N, normalize(uLightDir)), 0.0);
      float light = smoothstep(0.12, 0.55, diff);
      float n = sin(vWorldPos.x*0.06)*sin(vWorldPos.z*0.06) + 0.5*sin(vWorldPos.x*0.13+1.3)*sin(vWorldPos.z*0.11-0.7);
      vec3 base = mix(vec3(0.49,0.71,0.39), vec3(0.60,0.80,0.47), clamp(n*0.5+0.5, 0.0, 1.0));
      vec3 col = base * (uAmbient * (0.85 + 0.15*vUp) + uLightColor * light);
      col = col / (1.0 + col * 0.6);
      float lum = dot(col, vec3(0.299, 0.587, 0.114));
      col = clamp(mix(vec3(lum), col, 1.35), 0.0, 1.0);
      float f = clamp((vFogDepth - uFogNear)/(uFogFar - uFogNear), 0.0, 1.0);
      gl_FragColor = vec4(mix(col, uFog, f), 1.0);
    }`;
export const fragFlat = `
    precision highp float;
    uniform vec3 uColor; uniform float uAlpha; uniform vec3 uFog; uniform float uFogNear, uFogFar;
    varying float vFogDepth;
    void main(){
      float f = clamp((vFogDepth - uFogNear)/(uFogFar - uFogNear), 0.0, 1.0);
      gl_FragColor = vec4(mix(uColor, uFog, f), uAlpha);
    }`;
export const fragGlow = `
    precision highp float;
    uniform vec3 uDayColor, uNightColor, uFog; uniform float uGlow, uFogNear, uFogFar;
    varying float vFogDepth;
    void main(){
      vec3 c = mix(uDayColor, uNightColor, uGlow);
      float f = clamp((vFogDepth - uFogNear)/(uFogFar - uFogNear), 0.0, 1.0);
      gl_FragColor = vec4(mix(c, uFog, f), 1.0);
    }`;
export const vertPath = `
    uniform vec3 uPlayer; uniform float uCurvature;
    attribute float aEdge;
    varying vec3 vWorldPos; varying float vFogDepth; varying float vEdge;
    void main(){
      vec4 wp = modelMatrix * vec4(position, 1.0);
      float d = distance(wp.xz, uPlayer.xz);
      wp.y -= d * d * uCurvature;
      vWorldPos = wp.xyz; vEdge = aEdge;
      vec4 mv = viewMatrix * wp; vFogDepth = -mv.z;
      gl_Position = projectionMatrix * mv;
    }`;
export const fragPath = `
    precision highp float;
    uniform vec3 uTint, uFog; uniform float uFogNear, uFogFar;
    varying vec3 vWorldPos; varying float vFogDepth; varying float vEdge;
    void main(){
      float a = smoothstep(1.0, 0.72, abs(vEdge));
      float v = 0.5 + 0.5*sin(vWorldPos.x*0.35)*sin(vWorldPos.z*0.35);
      vec3 dirt = mix(vec3(0.60,0.48,0.33), vec3(0.70,0.57,0.40), v) * uTint;
      float f = clamp((vFogDepth - uFogNear)/(uFogFar - uFogNear), 0.0, 1.0);
      gl_FragColor = vec4(mix(dirt, uFog, f), a * 0.97);
    }`;
export const skyVert = `varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
export const skyFrag = `
    precision highp float;
    uniform vec3 uHorizon, uZenith, uSun, uSunCol;
    varying vec3 vDir;
    void main(){
      vec3 d = normalize(vDir);
      vec3 col = mix(uHorizon, uZenith, pow(clamp(d.y*0.5+0.5, 0.0, 1.0), 0.9));
      float s = max(dot(d, normalize(uSun)), 0.0);
      col += uSunCol * pow(s, 300.0) * 1.3 + uSunCol * pow(s, 7.0) * 0.12;
      gl_FragColor = vec4(col, 1.0);
    }`;
