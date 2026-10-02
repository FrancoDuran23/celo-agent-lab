import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";
import { IMPUESTOS } from "../../data/impuestos";
import type { ImpuestoSlug } from "../../data/types";
import { Icon } from "../../lib/icons";
import { strataGradient, TINT } from "./palette";

/** Franja con el resto de los impuestos. */
export function OtrosImpuestos({
  actual,
  eyebrow = "Seguí explorando",
  title = "Otros impuestos",
}: {
  actual?: ImpuestoSlug;
  eyebrow?: string;
  title?: string;
}) {
  const otros = IMPUESTOS.filter((i) => i.slug !== actual);
  if (!otros.length) return null;

  return (
    <section aria-labelledby="otros-titulo" className="border-t border-line bg-surface-2/50 py-16 sm:py-20">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">{eyebrow}</p>
            <h2 id="otros-titulo" className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {title}
            </h2>
          </div>
          <Link
            to="/impuestos"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-brand hover:bg-brand-soft"
          >
            Ver todos <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className={clsx("mt-8 grid gap-3 sm:grid-cols-2", otros.length > 4 ? "lg:grid-cols-3 xl:grid-cols-5" : "lg:grid-cols-4")}>
          {otros.map((imp) => (
            <li key={imp.slug}>
              <Link
                to={`/impuestos/${imp.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-surface p-5 ring-1 ring-line transition-[box-shadow,transform] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:shadow-lift hover:ring-line-strong"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundImage: strataGradient(imp.color) }}
                />
                <span className="flex items-center gap-3">
                  <span className={clsx("inline-flex size-10 shrink-0 items-center justify-center rounded-xl", TINT[imp.color])}>
                    <Icon name={imp.icon} className="size-5" />
                  </span>
                  <span className="font-semibold text-ink group-hover:text-brand">{imp.corto}</span>
                </span>
                <span className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-3">{imp.bajada}</span>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-brand">
                  Ver impuesto
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
