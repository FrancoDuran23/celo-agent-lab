import type { ReactNode } from "react";
import { Receipt, Smartphone, Store } from "lucide-react";
import { MEDIOS_DE_PAGO, PORTAL, REDES } from "../../data/contacto";
import { LINKS } from "../../data/site";
import { ButtonLink } from "../ui/Button";
import { ArrowLink, SectionHeader, SmartLink } from "../ui/primitives";

export function PagosYRedes({ id }: { id: string }) {
  return (
    <div className="container-page grid grid-cols-[minmax(0,1fr)] gap-12 py-14 sm:py-16 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16">
      <MediosDePago id={id} />
      {REDES.length ? <Redes /> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function MediosDePago({ id }: { id: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="min-w-0">
      <SectionHeader
        id={`${id}-titulo`}
        title="Medios de pago"
        description="Pagá en línea desde el celular o la compu, o de forma presencial en las bocas de cobro habilitadas."
      />

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-8 sm:grid-cols-[repeat(2,minmax(0,1fr))]">
        <Grupo titulo="En línea" icon={<Smartphone aria-hidden="true" />} items={MEDIOS_DE_PAGO.digitales} />
        <Grupo titulo="Presenciales" icon={<Store aria-hidden="true" />} items={MEDIOS_DE_PAGO.presenciales} />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
        <ButtonLink to={LINKS.pagar}>
          <Receipt aria-hidden="true" />
          Pagar en línea
        </ButtonLink>
        <ArrowLink to={LINKS.mediosDePago}>Medios y lugares de pago</ArrowLink>
      </div>
    </section>
  );
}

function Grupo({ titulo, icon, items }: { titulo: string; icon: ReactNode; items: readonly string[] }) {
  if (!items.length) return null;
  return (
    <div className="min-w-0">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-ink [&_svg]:size-5 [&_svg]:shrink-0 [&_svg]:text-ink-3">
        {icon}
        {titulo}
      </h3>
      <ul className="mt-3 border-b border-line">
        {items.map((m) => (
          <li key={m} className="border-t border-line py-2.5 text-ink-2">
            {m}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Redes() {
  return (
    <section aria-labelledby="redes-titulo" className="min-w-0">
      <SectionHeader
        id="redes-titulo"
        title="Redes oficiales"
        description="Las cuentas oficiales de la Dirección Provincial de Rentas."
      />
      <ul className="mt-6 border-b border-line" aria-label="Redes sociales">
        {REDES.map((r) => (
          // En táctil el enlace mide 44×44px (la "X" sola son 11px); el py menor compensa la altura de la fila.
          <li key={r.href} className="flex flex-wrap items-baseline gap-x-2 border-t border-line py-3 coarse:py-1">
            <SmartLink
              to={r.href}
              className="link font-semibold coarse:inline-flex coarse:min-h-11 coarse:min-w-11 coarse:items-center coarse:justify-center"
            >
              {r.nombre}
              {r.nombre === "X" ? <span className="sr-only"> (Twitter)</span> : null}
            </SmartLink>
            <span className="text-sm text-ink-3">{r.usuario}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-ink-3">
        Sitio oficial:{" "}
        <SmartLink to={PORTAL.sitioOficial} className="link [overflow-wrap:anywhere]">
          {PORTAL.sitioOficial.replace(/^https?:\/\//, "")}
        </SmartLink>
      </p>
    </section>
  );
}
