import { ArrowUpRight } from "lucide-react";
import type { Vencimiento } from "../../data/types";
import { VENCIMIENTOS_INFO } from "../../data/vencimientos";
import { countdownLabel, countdownTone, formatLong, parseISODate } from "../../lib/dates";
import { Button, ButtonLink } from "../ui/Button";
import { Badge, Panel } from "../ui/primitives";
import { AddToCalendarButton } from "./AddToCalendar";
import { ImpuestoTag } from "./bits";
import { capitalize, monthName, vencKey } from "./utils";

const fmtWeekday = new Intl.DateTimeFormat("es-AR", { weekday: "long" });

/** Próximo vencimiento (respeta el filtro): fecha grande, cuenta regresiva y .ics. */
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
  const titulo = `Próximo vencimiento${filtro ? ` de ${filtro}` : ""}`;

  if (!first) {
    return (
      <Panel as="section" aria-labelledby="proximo-titulo" className="p-6 sm:p-8">
        <h2 id="proximo-titulo" className="text-lg font-bold text-ink">
          {titulo}
        </h2>
        <p className="mt-4 text-xl font-semibold text-ink">
          No hay próximos vencimientos cargados{filtro ? " para este impuesto" : ""}.
        </p>
        <p className="mt-2 text-ink-3">Consultá las fechas vigentes en el calendario oficial.</p>
        <ButtonLink to={VENCIMIENTOS_INFO.oficial} variant="secondary" className="mt-6">
          Ver calendario oficial
          <ArrowUpRight aria-hidden="true" />
        </ButtonLink>
      </Panel>
    );
  }

  const d = parseISODate(first.fecha);

  return (
    <Panel as="section" aria-labelledby="proximo-titulo" className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h2 id="proximo-titulo" className="text-lg font-bold text-ink">
          {titulo}
        </h2>
        <Badge tone={countdownTone(first.fecha, hoy)} className="tabular">
          {countdownLabel(first.fecha, hoy)}
        </Badge>
      </div>

      <time dateTime={first.fecha} className="sr-only">
        {capitalize(formatLong(first.fecha))} de {d.getFullYear()}
      </time>
      <div aria-hidden="true" className="mt-5 flex items-center gap-4 sm:gap-5">
        <span className="text-6xl leading-none font-bold tracking-[-0.03em] text-ink tabular sm:text-7xl">
          {d.getDate()}
        </span>
        <span className="min-w-0">
          <span className="block text-2xl leading-tight font-bold text-ink">{monthName(d)}</span>
          <span className="mt-0.5 block text-ink-3 tabular first-letter:uppercase">
            {fmtWeekday.format(d)} · {d.getFullYear()}
          </span>
        </span>
      </div>

      <ul className="mt-6 border-b border-line">
        {items.map((v) => (
          <li
            key={vencKey(v)}
            className="flex flex-col gap-1 border-t border-line py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <span className="min-w-0">
              <span className="block font-semibold text-ink">{v.titulo}</span>
              {v.detalle ? <span className="block text-sm text-ink-3">{v.detalle}</span> : null}
            </span>
            <ImpuestoTag slug={v.impuesto} className="shrink-0" />
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-3">
        <AddToCalendarButton
          items={items}
          variant="secondary"
          size="md"
          srContext={`${items.length === 1 ? "el vencimiento" : `los ${items.length} vencimientos`} del ${formatLong(first.fecha)}`}
        />
        <Button variant="subtle" onClick={() => onShow(first.fecha)}>
          Ver en el calendario
        </Button>
      </div>
    </Panel>
  );
}
