import { ArrowDown } from "lucide-react";
import { NORMATIVA } from "../data/normativa";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { PageIntro, SectionHeader } from "../components/ui/primitives";
import { NormasClave } from "../components/normativa/NormasClave";
import { NormativaBrowser } from "../components/normativa/NormativaBrowser";
import { GuiaNormas } from "../components/normativa/GuiaNormas";
import { normasClave } from "../components/normativa/utils";

export function NormativaPage() {
  useDocumentTitle("Normativa");
  const { codigo, impositiva } = normasClave(NORMATIVA);
  const hayClave = Boolean(codigo || impositiva);

  return (
    <>
      <PageIntro
        eyebrow="Normativa tributaria"
        title={
          <>
            Las reglas de tus impuestos,{" "}
            <span className="font-serif font-normal tracking-normal text-brand italic">a la vista.</span>
          </>
        }
        description="El Código Fiscal, la Ley Impositiva y las resoluciones que ordenan los impuestos provinciales. Buscá por número o tema y consultá el texto en el sitio oficial."
      >
        {hayClave ? (
          <section aria-labelledby="clave-titulo">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 id="clave-titulo" className="eyebrow">
                Normas clave
              </h2>
              {NORMATIVA.length ? (
                <a
                  href="#buscador"
                  className="group -mr-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-brand hover:bg-brand-soft"
                >
                  Ver las <span className="tabular">{NORMATIVA.length}</span> normas
                  <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
                </a>
              ) : null}
            </div>
            <NormasClave codigo={codigo} impositiva={impositiva} />
          </section>
        ) : null}
      </PageIntro>

      <div className="container-page grid gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section id="buscador" aria-labelledby="buscador-titulo" className="min-w-0 scroll-mt-24">
          <SectionHeader
            id="buscador-titulo"
            eyebrow="Buscador"
            title="Encontrá una norma"
            description="Filtrá por tipo o por impuesto, o escribí el número o una palabra clave."
            className="mb-8"
          />
          {NORMATIVA.length ? (
            <NormativaBrowser normas={NORMATIVA} headingId="normas-anio" />
          ) : (
            <div className="rounded-3xl border border-dashed border-line-strong px-6 py-14 text-center">
              <p className="text-lg font-semibold text-ink">Todavía no hay normas cargadas.</p>
              <p className="mt-1 text-ink-3">Mientras tanto, podés consultarlas en los repositorios oficiales.</p>
            </div>
          )}
        </section>

        <aside aria-labelledby="guia-titulo" className="lg:self-start xl:[@media(min-height:56rem)]:sticky xl:[@media(min-height:56rem)]:top-24">
          <GuiaNormas id="guia-titulo" />
        </aside>
      </div>
    </>
  );
}
