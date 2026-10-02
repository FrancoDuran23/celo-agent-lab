import { Link } from "react-router";
import { ArrowRight, ArrowUpRight, Car } from "lucide-react";
import { getImpuesto } from "../../data/impuestos";
import { LINKS } from "../../data/site";
import { Icon } from "../../lib/icons";
import { CtaBand } from "../home/CtaBand";

/**
 * Situaciones cotidianas → impuesto que corresponde. Las que apuntan a un
 * impuesto que no está en IMPUESTOS no se muestran.
 */
const SITUACIONES: { texto: string; slug: string }[] = [
  { texto: "Tengo una casa, un departamento o un terreno", slug: "inmobiliario" },
  { texto: "Tengo un comercio o presto servicios", slug: "ingresos-brutos" },
  { texto: "Firmé un contrato, como un alquiler o una compraventa", slug: "sellos" },
  { texto: "Voy a iniciar un juicio", slug: "tasas" },
  { texto: "Tengo una explotación minera", slug: "minerales" },
];

const rowClass =
  "group flex gap-4 rounded-2xl bg-white/6 p-3.5 ring-1 ring-white/10 backdrop-blur-[2px] sm:p-4";
const iconClass = "inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-ocre-300";

export function Orientacion({ id }: { id?: string }) {
  const items = SITUACIONES.flatMap((s) => {
    const imp = getImpuesto(s.slug);
    return imp ? [{ texto: s.texto, imp }] : [];
  });
  if (!items.length) return null;

  return (
    <div id={id} className="scroll-mt-28">
      <CtaBand className="dark:ring-1 dark:ring-line-strong">
        <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_1.3fr] lg:items-center lg:gap-14 lg:p-14">
          <div>
            <p className="eyebrow !text-crema-200/70">Orientación</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              ¿No sabés qué impuesto{" "}
              <span className="font-serif font-normal tracking-normal text-ocre-300 italic">te corresponde?</span>
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-crema-100/80">
              Elegí la situación que más se parece a la tuya y te llevamos a la información que necesitás.
            </p>
          </div>

          <ul className="grid gap-2">
            {items.map(({ texto, imp }) => (
              <li key={imp.slug}>
                <Link
                  to={`/impuestos/${imp.slug}`}
                  className={`${rowClass} items-center transition-colors hover:bg-white/12 hover:ring-white/20 focus-visible:outline-ocre-300`}
                >
                  <span className={iconClass}>
                    <Icon name={imp.icon} className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block leading-snug font-semibold text-crema-50">{texto}</span>
                    <span className="mt-0.5 block text-sm text-crema-200/75">
                      <span className="sr-only">Te corresponde: </span>
                      {imp.nombre}
                    </span>
                  </span>
                  <ArrowRight
                    className="size-4 shrink-0 text-crema-200/60 transition-transform group-hover:translate-x-1 group-hover:text-crema-50"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}

            {/* El Impuesto Automotor no es provincial: lo administra cada municipio. */}
            <li className={`${rowClass} items-start`}>
              <span className={iconClass}>
                <Car className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block leading-snug font-semibold text-crema-50">
                  Tengo un auto, una moto o un utilitario
                </span>
                <span className="mt-0.5 block text-sm leading-relaxed text-crema-200/75">
                  El Impuesto Automotor es municipal: se paga en el municipio donde está radicado el vehículo.{" "}
                  <a
                    href={LINKS.automotorCapital}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 font-medium whitespace-nowrap text-ocre-300 underline-offset-2 hover:underline focus-visible:outline-ocre-300"
                  >
                    Vehículos de la Capital
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    <span className="sr-only">(sitio municipal, se abre en una pestaña nueva)</span>
                  </a>
                </span>
              </span>
            </li>
          </ul>
        </div>
      </CtaBand>
    </div>
  );
}
