import type { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowUp } from "lucide-react";
import { Logo } from "./Logo";
import { SHOW_PROTOTYPE_NOTICE, SITE } from "../../data/site";
import { CONTACTO, OFICINAS, PORTAL, REDES } from "../../data/contacto";
import { TRAMITES } from "../../data/tramites";
import { IMPUESTOS } from "../../data/impuestos";
import { SmartLink } from "../ui/primitives";

/**
 * Redes en pantallas táctiles: objetivo de 44px (la "X" sola mide 11px de
 * ancho). El alto lo da min-h; el ancho, un ::before de 44px centrado, para
 * que la "X" no quede corrida respecto de las otras redes (mismo patrón que
 * Seguinos).
 */
const redesLink =
  "link coarse:relative coarse:inline-flex coarse:min-h-11 coarse:items-center coarse:before:absolute coarse:before:inset-y-0 coarse:before:left-1/2 coarse:before:w-11 coarse:before:-translate-x-1/2";

export function SiteFooter() {
  const frecuentes = TRAMITES.filter((t) => t.destacado).slice(0, 5);
  const casaCentral = OFICINAS.find((o) => o.casaCentral);
  const anio = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line bg-surface-2 text-[0.95rem] text-ink-2">
      {/* Dos columnas hasta xl: a 1024px, cuatro dejaban "Atención" en ~214px y partían teléfono y correo. */}
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:gap-12 xl:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <Link to="/" aria-label="Rentas Jujuy, ir al inicio" className="inline-flex rounded-md">
            <Logo />
          </Link>
          <p className="mt-4 max-w-xs">{SITE.dependencia}</p>
          {REDES.length ? (
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1" aria-label="Redes sociales">
              {REDES.map((r) => (
                <li key={r.href}>
                  <SmartLink to={r.href} className={redesLink}>
                    {r.nombre}
                    {r.nombre === "X" ? <span className="sr-only"> (Twitter)</span> : null}
                  </SmartLink>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <FooterNav title="Trámites frecuentes">
          {frecuentes.map((t) => (
            <li key={t.id}>
              <SmartLink to={t.href} className="link">
                {t.titulo}
              </SmartLink>
            </li>
          ))}
          <li>
            <Link to="/tramites" className="link font-semibold">
              Todos los trámites
            </Link>
          </li>
        </FooterNav>

        <FooterNav title="Impuestos">
          {IMPUESTOS.map((i) => (
            <li key={i.slug}>
              <Link to={`/impuestos/${i.slug}`} className="link">
                {i.corto}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/vencimientos" className="link">
              Calendario de vencimientos
            </Link>
          </li>
          <li>
            <Link to="/normativa" className="link">
              Normativa
            </Link>
          </li>
        </FooterNav>

        <FooterNav title="Atención">
          <li>
            <a href={CONTACTO.telefono.href} className="link">
              Línea gratuita <span className="tabular whitespace-nowrap">{CONTACTO.telefono.valor}</span>
            </a>
          </li>
          <li>
            <SmartLink to={CONTACTO.whatsapp.href} className="link">
              WhatsApp <span className="tabular whitespace-nowrap">{CONTACTO.whatsapp.valor}</span>
            </SmartLink>
          </li>
          <li>
            <a href={CONTACTO.email.href} className="link">
              {CONTACTO.email.valor.split("@")[0]}@<wbr />
              {CONTACTO.email.valor.split("@")[1]}
            </a>
          </li>
          {casaCentral ? (
            <li className="pt-1">
              {casaCentral.nombre}: {casaCentral.direccion}, {casaCentral.localidad}.
              {casaCentral.horario ? <span className="block text-ink-3">{casaCentral.horario}</span> : null}
            </li>
          ) : null}
          <li>
            <Link to="/atencion" className="link font-semibold">
              Oficinas y canales
            </Link>
          </li>
        </FooterNav>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-3 py-6 text-sm text-ink-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p>
              © {anio} {SITE.nombreLargo} · Gobierno de Jujuy
            </p>
            {SHOW_PROTOTYPE_NOTICE ? (
              <p className="mt-1">
                Propuesta de rediseño, prototipo no oficial. Sitio oficial:{" "}
                <a href={PORTAL.sitioOficial} className="link">
                  {PORTAL.sitioOficial.replace("https://", "")}
                </a>
              </p>
            ) : null}
          </div>
          {/* En pantallas táctiles, objetivos de 44px de alto sin mover nada (py/-my). */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/ayuda" className="link coarse:-my-3 coarse:py-3">
              Centro de ayuda
            </Link>
            <Link to="/noticias" className="link coarse:-my-3 coarse:py-3">
              Noticias
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0 })}
              className="inline-flex items-center gap-1 font-semibold text-ink-2 hover:text-ink coarse:-my-3 coarse:py-3"
            >
              <ArrowUp className="size-4" aria-hidden="true" />
              Volver arriba
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterNav({ title, children }: { title: string; children: ReactNode }) {
  return (
    <nav aria-label={title}>
      <h2 className="text-sm font-bold text-ink">{title}</h2>
      {/* En pantallas táctiles los enlaces ocupan la fila (36px de alto) y el espacio entre ellos pasa al relleno. */}
      <ul className="mt-3 grid gap-2 coarse:mt-1.5 coarse:gap-0 coarse:[&_a]:block coarse:[&_a]:py-1.5">{children}</ul>
    </nav>
  );
}
