import { NORMATIVA } from "../data/normativa";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { ArrowLink, PageIntro, SectionHeader } from "../components/ui/primitives";
import { NormasClave } from "../components/normativa/NormasClave";
import { NormativaBrowser } from "../components/normativa/NormativaBrowser";
import { GuiaNormas } from "../components/normativa/GuiaNormas";
import { normasClave } from "../components/normativa/utils";
import { LINKS } from "../data/site";

export function NormativaPage() {
  useDocumentTitle("Normativa");
  const { codigo, impositiva } = normasClave(NORMATIVA);
  const hayClave = Boolean(codigo || impositiva);

  return (
    <>
      <PageIntro
        title="Normativa"
        breadcrumbs={[{ label: "Normativa" }]}
        description="El Código Fiscal, la Ley Impositiva y las resoluciones que ordenan los impuestos provinciales. Buscá por número o tema y consultá el texto en el sitio oficial."
      />

      {hayClave ? (
        <section aria-labelledby="clave-titulo" className="container-page pt-12 sm:pt-14">
          <SectionHeader id="clave-titulo" title="Normas clave" />
          <div className="mt-6">
            <NormasClave codigo={codigo} impositiva={impositiva} />
          </div>
        </section>
      ) : null}

      <div className="container-page grid grid-cols-[minmax(0,1fr)] gap-12 py-12 sm:py-16 xl:grid-cols-[minmax(0,1fr)_19rem] xl:gap-14">
        <section id="buscador" aria-labelledby="buscador-titulo" className="min-w-0 scroll-mt-24">
          <SectionHeader
            id="buscador-titulo"
            title="Buscar una norma"
            description="Filtrá por tipo o por impuesto, o escribí el número o una palabra clave."
          />
          <div className="mt-6">
            {NORMATIVA.length ? (
              <NormativaBrowser normas={NORMATIVA} />
            ) : (
              <div className="border-y border-line py-10">
                <p className="text-lg font-bold text-ink">Todavía no hay normas cargadas</p>
                <p className="mt-2 text-ink-2">Mientras tanto, podés consultarlas en el sitio oficial.</p>
                <div className="mt-4">
                  <ArrowLink to={LINKS.resoluciones}>Resoluciones generales</ArrowLink>
                </div>
              </div>
            )}
          </div>
        </section>

        <aside aria-labelledby="guia-titulo" className="min-w-0 max-w-2xl xl:max-w-none xl:self-start">
          <GuiaNormas id="guia-titulo" />
        </aside>
      </div>
    </>
  );
}
