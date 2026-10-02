import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Copy } from "lucide-react";
import clsx from "clsx";
import { CANALES } from "../../data/contacto";
import type { Canal } from "../../data/types";
import { Icon } from "../../lib/icons";
import { SectionHeader } from "../ui/primitives";
import { NEW_TAB } from "./utils";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const ACTION: Record<string, string> = {
  telefono: "Llamar",
  whatsapp: "Abrir WhatsApp",
  tubot: "Abrir el chat",
  email: "Escribir un correo",
};

const TINT: Record<string, string> = {
  telefono: "tint-terracota",
  whatsapp: "tint-salvia",
  email: "tint-violeta",
};

function actionLabel(c: Canal) {
  if (ACTION[c.id]) return ACTION[c.id];
  if (c.href.startsWith("tel:")) return "Llamar";
  if (c.href.startsWith("mailto:")) return "Escribir un correo";
  return "Abrir";
}

const opensNewTab = (href: string) => /^https?:/.test(href);

/** Sólo se copian datos de contacto (número o correo), no enlaces web. */
function copyLabel(c: Canal): string | null {
  if (c.href.startsWith("mailto:")) return "Copiar correo";
  if (c.href.startsWith("tel:") || /^https:\/\/wa\.me\//.test(c.href)) return "Copiar número";
  return null;
}

/** Todo el card es clickeable (enlace "estirado"); el foco se marca en el card. */
const CARD_FOCUS =
  "has-[a[data-stretched]:focus-visible]:outline-2 has-[a[data-stretched]:focus-visible]:outline-offset-2 has-[a[data-stretched]:focus-visible]:outline-focus";

const CARD_HOVER =
  "transition-[box-shadow,transform] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:shadow-lift";

function ChannelLink({ c, className }: { c: Canal; className?: string }) {
  const newTab = opensNewTab(c.href);
  return (
    <a
      href={c.href}
      data-stretched=""
      {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={clsx("after:absolute after:inset-0 after:content-[''] focus-visible:outline-none", className)}
    >
      <span className="sr-only">{c.nombre}: </span>
      {c.valor}
      {newTab ? <span className="sr-only">{NEW_TAB}</span> : null}
    </a>
  );
}

function CopyButton({ value, label, dark = false }: { value: string; label: string; dark?: boolean }) {
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
      <button
        type="button"
        onClick={copy}
        aria-label={`${label}: ${value}`}
        className={clsx(
          "relative z-10 inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors",
          dark
            ? "text-crema-100/85 ring-1 ring-white/15 hover:bg-white/10 hover:text-crema-50"
            : "bg-surface text-ink-2 ring-1 ring-line hover:bg-surface-2 hover:text-ink",
        )}
      >
        {state === "ok" ? (
          <Check className="size-4 text-ok" aria-hidden="true" />
        ) : (
          <Copy className="size-4" aria-hidden="true" />
        )}
        <span>{state === "ok" ? "Copiado" : state === "error" ? "No se pudo" : "Copiar"}</span>
      </button>
      <span className="sr-only" aria-live="polite">
        {state === "ok" ? `${value} copiado al portapapeles.` : state === "error" ? "No se pudo copiar." : ""}
      </span>
    </>
  );
}

function CardFooter({ c, dark = false }: { c: Canal; dark?: boolean }) {
  const copy = copyLabel(c);
  return (
    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
      <span
        aria-hidden="true"
        className={clsx(
          "inline-flex items-center gap-1.5 text-sm font-semibold",
          dark ? "text-ocre-300" : "text-brand",
        )}
      >
        {actionLabel(c)}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
      {copy ? <CopyButton value={c.valor} label={copy} dark={dark} /> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cards                                                               */
/* ------------------------------------------------------------------ */

/** TuBOT: card nocturno, para remarcar que atiende las 24 horas. */
function BotCard({ c, className }: { c: Canal; className?: string }) {
  // "24 h, todos los días" → "24 h" grande + "todos los días".
  const [lead, ...rest] = (c.horario ?? "").split(",");
  const tail = rest.join(",").trim();
  return (
    <li
      className={clsx(
        "group relative isolate flex flex-col overflow-hidden rounded-3xl bg-night-900 p-7 text-crema-50 ring-1 ring-white/10 sm:p-8",
        CARD_HOVER,
        CARD_FOCUS,
        className,
      )}
    >
      {/* Cielo nocturno: estrellas + resplandor */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-70 [background-image:radial-gradient(1.2px_1.2px_at_12%_18%,rgb(255_255_255/0.7),transparent),radial-gradient(1px_1px_at_28%_42%,rgb(255_255_255/0.5),transparent),radial-gradient(1.4px_1.4px_at_46%_12%,rgb(255_255_255/0.6),transparent),radial-gradient(1px_1px_at_64%_30%,rgb(255_255_255/0.45),transparent),radial-gradient(1.2px_1.2px_at_82%_52%,rgb(255_255_255/0.55),transparent),radial-gradient(1px_1px_at_90%_14%,rgb(255_255_255/0.5),transparent),radial-gradient(1px_1px_at_20%_70%,rgb(255_255_255/0.35),transparent),radial-gradient(1.2px_1.2px_at_56%_64%,rgb(255_255_255/0.4),transparent)]" />
      <div
        aria-hidden="true"
        className="absolute -top-28 -right-24 -z-10 size-80 rounded-full bg-[radial-gradient(circle,rgb(224_166_59/0.38),transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-1.5 bg-gradient-to-r from-violeta-500 via-rosa-500 to-ocre-500"
      />

      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex size-11 items-center justify-center rounded-xl bg-white/10 text-ocre-300 ring-1 ring-white/10">
          <Icon name={c.icon} className="size-5" />
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-xs font-medium text-crema-100/90 ring-1 ring-white/15">
          <span className="relative flex size-2" aria-hidden="true">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-ocre-300 opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-ocre-500" />
          </span>
          Siempre disponible
        </span>
      </div>

      <h3 className="mt-6 text-lg font-semibold text-crema-50">{c.nombre}</h3>

      {lead ? (
        <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-serif text-6xl leading-none tracking-normal text-ocre-300 italic sm:text-7xl">
            {lead.trim()}
          </span>
          {tail ? <span className="text-lg text-crema-100/80">{tail}</span> : null}
        </p>
      ) : null}

      <p className="mt-5 max-w-sm leading-relaxed text-crema-100/75">{c.descripcion}</p>

      <p className="mt-6 text-xl font-semibold tracking-tight">
        <ChannelLink c={c} className="text-crema-50 underline decoration-white/25 underline-offset-4 group-hover:decoration-ocre-300" />
      </p>

      <CardFooter c={c} dark />
    </li>
  );
}

/** WhatsApp: card ancho con el número bien grande. */
function WhatsAppCard({ c, className }: { c: Canal; className?: string }) {
  return (
    <li
      className={clsx(
        "group relative flex flex-col overflow-hidden rounded-3xl bg-surface p-7 ring-1 ring-line sm:p-8",
        CARD_HOVER,
        CARD_FOCUS,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-salvia-500 via-ocre-300 to-ocre-500"
      />
      <div className="grid flex-1 gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div className="flex min-w-0 flex-col">
          <span className={clsx("inline-flex size-11 items-center justify-center rounded-xl", TINT[c.id] ?? "tint-salvia")}>
            <Icon name={c.icon} className="size-5" />
          </span>
          <h3 className="mt-5 text-[0.95rem] font-medium text-ink-2">{c.nombre}</h3>
          <p className="mt-1 text-4xl font-semibold tracking-tight text-ink tabular sm:text-5xl">
            <ChannelLink c={c} className="transition-colors group-hover:text-brand" />
          </p>
          <p className="mt-3 max-w-md leading-relaxed text-ink-3">{c.descripcion}</p>
        </div>
        <ChatIllustration />
      </div>
      <CardFooter c={c} />
    </li>
  );
}

function ChannelCard({ c, className }: { c: Canal; className?: string }) {
  const isEmail = c.href.startsWith("mailto:");
  return (
    <li
      className={clsx(
        "group relative flex flex-col rounded-3xl bg-surface p-6 ring-1 ring-line sm:p-7",
        CARD_HOVER,
        CARD_FOCUS,
        className,
      )}
    >
      <span className={clsx("inline-flex size-11 items-center justify-center rounded-xl", TINT[c.id] ?? "tint-night")}>
        <Icon name={c.icon} className="size-5" />
      </span>
      <h3 className="mt-5 text-[0.95rem] font-medium text-ink-2">{c.nombre}</h3>
      <p
        className={clsx(
          "mt-1 font-semibold tracking-tight text-ink",
          isEmail ? "text-lg [overflow-wrap:anywhere] sm:text-xl" : "text-2xl tabular sm:text-3xl",
        )}
      >
        <ChannelLink c={c} className="transition-colors group-hover:text-brand" />
      </p>
      {c.horario ? <p className="mt-2 text-sm font-medium text-ok">{c.horario}</p> : null}
      <p className="mt-3 leading-relaxed text-ink-3">{c.descripcion}</p>
      <CardFooter c={c} />
    </li>
  );
}

/** Burbujas de chat abstractas (decorativas). */
function ChatIllustration() {
  return (
    <div aria-hidden="true" className="hidden w-56 flex-col gap-2.5 md:flex lg:w-64">
      <div className="w-[78%] rounded-2xl rounded-bl-md bg-surface-2 p-3 ring-1 ring-line">
        <div className="h-2 w-[85%] rounded-full bg-line-strong" />
        <div className="mt-2 h-2 w-[55%] rounded-full bg-line-strong" />
      </div>
      <div className="tint-salvia ml-auto w-[70%] rounded-2xl rounded-br-md p-3">
        <div className="h-2 w-[90%] rounded-full bg-current opacity-35" />
        <div className="mt-2 h-2 w-[40%] rounded-full bg-current opacity-35" />
      </div>
      <div className="inline-flex w-fit items-center gap-1 rounded-2xl rounded-bl-md bg-surface-2 px-3 py-2.5 ring-1 ring-line">
        <span className="size-1.5 rounded-full bg-ink-3" />
        <span className="size-1.5 rounded-full bg-ink-3 opacity-70" />
        <span className="size-1.5 rounded-full bg-ink-3 opacity-40" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sección                                                             */
/* ------------------------------------------------------------------ */

export function Canales({ id }: { id: string }) {
  if (!CANALES.length) return null;
  const bot = CANALES.find((c) => c.id === "tubot");
  const wsp = CANALES.find((c) => c.id === "whatsapp");
  const rest = CANALES.filter((c) => c !== bot && c !== wsp);

  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="scroll-mt-24 py-16 sm:py-20">
      <div className="container-page">
        <SectionHeader
          id={`${id}-titulo`}
          eyebrow="Centro de Atención Omnicanal"
          title={
            <>
              Elegí cómo{" "}
              <span className="font-serif font-normal tracking-normal text-brand italic">comunicarte.</span>
            </>
          }
          description="Hacé tus consultas, reclamos y sugerencias por el canal que te quede más cómodo, sin ir a una oficina."
        />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bot ? <BotCard c={bot} className="sm:col-span-2 lg:col-span-1 lg:row-span-2" /> : null}
          {wsp ? <WhatsAppCard c={wsp} className={clsx("sm:col-span-2", !bot && "lg:col-span-3")} /> : null}
          {rest.map((c) => (
            <ChannelCard key={c.id} c={c} />
          ))}
        </ul>
      </div>
    </section>
  );
}
