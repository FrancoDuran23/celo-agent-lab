import { TRAMITES } from "../../data/tramites";
import type { Impuesto, Tramite } from "../../data/types";

/** Resuelve los ids de `imp.tramites` contra el catálogo, en el orden del impuesto. */
export function tramitesDe(imp: Impuesto): Tramite[] {
  return imp.tramites.map((id) => TRAMITES.find((t) => t.id === id)).filter((t): t is Tramite => Boolean(t));
}

export const CANAL_LABEL: Record<Tramite["canal"], string> = {
  online: "En línea",
  presencial: "Presencial",
  "online-y-presencial": "En línea o presencial",
};

export const opensNewTab = (href: string) => /^https?:/.test(href);
