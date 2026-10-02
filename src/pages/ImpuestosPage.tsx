import { ArrowDown, FileQuestion } from "lucide-react";
import { IMPUESTOS } from "../data/impuestos";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { PageIntro } from "../components/ui/primitives";
import { ButtonLink } from "../components/ui/Button";
import { ImpuestoCard } from "../components/impuestos/ImpuestoCard";
import { Orientacion } from "../components/impuestos/Orientacion";

export function ImpuestosPage() {
  useDocumentTitle("Impuestos");

  return (
    <>
      <PageIntro
        eyebrow="Impuestos provinciales"
        title={
          <>
            Los impuestos de Jujuy,{" "}
            <span className="font-serif font-normal tracking-normal text-brand italic">explicados simple.</span>
          </>
        }
        description="Conocé quiénes pagan cada impuesto, qué tenés que tener en cuenta y qué trámites podés hacer en línea."
      >
        <a
          href="#orientacion"
          className="group inline-flex items-center gap-2 rounded-full bg-surface py-2 pr-4 pl-2 text-sm font-medium text-ink-2 ring-1 ring-line transition-colors hover:text-ink hover:ring-line-strong"
        >
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-accent-soft text-warn">
            <FileQuestion className="size-4" aria-hidden="true" />
          </span>
          ¿No sabés qué impuesto te corresponde?
          <ArrowDown
            className="size-4 text-ink-3 transition-transform group-hover:translate-y-0.5"
            aria-hidden="true"
          />
        </a>
      </PageIntro>

      <div className="container-page py-12 sm:py-16">
        {IMPUESTOS.length ? (
          <ul className="grid gap-5" aria-label="Impuestos provinciales">
            {IMPUESTOS.map((imp, i) => (
              <li key={imp.slug} className="animate-rise" style={{ animationDelay: `${i * 60}ms` }}>
                <ImpuestoCard imp={imp} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-3xl border border-dashed border-line-strong px-6 py-16 text-center">
            <p className="text-lg font-semibold text-ink">Todavía no hay impuestos cargados.</p>
            <p className="mt-1 text-ink-3">Mientras tanto, podés buscar lo que necesitás en la guía de trámites.</p>
            <ButtonLink to="/tramites" variant="secondary" className="mt-6">
              Ir a trámites
            </ButtonLink>
          </div>
        )}
      </div>

      <div className="container-page pb-20 sm:pb-24">
        <Orientacion id="orientacion" />
      </div>
    </>
  );
}
