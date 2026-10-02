import { Hero } from "../components/home/Hero";
import { ImpuestosLista, Novedades, PorPerfil, TramitesFrecuentes, VencimientosYAtencion } from "../components/home/Secciones";
import { useDocumentTitle } from "../lib/useDocumentTitle";

export function HomePage() {
  useDocumentTitle();
  return (
    <>
      <Hero />
      <TramitesFrecuentes />
      <VencimientosYAtencion />
      <ImpuestosLista />
      <PorPerfil />
      <Novedades />
    </>
  );
}
