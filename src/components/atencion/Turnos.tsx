import { CalendarCheck, MonitorSmartphone } from "lucide-react";
import { PORTAL } from "../../data/contacto";
import { ButtonLink } from "../ui/Button";
import { NEW_TAB } from "./utils";

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
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className="scroll-mt-24 border-y border-line bg-surface-2/50 py-20 sm:py-24"
    >
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
        <div>
          <p className="eyebrow mb-3">Atención presencial</p>
          <h2 id={`${id}-titulo`} className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            ¿Tenés que ir a una oficina?{" "}
            <span className="font-serif font-normal tracking-normal text-brand italic">Sacá turno antes.</span>
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-3">
            En Casa Central y en las delegaciones se atiende con turno previo. Pedilo en línea y llegá con el día y
            el horario asignados.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to={PORTAL.turnos.href} size="lg">
              <CalendarCheck aria-hidden="true" />
              Sacar turno web
              <span className="sr-only">{NEW_TAB}</span>
            </ButtonLink>
            <ButtonLink to="/tramites?online=1" variant="secondary" size="lg">
              <MonitorSmartphone aria-hidden="true" />
              Ver trámites en línea
            </ButtonLink>
          </div>
        </div>

        <ol className="relative grid gap-3">
          {PASOS.map((p, i) => (
            <li key={p.titulo} className="relative flex gap-5 rounded-2xl bg-surface p-5 ring-1 ring-line sm:p-6">
              <span
                aria-hidden="true"
                className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-soft font-serif text-2xl text-brand italic ring-1 ring-brand/15"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-ink">
                  <span className="sr-only">Paso {i + 1}: </span>
                  {p.titulo}
                </h3>
                <p className="mt-1 leading-relaxed text-ink-3">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
