import type { NavItem } from "./types";

/** Sitio informativo oficial. */
export const OFFICIAL_URL = "https://www.rentasjujuy.gob.ar";

/**
 * Sistema transaccional (Clave Fiscal y servicios web), que corre en un
 * dominio aparte. Rutas relevadas de resultados de búsqueda (oct. 2026):
 * verificarlas al integrar con el backend.
 */
export const ONLINE_URL = "https://www.rentasjujuyonline.gob.ar/cedulavirtual";

/** Enlaces del portal oficial a los que deriva este front. */
export const LINKS = {
  login: `${ONLINE_URL}/hlogindpr.aspx`,
  serviciosSinClave: `${ONLINE_URL}/serviciosweb.aspx`,
  turnos: `${ONLINE_URL}/WturnosWeb1.aspx`,
  inmobiliarioSinClave: `${ONLINE_URL}/winmscf.aspx`,
  constanciaIIBB: `${ONLINE_URL}/constanciainscripcionib.aspx`,
  consultaExenciones: `${ONLINE_URL}/consultadeexenciones1.aspx`,
  alicuotasRetPer: `${ONLINE_URL}/consultaalicuotasretper.aspx`,
  tasaJusticia: `${ONLINE_URL}/cargatasajusticiascf.aspx`,
  pagar: `${OFFICIAL_URL}/pagar-2/`,
  mediosDePago: `${OFFICIAL_URL}/medios-y-lugares-de-pago-2/`,
  facilidades: `${OFFICIAL_URL}/facilidades-de-pago/`,
  delegaciones: `${OFFICIAL_URL}/delegaciones/`,
  rentasConVos: `${OFFICIAL_URL}/rentas-con-vos/`,
  calendario: `${OFFICIAL_URL}/events/`,
  codigoFiscal: `${OFFICIAL_URL}/codigo-fiscal/`,
  resoluciones: `${OFFICIAL_URL}/resoluciones/`,
  leyes: `${OFFICIAL_URL}/leyes-2/`,
  decretos: `${OFFICIAL_URL}/decretos-2/`,
  tutoriales: `${OFFICIAL_URL}/tutoriales/`,
  formularios: `${OFFICIAL_URL}/formularios/`,
  aplicativos: `${OFFICIAL_URL}/descarga-de-aplicativos/`,
  preguntasFrecuentes: `${OFFICIAL_URL}/preguntas-frecuentes/`,
  /** El Impuesto Automotor es un recurso municipal (Const. de Jujuy, art. 215). */
  automotorCapital: "https://rentasmunijujuy.gob.ar",
} as const;

/** Aviso de "prototipo no oficial" en header y footer (desactivado a pedido). */
export const SHOW_PROTOTYPE_NOTICE = false;

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
      { label: "Ingresos Brutos", to: "/impuestos/ingresos-brutos", icon: "store", descripcion: "Comercios, empresas y profesionales" },
      { label: "Inmobiliario", to: "/impuestos/inmobiliario", icon: "house", descripcion: "Inmuebles urbanos y rurales" },
      { label: "Sellos", to: "/impuestos/sellos", icon: "stamp", descripcion: "Contratos e instrumentos" },
      { label: "Tasas", to: "/impuestos/tasas", icon: "gavel", descripcion: "Tasa de Justicia y retributivas" },
      { label: "Minerales", to: "/impuestos/minerales", icon: "mountain", descripcion: "Derecho de explotación minera" },
    ],
  },
  { label: "Vencimientos", to: "/vencimientos" },
  { label: "Atención", to: "/atencion" },
  { label: "Normativa", to: "/normativa" },
];
