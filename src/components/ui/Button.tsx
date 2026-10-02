import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "subtle" | "inverse" | "inverse-outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap no-underline transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[1.1em] [&_svg]:shrink-0";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-brand-ink hover:bg-brand-hover",
  secondary: "bg-surface text-ink ring-1 ring-line-strong ring-inset hover:bg-surface-2",
  subtle: "bg-surface-2 text-ink hover:bg-surface-3",
  /** Sobre la banda azul. */
  inverse: "bg-white text-[#0e3a86] hover:bg-[#eaf1fd]",
  "inverse-outline": "text-white ring-1 ring-white/60 ring-inset hover:bg-white/10",
};

const sizes: Record<Size, string> = {
  /** 36px con mouse; 44px en pantallas táctiles. */
  sm: "h-9 px-3.5 text-sm coarse:h-11",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-12 px-6 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function buttonClass({ variant = "primary", size = "md", className }: Omit<CommonProps, "children">) {
  return clsx(base, variants[variant], sizes[size], className);
}

/**
 * Fila de chips de filtro. En pantallas chicas es una sola fila con
 * desplazamiento horizontal que llega a los bordes de la pantalla (así los
 * filtros no empujan los resultados fuera de la vista), con un fundido a la
 * derecha que avisa que hay más. Desde md vuelve a ser una fila que se parte.
 * El py/-my deja lugar al anillo de foco, que el overflow recortaría.
 * `relative`: los textos sr-only (absolutos) de los chips quedan contenidos en
 * la fila; si no, escapan del recorte y ensanchan la página.
 */
export const chipRowClass =
  "relative flex gap-2 md:flex-wrap max-md:-mx-4 max-md:-my-1.5 max-md:flex-nowrap max-md:overflow-x-auto max-md:px-4 max-md:py-1.5 max-md:pr-6 max-md:scroll-px-8 max-md:[scrollbar-width:none] max-md:[mask-image:linear-gradient(to_left,transparent,#000_1.5rem)] max-md:[&::-webkit-scrollbar]:hidden sm:max-md:-mx-6 sm:max-md:px-6 sm:max-md:pr-8";

/** Chip de filtro (botón con aria-pressed): 36px con mouse, 44px táctil. */
export function chipClass(active: boolean, className?: string) {
  return clsx(
    "inline-flex h-9 shrink-0 items-center rounded-full px-3.5 text-sm font-medium whitespace-nowrap transition-colors coarse:h-11",
    active ? "bg-ink text-bg" : "bg-surface text-ink-2 ring-1 ring-line-strong ring-inset hover:bg-surface-2 hover:text-ink",
    className,
  );
}

export function Button({
  variant,
  size,
  className,
  children,
  type = "button",
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={buttonClass({ variant, size, className })} {...rest}>
      {children}
    </button>
  );
}

/**
 * Enlace con aspecto de botón. Rutas internas ("/...") usan el router;
 * URLs absolutas abren en pestaña nueva con rel seguro.
 */
export function ButtonLink({
  to,
  variant,
  size,
  className,
  children,
  ...rest
}: CommonProps & { to: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const cls = buttonClass({ variant, size, className });
  if (/^https?:/.test(to)) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
        {children}
        <span className="sr-only"> (se abre en una pestaña nueva)</span>
      </a>
    );
  }
  if (isExternal(to)) {
    return (
      <a href={to} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={cls} {...rest}>
      {children}
    </Link>
  );
}

export function isExternal(href: string) {
  return /^(https?:|mailto:|tel:)/.test(href);
}
