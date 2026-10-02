import type { Impuesto, ImpuestoSlug } from "./types";

export const IMPUESTOS: Impuesto[] = [
  {
    slug: "ingresos-brutos",
    nombre: "Ingresos Brutos",
    corto: "Ingresos Brutos",
    bajada: "Para quienes ejercen una actividad comercial, industrial, profesional o de servicios en Jujuy.",
    descripcion:
      "Grava el ejercicio habitual de actividades con fines de lucro en la Provincia. Se liquida sobre los ingresos brutos devengados y se paga mediante anticipos mensuales con declaración jurada.",
    icon: "store",
    quienes:
      "Comercios, empresas, profesionales y prestadores de servicios que desarrollan su actividad en Jujuy, ya sea como contribuyentes locales o de Convenio Multilateral.",
    puntos: [
      "Régimen Local: DDJJ y pago de anticipos mensuales con clave fiscal.",
      "Convenio Multilateral para quienes operan en más de una provincia (SIFERE WEB).",
      "Régimen Simplificado: se paga junto con el Monotributo nacional (Monotributo Unificado).",
      "Alícuotas según actividad, fijadas por la Ley Impositiva 2026 (Ley 6.492).",
    ],
    tramites: ["iibb-inscripcion", "iibb-ddjj", "iibb-simplificado", "iibb-convenio", "constancia", "no-retencion", "mis-retenciones", "traslado-mercaderias"],
    preguntas: [
      {
        pregunta: "¿Cuándo tengo que inscribirme?",
        respuesta:
          "Antes de iniciar tu actividad. La inscripción se hace en línea con clave fiscal; si operás en varias provincias, corresponde el régimen de Convenio Multilateral.",
      },
      {
        pregunta: "¿Qué pasa si no tuve ingresos en un mes?",
        respuesta: "Igual tenés que presentar la declaración jurada del período, informando ingresos en cero.",
      },
      {
        pregunta: "¿Dónde consulto la alícuota de mi actividad?",
        respuesta:
          "Las alícuotas están en la Ley Impositiva vigente (sección Normativa). Las actividades se codifican según el Nomenclador de Actividades de la Provincia.",
      },
      {
        pregunta: "Soy monotributista, ¿tengo que presentar DDJJ?",
        respuesta:
          "Si estás en el Monotributo Unificado, pagás un monto fijo según tu categoría junto con el Monotributo nacional y no presentás declaraciones juradas mensuales.",
      },
    ],
  },
  {
    slug: "inmobiliario",
    nombre: "Impuesto Inmobiliario",
    corto: "Inmobiliario",
    bajada: "Para propietarios y poseedores de inmuebles urbanos y rurales de la Provincia.",
    descripcion:
      "Se aplica sobre los inmuebles ubicados en la Provincia y se calcula a partir de su valuación fiscal. Podés pagarlo en cuotas o en un único pago anual anticipado con bonificaciones.",
    icon: "house",
    quienes: "Titulares de dominio, usufructuarios y poseedores a título de dueño de inmuebles ubicados en Jujuy.",
    puntos: [
      "Se calcula sobre la valuación fiscal del inmueble.",
      "Pago en anticipos mensuales o en un pago anual anticipado.",
      "Bonificaciones por buen cumplimiento, pago anual anticipado y pago digital.",
      "Débito automático y exenciones para jubilados y otros casos previstos.",
    ],
    tramites: ["inmobiliario-pagar", "certificado-pago", "inmobiliario-debito", "inmobiliario-exencion", "consulta-exenciones", "plan-pagos"],
    preguntas: [
      {
        pregunta: "¿Qué dato necesito para generar la boleta?",
        respuesta:
          "El número de padrón del inmueble (figura en boletas anteriores) o el CUIT del titular. No necesitás clave fiscal para consultar y pagar.",
      },
      {
        pregunta: "¿Conviene el pago anual?",
        respuesta:
          "Si podés afrontarlo, sí: en 2026 el pago anual anticipado sumó hasta un 30% de descuento (buen cumplimiento + pago anual + pago digital). Las condiciones se fijan cada año.",
      },
      {
        pregunta: "Soy jubilado, ¿tengo algún beneficio?",
        respuesta:
          "Jubilados y pensionados pueden solicitar la exención del impuesto por la web, si cumplen los requisitos previstos por la normativa.",
      },
    ],
  },
  {
    slug: "sellos",
    nombre: "Impuesto de Sellos",
    corto: "Sellos",
    bajada: "Para contratos, escrituras e instrumentos con efectos en la Provincia.",
    descripcion:
      "Grava los actos, contratos y operaciones de carácter oneroso formalizados en instrumentos públicos o privados en Jujuy, o que produzcan efectos en ella. Se liquida y paga en línea.",
    icon: "stamp",
    quienes: "Las partes que otorgan o firman el instrumento alcanzado, y los agentes de recaudación designados.",
    puntos: [
      "Alcanza locaciones, boletos de compraventa, pagarés, poderes, préstamos y otros instrumentos.",
      "Liquidación y pago 100% web con clave fiscal.",
      "Los Registros del Automotor perciben Sellos en operaciones con vehículos.",
      "Alícuotas, exenciones y montos fijos según la Ley Impositiva.",
    ],
    tramites: ["sellos-liquidacion", "plan-pagos", "agentes-ddjj"],
    preguntas: [
      {
        pregunta: "¿Mi contrato de alquiler paga Sellos?",
        respuesta:
          "Depende del tipo de contrato y de la normativa vigente: en 2026 se anunciaron exenciones para alquileres de vivienda y reducciones para comerciales. Verificalo en la liquidación web antes de pagar.",
      },
      {
        pregunta: "¿Cuánto tiempo tengo para pagar?",
        respuesta: "El plazo corre desde la firma del instrumento; consultá los plazos vigentes en la normativa.",
      },
    ],
  },
  {
    slug: "tasas",
    nombre: "Tasa de Justicia y tasas retributivas",
    corto: "Tasas",
    bajada: "Para actuaciones judiciales y servicios administrativos de la Provincia.",
    descripcion:
      "Las tasas retribuyen servicios que presta el Estado provincial. La Tasa de Justicia se paga al iniciar actuaciones ante el Poder Judicial y se liquida en línea.",
    icon: "gavel",
    quienes: "Quienes inician actuaciones judiciales o solicitan servicios administrativos alcanzados.",
    puntos: [
      "Liquidación en línea de la Tasa de Justicia, inicial y final, sin clave fiscal.",
      "Tasa retributiva para publicaciones en el Boletín Oficial.",
      "Montos según el tipo de actuación y la Ley Impositiva.",
    ],
    tramites: ["tasa-justicia", "tasa-boletin", "plan-pagos"],
    preguntas: [
      {
        pregunta: "¿Quién liquida la Tasa de Justicia?",
        respuesta: "Generalmente el profesional que inicia la actuación, en nombre de su cliente.",
      },
      {
        pregunta: "¿Qué hago con el comprobante?",
        respuesta: "El comprobante de pago se presenta en el expediente judicial junto con la primera presentación.",
      },
    ],
  },
  {
    slug: "minerales",
    nombre: "Derecho de Explotación de Minerales",
    corto: "Minerales",
    bajada: "Para productores mineros que explotan yacimientos en la Provincia.",
    descripcion:
      "Previsto en el Código Fiscal, alcanza la explotación de minerales en Jujuy. Los productores presentan su declaración jurada digital y pagan ante la Dirección Provincial de Rentas.",
    icon: "mountain",
    quienes: "Productores y empresas que explotan yacimientos minerales ubicados en la Provincia.",
    puntos: [
      "Declaración jurada digital con clave fiscal.",
      "Regulado por el Código Fiscal de la Provincia.",
      "Regímenes especiales de regularización cuando la normativa los habilita.",
    ],
    tramites: ["minerales-ddjj", "plan-pagos", "regularizacion-fiscal"],
    preguntas: [
      {
        pregunta: "¿Cómo presento la declaración jurada?",
        respuesta: "Ingresando con clave fiscal al portal de Rentas, en la sección de Derecho de Explotación de Minerales.",
      },
    ],
  },
];

export function getImpuesto(slug: string | undefined): Impuesto | undefined {
  return IMPUESTOS.find((i) => i.slug === (slug as ImpuestoSlug));
}
