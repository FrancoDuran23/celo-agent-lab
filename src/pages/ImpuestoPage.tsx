import type { ReactNode } from "react";
import { Link, useParams } from "react-router";
import { ArrowUpRight, CalendarDays, ListChecks } from "lucide-react";
import { getImpuesto, IMPUESTOS } from "../data/impuestos";
import { PORTAL } from "../data/contacto";
import { LINKS } from "../data/site";
import type { Impuesto } from "../data/types";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { buttonClass, ButtonLink } from "../components/ui/Button";
import { ArrowLink, LinkList, Notice, PageIntro, SectionHeader, SmartLink } from "../components/ui/primitives";
import { SectionNav, type NavSection } from "../components/impuestos/SectionNav";
import { TramitesImpuesto } from "../components/impuestos/TramitesImpuesto";
import { VencimientosImpuesto } from "../components/impuestos/VencimientosImpuesto";
import { Faq } from "../components/impuestos/Faq";
import { OtrosImpuestos } from "../components/impuestos/OtrosImpuestos";
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

  const sections: NavSection[] = [
    ...(imp.puntos.length ? [{ id: "resumen", label: "Lo que tenés que saber" }] : []),
    { id: "quienes", label: "Quiénes pagan" },
    ...(tramites.length ? [{ id: "tramites", label: "Trámites" }] : []),
    { id: "vencimientos", label: "Próximos vencimientos" },
    ...(imp.preguntas.length ? [{ id: "preguntas", label: "Preguntas frecuentes" }] : []),
  ];

  return (
    <>
      <PageIntro
        title={imp.nombre}
        description={imp.bajada}
        breadcrumbs={[{ label: "Impuestos", to: "/impuestos" }, { label: imp.nombre }]}
      >
        <p className="prose-measure text-ink-3">{imp.descripcion}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {tramites.length ? (
            <a href="#tramites" className={buttonClass({ variant: "primary" })}>
              <ListChecks aria-hidden="true" />
              Ver trámites
            </a>
          ) : null}
          <ButtonLink to="/vencimientos" variant="secondary">
            <CalendarDays aria-hidden="true" />
            Calendario de vencimientos
          </ButtonLink>
        </div>
      </PageIntro>

      <div className="container-page grid grid-cols-[minmax(0,1fr)] gap-8 py-10 sm:py-14 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[14rem_minmax(0,1fr)]">
        <aside className="min-w-0 border-b border-line pb-8 lg:sticky lg:top-24 lg:self-start lg:border-0 lg:pb-0">
          <SectionNav sections={sections} />
        </aside>

        <div className="grid min-w-0 gap-14 sm:gap-16">
          {imp.puntos.length ? (
            <Bloque id="resumen" title="Lo que tenés que saber">
              <ul className="prose-measure grid list-disc gap-2.5 pl-5 text-ink-2 marker:text-ink-3">
                {imp.puntos.map((p) => (
                  <li key={p} className="pl-1">
                    {p}
                  </li>
                ))}
              </ul>
            </Bloque>
          ) : null}

          <Bloque id="quienes" title="Quiénes pagan">
            <p className="prose-measure text-ink-2">{imp.quienes}</p>
            <p className="mt-3 text-ink-3">
              ¿No sabés si te alcanza?{" "}
              <Link to="/atencion" className="link">
                Consultá con Atención al contribuyente
              </Link>
              .
            </p>
          </Bloque>

          {tramites.length ? (
            <Bloque
              id="tramites"
              title="Trámites"
              description={`${tramites.length} ${tramites.length === 1 ? "trámite relacionado" : "trámites relacionados"} con ${imp.corto}.${tramites.every((t) => opensNewTab(t.href)) ? " Se realizan en el sitio oficial de Rentas." : ""}`}
              action={<ArrowLink to={`/tramites?impuesto=${imp.slug}`}>Ver en la guía de trámites</ArrowLink>}
            >
              <TramitesImpuesto tramites={tramites} />
            </Bloque>
          ) : null}

          <Bloque
            id="vencimientos"
            title="Próximos vencimientos"
            action={<ArrowLink to="/vencimientos">Calendario completo</ArrowLink>}
          >
            <VencimientosImpuesto imp={imp} />
          </Bloque>

          {imp.preguntas.length ? (
            <Bloque id="preguntas" title="Preguntas frecuentes">
              <Faq preguntas={imp.preguntas} />
            </Bloque>
          ) : null}

          <aside aria-labelledby="ayuda-titulo" className="rounded-xl bg-surface-2 p-6 sm:p-7">
            <h2 id="ayuda-titulo" className="text-xl font-bold text-ink">
              ¿Te quedó alguna duda?
            </h2>
            <p className="prose-measure mt-1 text-ink-2">
              Consultá los canales de atención de Rentas o sacá un turno para que te atiendan en persona.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink to="/atencion">Ir a Atención</ButtonLink>
              <ButtonLink to={PORTAL.turnos.href} variant="secondary">
                Sacar turno
                <ArrowUpRight aria-hidden="true" />
              </ButtonLink>
            </div>
          </aside>
        </div>
      </div>

      <OtrosImpuestos actual={imp.slug} />
    </>
  );
}

function Bloque({
  id,
  title,
  description,
  action,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="min-w-0 scroll-mt-6">
      <SectionHeader id={`${id}-titulo`} title={title} description={description} action={action} />
      <div className="mt-5">{children}</div>
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

  const provinciales = IMPUESTOS.map((i) => ({
    key: i.slug,
    href: `/impuestos/${i.slug}`,
    title: i.nombre,
    description: i.bajada,
  }));

  return (
    <>
      <PageIntro
        title={automotor ? "Impuesto Automotor" : "No encontramos ese impuesto"}
        description={
          automotor
            ? "La patente se paga en tu municipio, no en Rentas de la Provincia."
            : "Puede que el enlace esté mal escrito o que la página haya cambiado de lugar. Elegí uno de los impuestos provinciales o volvé al inicio."
        }
        breadcrumbs={[
          { label: "Impuestos", to: "/impuestos" },
          { label: automotor ? "Impuesto Automotor" : "Impuesto no encontrado" },
        ]}
      >
        {automotor ? null : (
          <div className="flex flex-wrap gap-3">
            <ButtonLink to="/impuestos">Ver todos los impuestos</ButtonLink>
            <ButtonLink to="/" variant="secondary">
              Volver al inicio
            </ButtonLink>
          </div>
        )}
      </PageIntro>

      <div className="container-page py-10 sm:py-14">
        {automotor ? (
          <Notice tone="info" title="El Impuesto Automotor es municipal" className="mb-12 max-w-3xl">
            <p>
              No lo administra Rentas de la Provincia: lo cobra el municipio donde está radicado el vehículo. Consultá
              en tu municipalidad.
            </p>
            <p className="mt-3">
              <SmartLink to={LINKS.automotorCapital} className="link font-semibold">
                Vehículos de la Capital
                <ArrowUpRight className="ml-0.5 inline size-4 align-[-2px]" aria-hidden="true" />
              </SmartLink>
            </p>
          </Notice>
        ) : null}

        <section aria-labelledby="provinciales-titulo">
          <SectionHeader
            id="provinciales-titulo"
            title={automotor ? "Impuestos de la Provincia" : "Impuestos provinciales"}
            description={automotor ? "Estos son los impuestos que administra Rentas de la Provincia." : undefined}
          />
          <LinkList className="mt-6 border-b border-line" columns={3} items={provinciales} />
        </section>
      </div>
    </>
  );
}
