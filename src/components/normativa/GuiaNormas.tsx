import { ArrowUpRight } from "lucide-react";
import { LINKS } from "../../data/site";
import { SmartLink } from "../ui/primitives";

const TIPOS_EXPLICADOS: { nombre: string; texto: string }[] = [
  {
    nombre: "Código Fiscal",
    texto:
      "Es la ley base del sistema tributario provincial: define los impuestos, las obligaciones de los contribuyentes y los procedimientos, plazos y sanciones.",
  },
  {
    nombre: "Ley Impositiva",
    texto: "Se sanciona cada año y fija las alícuotas, los montos fijos y los mínimos con los que se calcula cada impuesto.",
  },
  {
    nombre: "Resoluciones Generales",
    texto:
      "Las dicta la Dirección Provincial de Rentas para reglamentar y aplicar esas normas: calendarios de vencimientos, regímenes y servicios en línea.",
  },
];

const FUENTES = [
  { label: "Código Fiscal", href: LINKS.codigoFiscal },
  { label: "Resoluciones generales", href: LINKS.resoluciones },
  { label: "Leyes", href: LINKS.leyes },
  { label: "Decretos", href: LINKS.decretos },
];

/** Glosario breve de tipos de norma + enlaces a los repositorios oficiales. */
export function GuiaNormas({ id }: { id: string }) {
  return (
    <div className="rounded-xl bg-surface-2 p-6 sm:p-7">
      <h2 id={id} className="text-xl font-bold text-ink">
        ¿Qué es cada norma?
      </h2>
      <dl className="mt-4">
        {TIPOS_EXPLICADOS.map((t) => (
          <div key={t.nombre} className="border-t border-line py-3.5 first:border-t-0 first:pt-0">
            <dt className="font-semibold text-ink">{t.nombre}</dt>
            <dd className="mt-1 text-[0.95rem] text-ink-2">{t.texto}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-2 border-t border-line pt-5">
        <h3 id={`${id}-fuentes`} className="font-semibold text-ink">
          Repositorios oficiales
        </h3>
        <ul aria-labelledby={`${id}-fuentes`} className="mt-2 grid gap-2">
          {FUENTES.map((f) => (
            <li key={f.href}>
              <SmartLink to={f.href} className="link">
                {f.label}
                <ArrowUpRight className="ml-1 inline size-4 align-[-2px]" aria-hidden="true" />
              </SmartLink>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-ink-3">
          Esta página es una guía orientativa. El texto con validez legal es el publicado oficialmente.
        </p>
      </div>
    </div>
  );
}
