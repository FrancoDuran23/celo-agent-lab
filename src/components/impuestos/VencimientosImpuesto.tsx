import { Link } from "react-router";
import { ArrowRight, CalendarClock } from "lucide-react";
import clsx from "clsx";
import { VENCIMIENTOS } from "../../data/vencimientos";
import type { Impuesto } from "../../data/types";
import { daysBetween, formatLong, parseISODate, relativeDays, today } from "../../lib/dates";

const MONTH = new Intl.DateTimeFormat("es-AR", { month: "short" });

/** Próximos vencimientos del impuesto, o un estado vacío que lleva al calendario. */
export function VencimientosImpuesto({ imp }: { imp: Impuesto }) {
  const hoy = today();
  const proximos = VENCIMIENTOS.filter(
    (v) => v.impuesto === imp.slug && daysBetween(hoy, parseISODate(v.fecha)) >= 0,
  )
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(0, 5);

  if (!proximos.length) {
    return (
      <div className="flex flex-col items-start gap-5 rounded-2xl border border-dashed border-line-strong bg-surface/60 p-6 sm:flex-row sm:items-center sm:p-7">
        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-ink-3 ring-1 ring-line">
          <CalendarClock className="size-6" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-ink">No hay vencimientos próximos cargados para este impuesto.</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-3">
            Revisá el calendario general para ver todas las fechas del año.
          </p>
        </div>
        <Link
          to="/vencimientos"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-surface px-4 py-2 text-sm font-medium text-ink ring-1 ring-line-strong transition-colors hover:bg-surface-2"
        >
          Ver calendario <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-surface ring-1 ring-line">
      <ol className="divide-y divide-line">
        {proximos.map((v) => {
          const d = parseISODate(v.fecha);
          const dias = daysBetween(hoy, d);
          const pronto = dias <= 7;
          return (
            <li key={v.fecha + v.titulo} className="flex items-center gap-4 p-4 sm:px-6">
              <div
                aria-hidden="true"
                className={clsx(
                  "flex size-14 shrink-0 flex-col items-center justify-center rounded-xl ring-1",
                  pronto ? "bg-brand-soft text-brand ring-brand/20" : "bg-surface-2 text-ink ring-line",
                )}
              >
                <span className="text-xl leading-none font-semibold tabular">{d.getDate()}</span>
                <span className="mt-0.5 text-[0.68rem] font-medium tracking-wide uppercase">
                  {MONTH.format(d).replace(".", "")}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink">{v.titulo}</p>
                <p className="mt-0.5 text-sm text-ink-3">
                  <time dateTime={v.fecha} className="inline-block first-letter:uppercase">
                    {formatLong(v.fecha)}
                  </time>
                  {v.detalle ? ` · ${v.detalle}` : ""}
                </p>
              </div>
              <span
                className={clsx(
                  "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                  pronto ? "bg-brand text-brand-ink" : "bg-surface-2 text-ink-2",
                )}
              >
                {relativeDays(v.fecha, hoy)}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="border-t border-line px-4 py-3 sm:px-6">
        <Link
          to="/vencimientos"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
        >
          Ver el calendario completo <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
