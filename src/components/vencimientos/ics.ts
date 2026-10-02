import type { Vencimiento } from "../../data/types";
import { VENCIMIENTOS_INFO } from "../../data/vencimientos";
import { parseISODate } from "../../lib/dates";
import { addDays, toISO, vencLabel } from "./utils";

/*
 * Generación de archivos iCalendar (RFC 5545) en el navegador.
 * Eventos de día completo: DTSTART;VALUE=DATE y DTEND exclusivo (día siguiente).
 */

const CRLF = "\r\n";

/** Escapa texto según RFC 5545 §3.3.11. */
function escapeText(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/** Pliega líneas a 75 octetos (UTF-8) sin cortar caracteres multibyte. */
function fold(line: string): string {
  const enc = new TextEncoder();
  if (enc.encode(line).length <= 75) return line;
  const out: string[] = [];
  let current = "";
  let bytes = 0;
  let limit = 75;
  for (const ch of line) {
    const b = enc.encode(ch).length;
    if (bytes + b > limit) {
      out.push(current);
      current = "";
      bytes = 0;
      limit = 74; // las líneas de continuación empiezan con un espacio
    }
    current += ch;
    bytes += b;
  }
  if (current) out.push(current);
  return out.join(CRLF + " ");
}

const compactDate = (iso: string) => iso.replace(/-/g, "");

function utcStamp(d = new Date()): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Año del calendario si todos los vencimientos son del mismo año. */
export function calendarioNombre(list: readonly Vencimiento[]): string {
  const years = new Set(list.map((v) => v.fecha.slice(0, 4)));
  return years.size === 1 ? `Calendario Impositivo ${[...years][0]}` : "Calendario Impositivo";
}

function description(nombreCalendario: string): string {
  const base = VENCIMIENTOS_INFO.ilustrativo
    ? `Fecha orientativa basada en el ${nombreCalendario} (${VENCIMIENTOS_INFO.norma}).`
    : `Según el ${nombreCalendario} (${VENCIMIENTOS_INFO.norma}).`;
  return [
    base,
    "Si el vencimiento cae en un día inhábil, se traslada al primer día hábil siguiente.",
    `Verificá la fecha en el calendario oficial de la Dirección Provincial de Rentas de Jujuy: ${VENCIMIENTOS_INFO.oficial}`,
  ].join("\n");
}

function vevent(v: Vencimiento, stamp: string, desc: string): string[] {
  const start = parseISODate(v.fecha);
  return [
    "BEGIN:VEVENT",
    `UID:${compactDate(v.fecha)}-${slugify(`${v.impuesto} ${vencLabel(v)}`)}@vencimientos.rentasjujuy.gob.ar`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${compactDate(v.fecha)}`,
    `DTEND;VALUE=DATE:${compactDate(toISO(addDays(start, 1)))}`,
    `SUMMARY:${escapeText(vencLabel(v))}`,
    `DESCRIPTION:${escapeText(desc)}`,
    `URL:${VENCIMIENTOS_INFO.oficial}`,
    "TRANSP:TRANSPARENT",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeText(`Vence mañana: ${vencLabel(v)}`)}`,
    "TRIGGER:-PT15H", // 9:00 del día anterior
    "END:VALARM",
    "END:VEVENT",
  ];
}

export function buildICS(list: readonly Vencimiento[]): string {
  const stamp = utcStamp();
  const desc = description(calendarioNombre(list));
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Rentas Jujuy//Calendario de vencimientos//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...list.flatMap((v) => vevent(v, stamp, desc)),
    "END:VCALENDAR",
  ];
  return lines.map(fold).join(CRLF) + CRLF;
}

export function icsFileName(list: readonly Vencimiento[]): string {
  if (list.length === 1) {
    const v = list[0]!;
    return `vencimiento-${v.fecha}-${slugify(vencLabel(v)) || v.impuesto}.ics`;
  }
  return "vencimientos-rentas-jujuy.ics";
}

/** Descarga el .ics. Devuelve false si el navegador no lo permitió. */
export function downloadICS(list: readonly Vencimiento[]): boolean {
  if (!list.length || typeof document === "undefined") return false;
  try {
    const blob = new Blob([buildICS(list)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = icsFileName(list);
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Safari necesita que la URL siga viva un momento después del click.
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
    return true;
  } catch {
    return false;
  }
}
