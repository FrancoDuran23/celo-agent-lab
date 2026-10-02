import { ArrowUpRight, CalendarRange } from "lucide-react";
import clsx from "clsx";
import type { Vencimiento } from "../../data/types";
import { VENCIMIENTOS_INFO } from "../../data/vencimientos";
import { daysBetween, formatLong, parseISODate, relativeDays } from "../../lib/dates";
import { CtaBand } from "../home/CtaBand";
import { buttonClass } from "../ui/Button";
import { AddToCalendarButton } from "./AddToCalendar";
import { DOT, capitalize, impuestoMeta, monthName, vencKey } from "./utils";

const fmtWeekday = new Intl.DateTimeFormat("es-AR", { weekday: "long" });

/**
 * Destacado del próximo vencimiento sobre el shader "aguayo" (único
 * acento WebGPU de la página), con cuenta regresiva.
 */
export function NextDue({
  items,
  hoy,
  filtro,
  onShow,
}: {
  /** Vencimientos de la fecha más próxima (misma fecha). */
  items: Vencimiento[];
  hoy: Date;
  filtro: string | null;
  onShow: (iso: string) => void;
}) {
  const first = items[0];

  if (!first) {
    return (
      <CtaBand className="h-full dark:ring-1 dark:ring-line">
        <div className="flex h-full flex-col p-6 sm:p-8">
          <h2 className="eyebrow !text-crema-200/70">Próximo vencimiento{filtro ? ` · ${filtro}` : ""}</h2>
          <p className="mt-5 max-w-sm text-2xl font-semibold tracking-tight">
            No hay próximos vencimientos cargados{filtro ? " para este impuesto" : ""}.
          </p>
          <p className="mt-3 max-w-md text-crema-100/75">Consultá las fechas vigentes en el calendario oficial.</p>
          <div className="mt-auto pt-8">
            <a
              href={VENCIMIENTOS_INFO.oficial}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass({ variant: "light" })}
            >
              Ver calendario oficial
              <ArrowUpRight aria-hidden="true" />
              <span className="sr-only">(se abre en una pestaña nueva)</span>
            </a>
          </div>
        </div>
      </CtaBand>
    );
  }

  const d = parseISODate(first.fecha);
  const dias = daysBetween(hoy, d);
  const rel = relativeDays(first.fecha, hoy);

  return (
    <CtaBand className="h-full dark:ring-1 dark:ring-line">
      <div className="flex h-full flex-col p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="eyebrow !text-crema-200/75">Próximo vencimiento{filtro ? ` · ${filtro}` : ""}</h2>
          <p
            className={clsx(
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold",
              dias <= 7 ? "bg-ocre-500 text-night-900" : "bg-white/10 text-crema-50 ring-1 ring-white/20 backdrop-blur-sm",
            )}
          >
            <span aria-hidden="true" className={clsx("size-1.5 rounded-full", dias <= 7 ? "bg-night-900" : "bg-ocre-300")} />
            Vence {rel}
          </p>
        </div>

        <time dateTime={first.fecha} className="sr-only">
          {capitalize(formatLong(first.fecha))} de {d.getFullYear()}
        </time>
        <div aria-hidden="true" className="mt-6 flex items-end gap-4 sm:gap-6">
          <span className="font-serif text-[5.5rem] leading-[0.78] text-ocre-300 italic tabular sm:text-[7.5rem]">
            {d.getDate()}
          </span>
          <div className="pb-1">
            <p className="text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">{monthName(d)}</p>
            <p className="mt-1 text-crema-100/70 first-letter:uppercase">
              {fmtWeekday.format(d)} · {d.getFullYear()}
            </p>
          </div>
        </div>

        <ul className="mt-7 space-y-2.5">
          {items.map((v) => {
            const m = impuestoMeta(v.impuesto);
            return (
              <li key={vencKey(v)} className="flex items-start gap-3">
                <span aria-hidden="true" className={clsx("mt-2 size-2 shrink-0 rounded-full", DOT[m.color])} />
                <span className="min-w-0">
                  <span className="font-semibold text-crema-50">{v.titulo}</span>
                  {v.detalle ? <span className="text-crema-100/70"> · {v.detalle}</span> : null}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto flex flex-wrap gap-3 pt-8">
          <AddToCalendarButton
            items={items}
            variant="light"
            size="md"
            srContext={`${items.length === 1 ? "el vencimiento" : `los ${items.length} vencimientos`} del ${formatLong(first.fecha)}`}
          />
          <button
            type="button"
            onClick={() => onShow(first.fecha)}
            className={buttonClass({ variant: "outline-light", size: "md" })}
          >
            <CalendarRange aria-hidden="true" />
            Ver en el calendario
          </button>
        </div>
      </div>
    </CtaBand>
  );
}
