import { useEffect, useRef, useState } from "react";
import { Check, Clock, Copy } from "lucide-react";
import clsx from "clsx";
import { CANALES } from "../../data/contacto";
import type { Canal } from "../../data/types";
import { Icon } from "../../lib/icons";
import { Button } from "../ui/Button";
import { Panel, SectionHeader } from "../ui/primitives";
import { NEW_TAB } from "./utils";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const opensNewTab = (href: string) => /^https?:/.test(href);

/** Sólo se copian datos de contacto (número o correo), no enlaces web. */
function copyLabel(c: Canal): string | null {
  if (c.href.startsWith("mailto:")) return "Copiar correo";
  if (c.href.startsWith("tel:") || /^https:\/\/wa\.me\//.test(c.href)) return "Copiar número";
  return null;
}

/** Números de teléfono y WhatsApp: se muestran grandes y con cifras tabulares. */
const isNumber = (c: Canal) => c.href.startsWith("tel:") || /^https:\/\/wa\.me\//.test(c.href);

/** En correos, permite cortar la línea antes de la "@" en pantallas angostas. */
function formatValor(valor: string) {
  const at = valor.indexOf("@");
  if (at <= 0) return valor;
  return (
    <>
      {valor.slice(0, at)}
      <wbr />
      {valor.slice(at)}
    </>
  );
}

function ChannelLink({ c }: { c: Canal }) {
  const newTab = opensNewTab(c.href);
  return (
    <a href={c.href} className="link" {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      <span className="sr-only">{c.nombre}: </span>
      {formatValor(c.valor)}
      {newTab ? <span className="sr-only">{NEW_TAB}</span> : null}
    </a>
  );
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [state, setState] = useState<"idle" | "ok" | "error">("idle");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (typeof navigator === "undefined" || !navigator.clipboard) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setState("ok");
    } catch {
      setState("error");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2200);
  };

  return (
    <>
      <Button variant="secondary" size="sm" onClick={copy} aria-label={`${label}: ${value}`}>
        {state === "ok" ? <Check className="text-ok" aria-hidden="true" /> : <Copy aria-hidden="true" />}
        {state === "ok" ? "Copiado" : state === "error" ? "No se pudo copiar" : "Copiar"}
      </Button>
      <span className="sr-only" aria-live="polite">
        {state === "ok" ? `${value} copiado al portapapeles.` : state === "error" ? "No se pudo copiar." : ""}
      </span>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Canal                                                               */
/* ------------------------------------------------------------------ */

function ChannelPanel({ c }: { c: Canal }) {
  const copy = copyLabel(c);
  const number = isNumber(c);
  return (
    <Panel as="li" className="flex min-w-0 flex-col p-5 sm:p-6">
      <div className="flex items-center gap-2.5">
        <Icon name={c.icon} className="size-5 shrink-0 text-brand" />
        <h3 className="text-lg font-semibold text-ink">{c.nombre}</h3>
      </div>
      <p
        className={clsx(
          "mt-3 font-bold",
          number ? "text-2xl tabular sm:text-[1.75rem]" : "text-lg [overflow-wrap:anywhere] sm:text-xl",
        )}
      >
        <ChannelLink c={c} />
      </p>
      <p className="mt-2 text-ink-2">{c.descripcion}</p>

      {c.horario || copy ? (
        <div className="mt-auto pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            {c.horario ? (
              <p className="flex items-center gap-1.5 text-sm text-ink-3">
                <Clock className="size-4 shrink-0" aria-hidden="true" />
                <span>
                  <span className="sr-only">Horario: </span>
                  {c.horario}
                </span>
              </p>
            ) : (
              <span aria-hidden="true" />
            )}
            {copy ? <CopyButton value={c.valor} label={copy} /> : null}
          </div>
        </div>
      ) : null}
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Sección                                                             */
/* ------------------------------------------------------------------ */

export function Canales({ id }: { id: string }) {
  if (!CANALES.length) return null;

  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="container-page py-14 sm:py-16">
      <SectionHeader
        id={`${id}-titulo`}
        title="Centro de Atención Omnicanal"
        description="Hacé tus consultas, reclamos y sugerencias por el canal que te quede más cómodo, sin ir a una oficina."
      />
      <ul className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-[repeat(2,minmax(0,1fr))]">
        {CANALES.map((c) => (
          <ChannelPanel key={c.id} c={c} />
        ))}
      </ul>
    </section>
  );
}
