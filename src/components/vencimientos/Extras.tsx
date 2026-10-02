import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import { VENCIMIENTOS_INFO } from "../../data/vencimientos";
import { ButtonLink } from "../ui/Button";
import { Notice, SmartLink } from "../ui/primitives";
import { Mark } from "./bits";
import type { ImpuestoMeta } from "./utils";

/* ------------------------------------------------------------------ */
/* Aviso: fechas orientativas + día inhábil                            */
/* ------------------------------------------------------------------ */

export function FechasNotice({ calendario, className }: { calendario: string; className?: string }) {
  const ilustrativo = VENCIMIENTOS_INFO.ilustrativo;
  return (
    <Notice
      tone={ilustrativo ? "warn" : "info"}
      title={ilustrativo ? "Fechas orientativas" : "Sobre estas fechas"}
      className={className}
    >
      {ilustrativo ? (
        <p>
          Las fechas son orientativas: están armadas a partir del {calendario} ({VENCIMIENTOS_INFO.norma}). Antes de
          pagar, confirmalas en el calendario oficial.
        </p>
      ) : (
        <p>
          Las fechas corresponden al {calendario} ({VENCIMIENTOS_INFO.norma}). Ante cualquier duda, consultá el
          calendario oficial.
        </p>
      )}
      <p className="mt-2">
        Si un vencimiento cae en un día inhábil (fin de semana o feriado), se traslada al primer día hábil siguiente.
      </p>
      <p className="mt-3">
        <SmartLink to={VENCIMIENTOS_INFO.oficial} className="link inline-flex items-center gap-1 font-semibold">
          Ver el calendario oficial
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </SmartLink>
      </p>
    </Notice>
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
  className,
}: {
  impuestos: ImpuestoMeta[];
  counts: Map<string, number>;
  total: number;
  value: string | null;
  onChange: (slug: string | null) => void;
  className?: string;
}) {
  return (
    <fieldset className={className}>
      <legend className="mb-3 font-bold text-ink">Filtrar por impuesto</legend>
      <div className="flex flex-wrap gap-2">
        <Chip active={!value} onClick={() => onChange(null)} count={total}>
          Todos
        </Chip>
        {impuestos.map((i) => (
          <Chip key={i.slug} active={value === i.slug} onClick={() => onChange(i.slug)} count={counts.get(i.slug) ?? 0}>
            <Mark slug={i.slug} inherit={value === i.slug} />
            {i.corto}
          </Chip>
        ))}
      </div>
    </fieldset>
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
        "inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-sm font-medium transition-colors coarse:h-11",
        active ? "bg-ink text-bg" : "bg-surface text-ink-2 ring-1 ring-line-strong ring-inset hover:bg-surface-2 hover:text-ink",
      )}
    >
      {children}
      <span className={clsx("text-xs tabular", active ? "text-bg/75" : "text-ink-3")}>
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
    <section aria-labelledby="deuda-titulo" className="border-y border-line bg-surface-2">
      <div className="container-page grid grid-cols-[minmax(0,1fr)] gap-6 py-12 sm:py-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12">
        <div className="min-w-0">
          <h2 id="deuda-titulo" className="text-2xl font-bold text-ink sm:text-[1.75rem]">
            ¿Tenés deuda vencida?
          </h2>
          <p className="prose-measure mt-2 text-ink-2">
            Si se te pasó una fecha, podés ponerte al día con un plan de facilidades de pago. Y si tenés dudas, te
            ayudamos por teléfono, WhatsApp o en una oficina.
          </p>
        </div>
        <div className="grid gap-3 sm:flex sm:flex-wrap">
          <ButtonLink to="/tramites?q=plan" className="w-full sm:w-auto">
            Ver planes de pago
          </ButtonLink>
          <ButtonLink to="/atencion" variant="secondary" className="w-full sm:w-auto">
            Hablar con un asesor
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
