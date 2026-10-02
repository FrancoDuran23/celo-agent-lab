import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import type { Vencimiento } from "../../data/types";
import { countdownLabel, daysBetween, formatLong, parseISODate } from "../../lib/dates";
import { AddToCalendarButton } from "./AddToCalendar";
import { CountdownChip, DateBadge, ImpuestoTag } from "./bits";
import { capitalize, groupByDate, groupByMonth, monthName, pluralVenc, vencKey } from "./utils";

interface Props {
  /** Vencimientos ya filtrados. */
  items: readonly Vencimiento[];
  hoy: Date;
  filtro: string | null;
}

/** Lista de vencimientos agrupada por mes; los ya vencidos quedan plegados al final. */
export function Agenda({ items, hoy, filtro }: Props) {
  const withDays = items.map((v) => ({ v, dias: daysBetween(hoy, parseISODate(v.fecha)) }));
  const upcoming = withDays.filter((x) => x.dias >= 0).map((x) => x.v);
  const past = withDays.filter((x) => x.dias < 0).map((x) => x.v);
  const deFiltro = filtro ? ` de ${filtro}` : "";

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-ink">Agenda</h3>
          <p className="mt-0.5 text-sm text-ink-3 tabular" aria-live="polite">
            {upcoming.length
              ? `${pluralVenc(upcoming.length)} ${upcoming.length === 1 ? "próximo" : "próximos"}${deFiltro}`
              : `No hay próximos vencimientos${deFiltro} cargados`}
          </p>
        </div>
        {upcoming.length > 1 ? (
          <AddToCalendarButton
            items={upcoming}
            label="Agregar todos"
            srContext={`${pluralVenc(upcoming.length)} próximos${deFiltro}, en un solo archivo .ics`}
          />
        ) : null}
      </div>

      {upcoming.length ? (
        <div className="mt-6 space-y-8">
          {groupByMonth(upcoming).map((g) => (
            <MonthGroup key={g.key} month={g.month} items={g.items} hoy={hoy} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-xl bg-surface-2 px-5 py-8">
          <p className="font-semibold text-ink">No hay próximos vencimientos{deFiltro} en este calendario.</p>
          <p className="mt-1 text-ink-3">Probá con otro impuesto o revisá el calendario oficial.</p>
        </div>
      )}

      {past.length ? (
        <details className="group mt-8 border-y border-line [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold text-ink select-none hover:text-brand">
            <span>
              Vencimientos anteriores <span className="font-normal text-ink-3 tabular">({past.length})</span>
            </span>
            <ChevronDown
              className="size-5 shrink-0 text-ink-3 transition-transform duration-200 group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <div className="space-y-8 pt-2 pb-6">
            {groupByMonth(past).map((g) => (
              <MonthGroup key={g.key} month={g.month} items={g.items} hoy={hoy} past />
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}

function MonthGroup({
  month,
  items,
  hoy,
  past = false,
}: {
  month: Date;
  items: Vencimiento[];
  hoy: Date;
  past?: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 pb-2">
        <h4 className={clsx("font-bold", past ? "text-ink-2" : "text-ink")}>
          {monthName(month)} <span className="font-normal text-ink-3 tabular">{month.getFullYear()}</span>
        </h4>
        <span className="text-sm text-ink-3 tabular">{pluralVenc(items.length)}</span>
      </div>
      <ol className="border-b border-line">
        {[...groupByDate(items)].map(([fecha, list]) => {
          const dias = daysBetween(hoy, parseISODate(fecha));
          const tone = dias < 0 ? "past" : dias <= 7 ? "soon" : "neutral";
          return (
            <li key={fecha} className="flex gap-4 border-t border-line py-4">
              <DateBadge iso={fecha} tone={tone} />
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-3">
                  <time dateTime={fecha}>{capitalize(formatLong(fecha))}</time>
                  <CountdownChip text={countdownLabel(fecha, hoy)} tone={tone} />
                </p>
                <ul className="mt-2 space-y-3">
                  {list.map((v) => (
                    <li key={vencKey(v)} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                      <div className="min-w-0 flex-1">
                        <p className={clsx("font-semibold", past ? "text-ink-2" : "text-ink")}>{v.titulo}</p>
                        {/* En el celular, detalle e impuesto en líneas separadas: el "·" nunca queda colgando. */}
                        <p className="mt-0.5 flex flex-col items-start gap-1 text-sm text-ink-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2">
                          {v.detalle ? (
                            <>
                              <span>{v.detalle}</span>
                              <span aria-hidden="true" className="max-sm:hidden">
                                ·
                              </span>
                            </>
                          ) : null}
                          <ImpuestoTag slug={v.impuesto} />
                        </p>
                      </div>
                      {!past ? (
                        <AddToCalendarButton
                          items={[v]}
                          appearance="link"
                          label="Agregar"
                          srContext={`${v.titulo}${v.detalle ? `, ${v.detalle}` : ""}, ${formatLong(v.fecha)}`}
                          className="self-start sm:self-center"
                        />
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
