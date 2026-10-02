import { REDES } from "../../data/contacto";
import { SmartLink } from "../ui/primitives";

/** Enlace a una red: en táctil, área de toque de 44×44px (la "X" sola mide 11px de ancho). */
const REDES_LINK =
  "link font-semibold coarse:inline-flex coarse:min-h-11 coarse:min-w-11 coarse:items-center coarse:justify-center";

/** Cierre con las cuentas oficiales (REDES), como una línea de enlaces. */
export function Seguinos() {
  if (!REDES.length) return null;
  return (
    <section aria-labelledby="seguinos-titulo" className="border-t border-line">
      <div className="container-page flex flex-col gap-x-8 gap-y-3 py-8 sm:flex-row sm:flex-wrap sm:items-baseline sm:py-10">
        <h2 id="seguinos-titulo" className="text-lg font-bold text-ink">
          Seguinos en redes
        </h2>
        {/* En móvil, una red por línea; en táctil cada enlace mide al menos 44×44px. */}
        <ul className="flex flex-col gap-x-6 gap-y-2 coarse:gap-y-0 sm:flex-row sm:flex-wrap">
          {REDES.map((r) => (
            <li key={r.href}>
              <SmartLink to={r.href} className={REDES_LINK}>
                {r.nombre}
                {r.nombre === "X" ? <span className="sr-only"> (Twitter)</span> : null}
              </SmartLink>{" "}
              <span className="text-ink-3">{r.usuario}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
