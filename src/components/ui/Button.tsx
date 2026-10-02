import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "light" | "outline-light";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-200 ease-[var(--ease-out-soft)] active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[1.1em] [&_svg]:shrink-0";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-brand-ink shadow-soft hover:bg-brand-hover",
  secondary: "bg-surface text-ink ring-1 ring-line-strong hover:bg-surface-2",
  ghost: "text-ink-2 hover:bg-surface-2 hover:text-ink",
  /** Sobre fondos oscuros / shader. */
  light: "bg-crema-50 text-night-900 shadow-soft hover:bg-white",
  "outline-light": "text-crema-50 ring-1 ring-white/30 backdrop-blur-sm hover:bg-white/10 hover:ring-white/50",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-13 px-7 text-base",
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

export function Button({
  variant,
  size,
  className,
  children,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={buttonClass({ variant, size, className })} {...rest}>
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
  if (isExternal(to)) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
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
