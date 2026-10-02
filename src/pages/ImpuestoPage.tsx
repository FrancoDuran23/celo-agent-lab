import type { ReactNode } from "react";
import { Link, useParams } from "react-router";
import { ArrowRight, CalendarClock, Car, ExternalLink, Headset, SearchX, Users } from "lucide-react";
import clsx from "clsx";
import { getImpuesto } from "../data/impuestos";
import { PORTAL } from "../data/contacto";
import { LINKS } from "../data/site";
import type { Impuesto } from "../data/types";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { ButtonLink } from "../components/ui/Button";
import { CtaBand } from "../components/home/CtaBand";
import { ImpuestoHero } from "../components/impuestos/ImpuestoHero";
import { SectionNav, type NavSection } from "../components/impuestos/SectionNav";
import { TramiteCard } from "../components/impuestos/TramiteCard";
import { VencimientosImpuesto } from "../components/impuestos/VencimientosImpuesto";
import { Faq } from "../components/impuestos/Faq";
import { OtrosImpuestos } from "../components/impuestos/OtrosImpuestos";
import { STRATA_STOPS, strataGradient, TINT } from "../components/impuestos/palette";
import { opensNewTab, tramitesDe } from "../components/impuestos/related";

export function ImpuestoPage() {
  const { slug } = useParams();
  const imp = getImpuesto(slug);
  if (!imp) return <ImpuestoNoEncontrado slug={slug} />;
  // `key` reinicia el estado (scroll-spy, acordeones) al pasar de un impuesto a otro.
  return <ImpuestoDetalle key={imp.slug} imp={imp} />;
}

/* ------------------------------------------------------------------ */
/* Detalle                                                             */
/* ------------------------------------------------------------------ */

