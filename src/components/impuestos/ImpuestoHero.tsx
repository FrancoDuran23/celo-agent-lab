import { Link } from "react-router";
import { CalendarDays, ChevronRight, ListChecks } from "lucide-react";
import clsx from "clsx";
import type { Impuesto, PaletteColor, Tramite } from "../../data/types";
import { Icon } from "../../lib/icons";
import { buttonClass, ButtonLink } from "../ui/Button";
import { STRATA_STOPS, strataGradient, TINT } from "./palette";

export function ImpuestoHero({ imp, tramites }: { imp: Impuesto; tramites: Tramite[] }) {
  const enLinea = tramites.filter((t) => t.canal !== "presencial").length;
  const sinClave = tramites.filter((t) => !t.requiereClave).length;

  const datos = [
    tramites.length ? { valor: tramites.length, label: tramites.length === 1 ? "trámite" : "trámites" } : null,
    enLinea ? { valor: enLinea, label: "se hacen en línea" } : null,
    sinClave ? { valor: sinClave, label: "sin clave fiscal" } : null,
  ].filter((d): d is { valor: number; label: string } => d !== null);

  return (
    <header className="relative isolate overflow-hidden border-b border-line bg-surface-2/60">
      {/* Franja de estratos */}
      <div aria-hidden="true" className="h-2" style={{ backgroundImage: strataGradient(imp.color) }} />
      <Relieve color={imp.color} />

      <div className="container-page relative pt-8 pb-12 sm:pt-10 sm:pb-16">
        <nav aria-label="Ruta de navegación">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-ink-3">
            <li>
              <Link to="/" className="rounded px-1 hover:text-ink">
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li>
              <Link to="/impuestos" className="rounded px-1 hover:text-ink">
                Impuestos
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li>
              <span aria-current="page" className="px-1 font-medium text-ink-2">
                {imp.corto}
              </span>
            </li>
          </ol>
        </nav>

        <div className="mt-8 max-w-3xl animate-rise sm:mt-10">
          <span
            className={clsx(
              "inline-flex size-16 items-center justify-center rounded-2xl ring-1 ring-current/10 sm:size-[4.5rem]",
              TINT[imp.color],
            )}
          >
            <Icon name={imp.icon} className="size-8 sm:size-9" />
          </span>
          <p className="eyebrow mt-5">Impuesto provincial</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">{imp.nombre}</h1>
          <p className="mt-5 text-xl leading-relaxed text-ink-2 sm:text-2xl sm:leading-snug">{imp.bajada}</p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-3 sm:text-lg">{imp.descripcion}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {tramites.length ? (
              <a href="#tramites" className={buttonClass({ variant: "primary", size: "lg" })}>
                <ListChecks aria-hidden="true" />
                Ver trámites
              </a>
            ) : null}
            <ButtonLink to="/vencimientos" variant="secondary" size="lg">
              <CalendarDays aria-hidden="true" />
              Calendario de vencimientos
            </ButtonLink>
          </div>

          {datos.length ? (
            <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-6">
              {datos.map((d) => (
                <div key={d.label} className="flex flex-row-reverse items-baseline justify-end gap-2">
                  <dt className="text-sm text-ink-3">{d.label}</dt>
                  <dd className="text-2xl font-semibold tracking-tight text-ink tabular">{d.valor}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>
    </header>
  );
}

/**
 * Relieve decorativo: capas onduladas como los cerros de la Quebrada,
 * en los tonos del impuesto. Sólo en escritorio, a la derecha del texto.
 */
function Relieve({ color }: { color: PaletteColor }) {
  const [a, b, c] = STRATA_STOPS[color];
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-0 bottom-0 -z-10 hidden h-[72%] w-[30%] opacity-75 [mask-image:linear-gradient(to_right,transparent,black_40%)] lg:block xl:w-[40%] 2xl:w-[44%] dark:opacity-50"
    >
      <span
        className="absolute top-[10%] right-[20%] size-16 rounded-full xl:size-20"
        style={{ backgroundColor: b, opacity: 0.55 }}
      />
      <svg viewBox="0 0 640 360" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path d="M0 210 C 90 170 170 196 250 160 S 410 100 500 132 S 600 118 640 112 V360 H0Z" fill={c} opacity="0.32" />
        <path d="M0 246 C 100 214 180 236 280 204 S 440 170 530 192 S 610 186 640 182 V360 H0Z" fill={b} opacity="0.38" />
        <path d="M0 280 C 110 256 200 276 300 248 S 450 224 540 240 S 612 236 640 234 V360 H0Z" fill={a} opacity="0.42" />
        <path d="M0 312 C 120 294 220 310 320 290 S 470 272 560 284 S 618 282 640 280 V360 H0Z" fill={c} opacity="0.4" />
        <path d="M0 340 C 120 328 230 340 330 326 S 480 314 570 322 S 620 320 640 320 V360 H0Z" fill={a} opacity="0.5" />
      </svg>
    </div>
  );
}
