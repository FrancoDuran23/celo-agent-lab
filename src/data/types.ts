import type { IconName } from "../lib/icons";

/**
 * Contrato de datos del sitio. Todo el contenido vive en src/data como
 * objetos planos, para poder reemplazarlo por una API sin tocar la UI.
 */

export type ImpuestoSlug = "inmobiliario" | "automotor" | "ingresos-brutos" | "sellos" | "tasas";

export type Perfil = "personas" | "empresas" | "profesionales" | "agentes";

export type PaletteColor = "terracota" | "ocre" | "rosa" | "salvia" | "violeta" | "night";

export interface Tramite {
  id: string;
  titulo: string;
  descripcion: string;
  /** Impuesto al que pertenece, o "general" si aplica a todos. */
  impuesto: ImpuestoSlug | "general";
  perfiles: Perfil[];
  canal: "online" | "presencial" | "online-y-presencial";
  requiereClave: boolean;
  /** Aparece en los accesos rápidos de la portada. */
  destacado?: boolean;
  /** Destino del trámite (portal oficial o ruta interna). */
  href: string;
  icon: IconName;
  palabrasClave?: string[];
}

export interface Pregunta {
  pregunta: string;
  respuesta: string;
}

export interface Impuesto {
  slug: ImpuestoSlug;
  nombre: string;
  /** Nombre corto para chips y menús. */
  corto: string;
  bajada: string;
  descripcion: string;
  icon: IconName;
  color: PaletteColor;
  quienes: string;
  puntos: string[];
  /** ids de Tramite relacionados. */
  tramites: string[];
  preguntas: Pregunta[];
}

export interface Vencimiento {
  /** ISO YYYY-MM-DD */
  fecha: string;
  impuesto: ImpuestoSlug;
  titulo: string;
  detalle?: string;
}

export interface Noticia {
  slug: string;
  titulo: string;
  /** ISO YYYY-MM-DD */
  fecha: string;
  categoria: string;
  resumen: string;
  href?: string;
}

export interface Norma {
  tipo: "Ley" | "Decreto" | "Resolución General" | "Código";
  numero: string;
  anio: number;
  titulo: string;
  tema: ImpuestoSlug | "general" | "procedimiento";
  href?: string;
}

export type Region = "Valles" | "Quebrada" | "Puna" | "Yungas" | "Ramal";

export interface Oficina {
  nombre: string;
  localidad: string;
  region: Region;
  direccion?: string;
  telefono?: string;
  horario?: string;
  casaCentral?: boolean;
}

export interface Canal {
  id: string;
  nombre: string;
  valor: string;
  href: string;
  descripcion: string;
  horario?: string;
  icon: IconName;
}

export interface NavItem {
  label: string;
  to: string;
  children?: { label: string; to: string; descripcion?: string; icon?: IconName }[];
}
