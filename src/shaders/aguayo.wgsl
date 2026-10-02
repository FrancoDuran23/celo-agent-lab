// aguayo.wgsl — CTA band background for Rentas Jujuy.
// A woven Andean aguayo, mirrored about the band's centre like the real cloth:
// a calm central field for the CTA copy, framed by pinstripe groups, stepped
// rhombus rows and chevrons in muted palette tones on deep indigo, with a slow
// silk-like shimmer. Every pixel is luminance-capped (maxLuminance) so white
// text on top keeps its WCAG contrast ratio.
import { hash1, hash2 } from "@vgpu/wgsl-std/hash";
import { srgbToLinear3, linearToSrgb3, luminance } from "@vgpu/wgsl-std/color";
import { saturate } from "@vgpu/wgsl-std/math";

struct Params {
  resolution: vec2f,
  pointer: vec2f,
  time: f32,
  intensity: f32,
  cell: f32,
  grain: f32,
  maxLuminance: f32,
}

@group(0) @binding(0) var<uniform> params: Params;

// palette (sRGB 0..1)
const INDIGO_DEEP = vec3f(0.043, 0.086, 0.149);  // #0B1626
const INDIGO = vec3f(0.075, 0.137, 0.239);       // #13233D
const TERRACOTTA = vec3f(0.769, 0.325, 0.184);   // #C4532F
const OCHRE = vec3f(0.878, 0.651, 0.231);        // #E0A63B
const ROSE = vec3f(0.851, 0.529, 0.498);         // #D9877F
const SAGE = vec3f(0.498, 0.604, 0.384);         // #7F9A62
const VIOLET = vec3f(0.416, 0.298, 0.576);       // #6A4C93
const CREAM = vec3f(0.961, 0.925, 0.867);        // #F5ECDD

const FIELD: i32 = 9;     // half-height (in threads) of the calm central field
const PERIOD: i32 = 42;   // repeat of the framing bands, counted outward

fn imod(a: i32, b: i32) -> i32 {
  return ((a % b) + b) % b;
}

struct Thread {
  color: vec3f,
  alpha: f32,
}

