import { ArrowDown, ArrowUpRight } from "lucide-react";
import { IMPUESTOS } from "../data/impuestos";
import { LINKS } from "../data/site";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { Notice, PageIntro, SmartLink } from "../components/ui/primitives";
import { ButtonLink } from "../components/ui/Button";
import { ImpuestosIndice } from "../components/impuestos/ImpuestosIndice";
import { Orientacion } from "../components/impuestos/Orientacion";

export function ImpuestosPage() {
  useDocumentTitle("Impuestos");

  return (
    <>
      <PageIntro
        title="Impuestos provinciales"
        description="Conocé quiénes pagan cada impuesto, qué tenés que tener en cuenta y qué trámites podés hacer en línea."
        breadcrumbs={[{ label: "Impuestos" }]}
      >
        {/* Enlace en línea: si se parte en dos líneas, la flecha queda pegada a la última palabra. */}
        <a href="#orientacion" className="link font-semibold">
          ¿No sabés qué impuesto te{" "}
          <span className="whitespace-nowrap">
            corresponde?
            <ArrowDown className="ml-1 inline size-4 align-[-2px]" aria-hidden="true" />
          </span>
        </a>
      </PageIntro>

      <div className="container-page py-10 sm:py-14">
        {IMPUESTOS.length ? (
          <ImpuestosIndice />
        ) : (
          <div className="border-t border-line pt-6">
            <p className="text-lg font-semibold text-ink">Todavía no hay impuestos cargados.</p>
            <p className="mt-1 text-ink-3">Mientras tanto, podés buscar lo que necesitás en la guía de trámites.</p>
            <ButtonLink to="/tramites" variant="secondary" className="mt-5">
              Ir a trámites
            </ButtonLink>
          </div>
        )}

        {/* El Impuesto Automotor no es provincial: lo administra cada municipio. */}
        <Notice tone="info" title="¿Buscás la patente del auto o la moto?" className="mt-8 max-w-3xl">
          <p>
            El Impuesto Automotor es municipal: se paga en el municipio donde está radicado el vehículo, no en Rentas de
            la Provincia.{" "}
            <SmartLink to={LINKS.automotorCapital} className="link font-semibold whitespace-nowrap">
              Vehículos de la Capital
              <ArrowUpRight className="ml-0.5 inline size-4 align-[-2px]" aria-hidden="true" />
            </SmartLink>
          </p>
        </Notice>
      </div>

      <Orientacion id="orientacion" />
    </>
  );
}
