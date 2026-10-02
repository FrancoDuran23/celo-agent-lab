// aurora.wgsl — light, airy section background (light mode) for Rentas Jujuy.
// Soft cream / dusty-rose / ochre washes that drift almost imperceptibly, with
// faint topographic contour lines (a nod to the Quebrada's relief) and fine
// paper grain. A soft bright lift in the centre sits behind the search box.
import { fbmSimplex2d } from "@vgpu/wgsl-std/noise/simplex";
import { hash2 } from "@vgpu/wgsl-std/hash";
import { srgbToLinear3, linearToSrgb3 } from "@vgpu/wgsl-std/color";
import { saturate, rotate2d } from "@vgpu/wgsl-std/math";

struct Params {
  resolution: vec2f,
  pointer: vec2f,
  time: f32,
  intensity: f32,
  grain: f32,
  contours: f32,
}

@group(0) @binding(0) var<uniform> params: Params;

fn hex(c: vec3f) -> vec3f {
  return srgbToLinear3(c / 255.0);
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let res = max(params.resolution, vec2f(1.0));
  let aspect = res.x / res.y;
  let t = params.time * 0.008;                // almost static: a slow breath
  let ptr = params.pointer - vec2f(0.5);

  let base = vec2f(uv.x * aspect, uv.y) + ptr * 0.03;
  // flowing, ribbon-like washes: rotate and stretch across the section
  let p = rotate2d(base, -0.35) * vec2f(0.55, 1.1);

  // gentle domain warp
  let w = vec2f(
    fbmSimplex2d(p * 0.8 + vec2f(0.0, t), 2, 2.0, 0.5),
    fbmSimplex2d(p * 0.8 + vec2f(5.2, -t * 0.8), 2, 2.0, 0.5)
  );
  let q = p + w * 0.5;

  let roseF = fbmSimplex2d(q * 0.7 + vec2f(1.7, 9.2) + t * 0.5, 2, 2.0, 0.45);
  let ochreF = fbmSimplex2d(q * 0.8 + vec2f(8.3, 2.8) - t * 0.4, 2, 2.0, 0.45);
  let sageF = fbmSimplex2d(q * 0.5 + vec2f(4.1, 6.6), 2, 2.0, 0.45);

  let cream = hex(vec3f(245.0, 236.0, 221.0));      // #F5ECDD
  let paper = hex(vec3f(250.0, 245.0, 237.0));
  let rose = hex(vec3f(217.0, 135.0, 127.0));       // #D9877F
  let ochre = hex(vec3f(224.0, 166.0, 59.0));       // #E0A63B
  let sage = hex(vec3f(127.0, 154.0, 98.0));        // #7F9A62
  let violet = hex(vec3f(106.0, 76.0, 147.0));      // #6A4C93

  let k = params.intensity;
  var col = cream;
  col = mix(col, mix(cream, rose, 0.62), smoothstep(-0.2, 0.55, roseF) * 0.62 * k);
  col = mix(col, mix(cream, ochre, 0.62), smoothstep(-0.1, 0.6, ochreF) * 0.58 * k);
  col = mix(col, mix(cream, sage, 0.4), smoothstep(0.1, 0.65, sageF) * 0.30 * k);
  col = mix(col, mix(cream, violet, 0.3), smoothstep(0.25, 0.75, -roseF) * 0.22 * k);
  // a warm low sun-wash in the upper right
  let sunq = (uv - vec2f(0.88, 0.1)) * vec2f(aspect, 1.0);
  col = mix(col, mix(cream, ochre, 0.45), exp(-dot(sunq, sunq) * 2.2) * 0.35 * k);

  // bright, calm lift behind the search box (centre, slightly above middle)
  let cq = (uv - vec2f(0.5, 0.45)) * vec2f(aspect * 0.55, 1.0);
  col = mix(col, paper, exp(-dot(cq, cq) * 5.0) * 0.6);

  // faint topographic contours
  let hq = base * 0.75 + w * 0.25;
  let h = fbmSimplex2d(hq + vec2f(3.3, 1.1), 3, 2.0, 0.42) * 6.0;
  let fw = max(fwidth(h), 1e-4);
  let line = 1.0 - smoothstep(0.0, 1.2 * fw, abs(fract(h + 0.5) - 0.5));
  let lineAlpha = line * params.contours * (1.0 - exp(-dot(cq, cq) * 4.0) * 0.7);
  col = mix(col, col * hex(vec3f(205.0, 160.0, 140.0)), lineAlpha * 0.35);

  // soft edge falloff toward warm parchment
  let vq = uv - vec2f(0.5);
  col *= 1.0 - dot(vq, vq) * 0.18;

  var outc = linearToSrgb3(max(col, vec3f(0.0)));
  let g = hash2(floor(uv * res) + vec2f(fract(params.time * 0.13) * 61.0, 3.0));
  outc += (g.x - 0.5) * params.grain;

  return vec4f(saturate(outc.r), saturate(outc.g), saturate(outc.b), 1.0);
}
