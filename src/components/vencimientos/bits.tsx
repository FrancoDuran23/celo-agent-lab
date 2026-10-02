import { Link } from "react-router";
import clsx from "clsx";
import type { ImpuestoSlug } from "../../data/types";
import { parseISODate } from "../../lib/dates";
import { Badge } from "../ui/primitives";
import { MARKS, impuestoMeta, weekdayShort } from "./utils";

/**
 * Marca del impuesto (punto lleno o hueco, azul o tinta). Con `inherit`
 * toma el color del texto que la rodea (día elegido, chip activo).
 */
export function Mark({
  slug,
  inherit = false,
  className,
}: {
  slug: ImpuestoSlug;
  inherit?: boolean;
  className?: string;
}) {
  const m = MARKS[impuestoMeta(slug).mark] ?? MARKS[0]!;
  return <span aria-hidden="true" className={clsx("inline-block size-2 shrink-0", m.shape, !inherit && m.tone, className)} />;
}

/** Etiqueta de texto del impuesto, con su marca, enlazada a su página. */
export function ImpuestoTag({ slug, className }: { slug: ImpuestoSlug; className?: string }) {
  const m = impuestoMeta(slug);
  return (
    <span className={clsx("inline-flex items-center gap-1.5 text-sm", className)}>
      <Mark slug={slug} />
      <Link to={`/impuestos/${m.slug}`} className="link">
        <span className="sr-only">Ver información de </span>
        {m.nombre}
      </Link>
    </span>
  );
}

/** Fecha compacta para listas: número del día y día de la semana. */
export function DateBadge({ iso, tone = "neutral" }: { iso: string; tone?: "neutral" | "soon" | "past" }) {
  const d = parseISODate(iso);
  return (
    <span aria-hidden="true" className="w-12 shrink-0 pt-0.5 text-center leading-none">
      <span className={clsx("block text-2xl font-bold tabular", tone === "past" ? "text-ink-3" : "text-ink")}>
        {d.getDate()}
      </span>
      <span className="mt-1 block text-xs font-semibold text-ink-3 uppercase">{weekdayShort(d).slice(0, 3)}</span>
    </span>
  );
}

/** Cuenta regresiva ("En 5 días", "Hoy", "Ya venció"). */
export function CountdownChip({ text, tone }: { text: string; tone: "soon" | "neutral" | "past" }) {
  return (
    <Badge tone={tone === "soon" ? "warn" : "neutral"} className="shrink-0 tabular">
      {text}
    </Badge>
  );
}
