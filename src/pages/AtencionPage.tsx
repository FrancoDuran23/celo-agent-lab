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
        title="Atención al contribuyente"
        breadcrumbs={[{ label: "Atención" }]}
        description="Consultanos por teléfono, WhatsApp, chat o correo, sin moverte de tu casa. Si tenés que ir a una oficina, sacá turno antes."
      >
        <nav aria-labelledby="en-esta-pagina" className="flex flex-wrap items-baseline gap-x-5 gap-y-2 text-[0.95rem]">
          <span id="en-esta-pagina" className="text-ink-3">
            En esta página:
          </span>
          <ul className="contents">
            {EN_ESTA_PAGINA.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="link font-semibold">
                  {s.label}
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
