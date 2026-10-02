import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import clsx from "clsx";
import { ChevronDown, LogIn, Menu, Moon, Search, Sun, X } from "lucide-react";
import { Logo } from "./Logo";
import { NAV, SHOW_PROTOTYPE_NOTICE } from "../../data/site";
import { CONTACTO, PORTAL } from "../../data/contacto";
import { useResolvedTheme, useTheme } from "../../lib/theme";
import { ButtonLink } from "../ui/Button";
import { SearchDialog } from "../search/SearchDialog";

/** Enlaces de la barra institucional: siempre subrayados, con un subrayado suave. */
const barLink = "underline decoration-ink-3/50 underline-offset-2 hover:decoration-current";

export function SiteHeader() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Cerrar el menú móvil al navegar.
  useEffect(() => setMenuOpen(false), [pathname]);

  const openSearch = () => {
    setMenuOpen(false);
    setSearchOpen(true);
  };

  // Menú móvil abierto = modal: la página no se desplaza debajo, todo lo que
  // no es el header queda inerte (el foco no sale a contenido tapado), Esc lo
  // cierra devolviendo el foco al botón, y se cierra solo al pasar a escritorio.
  useEffect(() => {
    const header = headerRef.current;
    if (!menuOpen || !header?.parentElement) return;
    const root = document.documentElement;
    // El buscador (<dialog>) queda fuera: se abre desde el menú.
    const fondo = Array.from(header.parentElement.children).filter((el) => el !== header && el.tagName !== "DIALOG");
    fondo.forEach((el) => el.toggleAttribute("inert", true));
    // Con barra de desplazamiento clásica, se reserva su lugar para que nada salte.
    if (window.innerWidth > root.clientWidth) root.style.scrollbarGutter = "stable";
    root.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      toggleRef.current?.focus();
    };
    const escritorio = matchMedia("(min-width: 64rem)");
    const onResize = () => escritorio.matches && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    escritorio.addEventListener("change", onResize);
    return () => {
      fondo.forEach((el) => el.removeAttribute("inert"));
      root.style.overflow = "";
      root.style.scrollbarGutter = "";
      document.removeEventListener("keydown", onKey);
      escritorio.removeEventListener("change", onResize);
    };
  }, [menuOpen]);

  // Atajo global: "/" o Ctrl/⌘+K abre el buscador.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setMenuOpen(false);
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
        <aside aria-label="Aviso de prototipo" className="border-b border-line bg-brand-soft px-4 py-1.5 text-center text-xs text-ink-2">
          Propuesta de rediseño, prototipo no oficial. Los trámites se hacen en el{" "}
          <a href={PORTAL.sitioOficial} className="font-semibold underline underline-offset-2">
            sitio oficial
          </a>
          .
        </aside>
      ) : null}

      {/* Barra institucional (en pantallas bajas, como un celular apaisado, se oculta para ganar alto) */}
      <section
        aria-label="Barra institucional"
        className="border-b border-line bg-surface-2 text-[0.8rem] text-ink-2 [@media(max-height:480px)]:hidden"
      >
        <div className="container-page flex min-h-9 items-center justify-between gap-4 py-1.5">
          <p className="truncate">Gobierno de Jujuy · Ministerio de Hacienda y Finanzas</p>
          {/* Entre md y lg sólo entra el teléfono; la lista completa, desde lg. Nunca en dos líneas. */}
          <ul className="hidden items-center gap-5 whitespace-nowrap md:flex">
            <li>
              <a href={CONTACTO.telefono.href} className={barLink}>
                Línea gratuita <span className="font-semibold tabular">{CONTACTO.telefono.valor}</span>
              </a>
            </li>
            <li className="max-lg:hidden">
              <a href={PORTAL.turnos.href} target="_blank" rel="noopener noreferrer" className={barLink}>
                Turnos web<span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            </li>
            <li className="max-lg:hidden">
              <Link to="/noticias" className={barLink}>
                Noticias
              </Link>
            </li>
            <li className="max-lg:hidden">
              <Link to="/ayuda" className={barLink}>
                Centro de ayuda
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* Opaco en celulares (el desenfoque deja una mancha detrás del logo) y no fijo en pantallas bajas. */}
      <header
        ref={headerRef}
        className="sticky top-0 z-40 border-b border-line bg-bg md:bg-bg/85 md:backdrop-blur-sm [@media(max-height:480px)]:relative"
      >
        <div className="container-page flex h-16 items-center gap-3 sm:gap-6 lg:h-[4.5rem] lg:gap-4 xl:gap-6">
          <Link to="/" className="shrink-0 rounded-md" aria-label="Rentas Jujuy, ir al inicio" onClick={() => setMenuOpen(false)}>
            <Logo />
          </Link>

          {/* Desde lg, en línea; entre lg y xl, con menos aire para que entre a 1024px con barra de scroll. */}
          <nav aria-label="Principal" className="hidden h-full flex-1 items-stretch lg:flex">
            <ul className="flex items-stretch xl:gap-1">
              {NAV.map((item) => (
                <li key={item.to} className="flex">
                  {item.children ? (
                    <NavDropdown item={item} />
                  ) : (
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        clsx(
                          "flex items-center border-b-[3px] px-2 text-[0.95rem] font-medium transition-colors xl:px-2.5 2xl:px-3",
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
              onClick={openSearch}
              className="hidden h-10 w-56 items-center gap-2 rounded-lg border border-line-strong bg-surface pr-2 pl-3 text-left text-sm text-ink-3 transition-colors hover:border-ink-3 md:flex lg:hidden"
            >
              <Search className="size-4 shrink-0" aria-hidden="true" />
              <span className="flex-1">Buscar trámite</span>
              <kbd className="rounded border border-line bg-surface-2 px-1.5 font-sans text-xs text-ink-3">/</kbd>
            </button>
            <button
              type="button"
              onClick={openSearch}
              className="inline-flex size-10 items-center justify-center rounded-lg text-ink-2 hover:bg-surface-2 md:hidden lg:inline-flex coarse:size-11"
              aria-label="Buscar trámite"
            >
              <Search className="size-5" aria-hidden="true" />
            </button>
            <ThemeToggle />
            <ButtonLink to={PORTAL.clave.href} size="sm" className="max-sm:hidden">
              <LogIn aria-hidden="true" />
              <span className="xl:hidden">{PORTAL.clave.cta}</span>
              <span className="max-xl:hidden">{PORTAL.clave.ctaLargo}</span>
            </ButtonLink>
            <button
              ref={toggleRef}
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-lg text-ink hover:bg-surface-2 lg:hidden coarse:size-11"
              aria-expanded={menuOpen}
              aria-controls="menu-movil"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {menuOpen ? <MobileMenu onSearch={openSearch} onClose={() => setMenuOpen(false)} /> : null}
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
    // Esc cierra; si el foco estaba en el panel, vuelve al botón (el panel desaparece).
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      if (ref.current?.contains(document.activeElement)) ref.current.querySelector("button")?.focus();
    };
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
          "flex items-center gap-1 border-b-[3px] px-2 text-[0.95rem] font-medium transition-colors xl:px-2.5 2xl:px-3",
          active || open ? "border-brand text-ink" : "border-transparent text-ink-2 hover:border-line-strong hover:text-ink",
        )}
      >
        {item.label}
        <ChevronDown className={clsx("size-4 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>
      {open ? (
        <div id="menu-impuestos" className="animate-pop absolute top-full left-0 z-50 w-[22rem] pt-px">
          <div className="rounded-b-xl bg-surface p-2 shadow-pop dark:ring-1 dark:ring-line">
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

function MobileMenu({ onSearch, onClose }: { onSearch: () => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  // El panel va desde el borde inferior del header (que baja si se ve la barra
  // institucional) hasta el final de la pantalla, y se desplaza por dentro.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => el.style.setProperty("--menu-top", `${el.getBoundingClientRect().top}px`);
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);

  return (
    <div
      ref={ref}
      id="menu-movil"
      // Cualquier enlace o botón cierra el menú, también el de la página actual.
      onClick={(e) => {
        if ((e.target as Element).closest("a, button")) onClose();
      }}
      className="absolute inset-x-0 top-full max-h-[calc(100dvh-var(--menu-top,4rem))] overflow-y-auto overscroll-contain border-y border-line bg-bg lg:hidden"
    >
      <nav aria-label="Menú" className="container-page pt-4 pb-8">
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
                        className={({ isActive }) =>
                          clsx(
                            "block py-1.5 coarse:flex coarse:min-h-11 coarse:items-center coarse:py-0",
                            isActive ? "font-semibold text-brand" : "text-ink-2",
                          )
                        }
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
            <NavLink to="/noticias" className="block py-3.5 text-lg font-semibold text-ink">
              Noticias
            </NavLink>
          </li>
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
  const { setPref } = useTheme();
  const resolved = useResolvedTheme();
  const next = resolved === "dark" ? "light" : "dark";
  const label = next === "dark" ? "Activar tema oscuro" : "Activar tema claro";
  const IconC = resolved === "dark" ? Moon : Sun;
  const toggle = () => {
    // Si el tema elegido coincide con el del sistema, volvemos a "automático".
    const system = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setPref(next === system ? "system" : next);
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="inline-flex size-10 items-center justify-center rounded-lg text-ink-2 transition-colors hover:bg-surface-2 coarse:size-11"
    >
      <IconC className="size-[1.15rem]" aria-hidden="true" />
    </button>
  );
}
