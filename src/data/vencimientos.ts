import type { Vencimiento } from "./types";
import { LINKS } from "./site";

/**
 * Calendario Impositivo 2026 — RG N.º 1732/2025.
 *
 * ATENCIÓN: fechas ORIENTATIVAS del prototipo, armadas a partir de los
 * patrones relevados (no del texto completo de la RG):
 *  - Ingresos Brutos Régimen Local: día 20 de cada mes o hábil siguiente
 *    (fechas 2026 vistas: 20/02, 20/04, 20/05, 22/06, 20/07).
 *  - Monotributo Unificado: día 20 de cada mes, junto al Monotributo nacional.
 *  - Inmobiliario: anticipos al último día hábil del mes (vistos: 27/02,
 *    31/03, 30/04, 29/05).
 * Reemplazar por el calendario oficial antes de publicar.
 */
export const VENCIMIENTOS_INFO = {
  ilustrativo: true,
  norma: "RG N.º 1732/2025",
  oficial: LINKS.calendario,
} as const;

export const VENCIMIENTOS: Vencimiento[] = [
  // Septiembre 2026 (vencidos, para el historial del calendario)
  { fecha: "2026-09-21", impuesto: "ingresos-brutos", titulo: "Ingresos Brutos · Régimen Local", detalle: "Anticipo agosto" },
  { fecha: "2026-09-21", impuesto: "ingresos-brutos", titulo: "Monotributo Unificado", detalle: "Cuota septiembre" },
  { fecha: "2026-09-30", impuesto: "inmobiliario", titulo: "Impuesto Inmobiliario", detalle: "Anticipo 9" },

  // Octubre 2026
  { fecha: "2026-10-20", impuesto: "ingresos-brutos", titulo: "Ingresos Brutos · Régimen Local", detalle: "Anticipo septiembre" },
  { fecha: "2026-10-20", impuesto: "ingresos-brutos", titulo: "Monotributo Unificado", detalle: "Cuota octubre" },
  { fecha: "2026-10-30", impuesto: "inmobiliario", titulo: "Impuesto Inmobiliario", detalle: "Anticipo 10" },

  // Noviembre 2026
  { fecha: "2026-11-20", impuesto: "ingresos-brutos", titulo: "Ingresos Brutos · Régimen Local", detalle: "Anticipo octubre" },
  { fecha: "2026-11-20", impuesto: "ingresos-brutos", titulo: "Monotributo Unificado", detalle: "Cuota noviembre" },
  { fecha: "2026-11-30", impuesto: "inmobiliario", titulo: "Impuesto Inmobiliario", detalle: "Anticipo 11" },

  // Diciembre 2026
  { fecha: "2026-12-21", impuesto: "ingresos-brutos", titulo: "Ingresos Brutos · Régimen Local", detalle: "Anticipo noviembre" },
  { fecha: "2026-12-21", impuesto: "ingresos-brutos", titulo: "Monotributo Unificado", detalle: "Cuota diciembre" },
  { fecha: "2026-12-31", impuesto: "inmobiliario", titulo: "Impuesto Inmobiliario", detalle: "Anticipo 12" },
];
