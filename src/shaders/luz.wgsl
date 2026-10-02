// luz.wgsl — Luz ambiental en movimiento para la portada.
//
// Tres masas de luz suaves derivan por trayectorias lentas (Lissajous de
// 29 a 47 s por eje). Se mueven despacio pero con dirección, así el ojo
// lo lee como luz que se desplaza y no como humo que se reforma. Los colores
// llegan como uniforms (sRGB) para servir en modo claro y oscuro.
//
// Todo es periódico en PERIOD segundos (los períodos dividen a PERIOD), así
// el reloj del host puede envolverse en ese valor sin ningún salto.
import { simplex2d } from "@vgpu/wgsl-std/noise/simplex";
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

const TAU: f32 = 6.28318530718;
const PERIOD: f32 = 1200.0;

/* Masa de luz suave: 1 en el centro, ~0.2 en el radio, nada más allá. */
fn mass(p: vec2f, c: vec2f, r: f32) -> f32 {
  let d = length(p - c) / r;
  return exp(-1.6 * d * d);
}

/* Deriva lenta: óvalo de Lissajous. nx, ny son enteros → el ciclo cierra en PERIOD. */
fn drift(t: f32, amp: vec2f, nx: f32, ny: f32, phase: vec2f) -> vec2f {
  return amp * vec2f(sin(TAU * (t * nx / PERIOD) + phase.x), sin(TAU * (t * ny / PERIOD) + phase.y));
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let res = params.resolution;
  let aspect = res.x / max(res.y, 1.0);
  // Unidades físicas: el lado corto mide 1, así el tamaño de las masas
  // no depende de la altura de la banda ni del aspecto.
  let s = min(res.x, res.y);
  let scale = res / s;
  let p = uv * scale;
  let t = params.time;
  // El puntero (sólo escritorio) corre las masas unos píxeles, nada más.
  let nudge = (params.pointer - 0.5) * 0.02;

  // Composición apaisada: las masas viven a la derecha, lejos del texto.
  // Períodos (s): 34/41, 43/29, 38/47 → n = PERIOD / T.
  let a1 = vec2f(0.80, 0.30) * scale + drift(t, vec2f(0.085 * scale.x, 0.2 * scale.y), 35.0, 29.0, vec2f(0.0, 1.7)) + nudge;
  let a2 = vec2f(0.96, 0.85) * scale + drift(t, vec2f(0.085 * scale.x, 0.2 * scale.y), 28.0, 41.0, vec2f(2.1, 0.6)) + nudge;
  let a3 = vec2f(0.64, 1.05) * scale + drift(t, vec2f(0.085 * scale.x, 0.2 * scale.y), 32.0, 26.0, vec2f(4.0, 2.9)) + nudge;
  let wide = 0.55 * mass(p, a1, 0.65) + 0.45 * mass(p, a2, 0.60) + 0.30 * mass(p, a3, 0.70);

  // Composición vertical (móvil): una masa grande arriba a la derecha, casi
  // fuera del lienzo, y otra más tenue abajo a la izquierda detrás de los
  // accesos directos. El texto ocupa todo el ancho, por eso la luz es más baja.
  let b1 = vec2f(1.0, 0.03) * scale + drift(t, vec2f(0.14, 0.09 * scale.y), 35.0, 29.0, vec2f(0.0, 1.7));
  let b2 = vec2f(0.10, 0.92) * scale + drift(t, vec2f(0.14, 0.09 * scale.y), 28.0, 41.0, vec2f(2.1, 0.6));
  let tall = min(0.65, 0.75 * mass(p, b1, 0.90) + 0.50 * mass(p, b2, 0.75));

  // Un toque de ruido de una sola octava para que las masas no sean círculos
  // perfectos; su deriva también es circular, y por eso periódica.
  let ring = vec2f(cos(TAU * t / PERIOD), sin(TAU * t / PERIOD)) * 1.9;
  let w = 0.12 * simplex2d(p * 0.9 + ring);

  let k = smoothstep(0.7, 0.95, aspect);
  let veil = clamp(mix(tall, wide, k) + w * mix(0.6, 1.0, k), 0.0, 1.0);

  // Base: degradé vertical casi imperceptible; encima, el velo.
  var col = mix(srgbToLinear3(params.top), srgbToLinear3(params.bottom), smoothstep(0.0, 1.0, uv.y));
  col = mix(col, srgbToLinear3(params.glow), veil * params.amount);

  var srgb = linearToSrgb3(col);
  // Grano fijo en el píxel (no se resiembra por cuadro): quita el bandeado sin titilar.
  let h = hash2(floor(uv * res)).x - 0.5;
  srgb += vec3f(h * params.grain);
  return vec4f(srgb, 1.0);
}
