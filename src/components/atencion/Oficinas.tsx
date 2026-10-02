import { useId, useState, type ReactNode } from "react";
import { ArrowUpRight, Building2, CalendarCheck, Clock, MapPin, Navigation, Phone } from "lucide-react";
import clsx from "clsx";
import { OFICINAS, PORTAL } from "../../data/contacto";
import { LINKS } from "../../data/site";
import type { Oficina, Region } from "../../data/types";
import { ButtonLink } from "../ui/Button";
import { SectionHeader } from "../ui/primitives";
import { RegionStrata } from "./RegionStrata";
import { mapsHref, NEW_TAB, REGION_META, REGION_ORDER, splitPhone, telHref } from "./utils";

const CASA_CENTRAL = OFICINAS.find((o) => o.casaCentral);
const DELEGACIONES = OFICINAS.filter((o) => !o.casaCentral);

/** Delegaciones agrupadas por región, en el orden de REGION_ORDER. */
const GRUPOS = REGION_ORDER.map((r) => ({ region: r, oficinas: DELEGACIONES.filter((o) => o.region === r) })).filter(
  (g) => g.oficinas.length > 0,
);

/** Todas las oficinas por región (incluida Casa Central), para el gráfico. */
const TOTALES = OFICINAS.reduce<Partial<Record<Region, number>>>((acc, o) => {
  acc[o.region] = (acc[o.region] ?? 0) + 1;
  return acc;
}, {});

