import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import clsx from "clsx";
import { ChevronDown, LogIn, Menu, Monitor, Moon, Search, Sun, X } from "lucide-react";
import { Logo } from "./Logo";
import { NAV, SHOW_PROTOTYPE_NOTICE } from "../../data/site";
import { CONTACTO, PORTAL } from "../../data/contacto";
import { useTheme } from "../../lib/theme";
import { ButtonLink } from "../ui/Button";
import { SearchDialog } from "../search/SearchDialog";

export function SiteHeader() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Cerrar el menú móvil al navegar.
  useEffect(() => setMenuOpen(false), [pathname]);

  // Atajo global: "/" o Ctrl/⌘+K abre el buscador.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>

      {SHOW_PROTOTYPE_NOTICE ? (
        <div className="bg-ink px-4 py-1.5 text-center text-xs text-bg">
          Propuesta de rediseño, prototipo no oficial. Los trámites se hacen en el{" "}
          <a href={PORTAL.sitioOficial} className="font-semibold underline underline-offset-2">
            sitio oficial
          </a>
          .
        </div>
      ) : null}

      {/* Barra institucional */}
      <div className="border-b border-line bg-surface-2 text-[0.8rem] text-ink-2">
        <div className="container-page flex h-9 items-center justify-between gap-4">
          <p className="truncate">Gobierno de Jujuy · Ministerio de Hacienda y Finanzas</p>
          <ul className="hidden items-center gap-5 md:flex">
            <li>
              <a href={CONTACTO.telefono.href} className="hover:underline">
                Línea gratuita <span className="font-semibold tabular">{CONTACTO.telefono.valor}</span>
              </a>
            </li>
            <li>
              <a href={PORTAL.turnos.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Turnos web<span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            </li>
            <li>
              <Link to="/ayuda" className="hover:underline">
                Centro de ayuda
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur-sm supports-[backdrop-filter]:bg-bg/85">
        <div className="container-page flex h-16 items-center gap-3 sm:gap-6 lg:h-[4.5rem]">
          <Link to="/" className="shrink-0 rounded-md" aria-label="Rentas Jujuy, ir al inicio">
            <Logo />
          </Link>

          <nav aria-label="Principal" className="hidden h-full flex-1 items-stretch xl:flex">
            <ul className="flex items-stretch gap-1">
              {NAV.map((item) => (
                <li key={item.to} className="flex">
                  {item.children ? (
                    <NavDropdown item={item} />
                  ) : (
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        clsx(
                          "flex items-center border-b-[3px] px-2.5 text-[0.95rem] font-medium transition-colors 2xl:px-3",
                          isActive
                            ? "border-brand text-ink"
                            : "border-transparent text-ink-2 hover:border-line-strong hover:text-ink",
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden h-10 w-56 items-center gap-2 rounded-lg border border-line-strong bg-surface pr-2 pl-3 text-left text-sm text-ink-3 transition-colors hover:border-ink-3 md:flex xl:w-44 2xl:w-56"
            >
              <Search className="size-4 shrink-0" aria-hidden="true" />
              <span className="flex-1">Buscar trámite</span>
              <kbd className="rounded border border-line bg-surface-2 px-1.5 font-sans text-xs text-ink-3">/</kbd>
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex size-10 items-center justify-center rounded-lg text-ink-2 hover:bg-surface-2 md:hidden"
              aria-label="Buscar trámite"
            >
              <Search className="size-5" aria-hidden="true" />
            </button>
            <ThemeToggle />
            <ButtonLink to={PORTAL.clave.href} size="sm" className="max-sm:hidden">
              <LogIn aria-hidden="true" />
              <span className="2xl:hidden">{PORTAL.clave.cta}</span>
              <span className="max-2xl:hidden">{PORTAL.clave.ctaLargo}</span>
            </ButtonLink>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-lg text-ink hover:bg-surface-2 xl:hidden"
              aria-expanded={menuOpen}
              aria-controls="menu-movil"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {menuOpen ? <MobileMenu onSearch={() => setSearchOpen(true)} /> : null}
      </header>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function NavDropdown({ item }: { item: (typeof NAV)[number] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const active = pathname.startsWith(item.to);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative flex"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="menu-impuestos"
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          "flex items-center gap-1 border-b-[3px] px-2.5 text-[0.95rem] font-medium transition-colors 2xl:px-3",
          active || open ? "border-brand text-ink" : "border-transparent text-ink-2 hover:border-line-strong hover:text-ink",
        )}
      >
        {item.label}
        <ChevronDown className={clsx("size-4 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>
      {open ? (
        <div id="menu-impuestos" className="animate-pop absolute top-full left-0 z-50 w-[22rem] pt-px">
          <div className="rounded-b-xl border border-t-0 border-line bg-surface p-2 shadow-pop">
            <ul>
              {item.children?.map((c) => (
                <li key={c.to}>
                  <Link to={c.to} className="group block rounded-lg px-3 py-2.5 hover:bg-surface-2">
                    <span className="block font-semibold text-ink group-hover:text-brand">{c.label}</span>
                    {c.descripcion ? <span className="block text-sm text-ink-3">{c.descripcion}</span> : null}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-1 border-t border-line px-3 pt-2 pb-1">
              <Link to={item.to} className="link text-sm font-semibold">
                Todos los impuestos
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MobileMenu({ onSearch }: { onSearch: () => void }) {
  return (
    <div id="menu-movil" className="border-t border-line bg-bg xl:hidden">
      <nav aria-label="Menú" className="container-page max-h-[calc(100dvh-4rem)] overflow-y-auto pt-4 pb-8">
        <button
          type="button"
          onClick={onSearch}
          className="mb-4 flex h-12 w-full items-center gap-3 rounded-lg border border-line-strong bg-surface px-4 text-left text-ink-3"
        >
          <Search className="size-5" aria-hidden="true" />
          ¿Qué trámite necesitás?
        </button>
        <ul className="divide-y divide-line border-y border-line">
          {NAV.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={!!item.children}
                className={({ isActive }) =>
                  clsx("block py-3.5 text-lg font-semibold", isActive ? "text-brand" : "text-ink")
                }
              >
                {item.label}
              </NavLink>
              {item.children ? (
                <ul className="mb-3 grid grid-cols-2 gap-x-4 gap-y-1">
                  {item.children.map((c) => (
                    <li key={c.to}>
                      <NavLink
                        to={c.to}
                        className={({ isActive }) => clsx("block py-1.5", isActive ? "font-semibold text-brand" : "text-ink-2")}
                      >
                        {c.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
          <li>
            <NavLink to="/ayuda" className="block py-3.5 text-lg font-semibold text-ink">
              Centro de ayuda
            </NavLink>
          </li>
        </ul>
        <div className="mt-6 grid gap-2">
          <ButtonLink to={PORTAL.clave.href} size="lg">
            <LogIn aria-hidden="true" />
            {PORTAL.clave.ctaLargo}
          </ButtonLink>
          <ButtonLink to={CONTACTO.telefono.href} variant="secondary" size="lg">
            Línea gratuita {CONTACTO.telefono.valor}
          </ButtonLink>
        </div>
      </nav>
    </div>
  );
}

function ThemeToggle() {
  const { pref, cycle } = useTheme();
  const label = pref === "system" ? "Tema automático" : pref === "light" ? "Tema claro" : "Tema oscuro";
  const IconC = pref === "system" ? Monitor : pref === "light" ? Sun : Moon;
  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`${label}. Cambiar tema`}
      title={label}
      className="inline-flex size-10 items-center justify-center rounded-lg text-ink-2 transition-colors hover:bg-surface-2"
    >
      <IconC className="size-[1.15rem]" aria-hidden="true" />
    </button>
  );
}
