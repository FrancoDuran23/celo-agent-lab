import type { IconName } from "../lib/icons";
import type { Pregunta } from "./types";
import { LINKS } from "./site";

/** Glosario básico: definiciones generales, sin cifras ni plazos. */
export const GLOSARIO: { termino: string; definicion: string }[] = [
  {
    termino: "CUIT / CUIL",
    definicion: "Clave única de identificación que asigna ARCA. En Rentas es tu usuario para operar con Clave Fiscal.",
  },
  {
    termino: "Clave Fiscal",
    definicion: "Usuario (tu CUIT) y contraseña que emite Rentas para hacer trámites en línea a tu nombre.",
  },
  {
    termino: "Domicilio Fiscal Electrónico",
    definicion: "Domicilio digital donde recibís las notificaciones oficiales de Rentas. Tiene la misma validez que el domicilio físico.",
  },
  {
    termino: "Padrón",
    definicion: "Número que identifica a un inmueble ante Rentas. Lo necesitás para consultar o pagar el Impuesto Inmobiliario.",
  },
  {
    termino: "Anticipo",
    definicion: "Pago a cuenta del impuesto anual que se hace en cuotas a lo largo del año.",
  },
  {
    termino: "Declaración jurada (DDJJ)",
    definicion: "Presentación en la que informás tu actividad y tus ingresos para calcular el impuesto. Lo declarado tiene carácter de declaración jurada.",
  },
  {
    termino: "Convenio Multilateral",
    definicion: "Régimen de Ingresos Brutos para quienes desarrollan actividades en más de una provincia: la base imponible se distribuye entre ellas.",
  },
  {
    termino: "Monotributo Unificado",
    definicion: "Integra el Monotributo nacional con el Régimen Simplificado de Ingresos Brutos de la Provincia en un único pago mensual.",
  },
  {
    termino: "Agente de recaudación",
    definicion: "Empresa u organismo designado para retener o percibir el impuesto de terceros e ingresarlo a la Provincia.",
  },
  {
    termino: "Certificado de Pago (libre deuda)",
    definicion: "Documento que acredita que un inmueble no registra deuda del Impuesto Inmobiliario. Suele pedirse en compraventas.",
  },
];

/** Primeros pasos para operar en línea. */
export const PRIMEROS_PASOS: { titulo: string; descripcion: string; href: string; cta: string; icon: IconName }[] = [
  {
    titulo: "Obtené tu Clave Fiscal",
    descripcion: "Pedila por la web o en una oficina. Con ella hacés la mayoría de los trámites sin moverte.",
    href: "/tramites?q=clave",
    cta: "Cómo obtenerla",
    icon: "key",
  },
  {
    titulo: "Adherí al Domicilio Fiscal Electrónico",
    descripcion: "Es obligatorio para Ingresos Brutos y agentes, y te avisa de todo lo importante.",
    href: "/tramites?q=domicilio",
    cta: "Ver el trámite",
    icon: "mail",
  },
  {
    titulo: "Consultá, pagá y descargá",
    descripcion: "Estado de cuenta, boletas, planes de pago y constancias, cuando quieras.",
    href: "/tramites",
    cta: "Ir a Trámites",
    icon: "receipt",
  },
];

export const PREGUNTAS_GENERALES: Pregunta[] = [
  {
    pregunta: "¿Qué puedo hacer sin Clave Fiscal?",
    respuesta:
      "Consultar y pagar el Impuesto Inmobiliario con el padrón o el CUIT, descargar la constancia de inscripción de Ingresos Brutos, liquidar la Tasa de Justicia y consultar exenciones y alícuotas de retención.",
  },
  {
    pregunta: "¿Cómo puedo pagar?",
    respuesta:
      "En línea con tarjeta de débito o crédito, DEBIN, Mercado Pago, Pago Mis Cuentas o Interbanking; o con la boleta impresa en Pago Fácil, Rapipago o Banco Macro.",
  },
  {
    pregunta: "No puedo ingresar con mi Clave Fiscal, ¿qué hago?",
    respuesta:
      "Podés blanquear (restablecer) la clave desde la web. Si no lo lográs, comunicate con el Centro de Atención Omnicanal por teléfono, WhatsApp o chat.",
  },
  {
    pregunta: "¿Necesito turno para ir a una oficina?",
    respuesta: "Sí. La atención presencial es con turno previo, que sacás en Turnos web eligiendo día y horario.",
  },
  {
    pregunta: "¿Dónde pago la patente del auto?",
    respuesta:
      "El Impuesto Automotor es municipal: se paga en el municipio donde está radicado el vehículo. En San Salvador de Jujuy lo cobra la Dirección de Rentas de la Municipalidad.",
  },
];

/** Recursos del sitio oficial. */
export const RECURSOS: { titulo: string; descripcion: string; href: string; icon: IconName }[] = [
  { titulo: "Tutoriales", descripcion: "Videos, manuales y folletos paso a paso.", href: LINKS.tutoriales, icon: "book" },
  { titulo: "Formularios", descripcion: "Inscripciones, devoluciones, compensaciones y poderes.", href: LINKS.formularios, icon: "file" },
  { titulo: "Aplicativos", descripcion: "Descargas y actualizaciones de aplicativos.", href: LINKS.aplicativos, icon: "download" },
  { titulo: "Preguntas frecuentes", descripcion: "Respuestas por impuesto en el sitio oficial.", href: LINKS.preguntasFrecuentes, icon: "info" },
  { titulo: "Medios y lugares de pago", descripcion: "Dónde y cómo pagar cada impuesto.", href: LINKS.mediosDePago, icon: "wallet" },
  { titulo: "Calendario oficial", descripcion: "Todos los vencimientos del año.", href: LINKS.calendario, icon: "calendar" },
];
