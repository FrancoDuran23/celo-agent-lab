import clsx from "clsx";
import type { Norma } from "../../data/types";
import { ArrowLink, Panel } from "../ui/primitives";
import { normaLabel, splitTitulo } from "./utils";

interface Clave {
  norma: Norma;
  /** Para qué sirve consultarla (genérico). */
  uso: string;
}

/** Las dos normas que más se consultan: Código Fiscal y Ley Impositiva vigente. */
export function NormasClave({ codigo, impositiva }: { codigo?: Norma; impositiva?: Norma }) {
  const items: Clave[] = [];
  if (codigo)
    items.push({
      norma: codigo,
      uso: "Consultalo para saber cómo funciona cada impuesto provincial, qué obligaciones tenés y cuáles son los plazos y procedimientos.",
    });
  if (impositiva)
    items.push({
      norma: impositiva,
      uso: "Consultala para conocer las alícuotas por actividad y los montos fijos y mínimos de cada impuesto para el año.",
    });
  if (!items.length) return null;

  return (
    <ul className={clsx("grid grid-cols-[minmax(0,1fr)] gap-4 sm:gap-6", items.length > 1 && "md:grid-cols-2")}>
      {items.map((c) => (
        <li key={c.norma.tipo + c.norma.numero} className="min-w-0">
          <NormaClave {...c} />
        </li>
      ))}
    </ul>
  );
}

function NormaClave({ norma, uso }: Clave) {
  const [head, sub] = splitTitulo(norma.titulo);
  const id = `clave-${norma.numero.replace(/\W/g, "")}`;

  return (
    <Panel as="article" aria-labelledby={id} className="flex h-full flex-col p-6 sm:p-7">
      <h3 id={id} className="text-xl font-bold text-ink">
        {head}
      </h3>
      <p className="mt-1 text-ink-3">
        <span className="tabular">{normaLabel(norma)}</span>
        {sub ? <> · {sub}</> : null}
      </p>
      <p className="mt-4 text-ink-2">{uso}</p>
      {norma.href ? (
        <div className="mt-auto pt-5">
          <ArrowLink to={norma.href}>
            Ver en el sitio oficial
            <span className="sr-only">: {normaLabel(norma)}</span>
          </ArrowLink>
        </div>
      ) : null}
    </Panel>
  );
}
