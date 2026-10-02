import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import clsx from "clsx";
import { ChevronDown, LogIn, Menu, Monitor, Moon, Phone, Search, Sun, X } from "lucide-react";
import { Logo } from "./Logo";
import { NAV, SHOW_PROTOTYPE_NOTICE } from "../../data/site";
import { CONTACTO, PORTAL } from "../../data/contacto";
import { Icon } from "../../lib/icons";
import { useTheme } from "../../lib/theme";
import { ButtonLink } from "../ui/Button";
import { SearchDialog } from "../search/SearchDialog";

export function SiteHeader() {
  const { pathname } = useLocation();
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const transparent = overHero && !scrolled && !menuOpen;

  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>

      {SHOW_PROTOTYPE_NOTICE ? (
        <div className="bg-night-950 px-4 py-1.5 text-center text-[0.72rem] text-crema-200/80">
          Propuesta de rediseño · prototipo no oficial. Los trámites se realizan en el{" "}
          <a href={PORTAL.sitioOficial} className="underline underline-offset-2 hover:text-crema-50">
            sitio oficial
          </a>
          .
        </div>
      ) : null}

      {/* Barra institucional */}
      <div
        className={clsx(
          "relative z-40 hidden text-[0.8rem] lg:block",
          overHero ? "bg-night-900 text-crema-200/80" : "border-b border-line bg-surface-2 text-ink-3",
        )}
      >
        <div className="container-page flex h-9 items-center justify-between">
          <p>Gobierno de Jujuy · Ministerio de Hacienda y Finanzas</p>
          <div className="flex items-center gap-5">
            <a href={CONTACTO.telefono.href} className="inline-flex items-center gap-1.5 hover:underline">
              <Phone className="size-3.5" aria-hidden="true" />
              {CONTACTO.telefono.valor}
            </a>
            <Link to="/atencion#turnos" className="hover:underline">
              Turnos web
            </Link>
            <Link to="/atencion" className="hover:underline">
              Canales de atención
            </Link>
          </div>
        </div>
      </div>

      <header
        className={clsx(
          "sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300",
          transparent
            ? "border-b border-transparent bg-night-900/0"
            : "border-b border-line bg-bg/85 shadow-[0_1px_0_rgb(0_0_0/0.02)] backdrop-blur-xl backdrop-saturate-150",
          overHero && !transparent && "bg-bg/90",
        )}
      >
        <div className="container-page flex h-16 items-center gap-4 lg:h-[4.5rem]">
          <Link to="/" className="rounded-lg" aria-label="Rentas Jujuy — inicio">
            <Logo tone={transparent ? "light" : "default"} />
          </Link>

          <nav aria-label="Principal" className="ml-6 hidden flex-1 items-center gap-1 xl:flex">
            {NAV.map((item) =>
              item.children ? (
                <NavDropdown key={item.to} item={item} light={transparent} />
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      "rounded-full px-3.5 py-2 text-[0.92rem] font-medium transition-colors",
                      transparent
                        ? "text-crema-100/85 hover:bg-white/10 hover:text-white"
                        : isActive
                          ? "bg-surface-2 text-ink"
                          : "text-ink-2 hover:bg-surface-2 hover:text-ink",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={clsx(
                "hidden h-10 items-center gap-2 rounded-full pr-2 pl-3.5 text-sm ring-1 transition-colors md:inline-flex",
                transparent
                  ? "text-crema-100/80 ring-white/20 hover:bg-white/10"
                  : "bg-surface text-ink-3 ring-line hover:ring-line-strong",
              )}
            >
              <Search className="size-4" aria-hidden="true" />
              <span className="pr-1 whitespace-nowrap xl:hidden 2xl:inline 2xl:pr-6">Buscar trámite</span>
              <kbd
                className={clsx(
                  "rounded-md px-1.5 py-0.5 font-mono text-[0.68rem]",
                  transparent ? "bg-white/10" : "bg-surface-2 text-ink-3",
                )}
              >
                /
              </kbd>
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={clsx(
                "inline-flex size-10 items-center justify-center rounded-full md:hidden",
                transparent ? "text-crema-50 hover:bg-white/10" : "text-ink-2 hover:bg-surface-2",
              )}
              aria-label="Buscar trámite"
            >
              <Search className="size-5" aria-hidden="true" />
            </button>
            <ThemeToggle light={transparent} />
            <ButtonLink
              to={PORTAL.clave.href}
              variant={transparent ? "light" : "primary"}
              size="sm"
              className="ml-1 hidden sm:inline-flex"
            >
              <LogIn aria-hidden="true" />
              {PORTAL.clave.cta}
            </ButtonLink>
            <button
              type="button"
              className={clsx(
                "inline-flex size-10 items-center justify-center rounded-full xl:hidden",
                transparent ? "text-crema-50 hover:bg-white/10" : "text-ink hover:bg-surface-2",
              )}
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

function NavDropdown({ item, light }: { item: (typeof NAV)[number]; light: boolean }) {
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
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          "inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.92rem] font-medium transition-colors",
          light
            ? "text-crema-100/85 hover:bg-white/10 hover:text-white"
            : active
              ? "bg-surface-2 text-ink"
              : "text-ink-2 hover:bg-surface-2 hover:text-ink",
        )}
      >
        {item.label}
        <ChevronDown className={clsx("size-4 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>
      {open ? (
        <div className="absolute top-full left-1/2 z-50 w-[26rem] -translate-x-1/2 pt-2">
          <div className="animate-rise rounded-2xl bg-surface p-2 shadow-lift ring-1 ring-line [animation-duration:250ms]">
            <ul className="grid gap-0.5">
              {item.children?.map((c) => (
                <li key={c.to}>
                  <Link
                    to={c.to}
                    className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-surface-2"
                  >
                    {c.icon ? (
                      <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                        <Icon name={c.icon} className="size-[1.1rem]" />
                      </span>
                    ) : null}
                    <span>
                      <span className="block text-sm font-semibold text-ink">{c.label}</span>
                      {c.descripcion ? <span className="block text-sm text-ink-3">{c.descripcion}</span> : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to={item.to}
              className="mt-1 flex items-center justify-between rounded-xl bg-surface-2 px-3 py-2.5 text-sm font-medium text-ink-2 hover:text-ink"
            >
              Ver todos los impuestos <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MobileMenu({ onSearch }: { onSearch: () => void }) {
  return (
    <div id="menu-movil" className="border-t border-line bg-bg xl:hidden">
      <nav aria-label="Menú móvil" className="container-page max-h-[calc(100dvh-4rem)] overflow-y-auto py-4">
        <button
          type="button"
          onClick={onSearch}
          className="mb-3 flex h-12 w-full items-center gap-3 rounded-xl bg-surface px-4 text-left text-ink-3 ring-1 ring-line"
        >
          <Search className="size-5" aria-hidden="true" />
          ¿Qué trámite necesitás?
        </button>
        <ul className="divide-y divide-line">
          {NAV.map((item) => (
            <li key={item.to} className="py-1">
              <NavLink
                to={item.to}
                end={!!item.children}
                className={({ isActive }) =>
                  clsx("block rounded-lg px-2 py-3 text-lg font-medium", isActive ? "text-brand" : "text-ink")
                }
              >
                {item.label}
              </NavLink>
              {item.children ? (
                <ul className="mb-2 grid grid-cols-2 gap-1 pl-2">
                  {item.children.map((c) => (
                    <li key={c.to}>
                      <NavLink
                        to={c.to}
                        className={({ isActive }) =>
                          clsx(
                            "flex items-center gap-2 rounded-lg px-2 py-2 text-[0.95rem]",
                            isActive ? "bg-brand-soft text-brand" : "text-ink-2",
                          )
                        }
                      >
                        {c.icon ? <Icon name={c.icon} className="size-4" /> : null}
                        {c.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
        <div className="mt-4 grid gap-2 pb-4 sm:hidden">
          <ButtonLink to={PORTAL.clave.href} size="lg">
            <LogIn aria-hidden="true" />
            {PORTAL.clave.cta}
          </ButtonLink>
          <ButtonLink to={CONTACTO.telefono.href} variant="secondary" size="lg">
            <Phone aria-hidden="true" />
            {CONTACTO.telefono.valor}
          </ButtonLink>
        </div>
      </nav>
    </div>
  );
}

function ThemeToggle({ light }: { light: boolean }) {
  const { pref, cycle } = useTheme();
  const label = pref === "system" ? "Tema: automático" : pref === "light" ? "Tema: claro" : "Tema: oscuro";
  const IconC = pref === "system" ? Monitor : pref === "light" ? Sun : Moon;
  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`${label}. Cambiar tema`}
      title={label}
      className={clsx(
        "inline-flex size-10 items-center justify-center rounded-full transition-colors",
        light ? "text-crema-50 hover:bg-white/10" : "text-ink-2 hover:bg-surface-2",
      )}
    >
      <IconC className="size-[1.15rem]" aria-hidden="true" />
    </button>
  );
}
