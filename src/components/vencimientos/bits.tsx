import { Link } from "react-router";
import clsx from "clsx";
import type { ImpuestoSlug } from "../../data/types";
import { parseISODate } from "../../lib/dates";
import { DOT, TINT, impuestoMeta, weekdayShort } from "./utils";

/** Etiqueta del impuesto con su color, enlazada a su página. */
export function ImpuestoTag({ slug, className }: { slug: ImpuestoSlug; className?: string }) {
  const m = impuestoMeta(slug);
  return (
    <Link
      to={`/impuestos/${m.slug}`}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium underline-offset-2 transition-[filter] hover:underline",
        TINT[m.color],
        className,
      )}
    >
      <span aria-hidden="true" className={clsx("size-1.5 rounded-full", DOT[m.color])} />
      <span className="sr-only">Ver información de </span>
      {m.nombre}
    </Link>
  );
}

/** Bloque de fecha: día de la semana + número. */
export function DateBadge({ iso, tone = "neutral" }: { iso: string; tone?: "neutral" | "soon" | "past" }) {
  const d = parseISODate(iso);
  return (
    <span
      aria-hidden="true"
      className={clsx(
        "flex size-14 shrink-0 flex-col items-center justify-center rounded-xl ring-1",
        tone === "soon" && "bg-brand-soft text-brand ring-brand/20",
        tone === "neutral" && "bg-surface-2 text-ink ring-line",
        tone === "past" && "bg-transparent text-ink-3 ring-line",
      )}
    >
      <span className="font-mono text-[0.62rem] font-medium tracking-[0.12em] uppercase">{weekdayShort(d).slice(0, 3)}</span>
      <span className="mt-0.5 text-xl leading-none font-semibold tabular">{d.getDate()}</span>
    </span>
  );
}

/** Chip con la cuenta regresiva ("en 5 días", "hoy"…). */
export function CountdownChip({ text, tone }: { text: string; tone: "soon" | "neutral" | "past" }) {
  return (
    <span
      className={clsx(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone === "soon" && "bg-brand text-brand-ink",
        tone === "neutral" && "bg-surface-2 text-ink-2 ring-1 ring-line ring-inset",
        tone === "past" && "text-ink-3 ring-1 ring-line ring-inset",
      )}
    >
      {text}
    </span>
  );
}
