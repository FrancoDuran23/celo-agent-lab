import type { Canal, Oficina } from "./types";
import { OFFICIAL_URL } from "./site";

/**
 * Datos de contacto. PROVISORIO: se completa con la investigación verificada.
 */
export const CONTACTO = {
  telefono: { valor: "0800-555-5599", href: "tel:08005555599" },
} as const;

export const PORTAL = {
  sitioOficial: OFFICIAL_URL,
  clave: { cta: "Ingresar", ctaLargo: "Ingresar con clave fiscal", href: OFFICIAL_URL },
  turnos: { href: OFFICIAL_URL },
} as const;

export const CANALES: Canal[] = [];
export const OFICINAS: Oficina[] = [];
