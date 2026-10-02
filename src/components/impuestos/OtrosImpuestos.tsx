import { Link } from "react-router";
import { IMPUESTOS } from "../../data/impuestos";
import type { ImpuestoSlug } from "../../data/types";

/** El resto de los impuestos, como una lista simple de enlaces. */
export function OtrosImpuestos({ actual }: { actual: ImpuestoSlug }) {
  const otros = IMPUESTOS.filter((i) => i.slug !== actual);
  if (!otros.length) return null;

  return (
    <section aria-labelledby="otros-titulo" className="border-t border-line">
      <div className="container-page py-10 sm:py-12">
        <h2 id="otros-titulo" className="text-xl font-bold text-ink">
          Otros impuestos
        </h2>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {otros.map((imp) => (
            <li key={imp.slug}>
              <Link to={`/impuestos/${imp.slug}`} className="link font-semibold">
                {imp.nombre}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
