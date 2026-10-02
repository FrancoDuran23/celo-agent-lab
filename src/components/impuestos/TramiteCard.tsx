import { ArrowUpRight, KeyRound, Layers, MonitorSmartphone } from "lucide-react";
import type { Tramite } from "../../data/types";
import { Icon } from "../../lib/icons";
import { Badge, SmartLink } from "../ui/primitives";
import { CANAL_LABEL, opensNewTab } from "./related";

/** Tarjeta de trámite (mismo lenguaje visual que la guía de trámites). */
export function TramiteCard({ t }: { t: Tramite }) {
  return (
    <SmartLink
      to={t.href}
      className="group flex h-full flex-col rounded-2xl bg-surface p-5 ring-1 ring-line transition-[box-shadow,transform] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:shadow-lift hover:ring-line-strong"
    >
      <div className="flex items-start gap-4">
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-ink-2 ring-1 ring-line">
          <Icon name={t.icon} className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-ink group-hover:text-brand">{t.titulo}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-3">{t.descripcion}</p>
        </div>
        <ArrowUpRight
          className="size-4 shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5 sm:pl-15">
        <Badge tone={t.canal === "presencial" ? "warn" : "ok"}>
          <MonitorSmartphone aria-hidden="true" />
          {CANAL_LABEL[t.canal]}
        </Badge>
        {t.requiereClave ? (
          <Badge tone="info">
            <KeyRound aria-hidden="true" />
            Clave fiscal
          </Badge>
        ) : null}
        {t.impuesto === "general" ? (
          <Badge>
            <Layers aria-hidden="true" />
            Para todos los impuestos
          </Badge>
        ) : null}
      </div>
      {opensNewTab(t.href) ? <span className="sr-only"> (se abre en el sitio oficial, en una pestaña nueva)</span> : null}
    </SmartLink>
  );
}
