import { useEffect, useRef, useState } from "react";
import { Check, Clock, Copy } from "lucide-react";
import clsx from "clsx";
import { CANALES } from "../../data/contacto";
import type { Canal } from "../../data/types";
import { Icon } from "../../lib/icons";
import { Button } from "../ui/Button";
import { SectionHeader } from "../ui/primitives";
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

function ChannelRow({ c }: { c: Canal }) {
  const copy = copyLabel(c);
  const number = isNumber(c);
  return (
    <li className="grid grid-cols-[minmax(0,1fr)] items-center gap-x-8 gap-y-3 border-t border-line py-5 sm:grid-cols-[minmax(0,1fr)_auto]">
      <div className="flex min-w-0 gap-3">
        <Icon name={c.icon} className="mt-1 size-5 shrink-0 text-brand" />
        <div className="min-w-0">
          <h3 className="font-semibold text-ink-2">{c.nombre}</h3>
          <p className={clsx("mt-0.5 font-bold text-ink", number ? "text-2xl tabular sm:text-[1.75rem]" : "text-lg sm:text-xl")}>
            <ChannelLink c={c} />
          </p>
          <p className="mt-1 text-ink-3">
            {c.descripcion}
            {c.horario ? (
              <span className="mt-1 flex items-center gap-1.5 text-sm">
                <Clock className="size-4 shrink-0" aria-hidden="true" />
                <span>
                  <span className="sr-only">Horario: </span>
                  {c.horario}
                </span>
              </span>
            ) : null}
          </p>
        </div>
      </div>
      {copy ? (
        <div className="pl-8 sm:pl-0">
          <CopyButton value={c.valor} label={copy} />
        </div>
      ) : null}
    </li>
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
      <ul className="mt-6 max-w-4xl border-b border-line">
        {CANALES.map((c) => (
          <ChannelRow key={c.id} c={c} />
        ))}
      </ul>
    </section>
  );
}
