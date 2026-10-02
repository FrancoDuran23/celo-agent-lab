import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { VENCIMIENTOS } from "../data/vencimientos";
import { IMPUESTOS } from "../data/impuestos";
import type { ImpuestoSlug } from "../data/types";
import { parseISODate, today } from "../lib/dates";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { PageIntro, Panel, SectionHeader } from "../components/ui/primitives";
import { Mark } from "../components/vencimientos/bits";
import { AnnounceProvider } from "../components/vencimientos/AddToCalendar";
import { MonthCalendar } from "../components/vencimientos/MonthCalendar";
import { DayPanel } from "../components/vencimientos/DayPanel";
import { Agenda } from "../components/vencimientos/Agenda";
import { NextDue } from "../components/vencimientos/NextDue";
import { DeudaHelp, FechasNotice, ImpuestoFilter } from "../components/vencimientos/Extras";
import { calendarioNombre } from "../components/vencimientos/ics";
import {
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
    // Debajo de md todo va apilado: la tarjeta de arriba y el comienzo de la agenda ya muestran el próximo
    // vencimiento, así que se arranca sin día elegido para no repetirlo una tercera vez en el detalle del día.
    if (!window.matchMedia("(min-width: 48rem)").matches) return null;
    const first = items.find((v) => v.fecha >= hoyISO)?.fecha;
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
        title="Calendario de vencimientos"
        description="Consultá cuándo vence cada impuesto provincial, filtrá por lo que pagás y sumá las fechas a tu calendario para que no se te pase ninguna."
        breadcrumbs={[{ label: "Vencimientos" }]}
      />

      <div className="container-page grid grid-cols-[minmax(0,1fr)] gap-6 pt-10 sm:pt-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start lg:gap-8">
        <NextDue items={nextItems} hoy={hoy} filtro={filtroNombre} onShow={showInCalendar} />
        <FechasNotice calendario={calendario} />
      </div>

      <section aria-labelledby="calendario-titulo" className="container-page pt-14 pb-14 sm:pt-16 sm:pb-16">
        <SectionHeader
          id="calendario-titulo"
          title="Todas las fechas"
          description="Elegí un día para ver qué vence. Si filtrás por impuesto, el calendario y la agenda se actualizan juntos."
        />

        <ImpuestoFilter
          className="mt-6"
          impuestos={impuestos}
          counts={counts}
          total={all.length}
          value={filtro}
          onChange={setFiltro}
        />

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] xl:gap-12">
          {/* Desde sm, calendario y detalle del día lado a lado (tablet, celular apaisado); el calendario nunca
              baja de 21.5rem para que las celdas tengan 42px o más. Desde lg pasan a la columna angosta. */}
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-4 sm:grid-cols-[minmax(21.5rem,1.2fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)]">
            {/* El scroll-padding global (5rem) ya deja ~15px bajo el header de 64px; desde lg el header mide 72px. */}
            <div ref={calendarRef} className="min-w-0 lg:scroll-mt-2">
              <Panel className="p-3 sm:p-4 lg:p-5">
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
              </Panel>
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
    <ul aria-label="Referencias" className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-4 text-sm text-ink-3">
      {impuestos.map((i) => (
        <li key={i.slug} className="inline-flex items-center gap-1.5">
          <Mark slug={i.slug} />
          {i.corto}
        </li>
      ))}
      <li className="inline-flex items-center gap-1.5">
        <span aria-hidden="true" className="size-3.5 rounded-[4px] border-2 border-brand" />
        Hoy
      </li>
      <li className="inline-flex items-center gap-1.5">
        <span aria-hidden="true" className="size-3.5 rounded-[4px] bg-ink" />
        Día elegido
      </li>
    </ul>
  );
}
