import { ChevronDown, History } from "lucide-react";
import clsx from "clsx";
import type { Vencimiento } from "../../data/types";
import { daysBetween, formatLong, parseISODate, relativeDays } from "../../lib/dates";
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
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">Agenda</h3>
          <p className="mt-1 text-sm text-ink-3" aria-live="polite">
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
        <div className="mt-5 space-y-5">
          {groupByMonth(upcoming).map((g) => (
            <MonthGroup key={g.key} month={g.month} items={g.items} hoy={hoy} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-line-strong px-6 py-10 text-center">
          <p className="font-semibold text-ink">No hay próximos vencimientos{deFiltro} en este calendario.</p>
          <p className="mt-1 text-sm text-ink-3">Probá con otro impuesto o revisá el calendario oficial.</p>
        </div>
      )}

      {past.length ? (
        <details className="group mt-5 rounded-2xl bg-surface/60 ring-1 ring-line [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium text-ink-2 transition-colors select-none hover:bg-surface-2 sm:px-5">
            <History className="size-4 shrink-0 text-ink-3" aria-hidden="true" />
            <span className="flex-1">
              Vencimientos anteriores <span className="text-ink-3 tabular">({past.length})</span>
            </span>
            <ChevronDown
              className="size-4 shrink-0 text-ink-3 transition-transform duration-200 group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <div className="space-y-4 px-2 pb-2 sm:px-3 sm:pb-3">
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
    <div
      className={clsx("overflow-hidden rounded-2xl ring-1 ring-line", past ? "bg-surface/70" : "bg-surface")}
    >
      <div className="flex items-center justify-between gap-3 border-b border-line bg-surface-2/60 px-4 py-2.5 sm:px-5">
        <h4 className={clsx("text-sm font-semibold", past ? "text-ink-3" : "text-ink")}>
          {monthName(month)} <span className="font-normal text-ink-3 tabular">{month.getFullYear()}</span>
        </h4>
        <span className="text-xs text-ink-3">{pluralVenc(items.length)}</span>
      </div>
      <ol className="divide-y divide-line">
        {[...groupByDate(items)].map(([fecha, list]) => {
          const dias = daysBetween(hoy, parseISODate(fecha));
          const tone = dias < 0 ? "past" : dias <= 7 ? "soon" : "neutral";
          return (
            <li key={fecha} className={clsx("flex gap-4 p-4 sm:px-5", past && "opacity-80")}>
              <DateBadge iso={fecha} tone={tone} />
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-3">
                  <time dateTime={fecha}>{capitalize(formatLong(fecha))}</time>
                  <CountdownChip text={capitalize(relativeDays(fecha, hoy))} tone={tone} />
                </p>
                <ul className="mt-2 divide-y divide-dashed divide-line">
                  {list.map((v) => (
                    <li
                      key={vencKey(v)}
                      className="flex flex-col gap-2 py-3 first:pt-1 last:pb-0 sm:flex-row sm:items-center sm:gap-4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className={clsx("font-semibold", past ? "text-ink-2" : "text-ink")}>{v.titulo}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm text-ink-3">
                          {v.detalle ? <span>{v.detalle}</span> : null}
                          <ImpuestoTag slug={v.impuesto} />
                        </div>
                      </div>
                      {!past ? (
                        <AddToCalendarButton
                          items={[v]}
                          variant="ghost"
                          srContext={`${v.titulo}${v.detalle ? `, ${v.detalle}` : ""}, ${formatLong(v.fecha)}`}
                          className="-ml-3 self-start !text-brand hover:!bg-brand-soft sm:ml-0 sm:self-center"
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
