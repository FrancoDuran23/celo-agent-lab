import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { NOTICIAS } from "../../data/noticias";
import { SectionHeader } from "../ui/primitives";
import { NoticiaCard } from "../noticias/NoticiaCard";
import { ordenarPorFecha } from "../noticias/categorias";

export function NoticiasSection() {
  const items = ordenarPorFecha(NOTICIAS).slice(0, 3);
  if (!items.length) return null;

  return (
    <section aria-labelledby="noticias-titulo" className="pb-24">
      <div className="container-page">
        <SectionHeader
          id="noticias-titulo"
          eyebrow="Novedades"
          title="Noticias de Rentas"
          action={
            <Link
              to="/noticias"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-brand hover:bg-brand-soft"
            >
              Todas las noticias <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((n) => (
            <li key={n.slug}>
              {/* Sin nota oficial, la tarjeta lleva a la noticia dentro de /noticias. */}
              <NoticiaCard noticia={n} fallbackTo={`/noticias#${n.slug}`} showAction={false} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
