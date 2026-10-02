import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Search } from "lucide-react";
import { GLOSARIO, PREGUNTAS_GENERALES, PRIMEROS_PASOS, RECURSOS } from "../data/ayuda";
import { TRAMITES } from "../data/tramites";
import { normalize, searchTramites } from "../lib/search";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { ButtonLink } from "../components/ui/Button";
import { ArrowLink, Disclosure, LinkList, PageIntro, SectionHeader } from "../components/ui/primitives";

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
  const buscando = Boolean(q.trim());
  const sinResultados = buscando && !glosario.length && !preguntas.length && !tramites.length;

  return (
    <>
      <PageIntro
        title="Centro de ayuda"
        breadcrumbs={[{ label: "Centro de ayuda" }]}
        description="Buscá un término, una duda frecuente o un trámite. Si no lo encontrás, te atendemos por teléfono, WhatsApp o chat."
      >
        <form role="search" aria-label="Buscar en el centro de ayuda" onSubmit={(e) => e.preventDefault()} className="max-w-2xl">
          <label htmlFor="ayuda-q" className="mb-2 block font-semibold text-ink">
            Buscar en el centro de ayuda
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-ink-3"
              aria-hidden="true"
            />
            <input
              id="ayuda-q"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Por ejemplo: clave fiscal"
              autoComplete="off"
              className="h-12 w-full min-w-0 rounded-lg border border-ink-3 bg-surface pr-3 pl-11 text-base text-ink placeholder:text-ink-3 sm:h-13 sm:text-lg"
            />
          </div>
        </form>
      </PageIntro>

      <div className="container-page py-10 sm:py-14">
        <p className="sr-only" aria-live="polite">
          {buscando
            ? `${glosario.length} términos, ${preguntas.length} preguntas y ${tramites.length} trámites encontrados`
            : ""}
        </p>

        {sinResultados ? (
          <div className="mb-12 rounded-xl bg-surface-2 p-6 sm:p-8">
            <p className="text-lg font-semibold text-ink [overflow-wrap:anywhere]">No encontramos resultados para “{q}”.</p>
            <p className="mt-1 text-ink-2">Probá con otras palabras o escribinos: te respondemos a la brevedad.</p>
            <ButtonLink to="/atencion" className="mt-5">
              Ir a Atención
            </ButtonLink>
          </div>
        ) : null}

        {tramites.length ? (
          <section aria-labelledby="ayuda-tramites" className="mb-12 sm:mb-14">
            <SectionHeader id="ayuda-tramites" title="Trámites relacionados" />
            <LinkList
              className="mt-6"
              columns={3}
              items={tramites.map((t) => ({ key: t.id, href: t.href, title: t.titulo, description: t.descripcion }))}
            />
          </section>
        ) : null}

        {!buscando ? (
          <section aria-labelledby="pasos-titulo" className="mb-14 sm:mb-16">
            <SectionHeader id="pasos-titulo" title="Primeros pasos para operar en línea" />
            <ol className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-x-10 md:grid-cols-3">
              {PRIMEROS_PASOS.map((p, i) => (
                <li key={p.titulo} className="flex min-w-0 flex-col border-t border-line py-5">
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-ink text-sm font-bold tabular text-ink"
                    >
                      {i + 1}
                    </span>
                    <h3 className="pt-0.5 text-lg font-bold text-ink">{p.titulo}</h3>
                  </div>
                  <p className="mt-2 flex-1 text-ink-2">{p.descripcion}</p>
                  <Link to={p.href} className="link mt-3 self-start font-semibold">
                    {p.cta}
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {preguntas.length ? (
          <section aria-labelledby="faq-titulo" className="max-w-3xl">
            <SectionHeader id="faq-titulo" title="Preguntas frecuentes" />
            <div className="mt-6 border-t border-line">
              {preguntas.map((p) => (
                <Disclosure key={p.pregunta} summary={p.pregunta}>
                  <p>{p.respuesta}</p>
                </Disclosure>
              ))}
            </div>
            <p className="mt-5 text-ink-3">
              ¿No encontrás tu respuesta? <ArrowLink to="/atencion">Consultá los canales de atención</ArrowLink>
            </p>
          </section>
        ) : null}

        {glosario.length ? (
          <section aria-labelledby="glosario-titulo" className={preguntas.length ? "mt-14 sm:mt-16" : undefined}>
            <SectionHeader id="glosario-titulo" title="Glosario" />
            <dl className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-x-10 md:grid-cols-2">
              {glosario.map((g) => (
                <div key={g.termino} className="min-w-0 border-t border-line py-4">
                  <dt className="font-bold text-ink">{g.termino}</dt>
                  <dd className="prose-measure mt-1 text-ink-2">{g.definicion}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {!buscando ? (
          <section aria-labelledby="recursos-titulo" className="mt-14 sm:mt-16">
            <SectionHeader
              id="recursos-titulo"
              title="Recursos"
              description="Material de consulta publicado en el sitio oficial de la Dirección Provincial de Rentas."
            />
            <LinkList
              className="mt-6"
              columns={3}
              items={RECURSOS.map((r) => ({ key: r.titulo, href: r.href, title: r.titulo, description: r.descripcion }))}
            />
          </section>
        ) : null}
      </div>
    </>
  );
}
