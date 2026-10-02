import { useEffect, useMemo, type ReactNode } from "react";
import { useLocation, useSearchParams } from "react-router";
import { Newspaper, X } from "lucide-react";
import clsx from "clsx";
import { NOTICIAS } from "../data/noticias";
import type { Noticia, PaletteColor } from "../data/types";
import { formatMonth, parseISODate } from "../lib/dates";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { Button } from "../components/ui/Button";
import { PageIntro } from "../components/ui/primitives";
import { NoticiaCard } from "../components/noticias/NoticiaCard";
import { NoticiaDestacada } from "../components/noticias/NoticiaDestacada";
import { Seguinos } from "../components/noticias/Seguinos";
import { categoriasDe, ordenarPorFecha, slugCategoria } from "../components/noticias/categorias";

const DOT: Record<PaletteColor, string> = {
  terracota: "bg-terracota-500",
  ocre: "bg-ocre-500",
  rosa: "bg-rosa-500",
  salvia: "bg-salvia-500",
  violeta: "bg-violeta-500",
  night: "bg-night-600",
};

interface Mes {
  clave: string;
  nombre: string;
  anio: string;
  items: Noticia[];
}

/** Agrupa por "YYYY-MM" (la lista ya viene ordenada por fecha desc). */
function agruparPorMes(lista: Noticia[]): Mes[] {
  const meses: Mes[] = [];
  for (const n of lista) {
    const clave = n.fecha.slice(0, 7);
    let mes = meses.at(-1);
    if (!mes || mes.clave !== clave) {
      // formatMonth → "septiembre de 2026"; acá se muestra "Septiembre 2026".
      const [nombre = "", anio = clave.slice(0, 4)] = formatMonth(parseISODate(`${clave}-01`)).split(" de ");
      mes = { clave, nombre: nombre.charAt(0).toUpperCase() + nombre.slice(1), anio, items: [] };
      meses.push(mes);
    }
    mes.items.push(n);
  }
  return meses;
}

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
        eyebrow="Novedades"
        title={
          <>
            Noticias{" "}
            <span className="font-serif font-normal tracking-normal text-brand italic">de Rentas.</span>
          </>
        }
        description="Prórrogas, planes de pago, beneficios y novedades de atención de la Dirección Provincial de Rentas, de la más reciente a la más antigua."
      >
        {categorias.length > 1 ? (
          <div>
            <p id="filtro-titulo" className="eyebrow mb-3">
              Filtrar por categoría
            </p>
            <div role="group" aria-labelledby="filtro-titulo" className="flex flex-wrap gap-2">
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
                  <span aria-hidden="true" className={clsx("size-2 shrink-0 rounded-full", DOT[c.color])} />
                  {c.nombre}
                </FilterChip>
              ))}
            </div>
          </div>
        ) : null}
      </PageIntro>

      <div className="container-page py-12 sm:py-16">
        <p className="sr-only" aria-live="polite">
          {activa ? `${plural(lista.length)} en ${activa.nombre}.` : invalida ? "No hay noticias en esa categoría." : ""}
        </p>

        {invalida || !destacada ? (
          <div className="rounded-3xl border border-dashed border-line-strong px-6 py-16 text-center">
            <Newspaper className="mx-auto size-10 text-ink-3" aria-hidden="true" />
            <p className="mt-4 text-lg font-semibold text-ink">
              {invalida ? `No encontramos noticias en “${pedida}”.` : "Todavía no hay noticias publicadas."}
            </p>
            {invalida ? (
              <>
                <p className="mt-1 text-ink-3">Puede que la categoría haya cambiado de nombre. Elegí otra arriba.</p>
                <Button variant="secondary" className="mt-6" onClick={() => elegir(null)}>
                  <X aria-hidden="true" />
                  Ver todas las noticias
                </Button>
              </>
            ) : null}
          </div>
        ) : (
          <>
            <NoticiaDestacada
              key={destacada.slug}
              noticia={destacada}
              etiqueta={activa ? `Lo más reciente en ${activa.nombre}` : "Lo más reciente"}
              highlighted={objetivo === destacada.slug}
            />

            {meses.length ? (
              <section aria-labelledby="archivo-titulo" className="mt-16 sm:mt-20">
                <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-line pb-5">
                  <div>
                    <p className="eyebrow mb-2">Archivo</p>
                    <h2 id="archivo-titulo" className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                      {activa ? `Más sobre ${activa.nombre}` : "Noticias anteriores"}
                    </h2>
                  </div>
                  <p className="text-sm text-ink-3 tabular">{plural(resto.length)}</p>
                </div>

                <ol className="relative mt-10 ml-1 border-l border-line pl-6 sm:ml-2 sm:pl-10">
                  {meses.map((mes) => (
                    <li
                      key={mes.clave}
                      className="grid gap-5 pb-14 last:pb-2 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-10"
                    >
                      <div className="relative lg:sticky lg:top-28 lg:self-start lg:pt-1">
                        <span
                          aria-hidden="true"
                          className="absolute top-3 -left-[calc(1.5rem+5.5px)] size-2.5 rounded-full bg-brand ring-4 ring-bg sm:-left-[calc(2.5rem+5.5px)]"
                        />
                        <h3 className="flex items-baseline gap-3 lg:flex-col lg:gap-1">
                          <span className="font-serif text-3xl leading-none text-ink italic sm:text-4xl">
                            {mes.nombre}
                          </span>{" "}
                          <span className="font-mono text-sm tracking-[0.14em] text-ink-3 tabular">{mes.anio}</span>
                        </h3>
                        <p className="mt-1 text-sm text-ink-3 lg:mt-3">{plural(mes.items.length)}</p>
                      </div>
                      <ul className="grid gap-4">
                        {mes.items.map((n) => (
                          <li key={n.slug}>
                            <NoticiaCard
                              id={n.slug}
                              noticia={n}
                              layout="row"
                              headingAs="h4"
                              highlighted={objetivo === n.slug}
                            />
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </section>
            ) : activa ? (
              <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-surface-2/70 px-5 py-4 ring-1 ring-line">
                <p className="text-ink-2">Por ahora es la única noticia en {activa.nombre}.</p>
                <Button variant="ghost" size="sm" onClick={() => elegir(null)}>
                  Ver todas las noticias
                </Button>
              </div>
            ) : null}
          </>
        )}
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
      className={clsx(
        "inline-flex h-10 items-center gap-2 rounded-full pr-2 pl-3.5 text-sm font-medium transition-colors",
        active
          ? "bg-night-900 text-crema-50 dark:bg-crema-100 dark:text-night-900"
          : "bg-surface text-ink-2 ring-1 ring-line hover:bg-surface-2 hover:text-ink",
      )}
    >
      {children}
      <span
        className={clsx(
          "inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs tabular",
          active ? "bg-white/15 dark:bg-night-900/10" : "bg-surface-2 text-ink-3",
        )}
      >
        <span className="sr-only">(</span>
        {count}
        <span className="sr-only">)</span>
      </span>
    </button>
  );
}
