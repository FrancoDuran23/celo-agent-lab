import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Link } from "react-router";
import { ArrowRight, Briefcase, Calculator, Landmark, UserRound } from "lucide-react";
import clsx from "clsx";
import { TRAMITES } from "../../data/tramites";
import type { Perfil } from "../../data/types";
import { Icon } from "../../lib/icons";
import { SectionHeader, SmartLink } from "../ui/primitives";

const PERFILES: { id: Perfil; label: string; bajada: string; icon: typeof UserRound }[] = [
  { id: "personas", label: "Personas", bajada: "Tu casa, tu auto y tus pagos al día.", icon: UserRound },
  { id: "empresas", label: "Comercios y empresas", bajada: "Ingresos Brutos, sellos y facilidades.", icon: Briefcase },
  { id: "profesionales", label: "Profesionales", bajada: "Contadores, escribanos y gestores.", icon: Calculator },
  { id: "agentes", label: "Agentes de recaudación", bajada: "Retenciones, percepciones y DDJJ.", icon: Landmark },
];

/** Pestañas accesibles (patrón WAI-ARIA Tabs) con trámites por perfil. */
export function PorPerfil() {
  const [active, setActive] = useState<Perfil>("personas");
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = PERFILES.length;
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % n;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next >= 0) {
      e.preventDefault();
      setActive(PERFILES[next]!.id);
      tabRefs.current[next]?.focus();
    }
  };

  const items = TRAMITES.filter((t) => t.perfiles.includes(active)).slice(0, 8);
  if (!TRAMITES.length) return null;

  return (
    <section aria-labelledby="perfil-titulo" className="py-20 sm:py-24">
      <div className="container-page">
        <SectionHeader
          id="perfil-titulo"
          eyebrow="Trámites"
          title="Encontrá lo tuyo según quién sos"
          description="Elegí tu perfil y te mostramos los trámites más usados."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[19rem_1fr]">
          <div role="tablist" aria-label="Perfil" aria-orientation="vertical" className="flex min-w-0 gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {PERFILES.map((p, i) => {
              const selected = p.id === active;
              const P = p.icon;
              return (
                <button
                  key={p.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  type="button"
                  id={`${baseId}-tab-${p.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(p.id)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={clsx(
                    "flex shrink-0 items-center gap-3 rounded-2xl p-3 text-left transition-colors lg:p-4",
                    selected ? "bg-night-900 text-crema-50 shadow-soft" : "bg-surface text-ink ring-1 ring-line hover:bg-surface-2",
                  )}
                >
                  <span
                    className={clsx(
                      "inline-flex size-10 shrink-0 items-center justify-center rounded-xl",
                      selected ? "bg-white/10 text-ocre-300" : "bg-surface-2 text-ink-2",
                    )}
                  >
                    <P className="size-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-semibold whitespace-nowrap">{p.label}</span>
                    <span className={clsx("hidden text-sm lg:block", selected ? "text-crema-200/70" : "text-ink-3")}>
                      {p.bajada}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`${baseId}-panel`}
            aria-labelledby={`${baseId}-tab-${active}`}
            tabIndex={0}
            className="rounded-3xl bg-surface p-2 ring-1 ring-line sm:p-3"
          >
            <ul className="grid gap-1 sm:grid-cols-2">
              {items.map((t) => (
                <li key={t.id}>
                  <SmartLink
                    to={t.href}
                    className="group flex h-full items-start gap-3.5 rounded-2xl p-4 transition-colors hover:bg-surface-2"
                  >
                    <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-ink-2 ring-1 ring-line group-hover:bg-surface">
                      <Icon name={t.icon} className="size-[1.1rem]" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-medium text-ink">{t.titulo}</span>
                      <span className="mt-0.5 line-clamp-2 block text-sm text-ink-3">{t.descripcion}</span>
                    </span>
                  </SmartLink>
                </li>
              ))}
            </ul>
            <div className="px-4 pt-2 pb-3">
              <Link
                to={`/tramites?perfil=${active}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
              >
                Ver todos los trámites para {PERFILES.find((p) => p.id === active)?.label.toLowerCase()}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
