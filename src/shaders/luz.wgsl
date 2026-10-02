// luz.wgsl — Detalle de luz ambiental para la portada.
// Un degradé casi plano con un velo de color que deriva muy lento (fbm de
// muy baja frecuencia). Los colores llegan como uniforms (sRGB) para que
// el mismo efecto sirva en modo claro (blanco con velo celeste) y oscuro.
import { fbmSimplex2d } from "@vgpu/wgsl-std/noise/simplex";
import { hash2 } from "@vgpu/wgsl-std/hash";
import { srgbToLinear3, linearToSrgb3 } from "@vgpu/wgsl-std/color";

struct Params {
  resolution: vec2f,
  pointer: vec2f,
  time: f32,
  amount: f32,
  grain: f32,
  top: vec3f,
  bottom: vec3f,
  glow: vec3f,
}

@group(0) @binding(0) var<uniform> params: Params;

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let aspect = params.resolution.x / max(params.resolution.y, 1.0);
  let p = vec2f(uv.x * aspect, uv.y);
  let t = params.time * 0.03;

  // Base: degradé vertical casi imperceptible.
  var col = mix(srgbToLinear3(params.top), srgbToLinear3(params.bottom), smoothstep(0.0, 1.0, uv.y));

  // Velo que deriva: concentrado a la derecha, lejos del texto.
  let q = vec2f(
    fbmSimplex2d(p * 0.35 + vec2f(t, -t * 0.6), 2, 2.0, 0.5),
    fbmSimplex2d(p * 0.35 + vec2f(-t * 0.7, t * 0.4) + vec2f(4.2, 1.3), 2, 2.0, 0.5),
  );
  let n = fbmSimplex2d(p * 0.6 + q * 0.4 + vec2f(t * 0.5, 0.0), 3, 2.0, 0.45);
  let veil = smoothstep(-0.3, 0.9, n) * smoothstep(0.15, 0.95, uv.x + (params.pointer.x - 0.5) * 0.05);
  col = mix(col, srgbToLinear3(params.glow), veil * params.amount);

  var srgb = linearToSrgb3(col);
  let h = hash2(uv * params.resolution + vec2f(fract(params.time) * 37.0)).x - 0.5;
  srgb += vec3f(h * params.grain);
  return vec4f(srgb, 1.0);
}
