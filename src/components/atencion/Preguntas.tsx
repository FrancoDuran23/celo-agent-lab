import type { ReactNode } from "react";
import { Link } from "react-router";
import { Phone, Smartphone } from "lucide-react";
import { CANALES, CONTACTO, OFICINAS, PORTAL } from "../../data/contacto";
import { Disclosure, SectionHeader, SmartLink } from "../ui/primitives";

function buildPreguntas(): { pregunta: string; respuesta: ReactNode }[] {
  const central = OFICINAS.find((o) => o.casaCentral);
  const bot = CANALES.find((c) => c.id === "tubot");

  return [
    {
      pregunta: "¿Necesito turno para ir a una oficina?",
      respuesta: (
        <>
          Sí. Para que te atiendan en Casa Central o en una delegación, sacá turno antes en{" "}
          <SmartLink to={PORTAL.turnos.href} className="link">
            Turnos web
          </SmartLink>
          : elegís el día y el horario, y no necesitás clave fiscal.
        </>
      ),
    },
    {
      pregunta: "¿Puedo pagar sin clave fiscal?",
      respuesta: (
        <>
          Sí, en varios casos. El Inmobiliario se consulta y se paga con el padrón del inmueble o el CUIT del titular
          (también por WhatsApp, con TuBOT), y algunas tasas, como la Tasa de Justicia, se liquidan sin clave.{" "}
          <Link to="/tramites?q=sin%20clave" className="link">
            Ver trámites sin clave fiscal
          </Link>
          .
        </>
      ),
    },
    {
      pregunta: "¿En qué horario atienden?",
      respuesta: (
        <>
          {central?.horario ? (
            <>
              {central.nombre} atiende de {central.horario.charAt(0).toLowerCase() + central.horario.slice(1)}.{" "}
            </>
          ) : null}
          {bot?.horario ? <>TuBOT está disponible {bot.horario.toLowerCase()}, incluso feriados. </> : null}
          El horario de cada delegación puede variar: confirmalo en el sitio oficial antes de ir.
        </>
      ),
    },
    {
      pregunta: "¿Cómo hago una consulta o un reclamo?",
      respuesta: (
        <>
          Comunicate con el Centro de Atención Omnicanal: llamá gratis al{" "}
          <a href={CONTACTO.telefono.href} className="link tabular">
            {CONTACTO.telefono.valor}
          </a>
          , escribí por WhatsApp al{" "}
          <SmartLink to={CONTACTO.whatsapp.href} className="link tabular">
            {CONTACTO.whatsapp.valor}
          </SmartLink>{" "}
          o mandá un correo a{" "}
          <a href={CONTACTO.email.href} className="link [overflow-wrap:anywhere]">
            {CONTACTO.email.valor}
          </a>
          .
        </>
      ),
    },
  ];
}

export function Preguntas({ id }: { id: string }) {
  const preguntas = buildPreguntas();

  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="border-t border-line">
      <div className="container-page grid grid-cols-[minmax(0,1fr)] gap-8 py-14 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
        <div className="min-w-0">
          <SectionHeader
            id={`${id}-titulo`}
            title="Preguntas frecuentes"
            description="¿Seguís con dudas? Escribinos o llamanos y te ayudamos."
          />
          <ul className="mt-5 grid gap-2.5">
            <li className="flex items-center gap-2">
              <Smartphone className="size-4 shrink-0 text-ink-3" aria-hidden="true" />
              <SmartLink to={CONTACTO.whatsapp.href} className="link font-semibold">
                WhatsApp <span className="tabular">{CONTACTO.whatsapp.valor}</span>
              </SmartLink>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-ink-3" aria-hidden="true" />
              <a href={CONTACTO.telefono.href} className="link font-semibold">
                Línea gratuita <span className="tabular">{CONTACTO.telefono.valor}</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="min-w-0 border-t border-line">
          {preguntas.map((q, i) => (
            <Disclosure key={q.pregunta} summary={q.pregunta} defaultOpen={i === 0}>
              <p>{q.respuesta}</p>
            </Disclosure>
          ))}
        </div>
      </div>
    </section>
  );
}
