import { HandCoins, Headset } from "lucide-react";
import { Hero } from "../components/home/Hero";
import { QuickActions } from "../components/home/QuickActions";
import { VencimientosAyuda } from "../components/home/VencimientosAyuda";
import { ImpuestosGrid } from "../components/home/ImpuestosGrid";
import { PorPerfil } from "../components/home/PorPerfil";
import { CtaBand } from "../components/home/CtaBand";
import { NoticiasSection } from "../components/home/NoticiasSection";
import { ButtonLink } from "../components/ui/Button";
import { useDocumentTitle } from "../lib/useDocumentTitle";

export function HomePage() {
  useDocumentTitle();
  return (
    <>
      <Hero />
      <QuickActions />
      <VencimientosAyuda />
      <ImpuestosGrid />
      <PorPerfil />
      <div className="container-page pb-24">
        <CtaBand>
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:p-16">
            <div>
              <p className="eyebrow !text-crema-200/70">Planes de facilidades</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Ponete al día{" "}
                <span className="font-serif font-normal tracking-normal text-ocre-300 italic">en cuotas.</span>
              </h2>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-crema-100/80">
                Simulá y adherí a un plan de pagos para regularizar deudas de tus impuestos provinciales, sin moverte
                de tu casa.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink to="/tramites?q=plan" variant="light" size="lg">
                  <HandCoins aria-hidden="true" />
                  Ver planes de pago
                </ButtonLink>
                <ButtonLink to="/atencion" variant="outline-light" size="lg">
                  <Headset aria-hidden="true" />
                  Hablar con un asesor
                </ButtonLink>
              </div>
            </div>
          </div>
        </CtaBand>
      </div>
      <NoticiasSection />
    </>
  );
}
