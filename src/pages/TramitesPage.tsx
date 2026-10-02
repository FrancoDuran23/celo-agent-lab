import { useMemo, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import clsx from "clsx";
import { TRAMITES } from "../data/tramites";
import { IMPUESTOS } from "../data/impuestos";
import type { Perfil, Tramite } from "../data/types";
import { searchTramites } from "../lib/search";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { Button, buttonClass } from "../components/ui/Button";
import { Badge, LinkList, PageIntro } from "../components/ui/primitives";

const PERFILES: { id: Perfil; label: string }[] = [
  { id: "personas", label: "Personas" },
  { id: "empresas", label: "Comercios y empresas" },
  { id: "profesionales", label: "Profesionales" },
  { id: "agentes", label: "Agentes de recaudación" },
];

/** Leyendas de los grupos de filtros: encabezado chico en negrita. */
const LEGEND = "mb-3 font-bold text-ink";

const CANAL_LABEL: Record<Tramite["canal"], string> = {
  online: "En línea",
  presencial: "Presencial",
  "online-y-presencial": "En línea o presencial",
};

export function TramitesPage() {
  useDocumentTitle("Trámites");
  const [params, setParams] = useSearchParams();
  // En pantallas chicas los filtros se pliegan para que los resultados queden a la vista.
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const q = params.get("q") ?? "";
  const impuesto = params.get("impuesto") ?? "";
  const perfil = (params.get("perfil") ?? "") as Perfil | "";
  const soloOnline = params.get("online") === "1";

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true, preventScrollReset: true });
  };
  const limpiar = () => setParams(new URLSearchParams(), { replace: true, preventScrollReset: true });

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

  const filtrosActivos = [impuesto, perfil, soloOnline].filter(Boolean).length;
  const hasFilters = Boolean(q || filtrosActivos);
  const impuestoNombre = (slug: string) => IMPUESTOS.find((i) => i.slug === slug)?.corto ?? "General";

  return (
    <>
      <PageIntro
        title="Trámites"
        breadcrumbs={[{ label: "Trámites" }]}
        description="Buscá por nombre o filtrá por impuesto y perfil. Casi todos los trámites se hacen en línea."
      >
        <form role="search" aria-label="Buscar trámites" onSubmit={(e) => e.preventDefault()} className="max-w-2xl">
          <label htmlFor="tramites-q" className="mb-2 block font-semibold text-ink">
            Buscar un trámite
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-ink-3"
              aria-hidden="true"
            />
            <input
              id="tramites-q"
              type="search"
              value={q}
              onChange={(e) => update("q", e.target.value)}
              placeholder="Por ejemplo: libre deuda"
              autoComplete="off"
              className="h-12 w-full min-w-0 rounded-lg border border-ink-3 bg-surface pr-3 pl-11 text-base text-ink placeholder:text-ink-3 sm:h-13 sm:text-lg"
            />
          </div>
        </form>
      </PageIntro>

      <div className="container-page grid grid-cols-[minmax(0,1fr)] gap-6 py-8 sm:py-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
        {/* Filtros */}
        <aside aria-label="Filtros" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <button
            type="button"
            aria-expanded={filtrosAbiertos}
            aria-controls="tramites-filtros"
            onClick={() => setFiltrosAbiertos((o) => !o)}
            className={buttonClass({ variant: "secondary", className: "w-full lg:hidden" })}
          >
            <span className="inline-flex items-center gap-2">
              <SlidersHorizontal aria-hidden="true" />
              Filtrar
              {filtrosActivos ? (
                <span className="rounded-md bg-ink px-1.5 text-xs leading-5 font-semibold text-bg tabular">
                  {filtrosActivos}
                  <span className="sr-only"> {filtrosActivos === 1 ? "filtro activo" : "filtros activos"}</span>
                </span>
              ) : null}
            </span>
            <ChevronDown className={clsx("ml-auto transition-transform", filtrosAbiertos && "rotate-180")} aria-hidden="true" />
          </button>

          <div
            id="tramites-filtros"
            className={clsx(
              "mt-5 border-b border-line pb-6 lg:mt-0 lg:block lg:border-b-0 lg:pb-0",
              filtrosAbiertos ? "block" : "hidden",
            )}
          >
            <fieldset>
              <legend className={LEGEND}>Impuesto</legend>
              <div className="flex flex-wrap gap-2">
                <FilterChip active={!impuesto} onClick={() => update("impuesto", null)}>
                  Todos
                </FilterChip>
                {IMPUESTOS.map((i) => (
                  <FilterChip key={i.slug} active={impuesto === i.slug} onClick={() => update("impuesto", i.slug)}>
                    {i.corto}
                  </FilterChip>
                ))}
                <FilterChip active={impuesto === "general"} onClick={() => update("impuesto", "general")}>
                  Generales
                </FilterChip>
              </div>
            </fieldset>

            <div className="mt-6 border-t border-line pt-5">
              <fieldset>
                <legend className={LEGEND}>Perfil</legend>
                <div className="flex flex-wrap gap-2">
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
            </div>

            <div className="mt-6 border-t border-line pt-5">
              <fieldset>
                <legend className={LEGEND}>Canal</legend>
                <label className="flex cursor-pointer items-start gap-3 text-ink-2 hover:text-ink">
                  <input
                    type="checkbox"
                    checked={soloOnline}
                    onChange={(e) => update("online", e.target.checked ? "1" : null)}
                    className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[var(--brand)]"
                  />
                  <span>Sólo trámites en línea</span>
                </label>
              </fieldset>
            </div>
          </div>
        </aside>

        {/* Resultados */}
        <section aria-labelledby="resultados-titulo" className="min-w-0">
          <div className="flex min-h-9 flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <h2 id="resultados-titulo" className="text-lg font-bold text-ink [overflow-wrap:anywhere]" aria-live="polite">
              <span className="tabular">{results.length}</span> {results.length === 1 ? "trámite" : "trámites"}
              {q.trim() ? (
                <span className="font-normal text-ink-3">
                  {" "}
                  para “<span className="font-semibold text-ink">{q.trim()}</span>”
                </span>
              ) : null}
            </h2>
            {hasFilters && results.length ? (
              <Button variant="subtle" size="sm" onClick={limpiar}>
                <X aria-hidden="true" />
                Limpiar filtros
              </Button>
            ) : null}
          </div>

          {results.length ? (
            <LinkList
              className="mt-4 border-b border-line"
              items={results.map((t) => ({
                key: t.id,
                href: t.href,
                title: t.titulo,
                description: <span className="prose-measure block">{t.descripcion}</span>,
                meta: (
                  <>
                    <Badge>{impuestoNombre(t.impuesto)}</Badge>
                    <Badge tone={t.canal === "presencial" ? "warn" : "ok"}>{CANAL_LABEL[t.canal]}</Badge>
                    {t.requiereClave ? <Badge tone="info">Clave fiscal</Badge> : null}
                  </>
                ),
              }))}
            />
          ) : (
            <div className="mt-4 border-t border-line pt-6">
              <p className="text-lg font-semibold text-ink [overflow-wrap:anywhere]">
                {q.trim() && !filtrosActivos
                  ? `No encontramos trámites para “${q.trim()}”.`
                  : q.trim()
                    ? "No encontramos trámites con esa búsqueda y esos filtros."
                    : "No hay trámites con esa combinación de filtros."}
              </p>
              <p className="mt-3 text-ink-2">Podés probar:</p>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-ink-2 marker:text-ink-3">
                {q.trim() ? (
                  <>
                    <li>revisar cómo escribiste la búsqueda;</li>
                    <li>usar menos palabras o palabras más generales, como “certificado” o “pago”;</li>
                  </>
                ) : null}
                {filtrosActivos ? <li>quitar algún filtro;</li> : null}
                <li>ver la lista completa de trámites.</li>
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Button variant="secondary" onClick={limpiar}>
                  Ver todos los trámites
                </Button>
                <p className="text-ink-2">
                  ¿No encontrás lo que buscás?{" "}
                  <Link to="/atencion" className="link font-semibold">
                    Consultá al Centro de Atención
                  </Link>
                </p>
              </div>
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
        "inline-flex h-9 items-center rounded-full px-3.5 text-sm font-medium transition-colors",
        active ? "bg-ink text-bg" : "bg-surface text-ink-2 ring-1 ring-line-strong ring-inset hover:bg-surface-2 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
