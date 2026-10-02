import { CalendarCheck2, CalendarSearch } from "lucide-react";
import clsx from "clsx";
import type { Vencimiento } from "../../data/types";
import { daysBetween, formatLong, parseISODate, relativeDays } from "../../lib/dates";
import { Panel } from "../ui/primitives";
import { AddToCalendarButton } from "./AddToCalendar";
import { CountdownChip, ImpuestoTag, Mark } from "./bits";
import { capitalize, monthName, pluralVenc, vencKey, weekdayShort } from "./utils";

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
    <Panel className="flex h-full flex-col p-5 sm:p-6">
      <div aria-live="polite" aria-atomic="true">
        <h3 className="text-lg font-bold text-ink">
          {selected ? capitalize(formatLong(selected)) : `${monthName(view)} ${view.getFullYear()}`}
        </h3>
        <p className="mt-0.5 text-sm text-ink-3 tabular">
          {selected
            ? items.length
              ? `${pluralVenc(items.length)}${deFiltro} · ${relativeDays(selected, hoy)}`
              : `Sin vencimientos${deFiltro}`
            : monthCount
              ? `${pluralVenc(monthCount)}${deFiltro} en el mes`
              : `Sin vencimientos${deFiltro} cargados`}
        </p>
      </div>

      {selected && items.length ? (
        <ul className="mt-4">
          {items.map((v) => (
            <li key={vencKey(v)} className="@container border-t border-line py-4">
              <p className="font-semibold text-ink">{v.titulo}</p>
              {v.detalle ? <p className="text-sm text-ink-3">{v.detalle}</p> : null}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                <ImpuestoTag slug={v.impuesto} />
                {dias >= 0 ? (
                  <AddToCalendarButton
                    items={[v]}
                    appearance="link"
                    label="Agregar al calendario"
                    srContext={`${v.titulo}${v.detalle ? `, ${v.detalle}` : ""}, ${formatLong(v.fecha)}`}
                  />
                ) : (
                  <CountdownChip text="Ya venció" tone="past" />
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 flex flex-1 flex-col">
          <p className="flex items-start gap-2.5 text-[0.95rem] text-ink-2">
            {selected ? (
              <CalendarCheck2 className="mt-0.5 size-5 shrink-0 text-ok" aria-hidden="true" />
            ) : (
              <CalendarSearch className="mt-0.5 size-5 shrink-0 text-ink-3" aria-hidden="true" />
            )}
            <span>
              {selected
                ? monthDates.length
                  ? "Este día no vence nada. Elegí uno de los días marcados:"
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
                        "inline-flex h-9 items-center gap-2 rounded-lg bg-surface px-3 text-sm ring-1 ring-line-strong ring-inset transition-colors hover:bg-surface-2",
                        past ? "text-ink-3" : "text-ink",
                      )}
                    >
                      <span className="font-bold tabular">{d.getDate()}</span>
                      <span>{weekdayShort(d)}</span>
                      <span aria-hidden="true" className={clsx("flex gap-[3px]", past && "opacity-60")}>
                        {list.slice(0, 3).map((v) => (
                          <Mark key={vencKey(v)} slug={v.impuesto} />
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
    </Panel>
  );
}
