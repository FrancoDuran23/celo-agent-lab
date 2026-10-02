import { useMemo, type ReactNode } from "react";
import { useSearchParams } from "react-router";
import { ArrowUpRight, KeyRound, MonitorSmartphone, Search, SearchX, Store, X } from "lucide-react";
import clsx from "clsx";
import { TRAMITES } from "../data/tramites";
import { IMPUESTOS } from "../data/impuestos";
import type { Perfil, Tramite } from "../data/types";
import { searchTramites } from "../lib/search";
import { Icon } from "../lib/icons";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { Badge, PageIntro, SmartLink } from "../components/ui/primitives";

const PERFILES: { id: Perfil; label: string }[] = [
  { id: "personas", label: "Personas" },
  { id: "empresas", label: "Comercios y empresas" },
  { id: "profesionales", label: "Profesionales" },
  { id: "agentes", label: "Agentes de recaudación" },
];

const CANAL_LABEL: Record<Tramite["canal"], string> = {
  online: "En línea",
  presencial: "Presencial",
  "online-y-presencial": "En línea o presencial",
};

export function TramitesPage() {
  useDocumentTitle("Trámites");
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const impuesto = params.get("impuesto") ?? "";
  const perfil = (params.get("perfil") ?? "") as Perfil | "";
  const soloOnline = params.get("online") === "1";

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const results = useMemo(() => {
    let list = searchTramites(TRAMITES, q);
    if (impuesto) {
      // Un impuesto incluye sus trámites propios y los generales que le aplican (planes, libre deuda…).
      const relacionados = new Set(IMPUESTOS.find((i) => i.slug === impuesto)?.tramites ?? []);
      list = list.filter((t) => t.impuesto === impuesto || relacionados.has(t.id));
    }
    if (perfil) list = list.filter((t) => t.perfiles.includes(perfil));
    if (soloOnline) list = list.filter((t) => t.canal !== "presencial");
    return list;
  }, [q, impuesto, perfil, soloOnline]);

  const hasFilters = Boolean(q || impuesto || perfil || soloOnline);
  const impuestoNombre = (slug: string) => IMPUESTOS.find((i) => i.slug === slug)?.corto ?? "General";

  return (
    <>
      <PageIntro
        eyebrow="Guía de trámites"
        title="¿Qué necesitás hacer?"
        description="Buscá por nombre o filtrá por impuesto y perfil. La mayoría de los trámites se hacen 100% en línea."
      >
        <form role="search" onSubmit={(e) => e.preventDefault()} className="max-w-2xl">
          <label htmlFor="tramites-q" className="sr-only">
            Buscar trámite
          </label>
          <div className="flex items-center gap-3 rounded-2xl bg-surface px-4 shadow-soft ring-1 ring-line focus-within:ring-2 focus-within:ring-focus">
            <Search className="size-5 shrink-0 text-ink-3" aria-hidden="true" />
            <input
              id="tramites-q"
              type="search"
              value={q}
              onChange={(e) => update("q", e.target.value)}
              placeholder="Ej.: libre deuda, constancia, sellos…"
              autoComplete="off"
              className="h-14 min-w-0 flex-1 bg-transparent text-lg placeholder:text-ink-3 focus:outline-none"
            />
          </div>
        </form>
      </PageIntro>

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[16rem_1fr]">
        {/* Filtros */}
        <aside aria-label="Filtros" className="lg:sticky lg:top-24 lg:self-start">
          <fieldset>
            <legend className="eyebrow mb-3">Impuesto</legend>
            <div className="flex flex-wrap gap-2 lg:flex-col lg:items-stretch">
              <FilterChip active={!impuesto} onClick={() => update("impuesto", null)}>
                Todos
              </FilterChip>
              {IMPUESTOS.map((i) => (
                <FilterChip key={i.slug} active={impuesto === i.slug} onClick={() => update("impuesto", i.slug)}>
                  <Icon name={i.icon} className="size-4" />
                  {i.corto}
                </FilterChip>
              ))}
              <FilterChip active={impuesto === "general"} onClick={() => update("impuesto", "general")}>
                <Store className="size-4" aria-hidden="true" />
                Generales
              </FilterChip>
            </div>
          </fieldset>

          <fieldset className="mt-8">
            <legend className="eyebrow mb-3">Perfil</legend>
            <div className="flex flex-wrap gap-2 lg:flex-col lg:items-stretch">
              <FilterChip active={!perfil} onClick={() => update("perfil", null)}>
                Todos
              </FilterChip>
              {PERFILES.map((p) => (
                <FilterChip key={p.id} active={perfil === p.id} onClick={() => update("perfil", p.id)}>
                  {p.label}
                </FilterChip>
              ))}
            </div>
          </fieldset>

          <label className="mt-8 flex cursor-pointer items-center gap-3 rounded-xl bg-surface p-3 ring-1 ring-line">
            <input
              type="checkbox"
              checked={soloOnline}
              onChange={(e) => update("online", e.target.checked ? "1" : null)}
              className="size-4 accent-[var(--brand)]"
            />
            <span className="text-sm font-medium text-ink">Solo trámites en línea</span>
          </label>
        </aside>

        {/* Resultados */}
        <section aria-labelledby="resultados-titulo">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 id="resultados-titulo" className="text-sm text-ink-3" aria-live="polite">
              <span className="font-semibold text-ink tabular">{results.length}</span>{" "}
              {results.length === 1 ? "trámite" : "trámites"}
              {q ? (
                <>
                  {" "}
                  para “<span className="text-ink">{q}</span>”
                </>
              ) : null}
            </h2>
            {hasFilters ? (
              <button
                type="button"
                onClick={() => setParams(new URLSearchParams(), { replace: true })}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-ink-2 hover:bg-surface-2"
              >
                <X className="size-4" aria-hidden="true" />
                Limpiar filtros
              </button>
            ) : null}
          </div>

          {results.length ? (
            <ul className="grid gap-3 md:grid-cols-2">
              {results.map((t) => (
                <li key={t.id}>
                  <SmartLink
                    to={t.href}
                    className="group flex h-full flex-col rounded-2xl bg-surface p-5 ring-1 ring-line transition-[box-shadow,transform] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:shadow-lift"
                  >
                    <div className="flex items-start gap-4">
                      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-ink-2 ring-1 ring-line">
                        <Icon name={t.icon} className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-ink group-hover:text-brand">{t.titulo}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-ink-3">{t.descripcion}</p>
                      </div>
                      <ArrowUpRight
                        className="size-4 shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1.5 pl-15">
                      <Badge>{impuestoNombre(t.impuesto)}</Badge>
                      <Badge tone={t.canal === "presencial" ? "warn" : "ok"}>
                        <MonitorSmartphone aria-hidden="true" />
                        {CANAL_LABEL[t.canal]}
                      </Badge>
                      {t.requiereClave ? (
                        <Badge tone="info">
                          <KeyRound aria-hidden="true" />
                          Clave fiscal
                        </Badge>
                      ) : null}
                    </div>
                  </SmartLink>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-3xl border border-dashed border-line-strong px-6 py-16 text-center">
              <SearchX className="mx-auto size-10 text-ink-3" aria-hidden="true" />
              <p className="mt-4 text-lg font-semibold">No encontramos trámites con esos filtros.</p>
              <p className="mt-1 text-ink-3">Probá con otras palabras o limpiá los filtros.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={clsx(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors lg:rounded-xl lg:px-3",
        active ? "bg-night-900 text-crema-50 dark:bg-crema-100 dark:text-night-900" : "bg-surface text-ink-2 ring-1 ring-line hover:bg-surface-2",
      )}
    >
      {children}
    </button>
  );
}
