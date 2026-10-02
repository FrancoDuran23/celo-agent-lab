import type { Noticia } from "./types";
import { OFFICIAL_URL } from "./site";

/**
 * Novedades 2026 relevadas de partes de prensa de la DPR, resoluciones
 * generales y prensa local (oct. 2026). Los resúmenes evitan cifras que
 * no se pudieron confirmar con una segunda fuente.
 */
export const NOTICIAS: Noticia[] = [
  {
    slug: "regimen-permanente-facilidades-2026",
    titulo: "Nuevo régimen permanente de facilidades de pago",
    fecha: "2026-09-18",
    categoria: "Planes de pago",
    resumen:
      "La RG N.º 1767/2026 crea un régimen permanente para regularizar en cuotas deudas de Ingresos Brutos, Inmobiliario, Sellos, tasas y multas. Reemplaza a la RG N.º 1508/2018.",
    href: `${OFFICIAL_URL}/regimen-permanente-de-facilidades-de-pago/`,
  },
  {
    slug: "prorroga-anticipo-junio-iibb",
    titulo: "Prórroga del anticipo de junio de Ingresos Brutos",
    fecha: "2026-07-29",
    categoria: "Vencimientos",
    resumen:
      "Por cuestiones operativas, se consideraron en término hasta el 29 de julio las DDJJ y pagos del anticipo junio 2026 del Régimen General Local (RG N.º 1764/2026).",
  },
  {
    slug: "medidas-fiscales-comercio",
    titulo: "Paquete de medidas fiscales y asistencia al comercio",
    fecha: "2026-07-22",
    categoria: "Beneficios",
    resumen:
      "Se anunció un régimen transitorio de asistencia al comercio (Ley N.º 6.512, reglamentada por la RG N.º 1760/2026) con beneficios en Ingresos Brutos, Inmobiliario y Sellos, que se tramitan por la web.",
  },
  {
    slug: "prorroga-regimen-especial",
    titulo: "Se prorrogó el régimen especial de regularización de deudas",
    fecha: "2026-07-20",
    categoria: "Planes de pago",
    resumen:
      "La adhesión al Régimen Especial de Regularización de Deudas Tributarias se extendió hasta el 31 de julio y se amplió a obligaciones vencidas hasta el 30 de junio de 2026.",
  },
  {
    slug: "plan-especial-regularizacion-2026",
    titulo: "Plan especial de regularización de deudas con reducción de intereses",
    fecha: "2026-04-21",
    categoria: "Planes de pago",
    resumen:
      "Rentas lanzó un régimen especial (Decreto N.º 5193-HF/2026 y RG N.º 1753/2026) para regularizar deudas de Ingresos Brutos, Inmobiliario, Sellos, tasas y multas con reducción de intereses y multas.",
    href: `${OFFICIAL_URL}/plan-especial-de-regularizacion-de-deudas-2026/`,
  },
  {
    slug: "prorroga-inmobiliario-anual",
    titulo: "Prórroga de los descuentos del Inmobiliario Anual 2026",
    fecha: "2026-03-02",
    categoria: "Inmobiliario",
    resumen:
      "Se extendió hasta el 15 de marzo el plazo para pagar el Inmobiliario 2026 en un pago anual anticipado con bonificaciones; vencía el 27 de febrero.",
  },
  {
    slug: "rentas-con-vos-2026",
    titulo: "Rentas con Vos recorre barrios y localidades",
    fecha: "2026-01-29",
    categoria: "Atención",
    resumen:
      "Comenzaron las jornadas de atención en barrios de la capital y localidades sin delegación permanente, con asesoramiento, ayuda con trámites y capacitación en medios de pago electrónicos.",
    href: `${OFFICIAL_URL}/rentas-con-vos/`,
  },
  {
    slug: "inmobiliario-anual-2026",
    titulo: "Inmobiliario Anual 2026: descuentos de hasta el 30%",
    fecha: "2026-01-08",
    categoria: "Inmobiliario",
    resumen:
      "Se habilitó el pago anual anticipado del Inmobiliario 2026, con bonificaciones por buen cumplimiento, por pago anual y por pago con medios digitales.",
    href: `${OFFICIAL_URL}/pago-anual-anticipado-2026-impuesto-inmobiliario/`,
  },
];
