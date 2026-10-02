import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import type { Noticia } from "../../data/types";
import { daysBetween, formatFull, parseISODate, relativeDays, today } from "../../lib/dates";
import { ButtonLink } from "../ui/Button";
import { ArrowLink } from "../ui/primitives";
import { categoriaRelacionada, hostDe } from "./categorias";
import { RESALTADO } from "./NoticiaItem";

/** La noticia más reciente (de la categoría elegida), en formato grande y sólo texto. */
export function NoticiaDestacada({ noticia: n, highlighted = false }: { noticia: Noticia; highlighted?: boolean }) {
  const relacionado = categoriaRelacionada(n.categoria);
  const dias = daysBetween(parseISODate(n.fecha), today());
  const reciente = dias >= 0 && dias <= 45;

  return (
    <article
      id={n.slug}
      aria-labelledby={`${n.slug}-titulo`}
      className={clsx("relative isolate scroll-mt-28 border-b border-line pb-10 sm:pb-12", highlighted && RESALTADO)}
    >
      <p className="text-ink-3">
        <time dateTime={n.fecha}>{formatFull(n.fecha)}</time>
        {reciente ? <> ({relativeDays(n.fecha)})</> : null} · <span className="sr-only">Categoría: </span>
        {n.categoria}
      </p>
      <h2 id={`${n.slug}-titulo`} className="mt-2 text-[1.625rem] leading-tight font-bold text-ink sm:text-[2rem]">
        {n.titulo}
      </h2>
      <p className="prose-measure mt-4 text-lg text-ink-2">{n.resumen}</p>

      {n.href || relacionado ? (
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
          {n.href ? (
            <ButtonLink to={n.href}>
              Leer la nota completa
              <ArrowUpRight aria-hidden="true" />
              <span className="sr-only"> en {hostDe(n.href)}</span>
            </ButtonLink>
          ) : null}
          {relacionado ? <ArrowLink to={relacionado.to}>{relacionado.label}</ArrowLink> : null}
        </div>
      ) : null}
    </article>
  );
}
