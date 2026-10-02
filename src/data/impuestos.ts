import type { Impuesto, ImpuestoSlug } from "./types";

// PROVISORIO: se completa con la investigación verificada.
export const IMPUESTOS: Impuesto[] = [];

export function getImpuesto(slug: string | undefined): Impuesto | undefined {
  return IMPUESTOS.find((i) => i.slug === (slug as ImpuestoSlug));
}
