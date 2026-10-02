import type { ReactNode } from "react";
import { ArrowUpRight, CalendarClock, HandCoins, Headset, Info } from "lucide-react";
import clsx from "clsx";
import { VENCIMIENTOS_INFO } from "../../data/vencimientos";
import { ButtonLink } from "../ui/Button";
import { DOT, type ImpuestoMeta } from "./utils";

/* ------------------------------------------------------------------ */
/* Aviso: fechas orientativas + día inhábil                            */
/* ------------------------------------------------------------------ */

export function FechasNotice({ calendario }: { calendario: string }) {
  return (
    <aside
      aria-labelledby="aviso-fechas"
      className="flex h-full flex-col rounded-3xl bg-surface p-6 ring-1 ring-line sm:p-8"
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl tint-violeta">
          <Info className="size-5" aria-hidden="true" />
        </span>
        <h2 id="aviso-fechas" className="text-lg font-semibold tracking-tight text-ink">
          {VENCIMIENTOS_INFO.ilustrativo ? "Fechas orientativas" : "Sobre estas fechas"}
        </h2>
      </div>

      {VENCIMIENTOS_INFO.ilustrativo ? (
        <p className="mt-4 leading-relaxed text-ink-2">
          Este calendario es parte de un prototipo: las fechas son <strong className="font-semibold text-ink">orientativas</strong> y
          están armadas a partir del {calendario} ({VENCIMIENTOS_INFO.norma}). Antes de pagar, confirmalas en el
          calendario oficial.
        </p>
      ) : (
        <p className="mt-4 leading-relaxed text-ink-2">
          Las fechas corresponden al {calendario} ({VENCIMIENTOS_INFO.norma}). Ante cualquier duda, consultá el
          calendario oficial.
        </p>
      )}

      <p className="mt-4 flex items-start gap-3 rounded-2xl bg-surface-2 p-3.5 text-sm leading-relaxed text-ink-2">
        <CalendarClock className="mt-0.5 size-4 shrink-0 text-ink-3" aria-hidden="true" />
        <span>
          Si un vencimiento cae en un <strong className="font-semibold text-ink">día inhábil</strong> (fin de semana o
          feriado), se traslada al primer día hábil siguiente.
        </span>
      </p>

      <div className="mt-auto pt-6">
        <a
          href={VENCIMIENTOS_INFO.oficial}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 rounded-full text-sm font-semibold text-brand underline-offset-4 hover:underline"
        >
          Ver el calendario oficial
          <ArrowUpRight
            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
          <span className="sr-only">(se abre en una pestaña nueva)</span>
        </a>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Filtros por impuesto                                                 */
/* ------------------------------------------------------------------ */

export function ImpuestoFilter({
  impuestos,
  counts,
  total,
  value,
  onChange,
}: {
  impuestos: ImpuestoMeta[];
  counts: Map<string, number>;
  total: number;
  value: string | null;
  onChange: (slug: string | null) => void;
}) {
  return (
    <div role="group" aria-labelledby="filtro-impuesto" className="flex flex-wrap items-center gap-2">
      <span id="filtro-impuesto" className="eyebrow w-full sm:mr-2 sm:w-auto">
        Filtrar por impuesto
      </span>
      <Chip active={!value} onClick={() => onChange(null)} count={total}>
        Todos
      </Chip>
      {impuestos.map((i) => (
        <Chip key={i.slug} active={value === i.slug} onClick={() => onChange(i.slug)} count={counts.get(i.slug) ?? 0}>
          <span aria-hidden="true" className={clsx("size-2 rounded-full", DOT[i.color])} />
          {i.corto}
        </Chip>
      ))}
    </div>
  );
}

function Chip({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={clsx(
        "inline-flex h-10 items-center gap-2 rounded-full pr-2 pl-4 text-sm font-medium transition-colors",
        active
          ? "bg-night-900 text-crema-50 shadow-soft dark:bg-crema-100 dark:text-night-900"
          : "bg-surface text-ink-2 ring-1 ring-line hover:bg-surface-2 hover:text-ink",
      )}
    >
      {children}
      <span
        className={clsx(
          "inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs tabular",
          active ? "bg-white/15 dark:bg-night-900/10" : "bg-surface-2 text-ink-3",
        )}
      >
        {count}
        <span className="sr-only"> {count === 1 ? "vencimiento" : "vencimientos"}</span>
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Ayuda final: deuda vencida                                           */
/* ------------------------------------------------------------------ */

export function DeudaHelp() {
  return (
    <section aria-labelledby="deuda-titulo" className="container-page pb-20 sm:pb-24">
      <div className="overflow-hidden rounded-3xl bg-surface ring-1 ring-line">
        <div className="aguayo-strip" aria-hidden="true" />
        <div className="grid gap-6 p-6 sm:p-10 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-10">
          <span className="inline-flex size-14 items-center justify-center rounded-2xl tint-ocre">
            <HandCoins className="size-7" aria-hidden="true" />
          </span>
          <div>
            <h2 id="deuda-titulo" className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              ¿Tenés deuda{" "}
              <span className="font-serif font-normal tracking-normal text-brand italic">vencida?</span>
            </h2>
            <p className="mt-2 max-w-xl leading-relaxed text-ink-3">
              Si se te pasó una fecha, podés ponerte al día con un plan de facilidades de pago. Y si tenés dudas, te
              ayudamos por teléfono, WhatsApp o en una oficina.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink to="/tramites?q=plan">
              <HandCoins aria-hidden="true" />
              Ver planes de pago
            </ButtonLink>
            <ButtonLink to="/atencion" variant="secondary">
              <Headset aria-hidden="true" />
              Hablar con un asesor
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
