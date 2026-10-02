import type { Oficina, Region } from "../../data/types";

/** Orden de las regiones en filtros y listados: primero la capital, CABA al final. */
export const REGION_ORDER: Region[] = ["Valles", "Quebrada", "Puna", "Ramal", "CABA"];

export const REGION_META: Record<Region, { label: string }> = {
  Valles: { label: "Valles" },
  Quebrada: { label: "Quebrada" },
  Puna: { label: "Puna" },
  Ramal: { label: "Ramal" },
  CABA: { label: "CABA" },
};

/**
 * "0388 424-6055 int. 255" → { numero: "0388 424-6055", interno: "255" }.
 * El interno se muestra aparte y nunca entra en el href.
 */
export function splitPhone(raw: string): { numero: string; interno?: string } {
  const m = raw.match(/^(.*?)[\s,]*\b(?:int\.?|interno)\s*(\d+)\s*$/i);
  if (m && m[1]) return { numero: m[1].trim(), interno: m[2] };
  return { numero: raw.trim() };
}

/** Href tel: sólo con dígitos (sin espacios, guiones ni internos). */
export function telHref(numero: string): string | null {
  const digits = numero.replace(/\D/g, "");
  return digits ? `tel:${digits}` : null;
}

/** Búsqueda en Google Maps a partir de la dirección y la localidad de la oficina. */
export function mapsHref(o: Oficina): string | null {
  if (!o.direccion) return null;
  const zona = o.region === "CABA" ? "Buenos Aires, Argentina" : "Jujuy, Argentina";
  const query = `${o.direccion}, ${o.localidad}, ${zona}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Texto accesible para enlaces que abren otra pestaña. */
export const NEW_TAB = " (se abre en una pestaña nueva)";
