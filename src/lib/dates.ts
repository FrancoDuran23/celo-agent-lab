/** Utilidades de fechas en horario de Argentina (sin dependencias). */

const TZ = "America/Argentina/Jujuy";

/** "2026-10-02" → Date a medianoche local (evita corrimientos por UTC). */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y!, (m ?? 1) - 1, d ?? 1);
}

/** Fecha de hoy (medianoche local) en Jujuy. */
export function today(): Date {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" })
    .format(new Date())
    .split("-")
    .map(Number);
  return new Date(parts[0]!, parts[1]! - 1, parts[2]!);
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

const fmtLong = new Intl.DateTimeFormat("es-AR", { weekday: "long", day: "numeric", month: "long" });
const fmtShort = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short" });
const fmtFull = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric" });
const fmtMonth = new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric" });

export const formatLong = (iso: string) => fmtLong.format(parseISODate(iso));
export const formatShort = (iso: string) => fmtShort.format(parseISODate(iso)).replace(".", "");
export const formatFull = (iso: string) => fmtFull.format(parseISODate(iso));
export const formatMonth = (d: Date) => fmtMonth.format(d);

/** "hoy", "mañana", "en 5 días", "hace 3 días". */
export function relativeDays(iso: string, from = today()): string {
  const n = daysBetween(from, parseISODate(iso));
  if (n === 0) return "hoy";
  if (n === 1) return "mañana";
  if (n === -1) return "ayer";
  return n > 0 ? `en ${n} días` : `hace ${-n} días`;
}

/** Etiqueta de cuenta regresiva, igual en todo el sitio: "Hoy", "Mañana", "En 18 días". */
export function countdownLabel(iso: string, from = today()): string {
  const s = relativeDays(iso, from);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Tono de la cuenta regresiva: advertencia a 7 días o menos, neutro el resto. */
export function countdownTone(iso: string, from = today()): "warn" | "neutral" {
  const n = daysBetween(from, parseISODate(iso));
  return n >= 0 && n <= 7 ? "warn" : "neutral";
}
