import { Link } from "react-router";
import { IMPUESTOS } from "../../data/impuestos";
import { tramitesDe } from "./related";

/**
 * Índice de impuestos como lista con reglas de 1px: nombre y bajada a la
 * izquierda, quiénes pagan a la derecha (se apilan en móvil).
 */
export function ImpuestosIndice() {
  return (
    <ul aria-label="Impuestos provinciales" className="border-b border-line">
      {IMPUESTOS.map((imp) => {
        const tramites = tramitesDe(imp);
        const enLinea = tramites.filter((t) => t.canal !== "presencial").length;
        return (
          <li
            key={imp.slug}
            className="grid grid-cols-[minmax(0,1fr)] gap-x-12 gap-y-4 border-t border-line py-6 sm:py-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
          >
            <div className="min-w-0">
              <h2 className="text-xl font-bold">
                <Link to={`/impuestos/${imp.slug}`} className="link">
                  {imp.nombre}
                </Link>
              </h2>
              <p className="mt-1.5 text-ink-2">{imp.bajada}</p>
              {tramites.length ? (
                <p className="mt-2 text-sm text-ink-3">
                  <span className="tabular">{tramites.length}</span>{" "}
                  {tramites.length === 1 ? "trámite relacionado" : "trámites relacionados"}
                  {enLinea === tramites.length ? ", todos en línea" : enLinea ? `, ${enLinea} en línea` : ""}
                </p>
              ) : null}
            </div>
            <dl className="min-w-0">
              <dt className="text-sm font-semibold text-ink">Quiénes pagan</dt>
              <dd className="mt-1 text-[0.95rem] text-ink-3">{imp.quienes}</dd>
            </dl>
          </li>
        );
      })}
    </ul>
  );
}
