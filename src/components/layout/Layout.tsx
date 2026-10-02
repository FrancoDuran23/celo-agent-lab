import { Outlet, ScrollRestoration } from "react-router";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      {/* Destino del enlace "Saltar al contenido": recibe el foco sin marco alrededor de toda la página. */}
      <main id="contenido" tabIndex={-1} className="flex-1 outline-none focus-visible:shadow-none">
        <Outlet />
      </main>
      <SiteFooter />
      <ScrollRestoration />
    </div>
  );
}
