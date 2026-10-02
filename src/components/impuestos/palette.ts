import type { PaletteColor } from "../../data/types";

/**
 * Tres tonos por color de la paleta, ordenados como los estratos del
 * Cerro de los Siete Colores. Se usan para franjas y relieves decorativos;
 * son iguales en modo claro y oscuro.
 */
export const STRATA_STOPS: Record<PaletteColor, readonly [string, string, string]> = {
  terracota: ["#c4532f", "#d9714e", "#e0a63b"],
  ocre: ["#e0a63b", "#f0cc85", "#d9877f"],
  rosa: ["#d9877f", "#e0a63b", "#c4532f"],
  salvia: ["#7f9a62", "#a8bb8a", "#e0a63b"],
  violeta: ["#6a4c93", "#d9877f", "#e0a63b"],
  night: ["#2a4470", "#6a4c93", "#d9877f"],
};

/** `linear-gradient(...)` con los tres tonos del color. */
export function strataGradient(color: PaletteColor, direction = "90deg") {
  const [a, b, c] = STRATA_STOPS[color];
  return `linear-gradient(${direction}, ${a}, ${b}, ${c})`;
}

/** Clases `tint-*` (definidas en index.css) escritas completas para Tailwind. */
export const TINT: Record<PaletteColor, string> = {
  terracota: "tint-terracota",
  ocre: "tint-ocre",
  rosa: "tint-rosa",
  salvia: "tint-salvia",
  violeta: "tint-violeta",
  night: "tint-night",
};
