import type { Norma } from "./types";
import { LINKS } from "./site";

/**
 * Normas de referencia relevadas (oct. 2026). Confirmadas con dos fuentes:
 * Código Fiscal (Ley 5.791 T.O. 2022), Ley Impositiva 2026 (Ley 6.492),
 * RG 1732/2025, RG 1759/2026 y RG 1764/2026. El resto surge de los títulos
 * de las publicaciones oficiales de la DPR.
 */
export const NORMATIVA: Norma[] = [
  { tipo: "Código", numero: "5.791", anio: 2013, titulo: "Código Fiscal de la Provincia de Jujuy (T.O. 2022 y modificatorias)", tema: "general", href: LINKS.codigoFiscal },
  { tipo: "Ley", numero: "6.492", anio: 2025, titulo: "Ley Impositiva 2026: alícuotas, montos y mínimos de los tributos provinciales", tema: "general", href: LINKS.leyes },
  { tipo: "Ley", numero: "6.491", anio: 2025, titulo: "Estímulos fiscales para el fortalecimiento de la economía (industria manufacturera)", tema: "ingresos-brutos", href: LINKS.leyes },
  { tipo: "Ley", numero: "6.512", anio: 2026, titulo: "Régimen transitorio de asistencia fiscal al comercio", tema: "ingresos-brutos", href: LINKS.leyes },
  { tipo: "Decreto", numero: "5193-HF", anio: 2026, titulo: "Régimen especial de regularización de deudas tributarias", tema: "procedimiento", href: LINKS.decretos },
  { tipo: "Resolución General", numero: "1767", anio: 2026, titulo: "Régimen permanente de facilidades de pago", tema: "procedimiento", href: LINKS.resoluciones },
  { tipo: "Resolución General", numero: "1764", anio: 2026, titulo: "Considera en término el anticipo junio 2026 de Ingresos Brutos (Régimen General Local)", tema: "ingresos-brutos", href: LINKS.resoluciones },
  { tipo: "Resolución General", numero: "1760", anio: 2026, titulo: "Reglamenta el régimen de asistencia fiscal al comercio (Ley 6.512)", tema: "ingresos-brutos", href: LINKS.resoluciones },
  { tipo: "Resolución General", numero: "1759", anio: 2026, titulo: "Prórroga del régimen especial de regularización de deudas", tema: "procedimiento", href: LINKS.resoluciones },
  { tipo: "Resolución General", numero: "1753", anio: 2026, titulo: "Reglamenta el régimen especial de regularización de deudas tributarias", tema: "procedimiento", href: LINKS.resoluciones },
  { tipo: "Resolución General", numero: "1746", anio: 2026, titulo: "Servicio web de adhesión al débito automático del Impuesto Inmobiliario", tema: "inmobiliario", href: LINKS.resoluciones },
  { tipo: "Resolución General", numero: "1745", anio: 2026, titulo: "Nomenclador de Actividades 2026 de Ingresos Brutos", tema: "ingresos-brutos", href: LINKS.resoluciones },
  { tipo: "Resolución General", numero: "1734", anio: 2025, titulo: "Bonificaciones del Impuesto Inmobiliario (buen cumplimiento, pago anual y pago digital)", tema: "inmobiliario", href: LINKS.resoluciones },
  { tipo: "Resolución General", numero: "1733", anio: 2025, titulo: "Régimen Simplificado de Ingresos Brutos (Monotributo Unificado)", tema: "ingresos-brutos", href: LINKS.resoluciones },
  { tipo: "Resolución General", numero: "1732", anio: 2025, titulo: "Calendario Impositivo 2026", tema: "general", href: LINKS.resoluciones },
  { tipo: "Resolución General", numero: "1694", anio: 2025, titulo: "Percepción del Impuesto de Sellos en Registros del Automotor", tema: "sellos", href: LINKS.resoluciones },
  { tipo: "Resolución General", numero: "1641", anio: 2023, titulo: "Declaración jurada digital del Derecho de Explotación de Minerales", tema: "minerales", href: LINKS.resoluciones },
  { tipo: "Resolución General", numero: "1616", anio: 2022, titulo: "Modifica los trámites de tramitación exclusiva por la web", tema: "procedimiento", href: LINKS.resoluciones },
  { tipo: "Resolución General", numero: "1598", anio: 2021, titulo: "Servicios de tramitación exclusiva por la web", tema: "procedimiento", href: LINKS.resoluciones },
  { tipo: "Resolución General", numero: "1581", anio: 2020, titulo: "Clave Fiscal: solicitud y blanqueo por la web", tema: "procedimiento", href: LINKS.resoluciones },
  { tipo: "Resolución General", numero: "1501", anio: 2018, titulo: "Domicilio Fiscal Electrónico", tema: "procedimiento", href: LINKS.resoluciones },
  { tipo: "Resolución General", numero: "1475", anio: 2017, titulo: "Guía de liquidación y pago de la Tasa de Justicia", tema: "tasas", href: LINKS.resoluciones },
  { tipo: "Resolución General", numero: "1431", anio: 2016, titulo: "Servicio web Mis Retenciones", tema: "ingresos-brutos", href: LINKS.resoluciones },
];
