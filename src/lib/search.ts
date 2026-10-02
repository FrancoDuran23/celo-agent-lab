import type { Tramite } from "../data/types";

/** Minúsculas y sin tildes: "Trámite" → "tramite". */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

/**
 * Búsqueda simple por relevancia: coincidencias en el título pesan más que
 * en palabras clave y descripción; todas las palabras de la consulta deben
 * aparecer en algún campo.
 */
export function searchTramites(tramites: Tramite[], query: string, limit = Infinity): Tramite[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return tramites.slice(0, limit);

  const scored: { t: Tramite; score: number }[] = [];
  for (const t of tramites) {
    const title = normalize(t.titulo);
    const keys = normalize((t.palabrasClave ?? []).join(" ") + " " + t.impuesto);
    const desc = normalize(t.descripcion);
    let score = 0;
    let all = true;
    for (const term of terms) {
      const inTitle = title.includes(term);
      const inKeys = keys.includes(term);
      const inDesc = desc.includes(term);
      if (!inTitle && !inKeys && !inDesc) {
        all = false;
        break;
      }
      score += (inTitle ? 6 : 0) + (title.startsWith(term) ? 3 : 0) + (inKeys ? 3 : 0) + (inDesc ? 1 : 0);
    }
    if (all) scored.push({ t, score: score + (t.destacado ? 1 : 0) });
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.t);
}
