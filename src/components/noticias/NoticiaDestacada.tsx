import { Link } from "react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import type { Noticia } from "../../data/types";
import { daysBetween, formatFull, parseISODate, relativeDays, today } from "../../lib/dates";
import { ButtonLink } from "../ui/Button";
import { NoticiaCover } from "./NoticiaCover";
import { NEW_TAB_NOTE, categoriaColor, categoriaRelacionada, hostDe } from "./categorias";

/** La noticia más reciente (de la categoría elegida), en formato grande. */
export function NoticiaDestacada({
  noticia: n,
  etiqueta,
  highlighted = false,
}: {
  noticia: Noticia;
  /** Texto del rótulo superior, p. ej. "Lo más reciente". */
  etiqueta: string;
  highlighted?: boolean;
}) {
  const relacionado = categoriaRelacionada(n.categoria);
  const dias = daysBetween(parseISODate(n.fecha), today());
  const reciente = dias >= 0 && dias <= 45;

  return (
    <article
      id={n.slug}
      aria-labelledby={`${n.slug}-titulo`}
      className={clsx(
        "grid scroll-mt-28 overflow-hidden rounded-3xl bg-surface shadow-soft ring-1 lg:grid-cols-[1.15fr_1fr]",
        highlighted ? "ring-2 ring-brand" : "ring-line",
      )}
    >
      <NoticiaCover
        slug={n.slug}
        color={categoriaColor(n.categoria)}
        className="h-52 sm:h-72 lg:order-last lg:h-auto lg:min-h-[25rem]"
        landscapeClassName="h-[70%] lg:h-auto lg:aspect-[2/1]"
      >
        <span className="absolute top-5 left-5 rounded-full bg-black/25 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm sm:top-6 sm:left-6">
          <span className="sr-only">Categoría: </span>
          {n.categoria}
        </span>
      </NoticiaCover>

      <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
        <p className="eyebrow flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
          {etiqueta}
        </p>
        <h2
          id={`${n.slug}-titulo`}
          className="mt-4 text-[1.75rem] leading-tight font-semibold tracking-tight text-ink sm:text-4xl"
        >
          {n.titulo}
        </h2>
        <p className="mt-3 text-sm text-ink-3">
          <time dateTime={n.fecha}>{formatFull(n.fecha)}</time>
          {reciente ? <span> · {relativeDays(n.fecha)}</span> : null}
        </p>
        <p className="mt-5 text-lg leading-relaxed text-ink-2">{n.resumen}</p>

        {n.href || relacionado ? (
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
            {n.href ? (
              <ButtonLink to={n.href} size="lg">
                Leer la nota completa
                <ArrowUpRight aria-hidden="true" />
                <span className="sr-only">
                  {" "}
                  en {hostDe(n.href)}
                  {NEW_TAB_NOTE}
                </span>
              </ButtonLink>
            ) : null}
            {relacionado && n.href ? (
              <Link
                to={relacionado.to}
                className="group inline-flex items-center gap-1.5 rounded-full py-2 font-medium text-brand hover:underline sm:px-3"
              >
                {relacionado.label}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            ) : relacionado ? (
              <ButtonLink to={relacionado.to} variant="secondary" size="lg">
                {relacionado.label}
                <ArrowRight aria-hidden="true" />
              </ButtonLink>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
