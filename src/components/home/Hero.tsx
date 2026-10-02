import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Search } from "lucide-react";
import { ShaderCanvas } from "../../gpu/ShaderCanvas";
import { LINKS } from "../../data/site";
import { PORTAL } from "../../data/contacto";
import { useResolvedTheme } from "../../lib/theme";
import { SmartLink } from "../ui/primitives";

const MAS_BUSCADOS = [
  { label: "Libre deuda", q: "libre deuda" },
  { label: "Plan de pagos", q: "plan de pagos" },
  { label: "Constancia de inscripción", q: "constancia" },
  { label: "Sellos", q: "sellos" },
];

/** Accesos directos: uno por necesidad típica de cada perfil. */
const ACCESOS = [
  { href: PORTAL.clave.href, titulo: "Ingresar con clave fiscal", detalle: "DDJJ, certificados, planes de pago y más." },
  { href: LINKS.inmobiliarioSinClave, titulo: "Pagar el Inmobiliario", detalle: "Con el padrón o el CUIT, sin clave fiscal." },
  { href: PORTAL.turnos.href, titulo: "Sacar un turno", detalle: "Atención en Casa Central o en una delegación." },
];

/** Colores del velo vgpu por tema (sRGB 0..1). */
const LUZ = {
  light: { top: [1, 1, 1], bottom: [0.957, 0.976, 0.992], glow: [0.78, 0.89, 0.97], amount: 0.75 },
  dark: { top: [0.051, 0.067, 0.09], bottom: [0.058, 0.077, 0.104], glow: [0.07, 0.11, 0.15], amount: 0.45 },
} as const;

export function Hero() {
  const navigate = useNavigate();
  const theme = useResolvedTheme();
  const [q, setQ] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/tramites?q=${encodeURIComponent(q.trim())}` : "/tramites");
  };

  return (
    <section aria-labelledby="hero-titulo" className="relative isolate overflow-hidden border-b border-line bg-bg">
      <ShaderCanvas
        shader="luz"
        interactive
        uniforms={LUZ[theme]}
        className="absolute inset-0 -z-10"
        fallback={<div className="h-full w-full bg-bg" />}
      />

      <div className="container-page grid gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16 lg:py-20">
        <div>
          <h1 id="hero-titulo" className="text-[2.25rem] font-bold text-ink sm:text-5xl">
            ¿Qué necesitás hacer?
          </h1>
          <p className="mt-4 max-w-xl text-lg text-ink-2">
            Pagá, consultá tu deuda, sacá turno y hacé tus trámites de impuestos provinciales desde donde estés.
          </p>

          <form role="search" onSubmit={submit} className="mt-8 max-w-2xl" aria-label="Buscar trámites">
            <label htmlFor="hero-buscar" className="mb-2 block font-semibold text-ink">
              Buscar un trámite
            </label>
            <div className="flex">
              <input
                id="hero-buscar"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Por ejemplo: libre deuda"
                autoComplete="off"
                className="h-13 min-w-0 flex-1 rounded-l-lg border-2 border-r-0 border-ink bg-surface px-4 text-base text-ink placeholder:text-ink-3 focus:shadow-none focus:outline-[3px] focus:outline-offset-0 focus:outline-focus"
              />
              <button
                type="submit"
                className="inline-flex h-13 items-center gap-2 rounded-r-lg bg-brand px-5 font-semibold text-brand-ink transition-colors hover:bg-brand-hover"
              >
                <Search className="size-5" aria-hidden="true" />
                <span className="max-sm:sr-only">Buscar</span>
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-2 text-[0.95rem]">
            <span className="text-ink-3">Más buscados:</span>
            {MAS_BUSCADOS.map((s) => (
              <Link key={s.q} to={`/tramites?q=${encodeURIComponent(s.q)}`} className="link font-semibold">
                {s.label}
              </Link>
            ))}
          </div>
        </div>

        <nav aria-labelledby="accesos-titulo" className="lg:border-l lg:border-line lg:pl-10">
          <h2 id="accesos-titulo" className="text-lg font-bold text-ink">
            Accesos directos
          </h2>
          <ul className="mt-3">
            {ACCESOS.map((a) => (
              <li key={a.titulo} className="border-t border-line py-3.5 first:border-t-0 first:pt-2">
                <SmartLink to={a.href} className="link text-[1.05rem] font-semibold">
                  {a.titulo}
                </SmartLink>
                <p className="mt-0.5 text-[0.95rem] text-ink-3">{a.detalle}</p>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
