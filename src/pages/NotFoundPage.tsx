import { useId, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { ArrowRight, CalendarDays, FileText, Headset, House, Search, type LucideIcon } from "lucide-react";
import clsx from "clsx";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { SmartLink } from "../components/ui/primitives";

const ACCESOS: { to: string; label: string; detalle: string; icon: LucideIcon; tint: string }[] = [
  { to: "/", label: "Inicio", detalle: "Volvé a la portada del sitio.", icon: House, tint: "tint-terracota" },
  { to: "/tramites", label: "Trámites", detalle: "Buscá y filtrá todos los trámites.", icon: FileText, tint: "tint-ocre" },
  {
    to: "/vencimientos",
    label: "Vencimientos",
    detalle: "Consultá el calendario de vencimientos.",
    icon: CalendarDays,
    tint: "tint-salvia",
  },
  { to: "/atencion", label: "Atención", detalle: "Canales, oficinas y turnos.", icon: Headset, tint: "tint-violeta" },
];

export function NotFoundPage() {
  useDocumentTitle("Página no encontrada");
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    navigate(term ? `/tramites?q=${encodeURIComponent(term)}` : "/tramites");
  };

  return (
    <>
      <section
        aria-labelledby="nf-titulo"
        className="relative isolate overflow-hidden border-b border-line bg-gradient-to-b from-surface-2/70 to-bg"
      >
        <div className="container-page grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16 lg:py-24">
          <div className="animate-rise">
            <p className="eyebrow">Error 404 · Página no encontrada</p>
            <h1
              id="nf-titulo"
              className="mt-4 text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.03em] text-ink sm:text-6xl"
            >
              Te perdiste en la{" "}
              <span className="font-serif font-normal tracking-normal text-brand italic">quebrada.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-3">
              La página que buscás no existe o cambió de lugar. Puede que el enlace esté desactualizado o que la
              dirección tenga un error de tipeo.
            </p>
            {pathname !== "/" ? (
              <p className="mt-4 text-sm text-ink-3">
                Dirección solicitada:{" "}
                <code className="rounded-md bg-surface-3/70 px-1.5 py-0.5 font-mono text-[0.82rem] break-all text-ink-2">
                  {pathname}
                </code>
              </p>
            ) : null}

            <form role="search" aria-label="Buscar trámites" onSubmit={submit} className="mt-8 max-w-xl">
              <label htmlFor="nf-buscar" className="mb-2 block text-sm font-medium text-ink-2">
                ¿Qué estabas buscando?
              </label>
              <div className="flex items-center gap-2 rounded-2xl bg-surface p-2 pl-4 shadow-soft ring-1 ring-line focus-within:ring-2 focus-within:ring-focus">
                <Search className="size-5 shrink-0 text-ink-3" aria-hidden="true" />
                <input
                  id="nf-buscar"
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Ej.: libre deuda, boleta…"
                  autoComplete="off"
                  enterKeyHint="search"
                  className="h-11 min-w-0 flex-1 bg-transparent text-base text-ink placeholder:text-ink-3 focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-hover sm:px-5"
                >
                  <span className="hidden sm:inline">Buscar trámite</span>
                  <span className="sr-only sm:hidden">Buscar</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            </form>
          </div>

          <div className="order-first lg:order-last">
            <HillsIllustration />
          </div>
        </div>
      </section>

      <section aria-labelledby="nf-accesos" className="container-page py-14 sm:py-20">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-2">Retomá el camino</p>
            <h2 id="nf-accesos" className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Accesos que te pueden servir
            </h2>
          </div>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {ACCESOS.map((a) => (
            <li key={a.to}>
              <SmartLink
                to={a.to}
                className="group flex h-full flex-col gap-4 rounded-2xl bg-surface p-4 ring-1 ring-line transition-[box-shadow,transform] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:shadow-lift hover:ring-line-strong sm:gap-5 sm:p-6"
              >
                <span className="flex items-center justify-between">
                  <span className={clsx("inline-flex size-11 items-center justify-center rounded-xl", a.tint)}>
                    <a.icon className="size-5" aria-hidden="true" />
                  </span>
                  <ArrowRight
                    className="size-4 text-ink-3 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-brand"
                    aria-hidden="true"
                  />
                </span>
                <span>
                  <span className="block font-semibold text-ink group-hover:text-brand">{a.label}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-ink-3">{a.detalle}</span>
                </span>
              </SmartLink>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

/**
 * Estratos del Cerro de los Siete Colores con un "404" detrás y un
 * sendero punteado que se pierde entre los cerros. Puramente decorativo.
 */
function HillsIllustration() {
  const uid = useId().replace(/:/g, "");
  const sky = `nf-sky-${uid}`;
  const glow = `nf-glow-${uid}`;

  return (
    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-3xl shadow-soft ring-1 ring-line sm:max-w-md lg:mx-auto lg:aspect-[5/4] lg:max-w-xl">
      <svg
        viewBox="0 0 500 400"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 size-full"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: "var(--surface-2)" }} />
            <stop offset="1" style={{ stopColor: "var(--accent-soft)" }} />
          </linearGradient>
          <radialGradient id={glow} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" style={{ stopColor: "var(--ocre-300)", stopOpacity: 0.55 }} />
            <stop offset="1" style={{ stopColor: "var(--ocre-300)", stopOpacity: 0 }} />
          </radialGradient>
        </defs>

        <rect width="500" height="400" fill={`url(#${sky})`} />

        {/* Estrellas: sólo en modo oscuro */}
        <g className="fill-crema-100 opacity-0 dark:opacity-70">
          <circle cx="60" cy="48" r="1.4" />
          <circle cx="132" cy="92" r="1" />
          <circle cx="210" cy="36" r="1.2" />
          <circle cx="302" cy="70" r="0.9" />
          <circle cx="440" cy="40" r="1.3" />
          <circle cx="470" cy="118" r="1" />
          <circle cx="28" cy="130" r="0.9" />
        </g>

        {/* Sol tras los cerros */}
        <circle cx="400" cy="118" r="72" fill={`url(#${glow})`} />
        <circle cx="400" cy="118" r="22" className="fill-ocre-300" />

        {/* Dos cóndores a lo lejos */}
        <g fill="none" className="stroke-ink-3" strokeWidth="1.6" strokeLinecap="round" style={{ opacity: 0.55 }}>
          <path d="M96 128 q7 -6 14 0 q7 -6 14 0" />
          <path d="M136 108 q5 -4.5 10 0 q5 -4.5 10 0" />
        </g>

        {/* "404" detrás de los estratos */}
        <text
          x="232"
          y="232"
          textAnchor="middle"
          className="fill-ink font-serif italic"
          style={{ fontSize: 168, opacity: 0.11 }}
        >
          404
        </text>

        {/* Estratos: violeta, salvia, rosa, ocre, terracota (algo atenuados en modo oscuro) */}
        <g className="dark:opacity-90">
          <path d="M0 250 C70 214 130 204 196 222 S330 192 400 176 S470 176 500 168 V400 H0Z" className="fill-violeta-500" />
          <path d="M0 280 C80 250 150 244 218 262 S350 232 420 224 S480 220 500 216 V400 H0Z" className="fill-salvia-500" />
          <path d="M0 308 C76 284 158 278 232 294 S362 270 432 262 S484 258 500 256 V400 H0Z" className="fill-rosa-500" />
          <path d="M0 336 C90 314 168 310 244 322 S376 304 446 298 S488 296 500 295 V400 H0Z" className="fill-ocre-500" />
          <path d="M0 364 C96 346 180 344 258 352 S390 338 456 334 S490 332 500 332 V400 H0Z" className="fill-terracota-500" />
        </g>

        {/* Sendero que se pierde entre los cerros */}
        <path
          d="M150 400 C172 380 214 374 228 356 S214 322 250 306 S298 292 306 270"
          fill="none"
          className="stroke-crema-50"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="1 11"
          style={{ opacity: 0.85 }}
        />
        <circle cx="306" cy="270" r="4.5" className="fill-crema-50" style={{ opacity: 0.95 }} />
        <circle cx="306" cy="270" r="10" fill="none" className="stroke-crema-50" strokeWidth="1.5" style={{ opacity: 0.5 }} />
      </svg>
    </div>
  );
}
