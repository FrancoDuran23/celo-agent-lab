import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import type { Vencimiento } from "../../data/types";
import { formatLong, formatMonth } from "../../lib/dates";
import { buttonClass } from "../ui/Button";
import { Mark } from "./bits";
import {
  WEEKDAYS,
  addDays,
  addMonths,
  capitalize,
  monthMatrix,
  monthName,
  pluralVenc,
  sameMonth,
  shiftMonthKeepDay,
  startOfMonth,
  toISO,
  vencKey,
  weekdayMon,
} from "./utils";

interface Props {
  /** Primer día del mes visible. */
  view: Date;
  onViewChange: (month: Date) => void;
  /** Primer y último mes navegables. */
  min: Date;
  max: Date;
  hoy: Date;
  /** Vencimientos (ya filtrados) agrupados por fecha ISO. */
  byDate: Map<string, Vencimiento[]>;
  selected: string | null;
  onSelect: (iso: string) => void;
  /** Al incrementarse, mueve el foco al día seleccionado. */
  focusRequest: number;
}

/**
 * Grilla mensual (lunes a domingo) con el patrón de teclado de un
 * selector de fechas: flechas por día/semana, Inicio/Fin de semana y
 * RePág/AvPág por mes. Un solo día es tabulable a la vez.
 */