function ImpuestoDetalle({ imp }: { imp: Impuesto }) {
  useDocumentTitle(imp.nombre);
  const tramites = tramitesDe(imp);
  const accent = STRATA_STOPS[imp.color][0];

  const sections: NavSection[] = [
    ...(imp.puntos.length ? [{ id: "resumen", label: "Resumen" }] : []),
    { id: "quienes", label: "Quiénes pagan" },
    ...(tramites.length ? [{ id: "tramites", label: "Trámites" }] : []),
    { id: "vencimientos", label: "Vencimientos" },
    ...(imp.preguntas.length ? [{ id: "preguntas", label: "Preguntas frecuentes" }] : []),
  ];

  return (
    <>
      <ImpuestoHero imp={imp} tramites={tramites} />

      <div className="container-page grid grid-cols-[minmax(0,1fr)] gap-10 py-10 sm:py-14 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16 lg:py-16 xl:grid-cols-[15rem_minmax(0,1fr)]">
        <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <SectionNav sections={sections} accent={accent} />
        </aside>

        <div className="grid min-w-0 gap-16 sm:gap-20">
          {imp.puntos.length ? (
            <Bloque id="resumen" eyebrow="Resumen" title="Lo que tenés que saber">
              <ol className="grid gap-3 sm:grid-cols-2">
                {imp.puntos.map((p, i) => (
                  <li key={p} className="flex gap-4 rounded-2xl bg-surface p-5 ring-1 ring-line sm:last:odd:col-span-2">
                    <span
                      aria-hidden="true"
                      className={clsx(
                        "inline-flex size-9 shrink-0 items-center justify-center rounded-full font-mono text-sm font-medium tabular",
                        TINT[imp.color],
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="pt-1.5 leading-relaxed text-ink-2">{p}</p>
                  </li>
                ))}
              </ol>
            </Bloque>
          ) : null}

          <Bloque id="quienes" eyebrow="Alcance" title="Quiénes pagan">
            <div className="relative overflow-hidden rounded-3xl bg-surface p-6 ring-1 ring-line sm:p-8">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1.5"
                style={{ backgroundImage: strataGradient(imp.color) }}
              />
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                <span
                  className={clsx("inline-flex size-12 shrink-0 items-center justify-center rounded-2xl", TINT[imp.color])}
                >
                  <Users className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-lg leading-relaxed text-ink sm:text-xl sm:leading-relaxed">{imp.quienes}</p>
                  <p className="mt-4 text-sm text-ink-3">
                    ¿No sabés si te alcanza?{" "}
                    <Link to="/atencion" className="font-medium text-brand underline-offset-2 hover:underline">
                      Consultá con Atención al contribuyente
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </Bloque>

          {tramites.length ? (
            <Bloque
              id="tramites"
              eyebrow="Hacelo en línea"
              title="Trámites"
              description={`${tramites.length} ${tramites.length === 1 ? "trámite relacionado" : "trámites relacionados"} con ${imp.corto}.${tramites.every((t) => opensNewTab(t.href)) ? " Se realizan en el sitio oficial de Rentas." : ""}`}
              action={
                <Link
                  to={`/tramites?impuesto=${imp.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-brand hover:bg-brand-soft"
                >
                  Abrir en la guía de trámites <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              }
            >
              <ul className="grid gap-3 md:grid-cols-2">
                {tramites.map((t) => (
                  <li key={t.id}>
                    <TramiteCard t={t} />
                  </li>
                ))}
              </ul>
            </Bloque>
          ) : null}

          <Bloque
            id="vencimientos"
            eyebrow="Agenda fiscal"
            title="Próximos vencimientos"
            action={
              <Link
                to="/vencimientos"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-brand hover:bg-brand-soft"
              >
                <CalendarClock className="size-4" aria-hidden="true" />
                Calendario completo
              </Link>
            }
          >
            <VencimientosImpuesto imp={imp} />
          </Bloque>

          {imp.preguntas.length ? (
            <Bloque id="preguntas" eyebrow="Dudas comunes" title="Preguntas frecuentes">
              <Faq preguntas={imp.preguntas} />
            </Bloque>
          ) : null}

          <CtaBand className="dark:ring-1 dark:ring-line-strong">
            <div className="flex flex-col gap-8 p-6 sm:p-10 xl:flex-row xl:items-center xl:justify-between">
              <div className="max-w-xl">
                <p className="eyebrow !text-crema-200/70">Atención al contribuyente</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  ¿Te quedó alguna{" "}
                  <span className="font-serif font-normal tracking-normal text-ocre-300 italic">duda?</span>
                </h2>
                <p className="mt-3 leading-relaxed text-crema-100/80">
                  Consultá los canales de atención de Rentas o sacá un turno para que te atiendan en persona.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <ButtonLink to="/atencion" variant="light" className="focus-visible:outline-ocre-300">
                  <Headset aria-hidden="true" />
                  Ir a Atención
                </ButtonLink>
                <ButtonLink to={PORTAL.turnos.href} variant="outline-light" className="focus-visible:outline-ocre-300">
                  Sacar turno
                  <ExternalLink aria-hidden="true" />
                  <span className="sr-only">(se abre en el sitio oficial, en una pestaña nueva)</span>
                </ButtonLink>
              </div>
            </div>
          </CtaBand>
        </div>
      </div>

      <OtrosImpuestos actual={imp.slug} />
    </>
  );
}

function Bloque({
  id,
  eyebrow,
  title,
  description,
  action,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="scroll-mt-28">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <div className="max-w-2xl">
          {eyebrow ? <p className="eyebrow mb-2">{eyebrow}</p> : null}
          <h2 id={`${id}-titulo`} className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {title}
          </h2>
          {description ? <p className="mt-2 leading-relaxed text-ink-3">{description}</p> : null}
        </div>
        {action ? <div className="-ml-3 shrink-0 sm:ml-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Slug desconocido                                                    */
/* ------------------------------------------------------------------ */

function ImpuestoNoEncontrado({ slug }: { slug?: string }) {
  // El Impuesto Automotor es municipal: un enlace viejo a /impuestos/automotor merece una explicación.
  const automotor = slug === "automotor";
  useDocumentTitle(automotor ? "Impuesto Automotor" : "Impuesto no encontrado");
  return (
    <>
      <div className="container-page py-20 sm:py-28">
        <div className="mx-auto max-w-2xl animate-rise text-center">
          <span className="mx-auto inline-flex size-16 items-center justify-center rounded-2xl bg-surface-2 text-ink-3 ring-1 ring-line">
            {automotor ? <Car className="size-8" aria-hidden="true" /> : <SearchX className="size-8" aria-hidden="true" />}
          </span>
          {automotor ? (
            <>
              <p className="eyebrow mt-6">Impuesto Automotor</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                La patente se paga{" "}
                <span className="font-serif font-normal tracking-normal text-brand italic">en tu municipio.</span>
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-ink-3">
                El Impuesto Automotor no lo administra Rentas de la Provincia: lo cobra el municipio donde está
                radicado el vehículo. Consultá en tu municipalidad.
              </p>
            </>
          ) : (
            <>
              <p className="eyebrow mt-6">Impuesto no encontrado</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                No encontramos{" "}
                <span className="font-serif font-normal tracking-normal text-brand italic">ese impuesto.</span>
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-ink-3">
                Puede que el enlace esté mal escrito o que la página haya cambiado de lugar. Elegí uno de los impuestos
                provinciales o volvé al inicio.
              </p>
            </>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {automotor ? (
              <ButtonLink to={LINKS.automotorCapital} size="lg">
                Vehículos de la Capital
                <ExternalLink aria-hidden="true" />
                <span className="sr-only">(sitio municipal, se abre en una pestaña nueva)</span>
              </ButtonLink>
            ) : null}
            <ButtonLink to="/impuestos" size="lg" variant={automotor ? "secondary" : "primary"}>
              Ver todos los impuestos
            </ButtonLink>
            {automotor ? null : (
              <ButtonLink to="/" variant="secondary" size="lg">
                Volver al inicio
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
      <OtrosImpuestos
        eyebrow={automotor ? "Impuestos de la Provincia" : "Quizás buscabas"}
        title="Impuestos provinciales"
      />
    </>
  );
}
