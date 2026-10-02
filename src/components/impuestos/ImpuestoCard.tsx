import { Link } from "react-router";
import { ArrowRight, Check, ListChecks } from "lucide-react";
import clsx from "clsx";
import type { Impuesto } from "../../data/types";
import { Icon } from "../../lib/icons";
import { strataGradient, TINT } from "./palette";
import { tramitesDe } from "./related";

/**
 * Fila del índice de impuestos. Toda la tarjeta es clickeable mediante un
 * enlace "estirado" sobre el título (un solo punto de foco por tarjeta).
 */
export function ImpuestoCard({ imp }: { imp: Impuesto }) {
  const tramites = tramitesDe(imp);
  const enLinea = tramites.filter((t) => t.canal !== "presencial").length;
  const titleId = `imp-${imp.slug}`;

  return (
    <article
      aria-labelledby={titleId}
      className={clsx(
        "group relative h-full overflow-hidden rounded-3xl bg-surface ring-1 ring-line",
        "transition-[box-shadow,transform] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:shadow-lift hover:ring-line-strong",
        "has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-focus",
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ backgroundImage: strataGradient(imp.color) }}
      />

      <div className="grid gap-6 p-3 pt-4.5 sm:p-4 sm:pt-5.5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-4">
        {/* Identidad + acción */}
        <div className="flex flex-col px-3 pt-3 sm:px-5 sm:pt-5 lg:pb-4">
          <div className="flex items-center gap-4">
            <span className={clsx("inline-flex size-14 shrink-0 items-center justify-center rounded-2xl", TINT[imp.color])}>
              <Icon name={imp.icon} className="size-7" />
            </span>
            <h2 id={titleId} className="text-2xl leading-tight font-semibold tracking-tight text-ink sm:text-[1.7rem]">
              <Link
                to={`/impuestos/${imp.slug}`}
                className="outline-none after:absolute after:inset-0 after:rounded-3xl after:content-[''] group-hover:text-brand"
              >
                {imp.nombre}
              </Link>
            </h2>
          </div>
          <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-ink-2">{imp.bajada}</p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pt-1 lg:mt-auto lg:pt-8">
            {tramites.length ? (
              <p className="inline-flex items-center gap-2 text-sm text-ink-3">
                <ListChecks className="size-4" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-ink tabular">{tramites.length}</span>{" "}
                  {tramites.length === 1 ? "trámite relacionado" : "trámites relacionados"}
                  {enLinea === tramites.length ? " · todos en línea" : enLinea ? ` · ${enLinea} en línea` : ""}
                </span>
              </p>
            ) : null}
            <span
              aria-hidden="true"
              className="inline-flex items-center gap-1.5 text-sm font-medium whitespace-nowrap text-brand"
            >
              Ver información
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>

        {/* Quiénes y puntos clave */}
        <div className="rounded-2xl bg-surface-2/70 p-5 ring-1 ring-line/60 sm:p-6">
          <p className="eyebrow mb-2">Quiénes pagan</p>
          <p className="text-[0.95rem] leading-relaxed text-ink">{imp.quienes}</p>
          {imp.puntos.length ? (
            <>
              <p className="eyebrow mt-6 mb-3">A tener en cuenta</p>
              <ul className="grid gap-2.5 text-sm text-ink-2">
                {imp.puntos.slice(0, 3).map((p) => (
                  <li key={p} className="flex gap-2.5">
                    <span
                      className={clsx(
                        "mt-px inline-flex size-[1.15rem] shrink-0 items-center justify-center rounded-full",
                        TINT[imp.color],
                      )}
                    >
                      <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                    </span>
                    <span className="leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}
