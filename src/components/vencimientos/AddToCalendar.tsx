import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { CalendarPlus, Check, CircleAlert } from "lucide-react";
import clsx from "clsx";
import type { Vencimiento } from "../../data/types";
import { buttonClass } from "../ui/Button";
import { downloadICS } from "./ics";

/* ------------------------------------------------------------------ */
/* Anuncios para lectores de pantalla (una sola región viva)           */
/* ------------------------------------------------------------------ */

const AnnounceContext = createContext<(msg: string) => void>(() => {});

export function AnnounceProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState("");
  const announce = useCallback((m: string) => {
    // Vaciar primero para que un mismo mensaje se vuelva a anunciar.
    setMsg("");
    window.setTimeout(() => setMsg(m), 60);
  }, []);
  return (
    <AnnounceContext.Provider value={announce}>
      {children}
      <p role="status" aria-live="polite" className="sr-only">
        {msg}
      </p>
    </AnnounceContext.Provider>
  );
}

export const useAnnounce = () => useContext(AnnounceContext);

/* ------------------------------------------------------------------ */
/* Botón "Agregar al calendario" (.ics)                                */
/* ------------------------------------------------------------------ */

type Status = "idle" | "done" | "error";

export function AddToCalendarButton({
  items,
  label = "Agregar al calendario",
  srContext,
  variant = "secondary",
  size = "sm",
  className,
}: {
  items: readonly Vencimiento[];
  label?: string;
  /** Texto extra solo para lectores (qué se agrega). */
  srContext?: string;
  variant?: "primary" | "secondary" | "subtle";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<number | undefined>(undefined);
  const announce = useAnnounce();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onClick = () => {
    const ok = downloadICS(items);
    setStatus(ok ? "done" : "error");
    announce(
      ok
        ? items.length === 1
          ? "Descargamos el archivo .ics. Abrilo para sumar el vencimiento a tu calendario."
          : `Descargamos un archivo .ics con ${items.length} vencimientos. Abrilo para sumarlos a tu calendario.`
        : "No pudimos generar el archivo. Probá de nuevo o anotá la fecha a mano.",
    );
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus("idle"), 2800);
  };

  const Icon = status === "done" ? Check : status === "error" ? CircleAlert : CalendarPlus;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!items.length}
      className={buttonClass({
        variant,
        size,
        className: clsx(
          status === "done" && variant !== "primary" && "!text-ok",
          status === "done" && variant === "secondary" && "!ring-ok/50",
          className,
        ),
      })}
    >
      <Icon aria-hidden="true" />
      <span>{status === "done" ? "Archivo descargado" : status === "error" ? "No se pudo descargar" : label}</span>
      {srContext ? <span className="sr-only">: {srContext}</span> : null}
    </button>
  );
}
