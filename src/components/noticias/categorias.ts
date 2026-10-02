import type { Noticia } from "../../data/types";
import { formatMonth, parseISODate } from "../../lib/dates";
import { normalize } from "../../lib/search";

/*
 * Helpers de presentación para las noticias: slug de categoría para la URL
 * (?categoria=), un enlace interno relacionado y el agrupado por mes.
 * Las categorías salen de los datos; las que no estén mapeadas acá no
 * muestran enlace relacionado.
 */

/** Rutas internas que existen en el sitio, para dar un próximo paso. */
const RELACIONADOS: Record<string, { label: string; to: string }> = {
  "planes de pago": { label: "Ver planes de pago", to: "/tramites?q=plan" },
  vencimientos: { label: "Ver calendario de vencimientos", to: "/vencimientos" },
  inmobiliario: { label: "Ver Impuesto Inmobiliario", to: "/impuestos/inmobiliario" },
  atencion: { label: "Ver canales de atención", to: "/atencion" },
};

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
  cantidad: number;
}

/** Categorías presentes en los datos, en orden alfabético, con su cantidad. */
export function categoriasDe(noticias: Noticia[]): CategoriaResumen[] {
  const map = new Map<string, CategoriaResumen>();
  for (const n of noticias) {
    const slug = slugCategoria(n.categoria);
    const prev = map.get(slug);
    if (prev) prev.cantidad++;
    else map.set(slug, { nombre: n.categoria, slug, cantidad: 1 });
  }
  return [...map.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

/** Más recientes primero; a igual fecha, por título. */
export function ordenarPorFecha(noticias: Noticia[]): Noticia[] {
  return [...noticias].sort((a, b) => b.fecha.localeCompare(a.fecha) || a.titulo.localeCompare(b.titulo, "es"));
}

export interface Mes {
  /** "YYYY-MM" */
  clave: string;
  /** "Septiembre de 2026" */
  titulo: string;
  items: Noticia[];
}

/** Agrupa por "YYYY-MM" (la lista ya viene ordenada por fecha desc). */
export function agruparPorMes(lista: Noticia[]): Mes[] {
  const meses: Mes[] = [];
  for (const n of lista) {
    const clave = n.fecha.slice(0, 7);
    let mes = meses.at(-1);
    if (!mes || mes.clave !== clave) {
      const nombre = formatMonth(parseISODate(`${clave}-01`));
      mes = { clave, titulo: nombre.charAt(0).toLocaleUpperCase("es") + nombre.slice(1), items: [] };
      meses.push(mes);
    }
    mes.items.push(n);
  }
  return meses;
}

/** "https://www.rentasjujuy.gob.ar/..." → "rentasjujuy.gob.ar". */
export function hostDe(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "el sitio oficial";
  }
}
