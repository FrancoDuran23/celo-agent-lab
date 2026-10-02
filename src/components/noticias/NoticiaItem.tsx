import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import type { Noticia } from "../../data/types";
import { formatFull } from "../../lib/dates";
import { ArrowLink, SmartLink } from "../ui/primitives";
import { categoriaRelacionada, hostDe } from "./categorias";

/** Fondo suave detrás del elemento al que se llega por /noticias#slug. */
export const RESALTADO =
  "before:absolute before:-inset-x-3 before:inset-y-0 before:-z-10 before:rounded-lg before:bg-brand-soft sm:before:-inset-x-4";

/**
 * Una noticia del archivo: fecha y categoría, título, resumen completo y,
 * si existe, el enlace a la nota oficial (o a un trámite relacionado).
 * Sin destino no hay enlace: nunca un enlace muerto.
 */
export function NoticiaItem({ noticia: n, highlighted = false }: { noticia: Noticia; highlighted?: boolean }) {
  const relacionado = n.href ? undefined : categoriaRelacionada(n.categoria);
  return (
    <li
      id={n.slug}
      className={clsx("relative isolate scroll-mt-28 border-t border-line py-5", highlighted && RESALTADO)}
    >
      <p className="text-sm text-ink-3">
        <time dateTime={n.fecha}>{formatFull(n.fecha)}</time> · <span className="sr-only">Categoría: </span>
        {n.categoria}
      </p>
      <h3 className="mt-1 text-lg leading-snug font-semibold text-ink">{n.titulo}</h3>
      <p className="prose-measure mt-1.5 text-ink-2">{n.resumen}</p>
      {n.href ? (
        <p className="mt-3">
          <SmartLink to={n.href} className="link font-semibold">
            Leer la nota en {hostDe(n.href)}
            <span className="sr-only">: {n.titulo}</span>
            <ArrowUpRight className="ml-1 inline size-4 align-[-2px]" aria-hidden="true" />
          </SmartLink>
        </p>
      ) : relacionado ? (
        <p className="mt-3">
          <ArrowLink to={relacionado.to}>{relacionado.label}</ArrowLink>
        </p>
      ) : null}
    </li>
  );
}
