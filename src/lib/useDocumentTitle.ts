import { useEffect } from "react";

const BASE = "Rentas Jujuy";

/** Título de la pestaña por página: "Trámites · Rentas Jujuy". */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE}` : `${BASE} — Dirección Provincial de Rentas`;
  }, [title]);
}
