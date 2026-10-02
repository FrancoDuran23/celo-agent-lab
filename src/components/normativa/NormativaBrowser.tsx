import { useId, useMemo, type ReactNode } from "react";
import { useSearchParams } from "react-router";
import { ArrowDownWideNarrow, ArrowUpRight, Search, SearchX, X } from "lucide-react";
import clsx from "clsx";
import type { Norma } from "../../data/types";
import { Icon } from "../../lib/icons";
import { Highlight, NewTabHint, TemaBadge, TipoBadge } from "./bits";
import { byRecency, DOT, matchesTerms, normaLabel, numeroLabel, queryTerms, TEMAS, TIPOS } from "./utils";

/**
 * Buscador de normas: texto libre (sin tildes), filtros por tipo y tema
 * sincronizados con la URL (?q=&tipo=&tema=) y resultados agrupados por año.
 */
export function NormativaBrowser({ normas, headingId }: { normas: Norma[]; headingId: string }) {
  const [params, setParams] = useSearchParams();
  const inputId = useId();
  const q = params.get("q") ?? "";
  const tipoParam = params.get("tipo") ?? "";
  const temaParam = params.get("tema") ?? "";
  const tipo = TIPOS.find((t) => t.id === tipoParam);
  const tema = TEMAS.find((t) => t.id === temaParam);

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true, preventScrollReset: true });
  };
  const clearAll = () => setParams(new URLSearchParams(), { replace: true, preventScrollReset: true });

  const terms = useMemo(() => queryTerms(q), [q]);

  const { results, tipoCounts, temaCounts } = useMemo(() => {
    const base = normas.filter((n) => matchesTerms(n, terms));
    const tipoCounts = new Map<string, number>();
    const temaCounts = new Map<string, number>();
    for (const n of base) {
      if (!tema || n.tema === tema.id) tipoCounts.set(n.tipo, (tipoCounts.get(n.tipo) ?? 0) + 1);
      if (!tipo || n.tipo === tipo.tipo) temaCounts.set(n.tema, (temaCounts.get(n.tema) ?? 0) + 1);
    }
    const results = base
      .filter((n) => (!tipo || n.tipo === tipo.tipo) && (!tema || n.tema === tema.id))
      .sort(byRecency);
    return { results, tipoCounts, temaCounts };
  }, [normas, terms, tipo, tema]);

  const groups = useMemo(() => {
    const out: { anio: number; items: Norma[] }[] = [];
    for (const n of results) {
      const last = out[out.length - 1];
      if (last && last.anio === n.anio) last.items.push(n);
      else out.push({ anio: n.anio, items: [n] });
    }
    return out;
  }, [results]);

  const hasFilters = Boolean(q.trim() || tipo || tema);
  const sumTipo = [...tipoCounts.values()].reduce((a, b) => a + b, 0);
  const sumTema = [...temaCounts.values()].reduce((a, b) => a + b, 0);

  return (
    <div>
      <form role="search" aria-label="Buscar normas" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-ink-2">
          Buscá por número, título o tema
        </label>
        <div className="flex items-center gap-3 rounded-2xl bg-surface px-4 shadow-soft ring-1 ring-line focus-within:ring-2 focus-within:ring-focus">
          <Search className="size-5 shrink-0 text-ink-3" aria-hidden="true" />
          <input
            id={inputId}
            type="search"
            value={q}
            onChange={(e) => update("q", e.target.value)}
            placeholder="Ej.: 1767, facilidades, sellos…"
            autoComplete="off"
            spellCheck={false}
            className="h-13 min-w-0 flex-1 bg-transparent text-base placeholder:text-ink-3 focus:outline-none sm:text-lg"
          />
        </div>
      </form>

      <div className="mt-6 grid gap-5">
        <fieldset className="min-w-0">
          <legend className="eyebrow mb-1.5">Tipo de norma</legend>
          <div className={CHIP_ROW}>
            <Chip active={!tipo} count={sumTipo} onClick={() => update("tipo", null)}>
              Todos
            </Chip>
            {TIPOS.map((t) => (
              <Chip
                key={t.id}
                active={tipo?.id === t.id}
                count={tipoCounts.get(t.tipo) ?? 0}
                onClick={() => update("tipo", tipo?.id === t.id ? null : t.id)}
              >
                <span className={clsx("size-2 rounded-full", DOT[t.color])} aria-hidden="true" />
                {t.label}
              </Chip>
            ))}
          </div>
        </fieldset>
        <fieldset className="min-w-0">
          <legend className="eyebrow mb-1.5">Tema</legend>
          <div className={CHIP_ROW}>
            <Chip active={!tema} count={sumTema} onClick={() => update("tema", null)}>
              Todos
            </Chip>
            {TEMAS.map((t) => (
              <Chip
                key={t.id}
                active={tema?.id === t.id}
                count={temaCounts.get(t.id) ?? 0}
                onClick={() => update("tema", tema?.id === t.id ? null : t.id)}
              >
                <Icon name={t.icon} className="size-4" />
                {t.label}
              </Chip>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line pb-4">
        <p role="status" aria-live="polite" aria-atomic="true" className="text-sm text-ink-3">
          <span className="font-semibold text-ink tabular">{results.length}</span>{" "}
          {results.length === 1 ? "norma" : "normas"}
          {hasFilters ? (
            <>
              {" "}
              de <span className="tabular">{normas.length}</span>
            </>
          ) : null}
          {q.trim() ? (
            <>
              {" "}
              para “<span className="text-ink">{q.trim()}</span>”
            </>
          ) : null}
        </p>
        <div className="flex items-center gap-3">
          <p className="hidden items-center gap-1.5 text-xs text-ink-3 sm:inline-flex">
            <ArrowDownWideNarrow className="size-4" aria-hidden="true" />
            De la más reciente a la más antigua
          </p>
          {hasFilters ? (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-ink-2 ring-1 ring-line transition-colors hover:bg-surface-2 hover:text-ink"
            >
              <X className="size-4" aria-hidden="true" />
              Limpiar filtros
            </button>
          ) : null}
        </div>
      </div>

      {results.length ? (
        <div className="mt-2">
          {groups.map((g) => (
            <section
              key={g.anio}
              aria-labelledby={`${headingId}-${g.anio}`}
              className="grid gap-3 pt-6 md:grid-cols-[4.5rem_minmax(0,1fr)] md:gap-5 md:pt-7"
            >
              <h3
                id={`${headingId}-${g.anio}`}
                className="flex items-baseline gap-3 px-1 md:sticky md:top-24 md:flex-col md:gap-0.5 md:self-start md:px-0 md:pt-3.5"
              >
                <span className="font-mono text-lg font-semibold tracking-tight text-ink tabular md:text-xl">{g.anio}</span>
                <span className="h-px flex-1 translate-y-[-0.3em] bg-line md:hidden" aria-hidden="true" />
                <span className="text-xs text-ink-3">
                  <span className="tabular">{g.items.length}</span> {g.items.length === 1 ? "norma" : "normas"}
                </span>
              </h3>
              <ul className="overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
                {g.items.map((n) => (
                  <NormaRow key={n.tipo + n.numero + n.anio} norma={n} terms={terms} />
                ))}
              </ul>
            </section>
          ))}
          <p className="mt-6 px-1 text-sm leading-relaxed text-ink-3">
            Esta es una selección de normas de referencia. Los enlaces llevan a la sección del sitio oficial de Rentas
            donde se publica cada tipo de norma, para que consultes el texto completo.
          </p>
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-line-strong px-6 py-14 text-center">
          <SearchX className="mx-auto size-10 text-ink-3" aria-hidden="true" />
          <p className="mt-4 text-lg font-semibold text-ink">No encontramos normas con esos filtros.</p>
          <p className="mx-auto mt-1 max-w-md text-ink-3">
            Probá con otras palabras, revisá el número o limpiá los filtros. También podés buscar en los repositorios
            oficiales.
          </p>
          {hasFilters ? (
            <button
              type="button"
              onClick={clearAll}
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-surface px-4 text-sm font-medium text-ink ring-1 ring-line-strong transition-colors hover:bg-surface-2"
            >
              <X className="size-4" aria-hidden="true" />
              Limpiar filtros
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

function NormaRow({ norma: n, terms }: { norma: Norma; terms: string[] }) {
  return (
    <li className="group relative grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 border-t border-line px-4 py-4 transition-colors first:border-t-0 hover:bg-surface-2/60 has-[a:focus-visible]:bg-surface-2/60 sm:gap-x-5 sm:px-5">
      <div className="col-span-2 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 sm:col-span-1">
        <TipoBadge tipo={n.tipo} />
        <span className="font-mono text-[0.8rem] text-ink-2 tabular">{numeroLabel(n)}</span>
        <span className="hidden sm:contents">
          <span className="text-line-strong" aria-hidden="true">
            ·
          </span>
          <TemaBadge tema={n.tema} />
        </span>
      </div>
      <div className="col-start-1 row-start-2 mt-2 min-w-0">
        <p className="leading-snug font-medium text-ink">
          <Highlight text={n.titulo} terms={terms} />
        </p>
        <div className="mt-2 sm:hidden">
          <TemaBadge tema={n.tema} />
        </div>
      </div>
      {n.href ? (
        <a
          href={n.href}
          target="_blank"
          rel="noopener noreferrer"
          className="col-start-2 row-start-2 inline-flex size-10 shrink-0 items-center justify-center self-center rounded-full text-ink-3 ring-1 ring-line transition-colors group-hover:bg-brand group-hover:text-brand-ink group-hover:ring-brand focus-visible:bg-brand focus-visible:text-brand-ink focus-visible:ring-brand after:absolute after:inset-0 after:content-[''] sm:row-span-2 sm:row-start-1"
        >
          <ArrowUpRight className="size-4.5" aria-hidden="true" />
          <span className="sr-only">
            Ver {normaLabel(n)} en el sitio oficial
            <NewTabHint />
          </span>
        </a>
      ) : null}
    </li>
  );
}

/** En móvil, cada fila de chips se desplaza en horizontal; desde sm, se acomoda en varias líneas. */
const CHIP_ROW =
  "relative -mx-4 flex gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden";

function Chip({
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
        "relative inline-flex h-9 shrink-0 items-center gap-2 rounded-full pr-2.5 pl-3.5 text-sm font-medium whitespace-nowrap transition-colors",
        active
          ? "bg-night-900 text-crema-50 dark:bg-crema-100 dark:text-night-900"
          : clsx("bg-surface ring-1 ring-line hover:bg-surface-2 hover:text-ink", count ? "text-ink-2" : "text-ink-3"),
      )}
    >
      {children}
      <span
        className={clsx(
          "min-w-5 rounded-full px-1.5 py-px text-center text-xs tabular",
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
