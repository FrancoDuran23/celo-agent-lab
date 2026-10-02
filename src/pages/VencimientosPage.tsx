import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { VENCIMIENTOS } from "../data/vencimientos";
import { IMPUESTOS } from "../data/impuestos";
import type { ImpuestoSlug } from "../data/types";
import { parseISODate, today } from "../lib/dates";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { PageIntro } from "../components/ui/primitives";
import { AnnounceProvider } from "../components/vencimientos/AddToCalendar";
import { MonthCalendar } from "../components/vencimientos/MonthCalendar";
import { DayPanel } from "../components/vencimientos/DayPanel";
import { Agenda } from "../components/vencimientos/Agenda";
import { NextDue } from "../components/vencimientos/NextDue";
import { DeudaHelp, FechasNotice, ImpuestoFilter } from "../components/vencimientos/Extras";
import { calendarioNombre } from "../components/vencimientos/ics";
import {
  DOT,
  type ImpuestoMeta,
  groupByDate,
  impuestoMeta,
  sameMonth,
  sortByFecha,
  startOfMonth,
  toISO,
} from "../components/vencimientos/utils";

export function VencimientosPage() {
  useDocumentTitle("Calendario de vencimientos");

  const hoy = useMemo(() => today(), []);
  const hoyISO = toISO(hoy);
  const all = useMemo(() => sortByFecha(VENCIMIENTOS), []);
  const calendario = calendarioNombre(all);

  // Impuestos presentes en los datos, en el orden de IMPUESTOS.
  const impuestos = useMemo(() => {
    const present = new Set(all.map((v) => v.impuesto));
    const ordered = IMPUESTOS.filter((i) => present.has(i.slug)).map((i) => impuestoMeta(i.slug));
    const extra = [...present].filter((s) => !IMPUESTOS.some((i) => i.slug === s)).map(impuestoMeta);
    return [...ordered, ...extra];
  }, [all]);
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const v of all) m.set(v.impuesto, (m.get(v.impuesto) ?? 0) + 1);
    return m;
  }, [all]);

  // Filtro en la URL (?impuesto=slug) para poder compartirlo o enlazarlo.
  const [params, setParams] = useSearchParams();
  const raw = params.get("impuesto");
  const filtro = impuestos.some((i) => i.slug === raw) ? (raw as ImpuestoSlug) : null;
  const filtroNombre = filtro ? impuestoMeta(filtro).corto : null;
  const setFiltro = (slug: string | null) => {
    const next = new URLSearchParams(params);
    if (slug) next.set("impuesto", slug);
    else next.delete("impuesto");
    setParams(next, { replace: true, preventScrollReset: true });
  };

  const items = useMemo(() => (filtro ? all.filter((v) => v.impuesto === filtro) : all), [all, filtro]);
  const byDate = useMemo(() => groupByDate(items), [items]);

  // Próxima fecha (respeta el filtro) y todos sus vencimientos.
  const nextISO = items.find((v) => v.fecha >= hoyISO)?.fecha ?? null;
  const nextItems = nextISO ? items.filter((v) => v.fecha === nextISO) : [];

  // Meses navegables: desde el primero con datos (o el actual) hasta el último.
  const minMonth = startOfMonth(all.length ? new Date(Math.min(parseISODate(all[0]!.fecha).getTime(), hoy.getTime())) : hoy);
  const maxMonth = startOfMonth(
    all.length ? new Date(Math.max(parseISODate(all[all.length - 1]!.fecha).getTime(), hoy.getTime())) : hoy,
  );

  const [view, setView] = useState(() => startOfMonth(hoy));
  const [selected, setSelected] = useState<string | null>(() => {
    const first = all.find((v) => v.fecha >= hoyISO)?.fecha;
    return first && sameMonth(parseISODate(first), hoy) ? first : null;
  });
  const [focusRequest, setFocusRequest] = useState(0);
  const calendarRef = useRef<HTMLDivElement>(null);

  const changeView = (month: Date) => {
    setView(month);
    if (selected && !sameMonth(parseISODate(selected), month)) setSelected(null);
  };

  const selectDay = (iso: string) => {
    setSelected(iso);
    const month = startOfMonth(parseISODate(iso));
    if (!sameMonth(month, view)) setView(month);
  };

  const showInCalendar = (iso: string) => {
    selectDay(iso);
    setFocusRequest((n) => n + 1);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    calendarRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <AnnounceProvider>
      <PageIntro
        eyebrow="Agenda fiscal"
        title={
          <>
            Calendario de{" "}
            <span className="font-serif font-normal tracking-normal text-brand italic">vencimientos</span>
          </>
        }
        description="Consultá cuándo vence cada impuesto provincial, filtrá por lo que pagás y sumá las fechas a tu calendario para que no se te pase ninguna."
      >
        <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr] lg:gap-5">
          <NextDue items={nextItems} hoy={hoy} filtro={filtroNombre} onShow={showInCalendar} />
          <FechasNotice calendario={calendario} />
        </div>
      </PageIntro>

      <section aria-labelledby="calendario-titulo" className="container-page py-14 sm:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow mb-3">{calendario}</p>
          <h2 id="calendario-titulo" className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Todas las fechas,{" "}
            <span className="font-serif font-normal tracking-normal text-brand italic">mes a mes.</span>
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-3 sm:text-lg">
            Elegí un día para ver qué vence. Si filtrás por impuesto, el calendario y la agenda se actualizan juntos.
          </p>
        </div>

        <div className="mt-8">
          <ImpuestoFilter
            impuestos={impuestos}
            counts={counts}
            total={all.length}
            value={filtro}
            onChange={setFiltro}
          />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,27rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,29rem)_minmax(0,1fr)] xl:gap-12">
          <div className="grid content-start gap-4 md:grid-cols-2 lg:grid-cols-1">
            <div ref={calendarRef} className="scroll-mt-24 rounded-3xl bg-surface p-4 ring-1 ring-line sm:p-6">
              <MonthCalendar
                view={view}
                onViewChange={changeView}
                min={minMonth}
                max={maxMonth}
                hoy={hoy}
                byDate={byDate}
                selected={selected}
                onSelect={selectDay}
                focusRequest={focusRequest}
              />
              <Legend impuestos={filtro ? impuestos.filter((i) => i.slug === filtro) : impuestos} />
            </div>
            <DayPanel
              selected={selected}
              view={view}
              hoy={hoy}
              byDate={byDate}
              filtro={filtroNombre}
              onSelect={selectDay}
            />
          </div>

          <Agenda items={items} hoy={hoy} filtro={filtroNombre} />
        </div>
      </section>

      <DeudaHelp />
    </AnnounceProvider>
  );
}

function Legend({ impuestos }: { impuestos: ImpuestoMeta[] }) {
  return (
    <ul aria-label="Referencias" className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-4 text-xs text-ink-3">
      {impuestos.map((i) => (
        <li key={i.slug} className="inline-flex items-center gap-1.5">
          <LegendDot className={DOT[i.color]} />
          {i.corto}
        </li>
      ))}
      <li className="inline-flex items-center gap-1.5">
        <span aria-hidden="true" className="size-3 rounded-[4px] bg-brand-soft ring-1 ring-brand/50 ring-inset" />
        Hoy
      </li>
      <li className="inline-flex items-center gap-1.5">
        <span aria-hidden="true" className="size-3 rounded-[4px] bg-night-900 dark:bg-crema-100" />
        Día elegido
      </li>
    </ul>
  );
}

function LegendDot({ className }: { className: string }) {
  return <span aria-hidden="true" className={`size-2 rounded-full ${className}`} />;
}
