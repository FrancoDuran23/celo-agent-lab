import type { ShaderSource } from "vgpu";
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
  /** Portada: velo de luz celeste muy leve; los colores llegan por uniforms según el tema. */
  luz: {
    source: luz,
    defaults: { amount: 0.75, grain: 0.006, top: [1, 1, 1], bottom: [0.957, 0.976, 0.992], glow: [0.78, 0.89, 0.97] },
    startTime: 12,
  },
} satisfies Record<string, ShaderDef>;

export type ShaderName = keyof typeof SHADERS;
