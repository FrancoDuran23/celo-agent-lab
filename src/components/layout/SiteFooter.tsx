import type { MouseEvent, ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowUp, ArrowUpRight, Clock, LogIn, MapPin, Phone } from "lucide-react";
import clsx from "clsx";
import { Logo } from "./Logo";
import { SHOW_PROTOTYPE_NOTICE, SITE } from "../../data/site";
import { CANALES, CONTACTO, OFICINAS, PORTAL, REDES } from "../../data/contacto";
import { TRAMITES } from "../../data/tramites";
import { IMPUESTOS } from "../../data/impuestos";
import type { PaletteColor } from "../../data/types";
import { Icon } from "../../lib/icons";
import { ButtonLink, isExternal } from "../ui/Button";
import { SmartLink } from "../ui/primitives";

const DOT: Record<PaletteColor, string> = {
  terracota: "bg-terracota-500",
  ocre: "bg-ocre-500",
  rosa: "bg-rosa-500",
  salvia: "bg-salvia-500",
  violeta: "bg-violeta-500",
  night: "bg-night-600",
};

const linkClass =
  "group inline-flex rounded-md py-1 text-[0.94rem] leading-snug text-crema-200/80 transition-colors hover:text-crema-50";

export function SiteFooter() {
  const frecuentes = TRAMITES.filter((t) => t.destacado).slice(0, 5);
  const casaCentral = OFICINAS.find((o) => o.casaCentral);
  const anio = new Date().getFullYear();

  const volverArriba = (e: MouseEvent<HTMLButtonElement>) => {
    // El desplazamiento respeta `scroll-behavior` (suave salvo con movimiento reducido).
    window.scrollTo({ top: 0 });
    // Con teclado (detail === 0), llevar el foco al inicio del documento.
    if (e.detail === 0) document.querySelector<HTMLElement>(".skip-link")?.focus({ preventScroll: true });
  };

  return (
    <footer className="relative isolate mt-auto overflow-hidden bg-night-900 text-crema-200/80 dark:bg-night-950 [&_:focus-visible]:outline-ocre-300">
      <div className="aguayo-strip" />

      {/* Acento decorativo: resplandor cálido muy tenue */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-32 -z-10 size-[28rem] rounded-full bg-[radial-gradient(circle,rgb(224_166_59/0.12),transparent_65%)]"
      />

      <div className="container-page grid gap-12 pt-16 pb-14 lg:pt-20 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,2fr)] xl:gap-16">
        {/* Marca: en tablet se reparte en dos columnas; en escritorio, columna propia */}
        <div className="grid gap-6 md:grid-cols-2 md:gap-12 xl:block xl:max-w-md">
          <div>
            <Link to="/" aria-label="Rentas Jujuy — inicio" className="inline-flex rounded-lg">
              <Logo tone="light" />
            </Link>
            <p className="mt-6 leading-relaxed">
              <span className="block font-medium text-crema-50">{SITE.nombreLargo}</span>
              <span className="block text-[0.94rem] text-crema-200/70">{SITE.dependencia}</span>
            </p>
          </div>

          <div className="xl:mt-5">
            <p className="text-[0.94rem] leading-relaxed text-crema-200/75">
              Desde el <span className="text-crema-50">Centro de Atención Omnicanal</span> te acompañamos a
              distancia para que resuelvas tus consultas y trámites sin hacer filas.
            </p>
            <ButtonLink to={PORTAL.clave.href} variant="light" size="sm" className="mt-6">
              <LogIn aria-hidden="true" />
              {PORTAL.clave.ctaLargo}
            </ButtonLink>

            {REDES.length ? (
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Redes sociales">
                {REDES.map((r) => (
                  <li key={r.href}>
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center rounded-full px-3.5 text-sm text-crema-100/85 ring-1 ring-white/15 transition-colors hover:bg-white/10 hover:text-crema-50"
                    >
                      {r.nombre}
                      <span className="sr-only"> (se abre en una pestaña nueva)</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        {/* Columnas de enlaces */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 sm:gap-x-8">
          <FooterNav id="footer-tramites" title="Trámites frecuentes">
            {frecuentes.map((t) => (
              <li key={t.id}>
                <SmartLink to={t.href} className={linkClass}>
                  <LinkLabel text={t.titulo} href={t.href} />
                </SmartLink>
              </li>
            ))}
            <li className="pt-2">
              <MoreLink to="/tramites">Ver todos los trámites</MoreLink>
            </li>
          </FooterNav>

          <FooterNav id="footer-impuestos" title="Impuestos">
            {IMPUESTOS.map((i) => (
              <li key={i.slug}>
                <Link to={`/impuestos/${i.slug}`} className={clsx(linkClass, "items-center gap-2.5")}>
                  <span aria-hidden="true" className={clsx("size-2 shrink-0 rounded-full", DOT[i.color])} />
                  {i.corto}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <MoreLink to="/impuestos">Todos los impuestos</MoreLink>
            </li>
          </FooterNav>

          <FooterNav id="footer-atencion" title="Atención" className="col-span-2 sm:col-span-1">
            <li>
              <a
                href={CONTACTO.telefono.href}
                className="group flex items-center gap-3 rounded-xl py-1 text-crema-50 transition-colors"
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/8 text-ocre-300 ring-1 ring-white/10 transition-colors group-hover:bg-white/12">
                  <Phone className="size-[1.1rem]" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-xs text-crema-200/70">Teléfono</span>
                  <span className="block text-lg font-semibold tracking-tight whitespace-nowrap tabular group-hover:underline group-hover:underline-offset-4">
                    {CONTACTO.telefono.valor}
                  </span>
                </span>
              </a>
            </li>
            {CANALES.map((c) => (
              <li key={c.id}>
                <SmartLink to={c.href} className={clsx(linkClass, "items-center gap-2.5")}>
                  <Icon name={c.icon} className="size-4 shrink-0 text-ocre-300" />
                  <span>
                    <span className="text-crema-200/70">{c.nombre}: </span>
                    <LinkLabel text={c.valor} href={c.href} />
                  </span>
                </SmartLink>
              </li>
            ))}
            {casaCentral?.direccion ? (
              <li className="flex items-start gap-2.5 py-1 text-[0.94rem] leading-snug">
                <MapPin className="mt-0.5 size-4 shrink-0 text-ocre-300" aria-hidden="true" />
                <span>
                  <span className="block text-crema-50">{casaCentral.nombre}</span>
                  {casaCentral.direccion}, {casaCentral.localidad}
                </span>
              </li>
            ) : null}
            {casaCentral?.horario ? (
              <li className="flex items-start gap-2.5 py-1 text-[0.94rem] leading-snug">
                <Clock className="mt-0.5 size-4 shrink-0 text-ocre-300" aria-hidden="true" />
                <span>{casaCentral.horario}</span>
              </li>
            ) : null}
            <li className="pt-2">
              <MoreLink to="/atencion">Canales, oficinas y horarios</MoreLink>
            </li>
          </FooterNav>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-5 py-6 text-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="text-crema-200/70">
            <p>
              © {anio} {SITE.nombreLargo} · Gobierno de Jujuy
            </p>
            {SHOW_PROTOTYPE_NOTICE ? (
              <p className="mt-1 text-xs text-crema-200/60">
                Propuesta de rediseño no oficial. Los trámites se realizan en el sitio oficial.
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <nav aria-label="Enlaces institucionales">
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <li>
                  <Link to="/vencimientos" className="rounded-md text-crema-200/80 hover:text-crema-50">
                    Vencimientos
                  </Link>
                </li>
                <li>
                  <Link to="/normativa" className="rounded-md text-crema-200/80 hover:text-crema-50">
                    Normativa
                  </Link>
                </li>
                <li>
                  <Link to="/noticias" className="rounded-md text-crema-200/80 hover:text-crema-50">
                    Noticias
                  </Link>
                </li>
                <li>
                  <a
                    href={PORTAL.sitioOficial}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-md text-crema-200/80 hover:text-crema-50"
                  >
                    Sitio oficial
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    <span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                </li>
              </ul>
            </nav>
            <button
              type="button"
              onClick={volverArriba}
              className="inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-crema-100/85 ring-1 ring-white/15 transition-colors hover:bg-white/10 hover:text-crema-50"
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

function FooterNav({
  id,
  title,
  className,
  children,
}: {
  id: string;
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <nav aria-labelledby={id} className={className}>
      <h2 id={id} className="eyebrow mb-4 !text-crema-200/60">
        {title}
      </h2>
      <ul className="grid gap-1.5">{children}</ul>
    </nav>
  );
}

function MoreLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-ocre-300 hover:text-ocre-500"
    >
      {children}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </Link>
  );
}

/**
 * Texto de un enlace; si abre en otra pestaña (portal oficial) suma una
 * flecha pegada a la última palabra y un aviso para lectores de pantalla.
 */
function LinkLabel({ text, href }: { text: string; href: string }) {
  const newTab = isExternal(href) && /^https?:/.test(href);
  if (!newTab) return <span>{text}</span>;
  const cut = text.lastIndexOf(" ");
  return (
    <span>
      {cut > 0 ? text.slice(0, cut + 1) : null}
      <span className="whitespace-nowrap">
        {cut > 0 ? text.slice(cut + 1) : text}
        <ExternalHint />
      </span>
    </span>
  );
}

function ExternalHint() {
  return (
    <>
      <ArrowUpRight
        className="ml-1 inline-block size-3.5 align-[-0.15em] opacity-50 transition-[opacity,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
        aria-hidden="true"
      />
      <span className="sr-only"> (se abre en una pestaña nueva)</span>
    </>
  );
}