// Woven motif at thread coordinate g (origin at the band centre).
fn motif(g: vec2i) -> Thread {
  var c = vec3f(0.0);
  var a = 0.0;
  let ay = select(g.y, -g.y - 1, g.y < 0);   // mirror rows about the centre line

  if (ay < FIELD) {
    // central field: plain cloth with one faint pinstripe at its edge
    if (ay == FIELD - 2) { c = CREAM; a = 0.07; }
    return Thread(c, a);
  }

  let r = ay - FIELD;
  let y = imod(r, PERIOD);
  let band = r / PERIOD;

  // --- pinstripe group (inner) ---
  if (y == 0) { c = OCHRE; a = 0.26; }
  else if (y == 2 || y == 3) { c = TERRACOTTA; a = 0.32; }
  else if (y == 5) { c = SAGE; a = 0.26; }

  // --- stepped rhombus row (y 8..24, centre 16) ---
  else if (y >= 8 && y <= 24) {
    let w = 18;
    let gx = g.x + 9;                         // rhombus centred on the band's centre column
    let k = (gx - imod(gx, w)) / w + band;
    let dx = abs(imod(gx, w) - 9);
    let dy = abs(y - 16);
    let m = dx + dy;                          // manhattan distance -> stepped diamond
    let alt = imod(k, 2) == 0;
    let outer = select(VIOLET, ROSE, alt);
    let inner = select(OCHRE, SAGE, alt);
    if (m == 8 || m == 7) { c = outer; a = 0.34; }
    else if (m == 5 || m == 4) { c = inner; a = 0.26; }
    else if (m <= 2) { c = select(CREAM, outer, m == 2); a = select(0.16, 0.22, m == 2); }
    else if (m > 9) {
      // stepped half-rhombus teeth between the rhombi
      let hx = abs(imod(gx + 9, w) - 9);
      if (hx + (8 - dy) <= 2 && dy >= 6) { c = TERRACOTTA; a = 0.26; }
    }
  }

  // --- pinstripe group (outer) ---
  else if (y == 27) { c = SAGE; a = 0.24; }
  else if (y == 29 || y == 30) { c = VIOLET; a = 0.42; }
  else if (y == 32) { c = OCHRE; a = 0.20; }

  // --- chevrons (y 34..40) ---
  else if (y >= 34 && y <= 40) {
    let yy = y - 34;
    let zx = abs(imod(g.x, 14) - 7);
    if (zx == yy || zx == yy - 1) { c = ROSE; a = 0.26; }
  }

  return Thread(c, a);
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let res = max(params.resolution, vec2f(1.0));
  let t = params.time;
  let px = uv * res;
  let cellPx = max(params.cell, 2.0);

  // thread grid centred on the band
  let gp = (px - res * 0.5) / cellPx;
  let g = vec2i(floor(gp));
  let f = fract(gp);

  // base cloth: deep indigo, a soft lift through the middle
  let lift = 1.0 - abs(uv.y - 0.5) * 1.4;
  var col = mix(INDIGO_DEEP, INDIGO, saturate(lift) * 0.85 + 0.15);

  // warp-faced weave: rounded vertical threads with a gentle weft ripple
  let warp = sqrt(max(sin(f.x * 3.14159), 0.0));
  let weft = 0.85 + 0.15 * sin(f.y * 3.14159);
  let thread = warp * weft;
  col *= mix(0.93, 1.03, thread);
  // natural dye drift row by row, even in the plain field
  col *= 0.97 + 0.06 * hash1(f32(g.y) * 1.371 + 0.5);

  let th = motif(g);

  // slow silk shimmer: a wide diagonal sheen drifting across, plus pointer glow
  let diag = (px.x + px.y * 0.5) / res.y;
  let sheen = pow(0.5 + 0.5 * sin(diag * 1.6 - t * 0.32), 8.0);
  let pointerGlow = exp(-length((uv - params.pointer) * vec2f(res.x / res.y, 1.0)) * 2.2);
  let sparkleRnd = hash2(vec2f(g) + vec2f(0.5, 7.0));
  let sparkle = step(0.985, sparkleRnd.x) * (0.5 + 0.5 * sin(t * (0.8 + sparkleRnd.y) + sparkleRnd.y * 30.0));

  // hand-dyed variation (abrash) per weft row and per warp column
  let dye = 0.85 + 0.25 * hash1(f32(g.y) * 0.731 + 3.0) + 0.1 * hash1(f32(g.x) * 0.419 + 9.0);
  let alpha = th.alpha * params.intensity * dye
            * (0.8 + 0.9 * sheen + 0.3 * pointerGlow + 0.4 * sparkle)
            * mix(0.7, 1.0, thread);
  col = mix(col, th.color, saturate(alpha));
  // sheen also catches the bare cloth a little
  col += INDIGO * (0.16 * sheen + 0.08 * pointerGlow);

  // edge vignette (left/right) keeps the band calm
  let vx = abs(uv.x - 0.5) * 2.0;
  col *= 1.0 - 0.25 * smoothstep(0.55, 1.0, vx);

  // grain
  let n = hash1(floor(px.x) * 0.618 + floor(px.y) * 17.13 + fract(t * 0.29) * 51.0) - 0.5;
  col += n * params.grain;

  // contrast guard: cap relative luminance so white text keeps its WCAG ratio
  var lin = srgbToLinear3(clamp(col, vec3f(0.0), vec3f(1.0)));
  let L = luminance(lin);
  let cap = max(params.maxLuminance, 0.001);
  if (L > cap) { lin *= cap / L; }

  return vec4f(linearToSrgb3(lin), 1.0);
}
