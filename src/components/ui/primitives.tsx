import type { AnchorHTMLAttributes, ElementType, HTMLAttributes, ReactNode } from "react";
import { Link } from "react-router";
import clsx from "clsx";
import { isExternal } from "./Button";

/* ------------------------------------------------------------------ */
/* Badge                                                               */
/* ------------------------------------------------------------------ */

type Tone = "neutral" | "brand" | "accent" | "ok" | "warn" | "info" | "danger";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-2 text-ink-2 ring-line",
  brand: "bg-brand-soft text-brand ring-brand/20",
  accent: "bg-accent-soft text-warn ring-accent/30",
  ok: "bg-ok-soft text-ok ring-ok/25",
  warn: "bg-warn-soft text-warn ring-warn/25",
  info: "bg-info-soft text-info ring-info/25",
  danger: "bg-danger/10 text-danger ring-danger/25",
};

export function Badge({ tone = "neutral", className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset [&_svg]:size-3.5",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

export function Card({
  as: As = "div",
  interactive = false,
  className,
  children,
  ...rest
}: { as?: ElementType; interactive?: boolean; className?: string; children: ReactNode } & HTMLAttributes<HTMLElement>) {
  return (
    <As
      className={clsx(
        "rounded-2xl bg-surface ring-1 ring-line",
        interactive &&
          "transition-[box-shadow,transform,background-color] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:shadow-lift hover:ring-line-strong",
        className,
      )}
      {...rest}
    >
      {children}
    </As>
  );
}

/* ------------------------------------------------------------------ */
/* Section header                                                      */
/* ------------------------------------------------------------------ */

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  as: Heading = "h2",
  id,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={clsx("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
        <Heading id={id} className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {title}
        </Heading>
        {description ? <p className="mt-3 text-base leading-relaxed text-ink-3 sm:text-lg">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Smart link                                                          */
/* ------------------------------------------------------------------ */

/** Link del router para rutas internas, <a target=_blank> para externas. */
export function SmartLink({
  to,
  className,
  children,
  ...rest
}: { to: string; className?: string; children: ReactNode } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  if (isExternal(to)) {
    const newTab = /^https?:/.test(to);
    return (
      <a
        href={to}
        className={className}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className} {...rest}>
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Page hero (páginas internas)                                        */
/* ------------------------------------------------------------------ */

export function PageIntro({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-line bg-surface-2/60">
      <div className="container-page py-12 sm:py-16">
        {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{title}</h1>
        {description ? <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-3">{description}</p> : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </div>
  );
}
