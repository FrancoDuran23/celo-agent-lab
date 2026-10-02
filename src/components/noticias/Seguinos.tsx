import { REDES } from "../../data/contacto";
import { SmartLink } from "../ui/primitives";

/** Cierre con las cuentas oficiales (REDES), como una línea de enlaces. */
export function Seguinos() {
  if (!REDES.length) return null;
  return (
    <section aria-labelledby="seguinos-titulo" className="border-t border-line">
      <div className="container-page flex flex-col gap-x-8 gap-y-3 py-8 sm:flex-row sm:flex-wrap sm:items-baseline sm:py-10">
        <h2 id="seguinos-titulo" className="text-lg font-bold text-ink">
          Seguinos en redes
        </h2>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {REDES.map((r) => (
            <li key={r.href}>
              <SmartLink to={r.href} className="link font-semibold">
                {r.nombre}
              </SmartLink>{" "}
              <span className="text-ink-3">{r.usuario}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
