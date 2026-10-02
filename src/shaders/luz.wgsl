// luz.wgsl — Luz ambiental sutil para la banda del buscador.
// Azul institucional con una deriva lenta de luz suave (fbm de muy baja
// frecuencia) y un brillo difuso arriba a la derecha. La luminancia se
// acota (maxLuminance) para que el texto blanco mantenga contraste AA
// en cualquier píxel: 1.05 / (maxLuminance + 0.05).
import { fbmSimplex2d } from "@vgpu/wgsl-std/noise/simplex";
import { hash2 } from "@vgpu/wgsl-std/hash";
import { srgbToLinear3, linearToSrgb3, luminance } from "@vgpu/wgsl-std/color";

struct Params {
  resolution: vec2f,
  pointer: vec2f,
  time: f32,
  intensity: f32,
  grain: f32,
  maxLuminance: f32,
}

@group(0) @binding(0) var<uniform> params: Params;

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let aspect = params.resolution.x / max(params.resolution.y, 1.0);
  let p = vec2f(uv.x * aspect, uv.y);
  let t = params.time * 0.035;

  let deep = srgbToLinear3(vec3f(0.031, 0.157, 0.384));
  let base = srgbToLinear3(vec3f(0.055, 0.227, 0.525));
  let lift = srgbToLinear3(vec3f(0.114, 0.345, 0.749));
  let haze = srgbToLinear3(vec3f(0.380, 0.560, 0.900));

  // Gradiente diagonal: más profundo abajo a la izquierda, donde va el texto.
  let g = clamp(uv.x * 0.55 + (1.0 - uv.y) * 0.45, 0.0, 1.0);
  var col = mix(deep, base, smoothstep(0.0, 0.75, g));

  // Luz suave que deriva: fbm de baja frecuencia con un warp leve.
  let q = vec2f(
    fbmSimplex2d(p * 0.35 + vec2f(t, -t * 0.6), 2, 2.0, 0.5),
    fbmSimplex2d(p * 0.35 + vec2f(-t * 0.7, t * 0.4) + vec2f(4.2, 1.3), 2, 2.0, 0.5),
  );
  let n = fbmSimplex2d(p * 0.55 + q * 0.35 + vec2f(t * 0.5, 0.0), 3, 2.0, 0.45);
  let glow = smoothstep(-0.6, 0.9, n);
  col = mix(col, lift, glow * 0.32 * params.intensity);

  // Brillo difuso arriba a la derecha; el puntero lo desplaza apenas.
  let c = vec2f(0.84 + (params.pointer.x - 0.5) * 0.05, 0.1 + (params.pointer.y - 0.5) * 0.04);
  let d = distance(vec2f(uv.x * aspect, uv.y), vec2f(c.x * aspect, c.y));
  col += haze * exp(-d * d * 2.6) * 0.2 * params.intensity;

  // Tope de luminancia: protege el contraste del texto blanco.
  let l = luminance(col);
  if (l > params.maxLuminance) {
    col *= params.maxLuminance / l;
  }

  var srgb = linearToSrgb3(col);
  // Grano muy fino contra el banding del degradé.
  let h = hash2(uv * params.resolution + vec2f(fract(params.time) * 37.0)).x - 0.5;
  srgb += vec3f(h * params.grain);
  return vec4f(srgb, 1.0);
}
