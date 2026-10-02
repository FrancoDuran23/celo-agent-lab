import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, CalendarDays, LogIn, Search } from "lucide-react";
import { ShaderCanvas } from "../../gpu/ShaderCanvas";
import { ButtonLink } from "../ui/Button";
import { PORTAL } from "../../data/contacto";
import { QuebradaFallback } from "./QuebradaFallback";

const SUGERENCIAS = [
  { label: "Libre deuda", q: "libre deuda" },
  { label: "Plan de pagos", q: "plan de pagos" },
  { label: "Pagar Inmobiliario", q: "inmobiliario" },
  { label: "Ingresos Brutos", q: "ingresos brutos" },
];

export function Hero() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/tramites?q=${encodeURIComponent(q.trim())}` : "/tramites");
  };

  return (
    <section
      aria-labelledby="hero-titulo"
      className="relative isolate -mt-[calc(4rem+1px)] overflow-hidden bg-night-900 text-crema-50 lg:-mt-[calc(4.5rem+1px)]"
    >
      <ShaderCanvas
        shader="quebrada"
        interactive
        className="absolute inset-0 -z-10"
        fallback={<QuebradaFallback />}
      />
      {/* Velo para legibilidad del texto sobre el shader */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(7_15_28/0.82)_0%,rgb(7_15_28/0.55)_42%,rgb(7_15_28/0)_75%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-[rgb(7_15_28/0.55)]"
      />

      <div className="container-page pt-32 pb-24 sm:pt-40 lg:pt-48 lg:pb-32">
        <div className="max-w-2xl">
          <p className="animate-rise inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-[0.8rem] font-medium text-crema-100/90 ring-1 ring-white/15 backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-ocre-500" aria-hidden="true" />
            Dirección Provincial de Rentas · Jujuy
          </p>
          <h1
            id="hero-titulo"
            className="animate-rise mt-6 text-[2.6rem] leading-[1.04] font-semibold tracking-[-0.03em] [animation-delay:80ms] sm:text-6xl lg:text-[4.25rem]"
          >
            Tus impuestos,{" "}
            <span className="font-serif font-normal tracking-normal text-ocre-300 italic">claros y en línea.</span>
          </h1>
          <p className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-crema-100/80 [animation-delay:160ms] sm:text-xl">
            Pagá, consultá tu deuda, sacá turno y hacé tus trámites desde donde estés. Sin filas y con atención
            humana cuando la necesites.
          </p>

          <form
            role="search"
            onSubmit={submit}
            className="animate-rise mt-9 [animation-delay:240ms]"
            aria-label="Buscar trámites"
          >
            <label htmlFor="hero-buscar" className="sr-only">
              ¿Qué necesitás hacer?
            </label>
            <div className="flex items-center gap-2 rounded-2xl bg-crema-50 p-2 pl-4 text-night-900 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.6)] ring-1 ring-white/40 focus-within:ring-2 focus-within:ring-ocre-500">
              <Search className="size-5 shrink-0 text-night-600" aria-hidden="true" />
              <input
                id="hero-buscar"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="¿Qué necesitás hacer? Ej.: libre deuda"
                autoComplete="off"
                className="h-11 min-w-0 flex-1 bg-transparent text-base placeholder:text-night-600/70 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-night-900 px-4 text-sm font-semibold text-crema-50 transition-colors hover:bg-night-700 sm:px-5"
              >
                <span className="hidden sm:inline">Buscar</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </form>

          <div className="animate-rise mt-4 flex flex-wrap items-center gap-2 text-sm [animation-delay:300ms]">
            <span className="text-crema-100/60">Más buscados:</span>
            {SUGERENCIAS.map((s) => (
              <Link
                key={s.q}
                to={`/tramites?q=${encodeURIComponent(s.q)}`}
                className="rounded-full bg-white/8 px-3 py-1 text-crema-100/90 ring-1 ring-white/15 backdrop-blur-sm transition-colors hover:bg-white/15 hover:text-white"
              >
                {s.label}
              </Link>
            ))}
          </div>

          <div className="animate-rise mt-10 flex flex-wrap gap-3 [animation-delay:360ms]">
            <ButtonLink to={PORTAL.clave.href} variant="light" size="lg">
              <LogIn aria-hidden="true" />
              {PORTAL.clave.ctaLargo}
            </ButtonLink>
            <ButtonLink to="/vencimientos" variant="outline-light" size="lg">
              <CalendarDays aria-hidden="true" />
              Ver vencimientos
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
