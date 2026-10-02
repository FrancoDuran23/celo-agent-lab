import { getImpuesto } from "../../data/impuestos";
import { ArrowLink, SectionHeader } from "../ui/primitives";

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

export function Orientacion({ id = "orientacion" }: { id?: string }) {
  const items = SITUACIONES.flatMap((s) => {
    const imp = getImpuesto(s.slug);
    return imp ? [{ texto: s.texto, imp }] : [];
  });
  if (!items.length) return null;

  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="container-page pb-14 sm:pb-20">
      <div className="rounded-xl bg-surface-2 p-6 sm:p-8 lg:p-10">
        <SectionHeader
          id={`${id}-titulo`}
          title="¿No sabés qué impuesto te corresponde?"
          description="Buscá la situación que más se parece a la tuya."
        />
        <ul className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-x-10 md:grid-cols-2">
          {items.map(({ texto, imp }) => (
            <li key={imp.slug} className="min-w-0 border-t border-line py-4">
              <p className="text-ink">{texto}</p>
              <p className="mt-1">
                <ArrowLink to={`/impuestos/${imp.slug}`}>
                  <span className="sr-only">Te corresponde: </span>
                  {imp.nombre}
                </ArrowLink>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
