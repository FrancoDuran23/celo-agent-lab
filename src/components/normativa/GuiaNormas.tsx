import { ArrowUpRight, Info } from "lucide-react";
import clsx from "clsx";
import { LINKS } from "../../data/site";
import type { PaletteColor } from "../../data/types";
import { NewTabHint } from "./bits";
import { DOT } from "./utils";

const TIPOS_EXPLICADOS: { nombre: string; color: PaletteColor; texto: string }[] = [
  {
    nombre: "Código Fiscal",
    color: "terracota",
    texto:
      "Es la ley base del sistema tributario provincial: define los impuestos, las obligaciones de los contribuyentes y los procedimientos, plazos y sanciones.",
  },
  {
    nombre: "Ley Impositiva",
    color: "ocre",
    texto: "Se sanciona cada año y fija las alícuotas, los montos fijos y los mínimos con los que se calcula cada impuesto.",
  },
  {
    nombre: "Resoluciones Generales",
    color: "night",
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
    <div className="overflow-hidden rounded-3xl bg-surface ring-1 ring-line">
      <div className="aguayo-strip" aria-hidden="true" />
      <div className="p-6 sm:p-7">
        <p className="eyebrow mb-2">Para entender</p>
        <h2 id={id} className="text-2xl font-semibold tracking-tight text-ink">
          ¿Qué es{" "}
          <span className="font-serif font-normal tracking-normal text-brand italic">cada norma?</span>
        </h2>
        <dl className="mt-5 grid gap-4">
          {TIPOS_EXPLICADOS.map((t) => (
            <div key={t.nombre} className="relative pl-4">
              <span
                aria-hidden="true"
                className={clsx("absolute top-1 bottom-1 left-0 w-[3px] rounded-full", DOT[t.color])}
              />
              <dt className="text-[0.95rem] font-semibold text-ink">{t.nombre}</dt>
              <dd className="mt-0.5 text-sm leading-relaxed text-ink-3">{t.texto}</dd>
            </div>
          ))}
        </dl>
      </div>

      <nav aria-labelledby={`${id}-fuentes`} className="border-t border-line bg-surface-2/60 p-6 sm:p-7">
        <h3 id={`${id}-fuentes`} className="eyebrow">
          Repositorios oficiales
        </h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {FUENTES.map((f) => (
            <li key={f.href}>
              <a
                href={f.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex h-9 items-center gap-1.5 rounded-full bg-surface pr-3 pl-3.5 text-sm font-medium whitespace-nowrap text-ink ring-1 ring-line transition-colors hover:text-brand hover:ring-line-strong"
              >
                {f.label}
                <NewTabHint />
                <ArrowUpRight
                  className="size-4 shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
                  aria-hidden="true"
                />
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex gap-2 text-xs leading-relaxed text-ink-3">
          <Info className="mt-px size-3.5 shrink-0" aria-hidden="true" />
          <span>Esta página es una guía orientativa. El texto con validez legal es el publicado oficialmente.</span>
        </p>
      </nav>
    </div>
  );
}
