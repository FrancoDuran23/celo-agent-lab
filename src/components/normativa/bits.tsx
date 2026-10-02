import { Fragment, type ReactNode } from "react";
import clsx from "clsx";
import type { Norma } from "../../data/types";
import { Icon } from "../../lib/icons";
import { DOT, matchRanges, temaInfo, tipoInfo, TINT } from "./utils";

/** Etiqueta de tipo de norma, con el tinte de su color. */
export function TipoBadge({ tipo, className }: { tipo: Norma["tipo"]; className?: string }) {
  const info = tipoInfo(tipo);
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        TINT[info.color],
        className,
      )}
    >
      <span className={clsx("size-1.5 rounded-full", DOT[info.color])} aria-hidden="true" />
      {info.label}
    </span>
  );
}

/** Etiqueta de tema (impuesto, general o procedimiento). */
export function TemaBadge({ tema, className }: { tema: Norma["tema"]; className?: string }) {
  const info = temaInfo(tema);
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-medium whitespace-nowrap text-ink-2 ring-1 ring-line ring-inset",
        className,
      )}
    >
      <Icon name={info.icon} className="size-3.5 text-ink-3" />
      {info.label}
    </span>
  );
}

/** Resalta las coincidencias de la búsqueda (sin distinguir tildes). */
export function Highlight({ text, terms }: { text: string; terms: string[] }) {
  const ranges = matchRanges(text, terms);
  if (!ranges.length) return <>{text}</>;
  const parts: ReactNode[] = [];
  let cursor = 0;
  ranges.forEach(([a, b], i) => {
    if (a > cursor) parts.push(<Fragment key={`t${i}`}>{text.slice(cursor, a)}</Fragment>);
    parts.push(
      <mark key={`m${i}`} className="rounded-[3px] bg-ocre-300/55 px-px text-ink dark:bg-ocre-500/30">
        {text.slice(a, b)}
      </mark>,
    );
    cursor = b;
  });
  if (cursor < text.length) parts.push(<Fragment key="end">{text.slice(cursor)}</Fragment>);
  return <>{parts}</>;
}

export function NewTabHint() {
  return <span className="sr-only"> (se abre en una pestaña nueva)</span>;
}
