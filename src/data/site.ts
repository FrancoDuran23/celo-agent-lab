import type { NavItem } from "./types";

/** Portal oficial: los trámites de este front apuntan ahí. */
export const OFFICIAL_URL = "https://www.rentasjujuy.gob.ar";

/**
 * Prototipo de rediseño no oficial: muestra un aviso discreto.
 * Poner en false si el organismo lo adopta.
 */
export const SHOW_PROTOTYPE_NOTICE = true;

export const SITE = {
  nombre: "Rentas Jujuy",
  nombreLargo: "Dirección Provincial de Rentas",
  dependencia: "Ministerio de Hacienda y Finanzas · Gobierno de Jujuy",
  url: OFFICIAL_URL,
} as const;

export const NAV: NavItem[] = [
  { label: "Trámites", to: "/tramites" },
  {
    label: "Impuestos",
    to: "/impuestos",
    children: [
      { label: "Inmobiliario", to: "/impuestos/inmobiliario", icon: "house", descripcion: "Inmuebles urbanos y rurales" },
      { label: "Automotor", to: "/impuestos/automotor", icon: "car", descripcion: "Autos, motos y utilitarios" },
      { label: "Ingresos Brutos", to: "/impuestos/ingresos-brutos", icon: "store", descripcion: "Actividades económicas" },
      { label: "Sellos", to: "/impuestos/sellos", icon: "stamp", descripcion: "Contratos e instrumentos" },
      { label: "Tasas", to: "/impuestos/tasas", icon: "gavel", descripcion: "Tasa de justicia y retributivas" },
    ],
  },
  { label: "Vencimientos", to: "/vencimientos" },
  { label: "Atención", to: "/atencion" },
  { label: "Normativa", to: "/normativa" },
  { label: "Noticias", to: "/noticias" },
];
