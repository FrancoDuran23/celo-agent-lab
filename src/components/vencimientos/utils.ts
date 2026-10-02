import { IMPUESTOS } from "../../data/impuestos";
import { VENCIMIENTOS } from "../../data/vencimientos";
import type { ImpuestoSlug, Vencimiento } from "../../data/types";
import { parseISODate } from "../../lib/dates";

/* ------------------------------------------------------------------ */
/* Fechas (siempre en horario local, a medianoche)                     */
/* ------------------------------------------------------------------ */

const pad = (n: number) => String(n).padStart(2, "0");

/** Date local → "YYYY-MM-DD" (sin pasar por UTC). */
export function toISO(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** "YYYY-MM" del mes de una fecha ISO o Date. */
export function monthKey(d: Date | string): string {
  const date = typeof d === "string" ? parseISODate(d) : d;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

export function sameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/** Índice del día de la semana con lunes = 0 … domingo = 6. */
export function weekdayMon(d: Date): number {
  return (d.getDay() + 6) % 7;
}

/** Semanas (lunes a domingo) que cubren el mes, con días de meses vecinos. */
export function monthMatrix(month: Date): Date[][] {
  const first = startOfMonth(month);
  const start = addDays(first, -weekdayMon(first));
  const last = new Date(first.getFullYear(), first.getMonth() + 1, 0);
  const end = addDays(last, 6 - weekdayMon(last));
  const weeks: Date[][] = [];
  for (let d = start; d <= end; d = addDays(d, 7)) {
    weeks.push(Array.from({ length: 7 }, (_, i) => addDays(d, i)));
  }
  return weeks;
}

/** Mismo día del mes en otro mes, recortado al último día si no existe. */
export function shiftMonthKeepDay(d: Date, n: number): Date {
  const target = addMonths(d, n);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), lastDay));
}

/* ------------------------------------------------------------------ */
/* Formatos es-AR                                                       */
/* ------------------------------------------------------------------ */

const fmtMonthName = new Intl.DateTimeFormat("es-AR", { month: "long" });
const fmtMonthShort = new Intl.DateTimeFormat("es-AR", { month: "short" });
const fmtWeekdayShort = new Intl.DateTimeFormat("es-AR", { weekday: "short" });
const fmtWeekdayLong = new Intl.DateTimeFormat("es-AR", { weekday: "long" });

export const capitalize = (s: string) => (s ? s.charAt(0).toLocaleUpperCase("es-AR") + s.slice(1) : s);

export const monthName = (d: Date) => capitalize(fmtMonthName.format(d));
export const monthShort = (d: Date) => fmtMonthShort.format(d).replace(".", "");
export const weekdayShort = (d: Date) => fmtWeekdayShort.format(d).replace(".", "");

/** Encabezados lunes → domingo ("lun", "mar"…, y el nombre completo para lectores). */
export const WEEKDAYS = Array.from({ length: 7 }, (_, i) => {
  // 5 de enero de 2026 fue lunes.
  const d = new Date(2026, 0, 5 + i);
  return { short: weekdayShort(d), long: fmtWeekdayLong.format(d) };
});

/* ------------------------------------------------------------------ */
/* Impuestos                                                            */
/* ------------------------------------------------------------------ */

export interface ImpuestoMeta {
  slug: ImpuestoSlug;
  nombre: string;
  corto: string;
  /** Índice en MARKS: cómo se marca el impuesto en la grilla. */
  mark: number;
}

/**
 * Marcas de la grilla: dos tonos (azul de marca y tinta) y dos formas
 * (lleno y hueco), para que los impuestos se distingan sin depender
 * sólo del color. Las clases van completas para que Tailwind las genere.
 */
export const MARKS: { tone: string; shape: string }[] = [
  { tone: "text-brand", shape: "rounded-full bg-current" },
  { tone: "text-ink-2", shape: "rounded-full border-2 border-current" },
  { tone: "text-brand", shape: "rounded-[2px] border-2 border-current" },
  { tone: "text-ink-2", shape: "rounded-[2px] bg-current" },
];

// Los impuestos con vencimientos cargados reciben las primeras marcas.
const PRESENT = new Set<string>(VENCIMIENTOS.map((v) => v.impuesto));
const ORDERED = [...IMPUESTOS.filter((i) => PRESENT.has(i.slug)), ...IMPUESTOS.filter((i) => !PRESENT.has(i.slug))];

const META = new Map<string, ImpuestoMeta>(
  ORDERED.map((i, idx) => [i.slug, { slug: i.slug, nombre: i.nombre, corto: i.corto, mark: idx % MARKS.length }]),
);

export function impuestoMeta(slug: ImpuestoSlug): ImpuestoMeta {
  return META.get(slug) ?? { slug, nombre: slug, corto: slug, mark: 0 };
}

/* ------------------------------------------------------------------ */
/* Vencimientos                                                         */
/* ------------------------------------------------------------------ */

export const vencKey = (v: Vencimiento) => `${v.fecha}|${v.impuesto}|${v.titulo}|${v.detalle ?? ""}`;

export const sortByFecha = (list: readonly Vencimiento[]) =>
  [...list].sort((a, b) => a.fecha.localeCompare(b.fecha) || a.titulo.localeCompare(b.titulo, "es"));

export function groupByDate(list: readonly Vencimiento[]): Map<string, Vencimiento[]> {
  const map = new Map<string, Vencimiento[]>();
  for (const v of list) {
    const arr = map.get(v.fecha);
    if (arr) arr.push(v);
    else map.set(v.fecha, [v]);
  }
  return map;
}

export function groupByMonth(list: readonly Vencimiento[]): { key: string; month: Date; items: Vencimiento[] }[] {
  const groups = new Map<string, Vencimiento[]>();
  for (const v of sortByFecha(list)) {
    const k = monthKey(v.fecha);
    const arr = groups.get(k);
    if (arr) arr.push(v);
    else groups.set(k, [v]);
  }
  return [...groups].map(([key, items]) => ({ key, month: startOfMonth(parseISODate(items[0]!.fecha)), items }));
}

export const pluralVenc = (n: number) => (n === 1 ? "1 vencimiento" : `${n} vencimientos`);

/** "Ingresos Brutos · Régimen Local — Anticipo septiembre". */
export const vencLabel = (v: Vencimiento) => (v.detalle ? `${v.titulo} — ${v.detalle}` : v.titulo);
