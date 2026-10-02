import type { ShaderSource } from "vgpu";
import quebrada from "./quebrada.wgsl";
import aguayo from "./aguayo.wgsl";
import aurora from "./aurora.wgsl";
import luz from "./luz.wgsl";

/** Valores del struct `params` además de time / resolution / pointer. */
export type ShaderUniforms = Record<string, number | readonly number[]>;

interface ShaderDef {
  source: ShaderSource;
  defaults: ShaderUniforms;
  /** Cuadro inicial (segundos) — también es el cuadro estático con reduced-motion. */
  startTime?: number;
}

export const SHADERS = {
  /** Banda del buscador: luz ambiental sutil sobre el azul institucional. */
  luz: {
    source: luz,
    defaults: { amount: 0.75, grain: 0.006, top: [1, 1, 1], bottom: [0.957, 0.976, 0.992], glow: [0.78, 0.89, 0.97] },
    startTime: 12,
  },
  /** Hero: estratos del Cerro de los Siete Colores bajo cielo nocturno. */
  quebrada: { source: quebrada, defaults: { intensity: 1, textShade: 0.6, grain: 0.035 }, startTime: 7.5 },
  /** Franjas CTA: motivo de aguayo andino, bajo contraste. */
  aguayo: { source: aguayo, defaults: { intensity: 1, cell: 6, grain: 0.02, maxLuminance: 0.1 }, startTime: 3 },
  /** Secciones claras: gradientes suaves crema/rosa/ocre. */
  aurora: { source: aurora, defaults: { intensity: 1, grain: 0.025, contours: 0.6 }, startTime: 2 },
} satisfies Record<string, ShaderDef>;

export type ShaderName = keyof typeof SHADERS;
