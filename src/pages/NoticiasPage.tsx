import { useEffect, useMemo, type ReactNode } from "react";
import { useLocation, useSearchParams } from "react-router";
import { NOTICIAS } from "../data/noticias";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { Button, chipClass, chipRowClass, revelarChip } from "../components/ui/Button";
import { PageIntro } from "../components/ui/primitives";
import { NoticiaDestacada } from "../components/noticias/NoticiaDestacada";
import { NoticiaItem } from "../components/noticias/NoticiaItem";
import { Seguinos } from "../components/noticias/Seguinos";
import { agruparPorMes, categoriasDe, ordenarPorFecha, slugCategoria } from "../components/noticias/categorias";

const plural = (n: number) => (n === 1 ? "1 noticia" : `${n} noticias`);

export function NoticiasPage() {
  useDocumentTitle("Noticias");
  const [params, setParams] = useSearchParams();
  const { hash } = useLocation();

  const categorias = useMemo(() => categoriasDe(NOTICIAS), []);
  const ordenadas = useMemo(() => ordenarPorFecha(NOTICIAS), []);

  const pedida = params.get("categoria") ?? "";
  const activa = pedida ? categorias.find((c) => c.slug === slugCategoria(pedida)) : undefined;
  const invalida = Boolean(pedida) && !activa;

  const lista = useMemo(
    () => (activa ? ordenadas.filter((n) => slugCategoria(n.categoria) === activa.slug) : invalida ? [] : ordenadas),
    [activa, invalida, ordenadas],
  );
  const [destacada, ...resto] = lista;
  const meses = agruparPorMes(resto);
  const objetivo = hash ? decodeURIComponent(hash.slice(1)) : "";

  // Al llegar desde la portada (/noticias#slug), ScrollRestoration inicia un
  // desplazamiento suave mientras la página recién se monta y Chromium lo
  // descarta. Lo repetimos un cuadro después, ya con el layout estable.
  useEffect(() => {
    if (!objetivo) return;
    const raf = requestAnimationFrame(() => document.getElementById(objetivo)?.scrollIntoView({ block: "start" }));
    return () => cancelAnimationFrame(raf);
  }, [objetivo]);

  const elegir = (slug: string | null) => {
    const next = new URLSearchParams(params);
    if (slug) next.set("categoria", slug);
    else next.delete("categoria");
    setParams(next, { replace: true, preventScrollReset: true });
  };

  return (
    <>
      <PageIntro
        title="Noticias"
        breadcrumbs={[{ label: "Noticias" }]}
        description="Prórrogas, planes de pago, beneficios y novedades de atención de la Dirección Provincial de Rentas, de la más reciente a la más antigua."
      />

      <div className="container-page grid grid-cols-[minmax(0,1fr)] gap-8 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_18rem]">
        {categorias.length > 1 ? (
          <aside
            aria-labelledby="filtro-titulo"
            className="min-w-0 lg:sticky lg:top-28 lg:col-start-2 lg:row-start-1 lg:self-start"
          >
            <h2 id="filtro-titulo" className="mb-3 font-semibold text-ink">
              Filtrar por categoría
            </h2>
            <div role="group" aria-labelledby="filtro-titulo" className={chipRowClass}>
              <FilterChip active={!activa && !invalida} count={NOTICIAS.length} onClick={() => elegir(null)}>
                Todas
              </FilterChip>
              {categorias.map((c) => (
                <FilterChip
                  key={c.slug}
                  active={activa?.slug === c.slug}
                  count={c.cantidad}
                  onClick={() => elegir(c.slug)}
                >
                  {c.nombre}
                </FilterChip>
              ))}
            </div>
          </aside>
        ) : null}

        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <p role="status" aria-live="polite" aria-atomic="true" className="mb-6 text-ink-2">
            {invalida ? (
              "No hay noticias en esa categoría."
            ) : (
              <>
                <span className="font-semibold text-ink tabular">{plural(lista.length)}</span>
                {activa ? <> en {activa.nombre}</> : null}
              </>
            )}
          </p>

          {invalida || !destacada ? (
            <div className="border-y border-line py-10">
              <h2 className="text-xl font-bold text-ink">
                {invalida ? (
                  <>
                    No encontramos noticias en “<span className="[overflow-wrap:anywhere]">{pedida}</span>”
                  </>
                ) : (
                  "Todavía no hay noticias publicadas"
                )}
              </h2>
              {invalida ? (
                <>
                  <p className="mt-2 text-ink-2">Puede que la categoría haya cambiado de nombre. Elegí otra de la lista.</p>
                  <Button variant="secondary" className="mt-5" onClick={() => elegir(null)}>
                    Ver todas las noticias
                  </Button>
                </>
              ) : null}
            </div>
          ) : (
            <>
              <NoticiaDestacada key={destacada.slug} noticia={destacada} highlighted={objetivo === destacada.slug} />

              {meses.map((mes) => (
                <section key={mes.clave} aria-labelledby={`mes-${mes.clave}`} className="mt-12 sm:mt-14">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h2 id={`mes-${mes.clave}`} className="text-xl font-bold text-ink sm:text-2xl">
                      {mes.titulo}
                    </h2>
                    <p className="text-sm text-ink-3 tabular">{plural(mes.items.length)}</p>
                  </div>
                  <ul className="mt-3 border-b border-line">
                    {mes.items.map((n) => (
                      <NoticiaItem key={n.slug} noticia={n} highlighted={objetivo === n.slug} />
                    ))}
                  </ul>
                </section>
              ))}

              {!meses.length && activa ? (
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-surface-2 px-5 py-4">
                  <p className="text-ink-2">Por ahora es la única noticia en {activa.nombre}.</p>
                  <Button variant="secondary" size="sm" onClick={() => elegir(null)}>
                    Ver todas las noticias
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      <Seguinos />
    </>
  );
}

function FilterChip({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean;
  count: number;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      onFocus={revelarChip}
      className={chipClass(active, "gap-2")}
    >
      {children}
      <span className={active ? "text-xs text-bg/75 tabular" : "text-xs text-ink-3 tabular"}>
        <span className="sr-only">(</span>
        {count}
        <span className="sr-only">)</span>
      </span>
    </button>
  );
}
