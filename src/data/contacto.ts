import type { Canal, Oficina } from "./types";
import { LINKS, OFFICIAL_URL } from "./site";

/*
 * Fuentes (relevamiento oct. 2026): partes de prensa de la DPR y notas de
 * prensa sobre el Centro de Atención Omnicanal (0800, WhatsApp, correo y
 * TuBOT: confirmados por dos fuentes). Oficinas del interior: página
 * oficial /delegaciones/ (vista en fragmentos; verificar antes de publicar).
 */

export const CONTACTO = {
  telefono: { valor: "0800-555-5599", href: "tel:08005555599" },
  whatsapp: { valor: "388 340-1111", href: "https://wa.me/5493883401111" },
  email: { valor: "centrodeatencion@rentasjujuy.gob.ar", href: "mailto:centrodeatencion@rentasjujuy.gob.ar" },
} as const;

export const PORTAL = {
  sitioOficial: OFFICIAL_URL,
  clave: { cta: "Ingresar", ctaLargo: "Ingresar con clave fiscal", href: LINKS.login },
  turnos: { href: LINKS.turnos },
  sinClave: { href: LINKS.serviciosSinClave },
} as const;

/** Centro de Atención Omnicanal. */
export const CANALES: Canal[] = [
  {
    id: "telefono",
    nombre: "Línea gratuita",
    valor: CONTACTO.telefono.valor,
    href: CONTACTO.telefono.href,
    descripcion: "Hablá con un operador para consultas, trámites y gestiones.",
    icon: "phone",
  },
  {
    id: "whatsapp",
    nombre: "WhatsApp",
    valor: CONTACTO.whatsapp.valor,
    href: CONTACTO.whatsapp.href,
    descripcion: "Escribinos o usá a TuBOT para consultar y pagar el Inmobiliario.",
    icon: "smartphone",
  },
  {
    id: "tubot",
    nombre: "Asistente virtual TuBOT",
    valor: "Chat web, las 24 horas",
    href: OFFICIAL_URL,
    descripcion: "Consultá, calculá y pagá el Inmobiliario cualquier día, incluso feriados.",
    horario: "24 h, todos los días",
    icon: "chat",
  },
  {
    id: "email",
    nombre: "Correo electrónico",
    valor: CONTACTO.email.valor,
    href: CONTACTO.email.href,
    descripcion: "Para consultas que no son urgentes o fuera del horario de atención.",
    icon: "mail",
  },
];

export const OFICINAS: Oficina[] = [
  {
    nombre: "Casa Central",
    localidad: "San Salvador de Jujuy",
    region: "Valles",
    direccion: "Lavalle 55",
    horario: "Lunes a viernes de 7:30 a 15:30",
    casaCentral: true,
  },
  { nombre: "Delegación Palpalá", localidad: "Palpalá", region: "Valles", direccion: "Monteagudo 84, 1.º piso, of. 3", telefono: "0388 427-7170" },
  { nombre: "Delegación Perico", localidad: "Perico", region: "Valles", direccion: "Lavalle 94", telefono: "0388 491-1416" },
  { nombre: "Delegación El Carmen", localidad: "El Carmen", region: "Valles", direccion: "Belgrano esq. Gral. Paz 601", telefono: "0388 493-4338" },
  { nombre: "Delegación Monterrico", localidad: "Monterrico", region: "Valles", direccion: "Las Orquídeas 201, Nueva Terminal", telefono: "0388 424-6079" },
  { nombre: "Delegación Tilcara", localidad: "Tilcara", region: "Quebrada", direccion: "Ernesto Padilla s/n, centro", telefono: "0388 424-6055 int. 255" },
  { nombre: "Delegación Humahuaca", localidad: "Humahuaca", region: "Quebrada", direccion: "Entre Ríos esq. Santa Fe, Centro Cívico, 1.º piso", telefono: "03887 42-1500" },
  { nombre: "Delegación La Quiaca", localidad: "La Quiaca", region: "Puna", direccion: "Balcarce 452", telefono: "03885 42-2445" },
  { nombre: "Delegación San Pedro", localidad: "San Pedro de Jujuy", region: "Ramal", direccion: "Sarmiento esq. Alberdi, 1.º piso", telefono: "03888 42-0227" },
  {
    nombre: "Delegación Libertador Gral. San Martín",
    localidad: "Libertador Gral. San Martín",
    region: "Ramal",
    direccion: "Sixto Ovejero 359, Centro Cívico Ernesto Zamar",
    telefono: "03886 42-1701",
  },
  { nombre: "Delegación Fraile Pintado", localidad: "Fraile Pintado", region: "Ramal", direccion: "Bustamante 81, centro", telefono: "03886 48-0809" },
  { nombre: "Oficina en Buenos Aires", localidad: "Ciudad Autónoma de Buenos Aires", region: "CABA", direccion: "Carlos Pellegrini 755, 6.º piso" },
];

/** Cuentas oficiales (relevadas en búsquedas; verificar antes de publicar). */
export const REDES: { nombre: string; usuario: string; href: string }[] = [
  { nombre: "Instagram", usuario: "@rentasjujuy", href: "https://www.instagram.com/rentasjujuy/" },
  { nombre: "Facebook", usuario: "dprjujuy", href: "https://www.facebook.com/dprjujuy/" },
  { nombre: "X", usuario: "@rentasjujuy", href: "https://x.com/rentasjujuy" },
];

/** Medios de pago aceptados (página oficial "Medios y lugares de pago"). */
export const MEDIOS_DE_PAGO = {
  digitales: ["Tarjetas de débito y crédito", "DEBIN", "Mercado Pago", "Pago Mis Cuentas", "Interbanking"],
  presenciales: ["Pago Fácil", "Rapipago", "Banco Macro"],
} as const;

/** Programa de atención territorial. */
export const RENTAS_CON_VOS = {
  titulo: "Rentas con Vos",
  descripcion:
    "Jornadas de atención en barrios de la capital y localidades del interior sin delegación permanente: asesoramiento, ayuda con trámites y capacitación en el uso de la web y los medios de pago electrónicos.",
  href: LINKS.rentasConVos,
} as const;
