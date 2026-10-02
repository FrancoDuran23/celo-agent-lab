import type { ReactNode } from "react";
import { ArrowUpRight, AtSign, Receipt, Smartphone, Store } from "lucide-react";
import { MEDIOS_DE_PAGO, REDES } from "../../data/contacto";
import { LINKS } from "../../data/site";
import { ButtonLink } from "../ui/Button";
import { NEW_TAB } from "./utils";

export function PagosYRedes({ id }: { id: string }) {
  return (
    <div className="container-page grid gap-4 py-20 sm:py-24 lg:grid-cols-[1.6fr_1fr]">
      <MediosDePago id={id} />
      {REDES.length ? <Redes /> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function MediosDePago({ id }: { id: string }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className="relative scroll-mt-24 overflow-hidden rounded-3xl bg-surface p-6 ring-1 ring-line sm:p-8 lg:p-10"
    >
      <p className="eyebrow mb-3">Medios de pago</p>
      <h2 id={`${id}-titulo`} className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Pagá{" "}
        <span className="font-serif font-normal tracking-normal text-brand italic">como te quede cómodo.</span>
      </h2>
      <p className="mt-3 max-w-xl text-lg leading-relaxed text-ink-3">
        Pagá en línea desde el celular o la compu, o de forma presencial en las bocas de cobro habilitadas.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Grupo
          titulo="En línea"
          icon={<Smartphone className="size-5" aria-hidden="true" />}
          tint="tint-salvia"
          items={MEDIOS_DE_PAGO.digitales}
        />
        <Grupo
          titulo="Presenciales"
          icon={<Store className="size-5" aria-hidden="true" />}
          tint="tint-ocre"
          items={MEDIOS_DE_PAGO.presenciales}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-6">
        <ButtonLink to={LINKS.pagar}>
          <Receipt aria-hidden="true" />
          Pagar en línea
          <span className="sr-only">{NEW_TAB}</span>
        </ButtonLink>
        <a
          href={LINKS.mediosDePago}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 rounded-full text-sm font-semibold text-brand hover:underline"
        >
          Medios y lugares de pago
          <ArrowUpRight
            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
          <span className="sr-only">{NEW_TAB}</span>
        </a>
      </div>
    </section>
  );
}

function Grupo({
  titulo,
  icon,
  tint,
  items,
}: {
  titulo: string;
  icon: ReactNode;
  tint: string;
  items: readonly string[];
}) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="flex items-center gap-3 font-semibold text-ink">
        <span className={`inline-flex size-9 items-center justify-center rounded-lg ${tint}`}>{icon}</span>
        {titulo}
      </h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map((m) => (
          <li
            key={m}
            className="rounded-full bg-surface-2 px-3 py-1.5 text-sm font-medium text-ink-2 ring-1 ring-line ring-inset"
          >
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
    <section
      aria-labelledby="redes-titulo"
      className="relative flex flex-col overflow-hidden rounded-3xl bg-surface p-6 ring-1 ring-line sm:p-8 lg:p-10"
    >
      <p className="eyebrow mb-3">Redes oficiales</p>
      <h2 id="redes-titulo" className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Seguinos.
      </h2>
      <p className="mt-3 text-lg leading-relaxed text-ink-3">
        Las cuentas oficiales de la Dirección Provincial de Rentas.
      </p>
      <ul className="mt-8 grid gap-2.5" aria-label="Redes sociales">
        {REDES.map((r) => (
          <li key={r.href}>
            <a
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-full bg-surface-2/70 py-2 pr-4 pl-2 ring-1 ring-line transition-colors hover:bg-surface-2 hover:ring-line-strong"
            >
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-surface text-ink ring-1 ring-line">
                <RedGlyph nombre={r.nombre} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-semibold text-ink">{r.nombre}</span>{" "}
                <span className="text-sm text-ink-3">{r.usuario}</span>
              </span>
              <ArrowUpRight
                className="size-4 shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
              <span className="sr-only">{NEW_TAB}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Glifos simples y monocromos (lucide ya no incluye marcas). */
function RedGlyph({ nombre }: { nombre: string }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "size-[1.05rem]",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (nombre.toLowerCase()) {
    case "instagram":
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common}>
          <path d="M14.5 8.5H16V5h-2.2C11.6 5 10.5 6.4 10.5 8.6V10.5H8.5v3h2V20h3v-6.5h2.2l.4-3h-2.6V9.3c0-.5.3-.8 1-.8Z" />
        </svg>
      );
    case "x":
    case "twitter":
      return (
        <svg {...common}>
          <path d="M5 4.5h3.6L19 19.5h-3.6Z" />
          <path d="M18.6 4.5 12.9 11M11.1 13l-5.7 6.5" />
        </svg>
      );
    default:
      return <AtSign className="size-4" aria-hidden="true" />;
  }
}
