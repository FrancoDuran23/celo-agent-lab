import { Link } from "react-router";
import { Logo } from "./Logo";
import { NAV, SITE } from "../../data/site";
import { CONTACTO, PORTAL } from "../../data/contacto";

// Stub provisorio — se completa con canales, redes y oficinas verificadas.
export function SiteFooter() {
  return (
    <footer className="mt-auto bg-night-900 text-crema-200/80">
      <div className="aguayo-strip" />
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr]">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">{SITE.dependencia}</p>
          <a href={CONTACTO.telefono.href} className="mt-4 inline-block text-crema-50">
            {CONTACTO.telefono.valor}
          </a>
        </div>
        <ul className="grid grid-cols-2 gap-2 text-sm">
          {NAV.map((n) => (
            <li key={n.to}>
              <Link to={n.to} className="hover:text-crema-50">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-6 text-xs">
          <a href={PORTAL.sitioOficial}>{PORTAL.sitioOficial.replace("https://", "")}</a>
        </div>
      </div>
    </footer>
  );
}
