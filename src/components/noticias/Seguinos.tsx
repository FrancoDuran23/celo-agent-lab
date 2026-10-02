import { ArrowUpRight, AtSign } from "lucide-react";
import { REDES } from "../../data/contacto";
import { normalize } from "../../lib/search";
import { CtaBand } from "../home/CtaBand";
import { NEW_TAB_NOTE } from "./categorias";

/** Franja de cierre con las cuentas oficiales (REDES), sobre el aguayo. */
export function Seguinos() {
  if (!REDES.length) return null;
  return (
    <div className="container-page pb-20 sm:pb-24">
      <CtaBand className="dark:ring-1 dark:ring-white/10">
        <div
          aria-labelledby="seguinos-titulo"
          role="region"
          className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12 lg:p-12"
        >
          <div>
            <p className="eyebrow !text-crema-200/70">Redes oficiales</p>
            <h2 id="seguinos-titulo" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Seguinos{" "}
              <span className="font-serif font-normal tracking-normal text-ocre-300 italic">en redes.</span>
            </h2>
            <p className="mt-3 max-w-md text-lg leading-relaxed text-crema-100/80">
              Las cuentas oficiales de la Dirección Provincial de Rentas.
            </p>
          </div>
          <ul className="grid gap-2.5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3" aria-label="Redes sociales">
            {REDES.map((r) => (
              <li key={r.href}>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-2xl bg-white/8 py-2.5 pr-4 pl-2.5 ring-1 ring-white/15 backdrop-blur-sm transition-colors hover:bg-white/15 hover:ring-white/30 focus-visible:outline-ocre-300"
                >
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-crema-50 text-night-900">
                    <RedGlyph nombre={r.nombre} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-crema-200/75">{r.nombre}</span>
                    <span className="block truncate font-semibold text-crema-50">{r.usuario}</span>
                  </span>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-crema-200/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{NEW_TAB_NOTE}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </CtaBand>
    </div>
  );
}

/** Glifos simples de cada red (lucide no incluye marcas). */
function RedGlyph({ nombre }: { nombre: string }) {
  const common = { className: "size-5", "aria-hidden": true, focusable: false, viewBox: "0 0 24 24" } as const;
  switch (normalize(nombre)) {
    case "instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common} fill="currentColor">
          <path d="M13.5 21v-7.5h2.6l.4-3.1h-3V8.5c0-.9.3-1.5 1.6-1.5h1.6V4.2c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.3H7.9v3.1h2.6V21h3Z" />
        </svg>
      );
    case "x":
    case "twitter":
      return (
        <svg {...common} fill="currentColor">
          <path d="M17.2 3.5h2.9l-6.4 7.3 7.5 9.7h-5.9l-4.6-6-5.3 6H2.5l6.8-7.8L2.1 3.5h6l4.2 5.5 4.9-5.5Zm-1 15.3h1.6L7.9 5.1H6.2l10 13.7Z" />
        </svg>
      );
    default:
      return <AtSign className="size-5" aria-hidden="true" />;
  }
}
