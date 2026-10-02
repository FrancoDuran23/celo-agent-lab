import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowUpRight, Headset, Search } from "lucide-react";
import { ShaderCanvas } from "../gpu/ShaderCanvas";
import { GLOSARIO, PREGUNTAS_GENERALES, PRIMEROS_PASOS, RECURSOS } from "../data/ayuda";
import { TRAMITES } from "../data/tramites";
import { normalize, searchTramites } from "../lib/search";
import { Icon } from "../lib/icons";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { ButtonLink } from "../components/ui/Button";
import { SectionHeader, SmartLink } from "../components/ui/primitives";

function matches(q: string, ...fields: string[]) {
  const terms = normalize(q).split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const hay = normalize(fields.join(" "));
  return terms.every((t) => hay.includes(t));
}

export function AyudaPage() {
  useDocumentTitle("Centro de ayuda");
  const [q, setQ] = useState("");

  const glosario = useMemo(() => GLOSARIO.filter((g) => matches(q, g.termino, g.definicion)), [q]);
  const preguntas = useMemo(() => PREGUNTAS_GENERALES.filter((p) => matches(q, p.pregunta, p.respuesta)), [q]);
  const tramites = useMemo(() => (q.trim() ? searchTramites(TRAMITES, q, 3) : []), [q]);
  const sinResultados = q.trim() && !glosario.length && !preguntas.length && !tramites.length;

  return (
    <>
      {/* Encabezado sobre el shader "aurora" (siempre claro, también en modo oscuro) */}
      <div className="container-page pt-8 sm:pt-10">
        <section
          aria-labelledby="ayuda-titulo"
          className="relative isolate overflow-hidden rounded-3xl bg-crema-100 px-6 py-14 text-night-900 ring-1 ring-line sm:px-12 sm:py-20"
        >
          <ShaderCanvas
            shader="aurora"
            className="absolute inset-0 -z-10"
            fallback={
              <div className="h-full w-full bg-[radial-gradient(60%_80%_at_80%_10%,rgb(224_166_59/0.35),transparent_60%),radial-gradient(50%_70%_at_10%_90%,rgb(217_135_127/0.3),transparent_60%),#f5ecdd]" />
            }
          />
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs tracking-[0.14em] text-night-700/70 uppercase">Centro de ayuda</p>
            <h1 id="ayuda-titulo" className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              ¿En qué te{" "}
              <span className="font-serif font-normal tracking-normal text-[#a8401f] italic">ayudamos?</span>
            </h1>
            <p className="mt-4 text-lg text-night-700/80">
              Buscá un término, una duda frecuente o un trámite. Si no lo encontrás, te atendemos por teléfono, WhatsApp o
              chat.
            </p>
            <form role="search" onSubmit={(e) => e.preventDefault()} className="mt-8">
              <label htmlFor="ayuda-q" className="sr-only">
                Buscar en el centro de ayuda
              </label>
              <div className="flex items-center gap-3 rounded-2xl bg-white/90 px-4 shadow-[0_20px_50px_-24px_rgb(11_22_38/0.45)] ring-1 ring-night-900/10 backdrop-blur focus-within:ring-2 focus-within:ring-[#2a63d6]">
                <Search className="size-5 shrink-0 text-night-600" aria-hidden="true" />
                <input
                  id="ayuda-q"
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Ej.: padrón, clave fiscal, cómo pagar…"
                  autoComplete="off"
                  className="h-14 min-w-0 flex-1 bg-transparent text-lg text-night-900 placeholder:text-night-600/60 focus:outline-none"
                />
              </div>
            </form>
          </div>
        </section>
      </div>

      <div className="container-page py-16 sm:py-20">
        <p className="sr-only" aria-live="polite">
          {q.trim()
            ? `${glosario.length} términos, ${preguntas.length} preguntas y ${tramites.length} trámites encontrados`
            : ""}
        </p>

        {sinResultados ? (
          <div className="mb-16 rounded-3xl border border-dashed border-line-strong px-6 py-12 text-center">
            <p className="text-lg font-semibold">No encontramos resultados para “{q}”.</p>
            <p className="mt-1 text-ink-3">Probá con otras palabras o escribinos: te respondemos a la brevedad.</p>
            <ButtonLink to="/atencion" className="mt-6">
              <Headset aria-hidden="true" />
              Ir a Atención
            </ButtonLink>
          </div>
        ) : null}

        {tramites.length ? (
          <section aria-labelledby="ayuda-tramites" className="mb-16">
            <h2 id="ayuda-tramites" className="eyebrow mb-4">
              Trámites relacionados
            </h2>
            <ul className="grid gap-3 md:grid-cols-3">
              {tramites.map((t) => (
                <li key={t.id}>
                  <SmartLink
                    to={t.href}
                    className="group flex h-full items-start gap-3 rounded-2xl bg-surface p-4 ring-1 ring-line transition-shadow hover:shadow-lift"
                  >
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-ink-2 ring-1 ring-line">
                      <Icon name={t.icon} className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-ink group-hover:text-brand">{t.titulo}</span>
                      <span className="mt-0.5 line-clamp-2 block text-sm text-ink-3">{t.descripcion}</span>
                    </span>
                  </SmartLink>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {!q.trim() ? (
          <section aria-labelledby="pasos-titulo" className="mb-20">
            <SectionHeader id="pasos-titulo" eyebrow="Para empezar" title="Primeros pasos para operar en línea" />
            <ol className="mt-10 grid gap-4 md:grid-cols-3">
              {PRIMEROS_PASOS.map((p, i) => (
                <li key={p.titulo} className="relative flex flex-col rounded-2xl bg-surface p-6 ring-1 ring-line">
                  <span
                    aria-hidden="true"
                    className="absolute top-5 right-6 font-serif text-5xl leading-none text-ink-3/30 italic"
                  >
                    {i + 1}
                  </span>
                  <span className="inline-flex size-11 items-center justify-center rounded-xl tint-terracota">
                    <Icon name={p.icon} className="size-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{p.titulo}</h3>
                  <p className="mt-2 flex-1 text-ink-3">{p.descripcion}</p>
                  <Link
                    to={p.href}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
                  >
                    {p.cta} <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr]">
          {preguntas.length ? (
            <section aria-labelledby="faq-titulo">
              <h2 id="faq-titulo" className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Preguntas frecuentes
              </h2>
              <div className="mt-6 divide-y divide-line rounded-2xl bg-surface ring-1 ring-line">
                {preguntas.map((p) => (
                  <details key={p.pregunta} className="group px-5 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg py-4 font-medium text-ink">
                      {p.pregunta}
                      <span
                        aria-hidden="true"
                        className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink-2 transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="pb-5 leading-relaxed text-ink-3">{p.respuesta}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          {glosario.length ? (
            <section aria-labelledby="glosario-titulo">
              <h2 id="glosario-titulo" className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Glosario
              </h2>
              <dl className="mt-6 grid gap-3">
                {glosario.map((g) => (
                  <div key={g.termino} className="rounded-2xl bg-surface-2/60 p-4 ring-1 ring-line">
                    <dt className="font-semibold text-ink">{g.termino}</dt>
                    <dd className="mt-1 text-[0.95rem] leading-relaxed text-ink-3">{g.definicion}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
        </div>

        {!q.trim() ? (
          <section aria-labelledby="recursos-titulo" className="mt-20">
            <SectionHeader
              id="recursos-titulo"
              eyebrow="En el sitio oficial"
              title="Recursos"
              description="Material de consulta publicado por la Dirección Provincial de Rentas."
            />
            <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {RECURSOS.map((r) => (
                <li key={r.titulo}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full items-center gap-4 rounded-2xl bg-surface p-5 ring-1 ring-line transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-lift"
                  >
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-ink-2 ring-1 ring-line">
                      <Icon name={r.icon} className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-ink">{r.titulo}</span>
                      <span className="block text-sm text-ink-3">{r.descripcion}</span>
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-ink-3" aria-hidden="true" />
                    <span className="sr-only">(se abre en una pestaña nueva)</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  );
}
