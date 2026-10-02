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
    color: "terracota",
    quienes:
      "Comercios, empresas, profesionales y prestadores de servicios que desarrollan su actividad en Jujuy, ya sea como contribuyentes locales o de Convenio Multilateral.",
    puntos: [
      "Régimen General para contribuyentes locales, con DDJJ y anticipos mensuales.",
      "Convenio Multilateral para quienes operan en más de una provincia (SIFERE WEB).",
      "Régimen Simplificado para pequeños contribuyentes.",
      "Alícuotas según actividad, fijadas por la Ley Impositiva vigente.",
    ],
    tramites: ["iibb-inscripcion", "iibb-ddjj", "iibb-simplificado", "iibb-convenio", "constancia", "iibb-modificacion", "no-retencion"],
    preguntas: [
      {
        pregunta: "¿Cuándo tengo que inscribirme?",
        respuesta:
          "Antes de iniciar tu actividad. La inscripción se hace en línea con clave fiscal; si operás en varias provincias, se tramita por el sistema de Convenio Multilateral.",
      },
      {
        pregunta: "¿Qué pasa si no tuve ingresos en un mes?",
        respuesta: "Igual tenés que presentar la declaración jurada del período, informando ingresos en cero.",
      },
      {
        pregunta: "¿Dónde consulto la alícuota de mi actividad?",
        respuesta: "Las alícuotas están en la Ley Impositiva vigente, disponible en la sección Normativa.",
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
    color: "ocre",
    quienes: "Titulares de dominio, usufructuarios y poseedores a título de dueño de inmuebles ubicados en Jujuy.",
    puntos: [
      "Se calcula sobre la valuación fiscal del inmueble.",
      "Pago en cuotas o anual anticipado con bonificación.",
      "Beneficios adicionales para contribuyentes cumplidores y pagos digitales.",
      "Exenciones previstas por ley para casos específicos.",
    ],
    tramites: ["inmobiliario-boleta", "inmobiliario-anual", "inmobiliario-valuacion", "libre-deuda", "exenciones"],
    preguntas: [
      {
        pregunta: "¿Qué dato necesito para generar la boleta?",
        respuesta: "El número de padrón del inmueble, que figura en boletas anteriores o en tu escritura.",
      },
      {
        pregunta: "¿Conviene el pago anual?",
        respuesta:
          "Si podés afrontarlo, sí: el pago anual anticipado tiene bonificaciones que se suman a los beneficios por buen cumplimiento y por pago digital.",
      },
      {
        pregunta: "Vendí mi inmueble, ¿qué hago?",
        respuesta: "Asegurate de que la transferencia esté registrada para que el impuesto deje de emitirse a tu nombre.",
      },
    ],
  },
  {
    slug: "automotor",
    nombre: "Impuesto a los Automotores",
    corto: "Automotor",
    bajada: "Para titulares de autos, motos, camionetas y utilitarios radicados en Jujuy.",
    descripcion:
      "Grava a los vehículos radicados en la Provincia según su valuación. En algunos municipios el impuesto se administra y paga a nivel municipal: verificá dónde corresponde según la radicación de tu vehículo.",
    icon: "car",
    color: "rosa",
    quienes: "Titulares registrales de vehículos automotores y motovehículos radicados en la Provincia.",
    puntos: [
      "Se calcula según la valuación del vehículo (modelo y año).",
      "Pago en cuotas o anual con bonificación.",
      "En algunos municipios se paga en el municipio de radicación.",
      "Informá la venta para dejar de ser responsable del impuesto.",
    ],
    tramites: ["automotor-boleta", "automotor-radicacion", "libre-deuda", "plan-pagos"],
    preguntas: [
      {
        pregunta: "¿Dónde pago la patente?",
        respuesta:
          "Depende del municipio de radicación del vehículo. Si tu municipio administra el impuesto, el pago se hace allí; en los demás casos, en Rentas.",
      },
      {
        pregunta: "Vendí mi auto, ¿sigo pagando?",
        respuesta:
          "Hasta que se registre la transferencia o la denuncia de venta, el impuesto se sigue emitiendo a nombre del titular registral.",
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
    color: "salvia",
    quienes: "Las partes que otorgan o firman el instrumento alcanzado, y los agentes de recaudación designados.",
    puntos: [
      "Alcanza contratos de locación, compraventas, mutuos y otros instrumentos.",
      "Liquidación web con cálculo automático del impuesto.",
      "Escribanos y entidades actúan como agentes de recaudación.",
      "Alícuotas y montos fijos según la Ley Impositiva.",
    ],
    tramites: ["sellos-liquidacion", "plan-pagos", "agentes-ddjj"],
    preguntas: [
      {
        pregunta: "¿Mi contrato de alquiler paga Sellos?",
        respuesta: "Los contratos de locación están alcanzados. Podés calcular el monto exacto con la liquidación web.",
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
    color: "violeta",
    quienes: "Quienes inician actuaciones judiciales o solicitan servicios administrativos alcanzados.",
    puntos: [
      "Liquidación en línea de la Tasa de Justicia.",
      "Montos según el tipo de actuación y la Ley Impositiva.",
      "Guía de liquidación disponible para profesionales.",
    ],
    tramites: ["tasa-justicia", "boleta"],
    preguntas: [
      {
        pregunta: "¿Quién liquida la Tasa de Justicia?",
        respuesta: "Generalmente el profesional que inicia la actuación, en nombre de su cliente.",
      },
    ],
  },
];

export function getImpuesto(slug: string | undefined): Impuesto | undefined {
  return IMPUESTOS.find((i) => i.slug === (slug as ImpuestoSlug));
}
