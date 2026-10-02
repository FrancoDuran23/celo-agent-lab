import type { Norma } from "../../data/types";
import { IMPUESTOS } from "../../data/impuestos";
import { normalize } from "../../lib/search";

export type TipoNorma = Norma["tipo"];
export type TemaNorma = Norma["tema"];

/* ------------------------------------------------------------------ */
/* Tipos de norma                                                      */
/* ------------------------------------------------------------------ */

export interface TipoInfo {
  /** Valor en la URL (?tipo=). */
  id: string;
  tipo: TipoNorma;
  label: string;
  /** Términos extra para el buscador ("rg", "codigo fiscal"…). */
  claves: string;
}

export const TIPOS: TipoInfo[] = [
  { id: "codigo", tipo: "Código", label: "Código", claves: "codigo fiscal" },
  { id: "ley", tipo: "Ley", label: "Ley", claves: "ley leyes" },
  { id: "decreto", tipo: "Decreto", label: "Decreto", claves: "decreto decretos" },
  { id: "resolucion", tipo: "Resolución General", label: "Resolución General", claves: "resolucion general resoluciones rg" },
];

export const tipoInfo = (tipo: TipoNorma): TipoInfo => TIPOS.find((t) => t.tipo === tipo) ?? TIPOS[TIPOS.length - 1]!;

/** Acepta el id ("ley") o el nombre ("Ley", "Resolución General"), sin distinguir mayúsculas ni tildes. */
export function tipoDeParam(param: string): TipoInfo | undefined {
  const p = normalize(param);
  if (!p) return undefined;
  return TIPOS.find((t) => t.id === p || normalize(t.tipo) === p);
}

/* ------------------------------------------------------------------ */
/* Temas                                                               */
/* ------------------------------------------------------------------ */

export interface TemaInfo {
  id: TemaNorma;
  label: string;
}

export const TEMAS: TemaInfo[] = [
  ...IMPUESTOS.map((i) => ({ id: i.slug, label: i.corto }) satisfies TemaInfo),
  { id: "general", label: "General" },
  { id: "procedimiento", label: "Procedimiento" },
];

export const temaInfo = (tema: TemaNorma): TemaInfo => TEMAS.find((t) => t.id === tema) ?? { id: tema, label: tema };

/** Acepta el id ("inmobiliario") o la etiqueta, sin distinguir mayúsculas ni tildes. */
export function temaDeParam(param: string): TemaInfo | undefined {
  const p = normalize(param);
  if (!p) return undefined;
  return TEMAS.find((t) => t.id === p || normalize(t.label) === p);
}

/* ------------------------------------------------------------------ */
/* Orden, búsqueda y formato                                           */
/* ------------------------------------------------------------------ */

const numeroValor = (numero: string) => Number.parseInt(numero.replace(/\./g, ""), 10) || 0;

/** Año descendente y, dentro del año, número descendente. */
export function byRecency(a: Norma, b: Norma): number {
  return b.anio - a.anio || numeroValor(b.numero) - numeroValor(a.numero) || b.numero.localeCompare(a.numero, "es");
}

/** "N.º 6.492/2025" */
export const numeroLabel = (n: Norma) => `N.º ${n.numero}/${n.anio}`;

/** Lectura completa para lectores de pantalla: "Ley N.º 6.492/2025". */
export const normaLabel = (n: Norma) => `${n.tipo} ${numeroLabel(n)}`;

/** Términos normalizados de la consulta. Ignora "N.º", "nro." y puntos de miles. */
export function queryTerms(q: string): string[] {
  return normalize(q)
    .split(/\s+/)
    .map((t) => t.replace(/^[«“"']+|[»”"',;:]+$/g, "").replace(/(\d)\.(?=\d)/g, "$1"))
    .filter((t) => t && !/^(n[.°º]*º?|nro\.?|numero)$/.test(t));
}

function haystack(n: Norma): string {
  const plano = n.numero.replace(/\./g, "");
  return normalize(
    [
      n.titulo,
      n.tipo,
      tipoInfo(n.tipo).claves,
      n.numero,
      plano,
      `${plano}/${n.anio}`,
      String(n.anio),
      temaInfo(n.tema).label,
    ].join(" "),
  );
}

export function matchesTerms(n: Norma, terms: string[]): boolean {
  if (!terms.length) return true;
  const h = haystack(n);
  return terms.every((t) => h.includes(t));
}

/**
 * Separa el título en encabezado y bajada:
 * "Código Fiscal … (T.O. 2022 y modificatorias)" → ["Código Fiscal …", "T.O. 2022 y modificatorias"]
 * "Ley Impositiva 2026: alícuotas…" → ["Ley Impositiva 2026", "Alícuotas…"]
 */
export function splitTitulo(titulo: string): [string, string | null] {
  const paren = /^(.+?)\s*\(([^()]+)\)\s*$/.exec(titulo);
  if (paren) return [paren[1]!, paren[2]!];
  const i = titulo.indexOf(":");
  if (i > 0 && i < titulo.length - 1) {
    const resto = titulo.slice(i + 1).trim();
    return [titulo.slice(0, i).trim(), resto.charAt(0).toLocaleUpperCase("es") + resto.slice(1)];
  }
  return [titulo, null];
}

/** Código Fiscal y la Ley Impositiva más reciente. */
export function normasClave(list: Norma[]): { codigo?: Norma; impositiva?: Norma } {
  const sorted = [...list].sort(byRecency);
  return {
    codigo: sorted.find((n) => n.tipo === "Código"),
    impositiva: sorted.find((n) => n.tipo === "Ley" && normalize(n.titulo).startsWith("ley impositiva")),
  };
}

/** Normaliza un carácter igual que `normalize`, sin recortar espacios. */
const foldChar = (c: string) => c.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

/**
 * Rangos [inicio, fin) del texto original que coinciden con algún término,
 * comparando sin tildes ni mayúsculas.
 */
export function matchRanges(text: string, terms: string[]): [number, number][] {
  if (!terms.length) return [];
  const chars = Array.from(text);
  let folded = "";
  const map: number[] = []; // índice en `folded` → índice en `text`
  let offset = 0;
  for (const c of chars) {
    const f = foldChar(c);
    for (let k = 0; k < f.length; k++) map.push(offset);
    folded += f;
    offset += c.length;
  }
  map.push(offset);

  const ranges: [number, number][] = [];
  for (const term of terms) {
    if (term.length < 2) continue;
    let from = 0;
    for (;;) {
      const i = folded.indexOf(term, from);
      if (i < 0) break;
      ranges.push([map[i]!, map[i + term.length]!]);
      from = i + term.length;
    }
  }
  ranges.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else merged.push([r[0], r[1]]);
  }
  return merged;
}
