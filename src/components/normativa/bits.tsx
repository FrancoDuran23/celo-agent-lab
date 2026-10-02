import { Fragment, type ReactNode } from "react";
import { matchRanges } from "./utils";

/** Resalta las coincidencias de la búsqueda (sin distinguir tildes). */
export function Highlight({ text, terms }: { text: string; terms: string[] }) {
  const ranges = matchRanges(text, terms);
  if (!ranges.length) return <>{text}</>;
  const parts: ReactNode[] = [];
  let cursor = 0;
  ranges.forEach(([a, b], i) => {
    if (a > cursor) parts.push(<Fragment key={`t${i}`}>{text.slice(cursor, a)}</Fragment>);
    parts.push(
      <mark key={`m${i}`} className="rounded-[3px] bg-[color-mix(in_oklab,var(--warn)_22%,transparent)] text-ink [box-decoration-break:clone]">
        {text.slice(a, b)}
      </mark>,
    );
    cursor = b;
  });
  if (cursor < text.length) parts.push(<Fragment key="end">{text.slice(cursor)}</Fragment>);
  return <>{parts}</>;
}
