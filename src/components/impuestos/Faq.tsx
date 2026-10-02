import { Plus } from "lucide-react";
import type { Pregunta } from "../../data/types";

/** Acordeón accesible con <details>/<summary> nativos (teclado y lectores de pantalla sin JS). */
export function Faq({ preguntas }: { preguntas: Pregunta[] }) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
      {preguntas.map((q, i) => (
        <details key={q.pregunta} className="group" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-medium text-ink transition-colors hover:bg-surface-2/60 focus-visible:-outline-offset-2 sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
            <span className="text-[1.02rem] leading-snug">{q.pregunta}</span>
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink-2 ring-1 ring-line transition-[transform,background-color,color] duration-300 ease-[var(--ease-out-soft)] group-open:rotate-45 group-open:bg-brand group-open:text-brand-ink group-open:ring-brand">
              <Plus className="size-4" aria-hidden="true" />
            </span>
          </summary>
          <div className="px-5 pb-5 sm:px-6 sm:pb-6">
            <p className="max-w-prose leading-relaxed text-ink-3">{q.respuesta}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
