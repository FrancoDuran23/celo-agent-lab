import { ArrowDown } from "lucide-react";
import { PageIntro } from "../components/ui/primitives";
import { Canales } from "../components/atencion/Canales";
import { Turnos } from "../components/atencion/Turnos";
import { Oficinas } from "../components/atencion/Oficinas";
import { RentasConVos } from "../components/atencion/RentasConVos";
import { PagosYRedes } from "../components/atencion/PagosYRedes";
import { Preguntas } from "../components/atencion/Preguntas";
import { useDocumentTitle } from "../lib/useDocumentTitle";

const EN_ESTA_PAGINA = [
  { id: "canales", label: "Canales de atención" },
  { id: "turnos", label: "Turnos" },
  { id: "oficinas", label: "Oficinas" },
  { id: "medios-de-pago", label: "Medios de pago" },
  { id: "preguntas", label: "Preguntas frecuentes" },
];

export function AtencionPage() {
  useDocumentTitle("Atención al contribuyente");

  return (
    <>
      <PageIntro
        eyebrow="Atención al contribuyente"
        title={
          <>
            Estamos para{" "}
            <span className="font-serif font-normal tracking-normal text-brand italic">ayudarte.</span>
          </>
        }
        description="Consultanos por teléfono, WhatsApp, chat o correo, sin moverte de tu casa. Y si tenés que venir a una oficina, sacá turno antes."
      >
        <nav aria-label="En esta página">
          <ul className="flex flex-wrap gap-2">
            {EN_ESTA_PAGINA.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="group inline-flex h-10 items-center gap-2 rounded-full bg-surface px-4 text-sm font-medium text-ink-2 ring-1 ring-line transition-colors hover:text-ink hover:ring-line-strong"
                >
                  {s.label}
                  <ArrowDown
                    className="size-3.5 text-ink-3 transition-transform group-hover:translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageIntro>

      <Canales id="canales" />
      <Turnos id="turnos" />
      <Oficinas id="oficinas" />
      <RentasConVos />
      <PagosYRedes id="medios-de-pago" />
      <Preguntas id="preguntas" />
    </>
  );
}