export function MonthCalendar({ view, onViewChange, min, max, hoy, byDate, selected, onSelect, focusRequest }: Props) {
  const headingId = useId();
  const hintId = useId();
  const tableRef = useRef<HTMLTableElement>(null);
  const pendingFocus = useRef<"keyboard" | "request" | null>(null);
  const [focusISO, setFocusISO] = useState<string | null>(null);

  const hoyISO = toISO(hoy);
  const weeks = monthMatrix(view);
  const inView = (iso: string | null): iso is string => !!iso && iso.slice(0, 7) === toISO(view).slice(0, 7);

  // Día tabulable: el enfocado, el seleccionado, hoy, el primer día con vencimientos o el 1.
  const firstWithItems = [...byDate.keys()].sort().find((iso) => inView(iso)) ?? null;
  const tabbable = [focusISO, selected, hoyISO, firstWithItems].find(inView) ?? toISO(view);

  const prev = addMonths(view, -1);
  const next = addMonths(view, 1);
  const canPrev = prev >= startOfMonth(min);
  const canNext = next <= startOfMonth(max);

  // Pedido externo ("Ver en el calendario"): enfocar el día seleccionado.
  const lastRequest = useRef(focusRequest);
  useEffect(() => {
    if (focusRequest === lastRequest.current) return;
    lastRequest.current = focusRequest;
    if (selected) {
      setFocusISO(selected);
      pendingFocus.current = "request";
    }
  }, [focusRequest, selected]);

  useEffect(() => {
    if (!pendingFocus.current) return;
    const btn = tableRef.current?.querySelector<HTMLButtonElement>(`button[data-iso="${tabbable}"]`);
    if (btn) {
      btn.focus({ preventScroll: pendingFocus.current === "request" });
      pendingFocus.current = null;
    }
  });

  const go = (month: Date) => {
    onViewChange(month);
    setFocusISO(null);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, from: Date) => {
    let to: Date | null = null;
    switch (e.key) {
      case "ArrowLeft":
        to = addDays(from, -1);
        break;
      case "ArrowRight":
        to = addDays(from, 1);
        break;
      case "ArrowUp":
        to = addDays(from, -7);
        break;
      case "ArrowDown":
        to = addDays(from, 7);
        break;
      case "Home":
        to = addDays(from, -weekdayMon(from));
        break;
      case "End":
        to = addDays(from, 6 - weekdayMon(from));
        break;
      case "PageUp":
        to = shiftMonthKeepDay(from, -1);
        break;
      case "PageDown":
        to = shiftMonthKeepDay(from, 1);
        break;
      default:
        return;
    }
    e.preventDefault();
    const month = startOfMonth(to);
    if (month < startOfMonth(min) || month > startOfMonth(max)) return;
    setFocusISO(toISO(to));
    pendingFocus.current = "keyboard";
    if (!sameMonth(month, view)) onViewChange(month);
  };

  const navBtn =
    "inline-flex size-9 items-center justify-center rounded-lg bg-surface text-ink ring-1 ring-line-strong ring-inset transition-colors hover:bg-surface-2 aria-disabled:cursor-not-allowed aria-disabled:text-ink-3 aria-disabled:opacity-50 aria-disabled:hover:bg-surface";

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h3 id={headingId} aria-live="polite" className="text-lg font-bold text-ink sm:text-xl">
          {monthName(view)} <span className="font-normal text-ink-3 tabular">{view.getFullYear()}</span>
        </h3>
        <div className="flex shrink-0 items-center gap-1.5">
          {!sameMonth(view, hoy) && startOfMonth(hoy) >= startOfMonth(min) && startOfMonth(hoy) <= startOfMonth(max) ? (
            <button
              type="button"
              onClick={() => go(startOfMonth(hoy))}
              className={buttonClass({ variant: "secondary", size: "sm" })}
            >
              Hoy
            </button>
          ) : null}
          <button
            type="button"
            className={navBtn}
            aria-disabled={!canPrev || undefined}
            aria-label={canPrev ? `Mes anterior, ${formatMonth(prev)}` : "Mes anterior (no hay fechas cargadas antes)"}
            onClick={() => canPrev && go(prev)}
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={navBtn}
            aria-disabled={!canNext || undefined}
            aria-label={canNext ? `Mes siguiente, ${formatMonth(next)}` : "Mes siguiente (no hay fechas cargadas después)"}
            onClick={() => canNext && go(next)}
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <p id={hintId} className="sr-only">
        Usá las flechas para moverte entre días, Re Pág y Av Pág para cambiar de mes, y Enter para ver los
        vencimientos del día.
      </p>

      <table
        ref={tableRef}
        role="grid"
        aria-labelledby={headingId}
        aria-describedby={hintId}
        className="mt-4 w-full table-fixed border-separate border-spacing-0.5 sm:border-spacing-1"
      >
        <thead>
          <tr>
            {WEEKDAYS.map((w) => (
              <th key={w.long} scope="col" abbr={w.long} className="pb-2 text-center text-xs font-semibold text-ink-3">
                {capitalize(w.short.slice(0, 3))}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={toISO(week[0]!)}>
              {week.map((d) => {
                const iso = toISO(d);
                if (!sameMonth(d, view)) {
                  return (
                    <td key={iso} role="gridcell" className="p-0">
                      <span aria-hidden="true" className="block aspect-square w-full" />
                    </td>
                  );
                }
                const items = byDate.get(iso) ?? [];
                const isToday = iso === hoyISO;
                const isPast = iso < hoyISO;
                const isSelected = iso === selected;
                const label = [
                  capitalize(formatLong(iso)),
                  isToday ? "hoy" : null,
                  items.length ? pluralVenc(items.length) : "sin vencimientos",
                ]
                  .filter(Boolean)
                  .join(", ");
                return (
                  <td key={iso} role="gridcell" aria-selected={isSelected} className="p-0">
                    <button
                      type="button"
                      data-iso={iso}
                      tabIndex={iso === tabbable ? 0 : -1}
                      aria-label={label}
                      aria-current={isToday ? "date" : undefined}
                      onClick={() => {
                        setFocusISO(iso);
                        onSelect(iso);
                      }}
                      onFocus={() => setFocusISO(iso)}
                      onKeyDown={(e) => onKeyDown(e, d)}
                      className={clsx(
                        "relative flex aspect-square w-full items-center justify-center rounded-lg border-2 text-sm tabular transition-colors duration-150 sm:text-[0.95rem]",
                        isToday ? "border-brand" : "border-transparent",
                        isSelected
                          ? "bg-ink font-bold text-bg"
                          : isToday
                            ? "font-bold text-brand hover:bg-surface-2"
                            : items.length && !isPast
                              ? "font-bold text-ink hover:bg-surface-2"
                              : isPast
                                ? "text-ink-3 hover:bg-surface-2"
                                : "text-ink-2 hover:bg-surface-2 hover:text-ink",
                      )}
                    >
                      <span className={clsx(items.length && "-translate-y-1")}>{d.getDate()}</span>
                      {items.length ? (
                        <span
                          aria-hidden="true"
                          className={clsx(
                            "absolute inset-x-0 bottom-[14%] flex justify-center gap-[3px]",
                            isPast && !isSelected && "opacity-60",
                          )}
                        >
                          {items.slice(0, 3).map((v) => (
                            <Mark key={vencKey(v)} slug={v.impuesto} inherit={isSelected} />
                          ))}
                        </span>
                      ) : null}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
