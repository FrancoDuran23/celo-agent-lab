import type { Noticia, PaletteColor } from "../../data/types";
import { normalize } from "../../lib/search";

/*
 * Helpers de presentación para las noticias: color por categoría, slug de
 * categoría para la URL (?categoria=) y un enlace interno relacionado.
 * Las categorías salen de los datos; las que no estén mapeadas acá reciben
 * un color estable derivado de su nombre y no muestran enlace relacionado.
 */

export const PALETTE_HEX: Record<PaletteColor, string> = {
  terracota: "#c4532f",
  ocre: "#e0a63b",
  rosa: "#d9877f",
  salvia: "#7f9a62",
  violeta: "#6a4c93",
  night: "#2a4470",
};

const COLORS = Object.keys(PALETTE_HEX) as PaletteColor[];

const PREFERIDOS: Record<string, PaletteColor> = {
  "planes de pago": "terracota",
  vencimientos: "ocre",
  beneficios: "salvia",
  inmobiliario: "violeta",
  atencion: "rosa",
};

/** Rutas internas que existen en el sitio, para dar un próximo paso. */
const RELACIONADOS: Record<string, { label: string; to: string }> = {
  "planes de pago": { label: "Ver planes de pago", to: "/tramites?q=plan" },
  vencimientos: { label: "Ver calendario de vencimientos", to: "/vencimientos" },
  inmobiliario: { label: "Ver Impuesto Inmobiliario", to: "/impuestos/inmobiliario" },
  atencion: { label: "Ver canales de atención", to: "/atencion" },
};

/** FNV-1a de 32 bits: hash estable y barato para semillas visuales. */
export function hashString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function categoriaColor(categoria: string): PaletteColor {
  return PREFERIDOS[normalize(categoria)] ?? COLORS[hashString(normalize(categoria)) % COLORS.length]!;
}

export function categoriaRelacionada(categoria: string): { label: string; to: string } | undefined {
  return RELACIONADOS[normalize(categoria)];
}

/** "Planes de pago" → "planes-de-pago". */
export function slugCategoria(categoria: string): string {
  return normalize(categoria)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface CategoriaResumen {
  nombre: string;
  slug: string;
  color: PaletteColor;
  cantidad: number;
}

/** Categorías presentes en los datos, en orden alfabético, con su cantidad. */
export function categoriasDe(noticias: Noticia[]): CategoriaResumen[] {
  const map = new Map<string, CategoriaResumen>();
  for (const n of noticias) {
    const slug = slugCategoria(n.categoria);
    const prev = map.get(slug);
    if (prev) prev.cantidad++;
    else map.set(slug, { nombre: n.categoria, slug, color: categoriaColor(n.categoria), cantidad: 1 });
  }
  return [...map.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

/** Más recientes primero; a igual fecha, por título. */
export function ordenarPorFecha(noticias: Noticia[]): Noticia[] {
  return [...noticias].sort((a, b) => b.fecha.localeCompare(a.fecha) || a.titulo.localeCompare(b.titulo, "es"));
}

/** "https://www.rentasjujuy.gob.ar/..." → "rentasjujuy.gob.ar". */
export function hostDe(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "el sitio oficial";
  }
}

export const NEW_TAB_NOTE = " (se abre en una pestaña nueva)";
