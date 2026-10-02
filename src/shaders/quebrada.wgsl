// quebrada.wgsl — Hero background for Rentas Jujuy.
// Layered strata of the Cerro de los Siete Colores / Quebrada de Humahuaca
// receding toward a deep indigo dusk sky. Left side kept dark for white text.
import { simplex2d, fbmSimplex2d } from "@vgpu/wgsl-std/noise/simplex";
import { hash1, hash2 } from "@vgpu/wgsl-std/hash";
import { srgbToLinear3, linearToSrgb3, luminance } from "@vgpu/wgsl-std/color";
import { saturate } from "@vgpu/wgsl-std/math";

struct Params {
  resolution: vec2f,
  pointer: vec2f,
  time: f32,
  intensity: f32,
  textShade: f32,
  grain: f32,
}

@group(0) @binding(0) var<uniform> params: Params;

const LAYERS: i32 = 7;

fn hex(c: vec3f) -> vec3f {
  return srgbToLinear3(c / 255.0);
}

// Weighted pick of a Siete Colores mineral tone for one sediment band.
fn mineral(r: f32) -> vec3f {
  if (r < 0.20) { return hex(vec3f(196.0, 83.0, 47.0)); }   // terracotta
  if (r < 0.36) { return hex(vec3f(217.0, 135.0, 127.0)); } // dusty rose
  if (r < 0.54) { return hex(vec3f(224.0, 166.0, 59.0)); }  // ochre
  if (r < 0.71) { return hex(vec3f(127.0, 154.0, 98.0)); }  // sage
  if (r < 0.84) { return hex(vec3f(106.0, 76.0, 147.0)); }  // violet
  if (r < 0.94) { return hex(vec3f(226.0, 206.0, 176.0)); } // cream
  return hex(vec3f(150.0, 60.0, 46.0));                     // iron oxide
}

// Soft sediment bands with near-equal value, so hue carries the stripes (calm, not stripy-loud).
fn strata(s: f32, seed: f32) -> vec3f {
  let id = floor(s);
  let f = fract(s);
  let a = mineral(hash1(id * 1.618 + seed));
  let b = mineral(hash1((id + 1.0) * 1.618 + seed));
  let c = mix(a, b, smoothstep(0.72, 1.0, f));
  let l = max(luminance(c), 1e-4);
  // fine sub-striations inside each band
  let fine = 1.0 + 0.10 * sin(s * 18.85 + seed) * sin(s * 7.3);
  return c * (mix(l, 0.16, 0.6) / l) * fine;
}

fn layerOffset(ptr: vec2f, d: f32) -> vec2f {
  let par = ptr * (0.010 + 0.045 * d * d);   // parallax: near layers move more
  return vec2f(par.x, par.y * 0.5);
}

