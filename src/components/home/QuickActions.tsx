import { ArrowUpRight } from "lucide-react";
import { TRAMITES } from "../../data/tramites";
import { Icon } from "../../lib/icons";
import { SmartLink } from "../ui/primitives";

/**
 * Accesos rápidos: los trámites destacados, en una grilla que se
 * superpone al borde inferior del hero.
 */
export function QuickActions() {
  const items = TRAMITES.filter((t) => t.destacado).slice(0, 6);
  if (!items.length) return null;

  return (
    <section aria-labelledby="accesos-titulo" className="relative z-10 -mt-14 sm:-mt-16">
      <div className="container-page">
        <h2 id="accesos-titulo" className="sr-only">
          Accesos rápidos
        </h2>
        <ul className="grid grid-cols-2 gap-2 rounded-3xl bg-surface p-2 shadow-lift ring-1 ring-line sm:gap-3 sm:p-3 md:grid-cols-3 lg:grid-cols-6">
          {items.map((t, i) => (
            <li key={t.id}>
              <SmartLink
                to={t.href}
                className="group relative flex h-full flex-col gap-4 rounded-2xl p-4 transition-colors hover:bg-surface-2 sm:p-5"
              >
                <span
                  className={[
                    "inline-flex size-11 items-center justify-center rounded-xl",
                    ACCENTS[i % ACCENTS.length],
                  ].join(" ")}
                >
                  <Icon name={t.icon} className="size-5" />
                </span>
                <span className="text-[0.95rem] leading-snug font-semibold text-ink">{t.titulo}</span>
                <ArrowUpRight
                  className="absolute top-4 right-4 size-4 text-ink-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </SmartLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const ACCENTS = ["tint-terracota", "tint-ocre", "tint-rosa", "tint-salvia", "tint-violeta", "tint-night"];
