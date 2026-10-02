import { useCallback, useEffect, useState } from "react";

export type ThemePref = "light" | "dark" | "system";

const KEY = "rentas-theme";

function read(): ThemePref {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

function apply(pref: ThemePref) {
  const root = document.documentElement;
  if (pref === "system") delete root.dataset.theme;
  else root.dataset.theme = pref;
}

/** Aplica la preferencia guardada lo antes posible (llamar antes del render). */
export function bootTheme() {
  apply(read());
}

export function useTheme() {
  const [pref, setPref] = useState<ThemePref>(() => read());

  useEffect(() => {
    apply(pref);
    try {
      if (pref === "system") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, pref);
    } catch {
      /* almacenamiento bloqueado: la preferencia dura la sesión */
    }
  }, [pref]);

  const cycle = useCallback(() => {
    setPref((p) => (p === "system" ? "light" : p === "light" ? "dark" : "system"));
  }, []);

  return { pref, setPref, cycle };
}
