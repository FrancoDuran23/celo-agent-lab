import { useId, useState, type ReactNode } from "react";
import { ArrowUpRight, CalendarCheck, Clock, MapPin, Navigation, Phone } from "lucide-react";
import clsx from "clsx";
import { OFICINAS, PORTAL } from "../../data/contacto";
import { LINKS } from "../../data/site";
import type { Oficina, Region } from "../../data/types";
import { ButtonLink } from "../ui/Button";
import { SectionHeader, SmartLink } from "../ui/primitives";
import { mapsHref, REGION_META, REGION_ORDER, splitPhone, telHref } from "./utils";

const CASA_CENTRAL = OFICINAS.find((o) => o.casaCentral);
const DELEGACIONES = OFICINAS.filter((o) => !o.casaCentral);

/** Delegaciones agrupadas por región, en el orden de REGION_ORDER. */
const GRUPOS = REGION_ORDER.map((r) => ({ region: r, oficinas: DELEGACIONES.filter((o) => o.region === r) })).filter(
  (g) => g.oficinas.length > 0,
);

const plural = (n: number) => (n === 1 ? "oficina" : "oficinas");

export function Oficinas({ id }: { id: string }) {
  const [region, setRegion] = useState<Region | null>(null);
  const baseId = useId();

  const visibles = region ? GRUPOS.filter((g) => g.region === region) : GRUPOS;
  const cantidad = visibles.reduce((n, g) => n + g.oficinas.length, 0);

  if (!OFICINAS.length) return null;

  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="container-page py-14 sm:py-16">
      <SectionHeader
        id={`${id}-titulo`}
        title="Oficinas"
        description="Casa Central y delegaciones. Buscá la oficina más cercana por región y recordá sacar turno antes de ir."
      />

      {CASA_CENTRAL ? <CasaCentral o={CASA_CENTRAL} /> : null}

      {GRUPOS.length ? (
        <div className="mt-12">
          <h3 className="text-xl font-bold text-ink">Delegaciones</h3>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2.5">
            <span id={`${baseId}-filtro`} className="text-sm font-semibold text-ink-2">
              Filtrar por región:
            </span>
            <div role="group" aria-labelledby={`${baseId}-filtro`} className="flex flex-wrap gap-2">
              <RegionChip active={region === null} onClick={() => setRegion(null)} count={DELEGACIONES.length}>
                Todas
              </RegionChip>
              {GRUPOS.map((g) => (
                <RegionChip
                  key={g.region}
                  active={region === g.region}
                  onClick={() => setRegion(g.region)}
                  count={g.oficinas.length}
                >
                  {REGION_META[g.region].label}
                </RegionChip>
              ))}
            </div>
          </div>

          <p className="mt-4 text-sm text-ink-3" aria-live="polite">
            <span className="font-semibold text-ink tabular">{cantidad}</span> {plural(cantidad)}
            {region ? ` en ${REGION_META[region].label}` : " en todas las regiones"}
          </p>

          <div className="mt-6 grid gap-10">
            {visibles.map((g) => {
              const headingId = `${baseId}-${g.region}`;
              return (
                <div key={g.region} role="group" aria-labelledby={headingId} className="min-w-0">
                  <h4 id={headingId} className="text-lg font-semibold text-ink">
                    {REGION_META[g.region].label}{" "}
                    <span className="text-sm font-normal text-ink-3 tabular">
                      · {g.oficinas.length} {plural(g.oficinas.length)}
                    </span>
                  </h4>
                  <ul className="mt-3 border-b border-line">
                    {g.oficinas.map((o) => (
                      <OfficeRow key={o.nombre} o={o} />
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <p className="prose-measure mt-8 text-sm text-ink-3">
            Las direcciones y teléfonos pueden cambiar. Confirmalos antes de ir en la página de{" "}
            <SmartLink to={LINKS.delegaciones} className="link">
              delegaciones del sitio oficial
            </SmartLink>
            .
          </p>
        </div>
      ) : null}
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
      className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-8 rounded-xl border border-line bg-surface-2 p-5 sm:p-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-12"
    >
      <div className="min-w-0">
        <h3 id="casa-central-titulo" className="text-xl font-bold text-ink sm:text-2xl">
          {o.nombre}
        </h3>
        <p className="mt-1 text-ink-3">{o.localidad}</p>

        <dl className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-[repeat(2,minmax(0,1fr))]">
          {o.direccion ? (
            <Dato icon={<MapPin aria-hidden="true" />} label="Dirección">
              {o.direccion}
            </Dato>
          ) : null}
          {o.horario ? (
            <Dato icon={<Clock aria-hidden="true" />} label="Horario">
              {o.horario}
            </Dato>
          ) : null}
          {tel ? (
            <Dato icon={<Phone aria-hidden="true" />} label="Teléfono">
              {telLink ? (
                <a href={telLink} className="link tabular">
                  {tel.numero}
                </a>
              ) : (
                <span className="tabular">{tel.numero}</span>
              )}
              {tel.interno ? <span className="font-normal text-ink-3"> · int. {tel.interno}</span> : null}
            </Dato>
          ) : null}
        </dl>
      </div>

      <div className="min-w-0 border-t border-line-strong pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
        <p className="font-semibold text-ink">Antes de ir</p>
        <p className="mt-1 text-ink-2">
          Sacá tu turno web y llevá la documentación que pida tu trámite. Para consultas, usá los canales de atención sin
          moverte de tu casa.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink to={PORTAL.turnos.href}>
            <CalendarCheck aria-hidden="true" />
            Sacar turno
          </ButtonLink>
          {maps ? (
            <ButtonLink to={maps} variant="secondary">
              <Navigation aria-hidden="true" />
              Cómo llegar
              <span className="sr-only"> a {o.nombre} en Google Maps</span>
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function Dato({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1.5 text-sm text-ink-3 [&_svg]:size-4 [&_svg]:shrink-0">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 text-lg font-semibold text-ink">{children}</dd>
    </div>
  );
}

function OfficeRow({ o }: { o: Oficina }) {
  const tel = o.telefono ? splitPhone(o.telefono) : null;
  const telLink = tel ? telHref(tel.numero) : null;
  const maps = mapsHref(o);

  return (
    <li className="grid grid-cols-[minmax(0,1fr)] gap-x-6 gap-y-1 border-t border-line py-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.5fr)_minmax(0,0.9fr)_auto] md:items-baseline">
      <div className="min-w-0">
        <p className="font-semibold text-ink">{o.nombre}</p>
        {o.horario ? (
          <p className="text-sm text-ink-3">
            <span className="sr-only">Horario: </span>
            {o.horario}
          </p>
        ) : null}
      </div>

      <p className="min-w-0 text-ink-2">
        <span className="sr-only">Dirección: </span>
        {o.direccion ? <>{o.direccion}, </> : null}
        <span className="text-ink-3">{o.localidad}</span>
      </p>

      {/* En móvil, teléfono y "Cómo llegar" comparten renglón; en escritorio son columnas. */}
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 md:contents">
        {tel ? (
          <p className="min-w-0">
            <span className="sr-only">Teléfono: </span>
            {telLink ? (
              <a href={telLink} className="link tabular whitespace-nowrap">
                {tel.numero}
              </a>
            ) : (
              <span className="tabular">{tel.numero}</span>
            )}
            {tel.interno ? <span className="text-ink-3"> · int. {tel.interno}</span> : null}
          </p>
        ) : (
          <span className="hidden md:block" aria-hidden="true" />
        )}

        {maps ? (
          <p className="md:text-right">
            <SmartLink
              to={maps}
              className="link inline-flex items-center gap-1 text-[0.95rem] font-semibold whitespace-nowrap"
            >
              Cómo llegar
              <span className="sr-only"> a {o.nombre} en Google Maps</span>
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </SmartLink>
          </p>
        ) : (
          <span className="hidden md:block" aria-hidden="true" />
        )}
      </div>
    </li>
  );
}

function RegionChip({
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
        "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition-colors",
        active ? "bg-ink text-bg" : "bg-surface text-ink-2 ring-1 ring-line-strong ring-inset hover:bg-surface-2",
      )}
    >
      {children}
      <span className={clsx("tabular", active ? "opacity-75" : "text-ink-3")}>
        <span className="sr-only"> (</span>
        {count}
        <span className="sr-only"> {plural(count)})</span>
      </span>
    </button>
  );
}
