import type { ReactNode } from "react";
import { Link } from "react-router";
import { Phone, Plus, Smartphone } from "lucide-react";
import { CANALES, CONTACTO, OFICINAS, PORTAL } from "../../data/contacto";
import { NEW_TAB } from "./utils";

const inline =
  "font-medium text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:text-brand hover:decoration-brand";

function Ext({ href, children }: { href: string; children: ReactNode }) {
  const newTab = /^https?:/.test(href);
  return (
    <a href={href} className={inline} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
      {newTab ? <span className="sr-only">{NEW_TAB}</span> : null}
    </a>
  );
}

function buildPreguntas(): { pregunta: string; respuesta: ReactNode }[] {
  const central = OFICINAS.find((o) => o.casaCentral);
  const bot = CANALES.find((c) => c.id === "tubot");

  return [
    {
      pregunta: "¿Necesito turno para ir a una oficina?",
      respuesta: (
        <>
          Sí. Para que te atiendan en Casa Central o en una delegación, sacá turno antes en{" "}
          <Ext href={PORTAL.turnos.href}>Turnos web</Ext>: elegís el día y el horario, y no necesitás clave fiscal.
        </>
      ),
    },
    {
      pregunta: "¿Puedo pagar sin clave fiscal?",
      respuesta: (
        <>
          Sí, en varios casos. El Inmobiliario se consulta y se paga con el padrón del inmueble o el CUIT del titular
          (también por WhatsApp, con TuBOT), y algunas tasas, como la Tasa de Justicia, se liquidan sin clave.{" "}
          <Link to="/tramites?q=sin%20clave" className={inline}>
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
          <Ext href={CONTACTO.telefono.href}>{CONTACTO.telefono.valor}</Ext>, escribí por WhatsApp al{" "}
          <Ext href={CONTACTO.whatsapp.href}>{CONTACTO.whatsapp.valor}</Ext> o mandá un correo a{" "}
          <Ext href={CONTACTO.email.href}>
            <span className="[overflow-wrap:anywhere]">{CONTACTO.email.valor}</span>
          </Ext>
          .
        </>
      ),
    },
  ];
}

export function Preguntas({ id }: { id: string }) {
  const preguntas = buildPreguntas();

  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className="scroll-mt-24 border-t border-line bg-surface-2/50 py-20 sm:py-24"
    >
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <p className="eyebrow mb-3">Preguntas frecuentes</p>
          <h2 id={`${id}-titulo`} className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Lo que más nos{" "}
            <span className="font-serif font-normal tracking-normal text-brand italic">preguntan.</span>
          </h2>
          <p className="mt-3 max-w-md text-lg leading-relaxed text-ink-3">
            ¿Seguís con dudas? Escribinos o llamanos y te ayudamos.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href={CONTACTO.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-surface px-4 text-sm font-medium text-ink ring-1 ring-line transition-colors hover:bg-surface-2 hover:ring-line-strong"
            >
              <Smartphone className="size-4 text-ok" aria-hidden="true" />
              WhatsApp {CONTACTO.whatsapp.valor}
              <span className="sr-only">{NEW_TAB}</span>
            </a>
            <a
              href={CONTACTO.telefono.href}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-surface px-4 text-sm font-medium text-ink ring-1 ring-line transition-colors hover:bg-surface-2 hover:ring-line-strong"
            >
              <Phone className="size-4 text-brand" aria-hidden="true" />
              {CONTACTO.telefono.valor}
            </a>
          </div>
        </div>

        <div className="divide-y divide-line self-start overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
          {preguntas.map((q, i) => (
            <details key={q.pregunta} className="group" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-medium text-ink transition-colors hover:bg-surface-2/60 focus-visible:-outline-offset-2 sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
                <span className="text-[1.02rem] leading-snug">{q.pregunta}</span>
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink-2 ring-1 ring-line transition-[transform,background-color,color] duration-300 ease-[var(--ease-out-soft)] group-open:rotate-45 group-open:bg-brand group-open:text-brand-ink group-open:ring-brand">
                  <Plus className="size-4" aria-hidden="true" />
                </span>
              </summary>
              <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                <p className="max-w-prose leading-relaxed text-ink-3">{q.respuesta}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
