import { CalendarCheck2, CalendarSearch } from "lucide-react";
import clsx from "clsx";
import type { Vencimiento } from "../../data/types";
import { daysBetween, formatLong, parseISODate, relativeDays } from "../../lib/dates";
import { AddToCalendarButton } from "./AddToCalendar";
import { CountdownChip, ImpuestoTag } from "./bits";
import { DOT, capitalize, impuestoMeta, monthName, pluralVenc, vencKey, weekdayShort } from "./utils";

interface Props {
  selected: string | null;
  view: Date;
  hoy: Date;
  byDate: Map<string, Vencimiento[]>;
  /** Nombre del impuesto filtrado, si hay filtro. */
  filtro: string | null;
  onSelect: (iso: string) => void;
}

/** Detalle del día elegido en la grilla, o un resumen del mes. */
export function DayPanel({ selected, view, hoy, byDate, filtro, onSelect }: Props) {
  const viewKey = `${view.getFullYear()}-${String(view.getMonth() + 1).padStart(2, "0")}`;
  const monthDates = [...byDate.keys()].filter((iso) => iso.startsWith(viewKey)).sort();
  const monthCount = monthDates.reduce((n, iso) => n + (byDate.get(iso)?.length ?? 0), 0);
  const deFiltro = filtro ? ` de ${filtro}` : "";

  const items = selected ? (byDate.get(selected) ?? []) : [];
  const dias = selected ? daysBetween(hoy, parseISODate(selected)) : 0;

  return (
    <div className="flex h-full flex-col rounded-3xl bg-surface p-5 ring-1 ring-line sm:p-6">
      <div aria-live="polite" aria-atomic="true">
        <p className="eyebrow">{selected ? "Día seleccionado" : "Este mes"}</p>
        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h4 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
            {selected ? capitalize(formatLong(selected)) : `${monthName(view)} ${view.getFullYear()}`}
          </h4>
          <p className="text-sm text-ink-3">
            {selected
              ? items.length
                ? `${pluralVenc(items.length)}${deFiltro} · ${relativeDays(selected, hoy)}`
                : `Sin vencimientos${deFiltro}`
              : monthCount
                ? `${pluralVenc(monthCount)}${deFiltro}`
                : `Sin vencimientos${deFiltro} cargados`}
          </p>
        </div>
      </div>

      {selected && items.length ? (
        <ul className="mt-4 space-y-2.5">
          {items.map((v) => {
            const m = impuestoMeta(v.impuesto);
            return (
              <li key={vencKey(v)} className="relative overflow-hidden rounded-2xl bg-surface-2/70 p-4 pl-5 ring-1 ring-line">
                <span aria-hidden="true" className={clsx("absolute inset-y-3 left-0 w-1 rounded-r-full", DOT[m.color])} />
                <p className="font-semibold text-ink">{v.titulo}</p>
                {v.detalle ? <p className="mt-0.5 text-sm text-ink-3">{v.detalle}</p> : null}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <ImpuestoTag slug={v.impuesto} />
                  {dias >= 0 ? (
                    <AddToCalendarButton
                      items={[v]}
                      srContext={`${v.titulo}${v.detalle ? `, ${v.detalle}` : ""}, ${formatLong(v.fecha)}`}
                      className="ml-auto"
                    />
                  ) : (
                    <CountdownChip text="Ya venció" tone="past" />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-4 flex flex-1 flex-col">
          <p className="flex items-start gap-3 text-sm leading-relaxed text-ink-3">
            {selected ? (
              <CalendarCheck2 className="mt-0.5 size-5 shrink-0 text-ok" aria-hidden="true" />
            ) : (
              <CalendarSearch className="mt-0.5 size-5 shrink-0 text-ink-3" aria-hidden="true" />
            )}
            <span>
              {selected
                ? monthDates.length
                  ? "Este día no vence nada. Elegí uno de los días marcados con puntos de color:"
                  : `Este día no vence nada, y no hay otros vencimientos${deFiltro} cargados en ${monthName(view).toLowerCase()}.`
                : monthDates.length
                  ? "Elegí un día marcado para ver qué vence:"
                  : `No hay vencimientos${deFiltro} cargados en ${monthName(view).toLowerCase()}. Probá con otro mes u otro impuesto.`}
            </span>
          </p>
          {monthDates.length ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {monthDates.map((iso) => {
                const list = byDate.get(iso) ?? [];
                const d = parseISODate(iso);
                const past = daysBetween(hoy, d) < 0;
                return (
                  <li key={iso}>
                    <button
                      type="button"
                      onClick={() => onSelect(iso)}
                      aria-label={`${capitalize(formatLong(iso))}, ${pluralVenc(list.length)}`}
                      className={clsx(
                        "inline-flex items-center gap-2 rounded-full bg-surface py-1.5 pr-3.5 pl-2 text-sm font-medium ring-1 ring-line transition-colors hover:bg-surface-2",
                        past ? "text-ink-3" : "text-ink",
                      )}
                    >
                      <span className="inline-flex size-7 items-center justify-center rounded-full bg-surface-2 text-xs font-semibold tabular ring-1 ring-line">
                        {d.getDate()}
                      </span>
                      <span className="capitalize">{weekdayShort(d)}</span>
                      <span aria-hidden="true" className="flex gap-[3px]">
                        {list.slice(0, 3).map((v) => (
                          <span
                            key={vencKey(v)}
                            className={clsx("size-1.5 rounded-full", DOT[impuestoMeta(v.impuesto).color], past && "opacity-45")}
                          />
                        ))}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      )}
    </div>
  );
}
