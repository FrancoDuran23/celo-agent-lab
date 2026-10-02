import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { CalendarClock, ChevronRight, House, LogIn, Search } from "lucide-react";
import { ShaderCanvas } from "../../gpu/ShaderCanvas";
import { LINKS } from "../../data/site";
import { PORTAL } from "../../data/contacto";
import { SmartLink } from "../ui/primitives";

const MAS_BUSCADOS = [
  { label: "Libre deuda", q: "libre deuda" },
  { label: "Plan de pagos", q: "plan de pagos" },
  { label: "Constancia de inscripción", q: "constancia" },
  { label: "Sellos", q: "sellos" },
];

/** Accesos directos: uno por necesidad típica de cada perfil. */
const ACCESOS = [
  {
    href: PORTAL.clave.href,
    titulo: "Ingresar con clave fiscal",
    detalle: "DDJJ, certificados, planes y más",
    icon: LogIn,
  },
  {
    href: LINKS.inmobiliarioSinClave,
    titulo: "Pagar el Inmobiliario",
    detalle: "Con el padrón o el CUIT, sin clave",
    icon: House,
  },
  {
    href: PORTAL.turnos.href,
    titulo: "Sacar un turno",
    detalle: "Atención en Casa Central o delegaciones",
    icon: CalendarClock,
  },
];

export function Hero() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/tramites?q=${encodeURIComponent(q.trim())}` : "/tramites");
  };

  return (
    <section aria-labelledby="hero-titulo" className="relative isolate overflow-hidden bg-band text-band-ink">
      <ShaderCanvas
        shader="luz"
        interactive
        className="absolute inset-0 -z-10"
        fallback={<div className="h-full w-full bg-[linear-gradient(110deg,#08285f_0%,#0e3a86_55%,#1a4ea6_100%)]" />}
      />

      <div className="container-page grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_22rem] lg:items-center lg:gap-16 lg:py-20">
        <div>
          <h1 id="hero-titulo" className="text-[2.25rem] font-bold sm:text-5xl">
            ¿Qué necesitás hacer?
          </h1>
          <p className="mt-4 max-w-xl text-lg text-band-ink-2">
            Pagá, consultá tu deuda, sacá turno y hacé tus trámites de impuestos provinciales desde donde estés.
          </p>

          <form role="search" onSubmit={submit} className="mt-8 max-w-2xl" aria-label="Buscar trámites">
            <label htmlFor="hero-buscar" className="mb-2 block text-sm font-semibold">
              Buscar un trámite
            </label>
            <div className="flex gap-2">
              <input
                id="hero-buscar"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Por ejemplo: libre deuda"
                autoComplete="off"
                className="h-13 min-w-0 flex-1 rounded-lg border-2 border-transparent bg-surface px-4 text-base text-ink placeholder:text-ink-3 focus:border-focus-ink focus:shadow-none focus:outline-[3px] focus:outline-offset-0 focus:outline-focus"
              />
              <button
                type="submit"
                className="inline-flex h-13 items-center gap-2 rounded-lg bg-ink px-5 font-semibold text-bg transition-colors hover:bg-ink-2"
              >
                <Search className="size-5" aria-hidden="true" />
                <span className="max-sm:sr-only">Buscar</span>
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-2 text-[0.95rem]">
            <span className="text-band-ink-2">Más buscados:</span>
            {MAS_BUSCADOS.map((s) => (
              <Link
                key={s.q}
                to={`/tramites?q=${encodeURIComponent(s.q)}`}
                className="font-semibold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>

        <nav aria-label="Accesos directos" className="rounded-xl bg-surface p-2 text-ink">
          <ul>
            {ACCESOS.map((a) => (
              <li key={a.titulo}>
                <SmartLink
                  to={a.href}
                  className="group flex items-center gap-3.5 rounded-lg px-3 py-3 transition-colors hover:bg-surface-2"
                >
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                    <a.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold group-hover:underline">{a.titulo}</span>
                    <span className="block text-sm text-ink-3">{a.detalle}</span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-ink-3" aria-hidden="true" />
                </SmartLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
