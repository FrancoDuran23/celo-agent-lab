import { CalendarCheck } from "lucide-react";
import { PORTAL } from "../../data/contacto";
import { ButtonLink } from "../ui/Button";
import { ArrowLink, SectionHeader } from "../ui/primitives";

const PASOS = [
  {
    titulo: "Fijate si lo podés hacer en línea",
    texto: "Muchos trámites se resuelven desde la web o con el Centro de Atención, sin moverte de tu casa.",
  },
  {
    titulo: "Sacá tu turno web",
    texto: "Elegí la oficina, el día y el horario que te queden mejor. No necesitás clave fiscal.",
  },
  {
    titulo: "Acercate a la oficina",
    texto: "Presentate el día y a la hora que elegiste, con la documentación que pida tu trámite.",
  },
];

/** Atención presencial con turno previo (destino de /atencion#turnos). */
export function Turnos({ id }: { id: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="border-y border-line bg-surface-2">
      <div className="container-page grid grid-cols-[minmax(0,1fr)] gap-10 py-14 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div className="min-w-0">
          <SectionHeader
            id={`${id}-titulo`}
            title="Turnos para atención presencial"
            description="En Casa Central y en las delegaciones se atiende con turno previo. Pedilo en línea y llegá con el día y el horario asignados."
          />
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
            <ButtonLink to={PORTAL.turnos.href} size="lg">
              <CalendarCheck aria-hidden="true" />
              Sacar turno web
            </ButtonLink>
            <ArrowLink to="/tramites?online=1">Ver trámites que podés hacer en línea</ArrowLink>
          </div>
        </div>

        <ol className="min-w-0">
          {PASOS.map((p, i) => (
            <li key={p.titulo} className="relative flex gap-4 pb-7 last:pb-0">
              {i < PASOS.length - 1 ? (
                <span aria-hidden="true" className="absolute top-11 bottom-2 left-[1.125rem] w-px bg-line-strong" />
              ) : null}
              <span
                aria-hidden="true"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-surface font-bold text-ink tabular"
              >
                {i + 1}
              </span>
              <div className="min-w-0 pt-1">
                <h3 className="text-lg font-semibold text-ink">
                  <span className="sr-only">Paso {i + 1}: </span>
                  {p.titulo}
                </h3>
                <p className="mt-1 text-ink-2">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
