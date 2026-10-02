import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { IMPUESTOS } from "../../data/impuestos";
import { Icon } from "../../lib/icons";
import { SectionHeader } from "../ui/primitives";

const STRATA: Record<string, string> = {
  terracota: "from-[#c4532f] via-[#d9714e] to-[#e0a63b]",
  ocre: "from-[#e0a63b] via-[#f0cc85] to-[#d9877f]",
  rosa: "from-[#d9877f] via-[#e0a63b] to-[#c4532f]",
  salvia: "from-[#7f9a62] via-[#a8bb8a] to-[#e0a63b]",
  violeta: "from-[#6a4c93] via-[#d9877f] to-[#e0a63b]",
  night: "from-[#2a4470] via-[#6a4c93] to-[#d9877f]",
};

export function ImpuestosGrid() {
  if (!IMPUESTOS.length) return null;
  return (
    <section aria-labelledby="impuestos-titulo" className="border-y border-line bg-surface-2/50 py-20 sm:py-24">
      <div className="container-page">
        <SectionHeader
          id="impuestos-titulo"
          eyebrow="Impuestos provinciales"
          title="Todo lo que necesitás saber, por impuesto"
          description="Quiénes pagan, cómo se calcula, cuándo vence y qué trámites podés hacer en línea."
          action={
            <Link
              to="/impuestos"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-brand hover:bg-brand-soft"
            >
              Ver todos <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {IMPUESTOS.map((imp, i) => (
            <li key={imp.slug} className={i === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : undefined}>
              <Link
                to={`/impuestos/${imp.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-surface p-6 ring-1 ring-line transition-[box-shadow,transform] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:shadow-lift"
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${STRATA[imp.color] ?? STRATA.terracota}`}
                />
                <span className={`inline-flex size-12 items-center justify-center rounded-xl tint-${imp.color}`}>
                  <Icon name={imp.icon} className="size-6" />
                </span>
                <h3 className="mt-5 text-xl font-semibold tracking-tight text-ink">{imp.nombre}</h3>
                <p className="mt-2 leading-relaxed text-ink-3">{imp.bajada}</p>
                {i === 0 && imp.puntos.length ? (
                  <ul className="mt-5 hidden gap-2 text-sm text-ink-2 lg:grid">
                    {imp.puntos.slice(0, 4).map((p) => (
                      <li key={p} className="flex gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-brand">
                  Ver información y trámites
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
