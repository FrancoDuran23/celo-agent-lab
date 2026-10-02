import { Link } from "react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import type { Noticia } from "../../data/types";
import { formatFull } from "../../lib/dates";
import { SmartLink } from "../ui/primitives";
import { isExternal } from "../ui/Button";
import { NoticiaCover } from "./NoticiaCover";
import { NEW_TAB_NOTE, categoriaColor, categoriaRelacionada, hostDe } from "./categorias";

interface NoticiaCardProps {
  noticia: Noticia;
  /** "stacked": portada arriba (portada del sitio). "row": portada a la izquierda (archivo). */
  layout?: "stacked" | "row";
  headingAs?: "h2" | "h3" | "h4";
  /**
   * Destino interno para noticias sin nota en el sitio oficial (la portada
   * usa "/noticias#slug"). Sin él, la tarjeta no es un enlace y muestra el
   * resumen completo.
   */
  fallbackTo?: string;
  /** Pie con la acción ("Leer la nota…" o un enlace relacionado). */
  showAction?: boolean;
  /** Resalta la tarjeta (p. ej. cuando se llega por #slug). */
  highlighted?: boolean;
  id?: string;
  className?: string;
}

/**
 * Tarjeta de noticia compartida por la portada y la página de Noticias.
 * Si hay destino, toda la tarjeta es clickeable (el enlace es el título,
 * con un ::after que cubre la tarjeta); si no, no hay enlace muerto.
 */
export function NoticiaCard({
  noticia: n,
  layout = "stacked",
  headingAs: Heading = "h3",
  fallbackTo,
  showAction = true,
  highlighted = false,
  id,
  className,
}: NoticiaCardProps) {
  const to = n.href ?? fallbackTo;
  const external = to ? isExternal(to) : false;
  const color = categoriaColor(n.categoria);
  const relacionado = !to ? categoriaRelacionada(n.categoria) : undefined;
  const row = layout === "row";

  return (
    <article
      id={id}
      className={clsx(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl bg-surface ring-1 transition-[box-shadow,transform] duration-300 ease-[var(--ease-out-soft)]",
        row && "sm:flex-row",
        highlighted ? "ring-2 ring-brand shadow-lift" : "ring-line",
        to && "hover:shadow-lift has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-focus",
        to && row && "hover:-translate-y-0.5",
        id && "scroll-mt-28",
        className,
      )}
    >
      <NoticiaCover
        slug={n.slug}
        color={color}
        className={clsx("shrink-0", row ? "h-28 sm:h-auto sm:min-h-44 sm:w-48 lg:w-56" : "h-36")}
        landscapeClassName={row ? "h-[72%] sm:h-auto sm:aspect-[2/1]" : "h-[72%]"}
      >
        <span className="absolute top-4 left-4 rounded-full bg-black/25 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <span className="sr-only">Categoría: </span>
          {n.categoria}
        </span>
      </NoticiaCover>

      <div className={clsx("flex min-w-0 flex-1 flex-col", row ? "p-5 sm:p-6" : "p-6")}>
        <time dateTime={n.fecha} className="text-sm text-ink-3">
          {formatFull(n.fecha)}
        </time>
        <Heading className={clsx("mt-2 leading-snug font-semibold text-ink", row ? "text-lg sm:text-xl" : "text-lg")}>
          {to ? (
            <SmartLink
              to={to}
              className="outline-none after:absolute after:inset-0 after:content-[''] group-hover:text-brand"
            >
              {n.titulo}
              {external ? <span className="sr-only">{NEW_TAB_NOTE}</span> : null}
            </SmartLink>
          ) : (
            n.titulo
          )}
        </Heading>
        {/* En la portada se recorta si la tarjeta lleva a la nota; en el archivo se lee completo. */}
        <p className={clsx("mt-2 leading-relaxed text-ink-3", to && !row && "line-clamp-3")}>{n.resumen}</p>

        {showAction && (n.href || relacionado) ? (
          <div className="mt-auto pt-5">
            {n.href ? (
              <span aria-hidden="true" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand">
                Leer la nota en {hostDe(n.href)}
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            ) : relacionado ? (
              <Link
                to={relacionado.to}
                className="group/rel inline-flex items-center gap-1.5 rounded-full text-sm font-medium text-brand hover:underline"
              >
                {relacionado.label}
                <ArrowRight className="size-4 transition-transform group-hover/rel:translate-x-0.5" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
