import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { NOTICIAS } from "../../data/noticias";
import { formatFull } from "../../lib/dates";
import { SectionHeader, SmartLink } from "../ui/primitives";

const COVERS = [
  "from-[#c4532f] to-[#6a4c93]",
  "from-[#e0a63b] to-[#c4532f]",
  "from-[#7f9a62] to-[#2a4470]",
];

export function NoticiasSection() {
  const items = [...NOTICIAS].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 3);
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
          {items.map((n, i) => (
            <li key={n.slug}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-surface ring-1 ring-line transition-shadow hover:shadow-lift">
                <div className={`relative h-36 bg-gradient-to-br ${COVERS[i % COVERS.length]}`} aria-hidden="true">
                  <svg viewBox="0 0 400 144" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-40">
                    <path d="M0 96 C70 80 120 90 190 74 S320 58 400 66 V144 H0Z" fill="#0b1626" opacity=".35" />
                    <path d="M0 116 C80 102 150 112 220 98 S340 86 400 92 V144 H0Z" fill="#0b1626" opacity=".5" />
                  </svg>
                  <span className="absolute top-4 left-4 rounded-full bg-black/25 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {n.categoria}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <time dateTime={n.fecha} className="text-sm text-ink-3">
                    {formatFull(n.fecha)}
                  </time>
                  <h3 className="mt-2 text-lg leading-snug font-semibold text-ink">
                    <SmartLink to={n.href ?? "/noticias"} className="after:absolute after:inset-0">
                      {n.titulo}
                    </SmartLink>
                  </h3>
                  <p className="mt-2 line-clamp-3 text-ink-3">{n.resumen}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