export function Oficinas({ id }: { id: string }) {
  const [region, setRegion] = useState<Region | null>(null);
  const baseId = useId();

  const casaCentral = CASA_CENTRAL;
  const grupos = GRUPOS;
  const visibles = region ? grupos.filter((g) => g.region === region) : grupos;
  const cantidad = visibles.reduce((n, g) => n + g.oficinas.length, 0);

  if (!OFICINAS.length) return null;

  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="scroll-mt-24 py-20 sm:py-24">
      <div className="container-page">
        <SectionHeader
          id={`${id}-titulo`}
          eyebrow="Oficinas"
          title={
            <>
              Casa Central y{" "}
              <span className="font-serif font-normal tracking-normal text-brand italic">delegaciones.</span>
            </>
          }
          description="Buscá la oficina más cercana por región. Recordá sacar turno antes de ir."
        />

        {casaCentral ? <CasaCentral o={casaCentral} /> : null}

        {grupos.length ? (
          <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-[18rem_1fr] lg:gap-10">
            {/* Filtro por región */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-3xl bg-surface p-5 ring-1 ring-line sm:p-6">
                <RegionStrata
                  active={region}
                  counts={TOTALES}
                  central={casaCentral?.region}
                  className="mb-6 hidden h-auto w-full max-w-sm sm:block lg:max-w-none"
                />
                <fieldset>
                  <legend className="eyebrow mb-3">Filtrar por región</legend>
                  <div className="flex flex-wrap gap-2 lg:flex-col lg:items-stretch">
                    <RegionChip active={region === null} onClick={() => setRegion(null)} count={DELEGACIONES.length}>
                      Todas
                    </RegionChip>
                    {grupos.map((g) => (
                      <RegionChip
                        key={g.region}
                        active={region === g.region}
                        onClick={() => setRegion(g.region)}
                        count={g.oficinas.length}
                        dot={REGION_META[g.region].dot}
                      >
                        {REGION_META[g.region].label}
                      </RegionChip>
                    ))}
                  </div>
                </fieldset>
              </div>
            </div>

            {/* Delegaciones */}
            <div>
              <p className="mb-6 text-sm text-ink-3" aria-live="polite">
                <span className="font-semibold text-ink tabular">{cantidad}</span>{" "}
                {cantidad === 1 ? "oficina" : "oficinas"}
                {region ? ` en ${REGION_META[region].label}` : " en todas las regiones"}
              </p>

              <div className="grid gap-10">
                {visibles.map((g) => {
                  const headingId = `${baseId}-${g.region}`;
                  return (
                    <div key={g.region} role="group" aria-labelledby={headingId}>
                      <h3 id={headingId} className="flex items-center gap-2.5 text-lg font-semibold text-ink">
                        <span className={clsx("size-2.5 rounded-full", REGION_META[g.region].dot)} aria-hidden="true" />
                        {REGION_META[g.region].label}
                        <span className="text-sm font-normal text-ink-3 tabular">
                          · {g.oficinas.length} {g.oficinas.length === 1 ? "oficina" : "oficinas"}
                        </span>
                      </h3>
                      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                        {g.oficinas.map((o) => (
                          <OfficeCard key={o.nombre} o={o} />
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              <p className="mt-8 flex items-start gap-2 text-sm leading-relaxed text-ink-3">
                <Building2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>
                  Las direcciones y teléfonos pueden cambiar. Confirmalos antes de ir en la página de{" "}
                  <a
                    href={LINKS.delegaciones}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-brand hover:decoration-brand"
                  >
                    delegaciones del sitio oficial
                    <span className="sr-only">{NEW_TAB}</span>
                  </a>
                  .
                </span>
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function CasaCentral({ o }: { o: Oficina }) {
  const maps = mapsHref(o);
  const tel = o.telefono ? splitPhone(o.telefono) : null;
  const telLink = tel ? telHref(tel.numero) : null;

  return (
    <article
      aria-labelledby="casa-central-titulo"
      className="relative mt-10 overflow-hidden rounded-3xl bg-surface ring-1 ring-line"
    >
      <div className="aguayo-strip" aria-hidden="true" />
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-12 lg:p-10">
        <div>
          <div className="flex items-center gap-4">
            <span className="tint-terracota inline-flex size-12 shrink-0 items-center justify-center rounded-xl">
              <Building2 className="size-6" aria-hidden="true" />
            </span>
            <div>
              <h3 id="casa-central-titulo" className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                {o.nombre}
              </h3>
              <p className="text-ink-3">{o.localidad}</p>
            </div>
          </div>

          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            {o.direccion ? (
              <Dato icon={<MapPin className="size-5" aria-hidden="true" />} label="Dirección">
                <span className="text-xl font-semibold tracking-tight text-ink">{o.direccion}</span>
              </Dato>
            ) : null}
            {o.horario ? (
              <Dato icon={<Clock className="size-5" aria-hidden="true" />} label="Horario">
                <span className="text-lg font-medium text-ink">{o.horario}</span>
              </Dato>
            ) : null}
            {tel ? (
              <Dato icon={<Phone className="size-5" aria-hidden="true" />} label="Teléfono">
                {telLink ? (
                  <a href={telLink} className="text-lg font-medium text-ink underline decoration-line-strong underline-offset-4 hover:text-brand">
                    {tel.numero}
                  </a>
                ) : (
                  <span className="text-lg font-medium text-ink">{tel.numero}</span>
                )}
                {tel.interno ? <span className="text-ink-3"> · int. {tel.interno}</span> : null}
              </Dato>
            ) : null}
          </dl>
        </div>

        <div className="rounded-2xl bg-surface-2 p-5 ring-1 ring-line sm:p-6">
          <p className="font-semibold text-ink">Antes de ir</p>
          <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-3">
            Sacá tu turno web y llevá la documentación que pida tu trámite. Para consultas, usá los canales de atención
            sin moverte de tu casa.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <ButtonLink to={PORTAL.turnos.href}>
              <CalendarCheck aria-hidden="true" />
              Sacar turno
              <span className="sr-only">{NEW_TAB}</span>
            </ButtonLink>
            {maps ? (
              <ButtonLink to={maps} variant="secondary">
                <Navigation aria-hidden="true" />
                Cómo llegar
                <span className="sr-only"> a {o.nombre} en Google Maps{NEW_TAB}</span>
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function Dato({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-3.5">
      <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-ink-2 ring-1 ring-line">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-sm text-ink-3">{label}</dt>
        <dd className="mt-0.5">{children}</dd>
      </div>
    </div>
  );
}

function OfficeCard({ o }: { o: Oficina }) {
  const tel = o.telefono ? splitPhone(o.telefono) : null;
  const telLink = tel ? telHref(tel.numero) : null;
  const maps = mapsHref(o);

  return (
    <li>
      <article className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-surface p-5 pl-6 ring-1 ring-line transition-[box-shadow] duration-300 hover:shadow-soft sm:p-6 sm:pl-7">
        <span aria-hidden="true" className={clsx("absolute inset-y-0 left-0 w-1", REGION_META[o.region].dot)} />
        <h4 className="font-semibold text-ink">{o.nombre}</h4>
        <p className="mt-0.5 text-sm text-ink-3">{o.localidad}</p>

        <ul className="mt-4 grid gap-2.5 text-[0.95rem] text-ink-2">
          {o.direccion ? (
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-ink-3" aria-hidden="true" />
              <span>
                <span className="sr-only">Dirección: </span>
                {o.direccion}
              </span>
            </li>
          ) : null}
          {tel ? (
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-ink-3" aria-hidden="true" />
              <span>
                <span className="sr-only">Teléfono: </span>
                {telLink ? (
                  <a
                    href={telLink}
                    className="font-medium text-ink tabular underline decoration-line-strong underline-offset-4 hover:text-brand hover:decoration-brand"
                  >
                    {tel.numero}
                  </a>
                ) : (
                  tel.numero
                )}
                {tel.interno ? <span className="text-ink-3"> · int. {tel.interno}</span> : null}
              </span>
            </li>
          ) : null}
          {o.horario ? (
            <li className="flex gap-2.5">
              <Clock className="mt-0.5 size-4 shrink-0 text-ink-3" aria-hidden="true" />
              <span>
                <span className="sr-only">Horario: </span>
                {o.horario}
              </span>
            </li>
          ) : null}
        </ul>

        {maps ? (
          <a
            href={maps}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-auto inline-flex items-center gap-1.5 self-start rounded-full pt-5 text-sm font-semibold text-brand hover:underline"
          >
            <Navigation className="size-4" aria-hidden="true" />
            Cómo llegar
            <span className="sr-only">
              {" "}
              a {o.nombre} en Google Maps{NEW_TAB}
            </span>
            <ArrowUpRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </a>
        ) : null}
      </article>
    </li>
  );
}

function RegionChip({
  active,
  onClick,
  count,
  dot,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  dot?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={clsx(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors lg:rounded-xl lg:px-3 lg:py-2.5",
        active
          ? "bg-night-900 text-crema-50 dark:bg-crema-100 dark:text-night-900"
          : "bg-surface text-ink-2 ring-1 ring-line hover:bg-surface-2",
      )}
    >
      {dot ? <span className={clsx("size-2 shrink-0 rounded-full", dot)} aria-hidden="true" /> : null}
      <span className="lg:flex-1 lg:text-left">{children}</span>
      <span
        className={clsx(
          "rounded-full px-1.5 text-xs tabular",
          active ? "bg-white/15 dark:bg-night-900/10" : "bg-surface-2 text-ink-3",
        )}
      >
        <span className="sr-only">(</span>
        {count}
        <span className="sr-only"> {count === 1 ? "oficina" : "oficinas"})</span>
      </span>
    </button>
  );
}