fn ridgeHeight(x: f32, fi: f32, d: f32, aspect: f32, t: f32) -> f32 {
  let freq = mix(0.8, 1.7, d);
  let drift = t * mix(0.003, 0.009, d);
  let warp = fbmSimplex2d(vec2f(x * 0.45 + fi * 3.7, t * 0.012 + fi * 1.3), 2, 2.0, 0.5) * 0.35;
  let xs = x * freq + warp + drift + fi * 11.3;
  let octaves = select(4, 5, d > 0.4);       // far, hazy ridges need less detail
  let broad = fbmSimplex2d(vec2f(xs, fi * 5.1), octaves, 2.07, 0.47);
  let cn = simplex2d(vec2f(xs * 2.1, fi * 2.3 + 7.0));
  let crag = 1.0 - sqrt(cn * cn + 0.015);
  // mountains rise toward the right (text lives on the left); near layers sit lower
  let base = mix(0.47, 0.06, d) + (x / aspect - 0.45) * mix(0.17, 0.24, d);
  let amp = mix(0.065, 0.13, d);
  return base + amp * (broad + crag * crag * 0.18 - 0.09);
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let res = max(params.resolution, vec2f(1.0));
  let aspect = res.x / res.y;
  let t = params.time;
  let ptr = params.pointer - vec2f(0.5);

  // y-up, aspect-correct coordinates
  let p = vec2f(uv.x * aspect, 1.0 - uv.y);
  let px = uv * res;

  // ---------- Sky: deep indigo night with a low warm glow on the right ----------
  let skyTop = hex(vec3f(11.0, 22.0, 38.0));    // #0B1626
  let skyMid = hex(vec3f(19.0, 35.0, 61.0));    // #13233D
  let skyHorizon = hex(vec3f(44.0, 46.0, 88.0));
  let dusk = hex(vec3f(106.0, 76.0, 147.0));    // violet
  let rose = hex(vec3f(217.0, 135.0, 127.0));   // dusty rose
  let gold = hex(vec3f(224.0, 166.0, 59.0));    // ochre / gold

  let sunPos = vec2f(0.765 * aspect + ptr.x * 0.012, 0.56 - ptr.y * 0.01);
  let sv = (p - sunPos) * vec2f(0.7, 1.0);
  let sunDist = length(sv);

  var sky = mix(skyMid, skyTop, smoothstep(0.38, 1.0, p.y));
  sky = mix(skyHorizon, sky, smoothstep(0.30, 0.62, p.y));
  sky = mix(sky, mix(dusk, skyMid, 0.35) * 0.55, saturate(exp(-sunDist * 4.6) * 0.8));
  sky = mix(sky, rose * 0.8, saturate(exp(-sunDist * 10.0) * 0.6));
  sky += gold * exp(-sunDist * 20.0) * 0.55;
  let disc = smoothstep(0.05, 0.018, length(p - sunPos));
  sky = mix(sky, hex(vec3f(248.0, 220.0, 170.0)), disc * 0.7);

  // faint stars: pixel-sized, denser high up, hidden near the glow
  let cellSize = 11.0;
  let cell = floor(px / cellSize);
  let rnd = hash2(cell + vec2f(17.0, 3.0));
  let center = (cell + 0.2 + rnd * 0.6) * cellSize;
  let present = step(0.935, hash1(cell.x * 157.0 + cell.y * 3.1 + 0.37));
  let r = length(px - center);
  let size = mix(0.55, 1.4, rnd.y * rnd.y);
  let twinkle = 0.65 + 0.35 * sin(t * (0.7 + rnd.x * 1.8) + rnd.y * 40.0);
  let starFade = smoothstep(0.45, 0.95, p.y) * (1.0 - saturate(exp(-sunDist * 2.4) * 1.8));
  let star = exp(-(r * r) / (size * size)) * present * twinkle * starFade;
  sky += vec3f(0.80, 0.85, 1.0) * star * 0.45;

  var col = sky;

  // ---------- Mountain strata layers (far -> near) ----------
  let ambient = hex(vec3f(54.0, 62.0, 104.0));
  let hazeCool = hex(vec3f(40.0, 46.0, 86.0));
  let hazeWarm = hex(vec3f(112.0, 76.0, 108.0));
  let nearShadow = hex(vec3f(12.0, 18.0, 32.0));
  let aa = 1.25 / res.y;

  // pass 1: ridge heights; find the nearest layer that fully covers this pixel
  var ridges: array<f32, LAYERS>;
  var first = 0;
  for (var i = 0; i < LAYERS; i = i + 1) {
    let fi = f32(i);
    let d = fi / f32(LAYERS - 1);
    let q = p + layerOffset(ptr, d);
    ridges[i] = ridgeHeight(q.x, fi, d, aspect, t);
    if (ridges[i] - q.y > aa) { first = i; }
  }

  // pass 2: shade only the visible layers (far -> near)
  for (var i = first; i < LAYERS; i = i + 1) {
    let fi = f32(i);
    let d = fi / f32(LAYERS - 1);            // 0 far .. 1 near
    let q = p + layerOffset(ptr, d);
    let ridge = ridges[i];
    let below = ridge - q.y;
    if (below > -aa) {
      let bd = max(below, 0.0);
      // tilted, gently folded sediment strata (parallel bands)
      let fold = fbmSimplex2d(q * vec2f(0.7, 1.1) + vec2f(fi * 9.0, t * 0.008), 3, 2.0, 0.5);
      let s = (q.y + q.x * 0.24 + fold * 0.045 + bd * 0.18) * mix(30.0, 44.0, d) + fi * 3.1;
      var albedo = strata(s, fi * 7.13);
      albedo = mix(vec3f(luminance(albedo)), albedo, 0.85 * params.intensity);

      // lighting: cool twilight ambient + warm glow grazing the crests near the sun
      let sunX = exp(-abs(q.x - sunPos.x) * mix(1.3, 2.2, d));
      let crest = exp(-bd * mix(14.0, 26.0, d));
      let face = exp(-bd * 3.5);
      var light = ambient * mix(0.9, 0.3, d) * mix(0.6, 1.0, face);
      light += gold * sunX * (0.3 * face + 0.8 * crest) * mix(1.0, 0.45, d);
      // thin back-lit rim right along the crest, strongest close to the sun
      let rim = exp(-bd * res.y * 0.5) * exp(-length((q - sunPos) * vec2f(0.55, 1.0)) * 6.5);
      var rock = albedo * light * 1.7;

      // the nearest ridges fall into night shadow
      rock = mix(rock, nearShadow, smoothstep(0.45, 1.0, d) * 0.7);

      // aerial perspective toward the sky colour behind the ridge
      let haze = mix(hazeCool, hazeWarm, exp(-abs(q.x - sunPos.x) * 1.4) * 0.8);
      rock = mix(rock, haze, pow(1.0 - d, 1.25) * 0.78);

      // valley mist pooling at the foot of each layer
      let mist = smoothstep(0.0, 0.2, bd) * mix(0.5, 0.18, d);
      rock = mix(rock, haze * 1.05, mist);

      rock += gold * rim * mix(1.1, 0.25, d);
      col = mix(col, rock, smoothstep(-aa, aa, below));
    }
  }

  // ---------- Post ----------
  // darker left side for text legibility
  let leftMask = 1.0 - smoothstep(0.0, 0.62, uv.x);
  col = mix(col, skyTop * 0.75, leftMask * params.textShade);

  // vignette
  let vq = (uv - vec2f(0.6, 0.45)) * vec2f(1.0, 1.2);
  col *= saturate(1.0 - dot(vq, vq) * 0.8);

  var outc = linearToSrgb3(max(col, vec3f(0.0)));
  // film grain (display space)
  let g = hash2(floor(px) + vec2f(fract(t * 0.37) * 97.0, 0.0)).x - 0.5;
  outc += g * params.grain;

  return vec4f(saturate(outc.r), saturate(outc.g), saturate(outc.b), 1.0);
}
