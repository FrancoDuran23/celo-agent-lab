import { ArrowUpRight, Percent, Scale, type LucideIcon } from "lucide-react";
import clsx from "clsx";
import type { Norma, PaletteColor } from "../../data/types";
import { NewTabHint, TemaBadge } from "./bits";
import { normaLabel, numeroLabel, splitTitulo, STRATA, TINT, tipoInfo } from "./utils";

interface Clave {
  norma: Norma;
  icon: LucideIcon;
  color: PaletteColor;
  /** Para qué sirve consultarla (genérico). */
  uso: string;
}

/**
 * Las dos normas que más se consultan, como "documentos" con esquina
 * plegada y lomo de estratos.
 */
export function NormasClave({ codigo, impositiva }: { codigo?: Norma; impositiva?: Norma }) {
  const items: Clave[] = [];
  if (codigo)
    items.push({
      norma: codigo,
      icon: Scale,
      color: tipoInfo(codigo.tipo).color,
      uso: "Consultalo para saber cómo funciona cada impuesto provincial, qué obligaciones tenés y cuáles son los plazos y procedimientos.",
    });
  if (impositiva)
    items.push({
      norma: impositiva,
      icon: Percent,
      color: tipoInfo(impositiva.tipo).color,
      uso: "Consultala para conocer las alícuotas por actividad y los montos fijos y mínimos de cada impuesto para el año.",
    });
  if (!items.length) return null;

  return (
    <ul className={clsx("grid gap-5 sm:gap-6", items.length > 1 && "md:grid-cols-2")}>
      {items.map((c, i) => (
        <li key={c.norma.tipo + c.norma.numero} className="animate-rise" style={{ animationDelay: `${120 + i * 90}ms` }}>
          <DocCard {...c} />
        </li>
      ))}
    </ul>
  );
}

const FOLD = "2.75rem";
const CLIP = `polygon(0 0, calc(100% - ${FOLD}) 0, 100% ${FOLD}, 100% 100%, 0 100%)`;

function DocCard({ norma, icon: I, color, uso }: Clave) {
  const [head, sub] = splitTitulo(norma.titulo);
  const id = `clave-${norma.numero.replace(/\W/g, "")}`;

  return (
    <article
      aria-labelledby={id}
      className="group h-full drop-shadow-[0_14px_22px_rgb(var(--shadow-color)/0.10)] transition-[translate,filter] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:drop-shadow-[0_22px_32px_rgb(var(--shadow-color)/0.18)]"
    >
      <div
        className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-surface ring-1 ring-line ring-inset has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-focus"
        style={{ clipPath: CLIP }}
      >
        {/* Lomo */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-2"
          style={{ backgroundImage: `linear-gradient(180deg, ${STRATA[color]})` }}
        />
        {/* Esquina plegada */}
        <span
          aria-hidden="true"
          className="absolute top-0 right-0 rounded-bl-xl bg-[linear-gradient(225deg,var(--surface-2)_40%,var(--line-strong))]"
          style={{ width: FOLD, height: FOLD, clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}
        />

        <div className="flex flex-1 flex-col p-6 pl-8 sm:p-8 sm:pl-11">
          <div className="flex items-center gap-3.5 pr-10">
            <span className={clsx("inline-flex size-12 shrink-0 items-center justify-center rounded-2xl", TINT[color])}>
              <I className="size-6" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="eyebrow">{norma.tipo}</p>
              <p className="mt-0.5 font-mono text-sm text-ink-2 tabular">{numeroLabel(norma)}</p>
            </div>
          </div>

          <h3 id={id} className="mt-7 text-[1.65rem] leading-[1.15] font-semibold tracking-tight text-ink sm:text-3xl">
            {head}
            {sub ? (
              <span className="mt-1.5 block font-serif text-[1.35rem] leading-snug font-normal tracking-normal text-ink-2 italic sm:text-2xl">
                {sub}
              </span>
            ) : null}
          </h3>

          <p className="mt-4 max-w-prose leading-relaxed text-ink-3">{uso}</p>

          {/* Renglones decorativos de "documento" */}
          <div aria-hidden="true" className="mt-6 grid max-w-sm gap-2 opacity-70">
            <span className="h-1.5 w-full rounded-full bg-surface-3" />
            <span className="h-1.5 w-11/12 rounded-full bg-surface-3" />
            <span className="h-1.5 w-2/3 rounded-full bg-surface-3" />
          </div>

          <div className="mt-auto pt-7">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-dashed border-line-strong pt-5">
              <TemaBadge tema={norma.tema} />
              {norma.href ? (
                <a
                  href={norma.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand outline-none after:absolute after:inset-0 after:content-['']"
                >
                  Ver en el sitio oficial
                  <span className="sr-only">: {normaLabel(norma)}</span>
                  <NewTabHint />
                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
