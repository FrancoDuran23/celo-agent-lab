import type { AnchorHTMLAttributes, ElementType, HTMLAttributes, ReactNode } from "react";
import { Link } from "react-router";
import { ArrowUpRight, ChevronDown, ChevronRight, CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import clsx from "clsx";
import { isExternal } from "./Button";

/* ------------------------------------------------------------------ */
/* Badge — estados y categorías, nunca decoración                      */
/* ------------------------------------------------------------------ */

type Tone = "neutral" | "info" | "ok" | "warn" | "danger";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-2 text-ink-2",
  info: "bg-brand-soft text-brand",
  ok: "bg-ok-soft text-ok",
  warn: "bg-warn-soft text-warn",
  danger: "bg-danger-soft text-danger",
};

export function Badge({ tone = "neutral", className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold [&_svg]:size-3.5",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Panel — contenedor con borde (sin sombra)                           */
/* ------------------------------------------------------------------ */

export function Panel({
  as: As = "div",
  className,
  children,
  ...rest
}: { as?: ElementType; className?: string; children: ReactNode } & HTMLAttributes<HTMLElement>) {
  return (
    <As className={clsx("rounded-xl border border-line bg-surface", className)} {...rest}>
      {children}
    </As>
  );
}

/** @deprecated Usar Panel. Se mantiene para no romper imports durante la migración. */
export const Card = ({
  interactive: _interactive,
  ...props
}: { as?: ElementType; interactive?: boolean; className?: string; children: ReactNode } & HTMLAttributes<HTMLElement>) => (
  <Panel {...props} />
);

/* ------------------------------------------------------------------ */
/* Encabezado de sección (sin eyebrow: el título habla solo)           */
/* ------------------------------------------------------------------ */

export function SectionHeader({
  title,
  description,
  action,
  as: Heading = "h2",
  id,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
  /** @deprecated Los eyebrows no se usan en este sistema; se ignora. */
  eyebrow?: string;
  /** @deprecated Siempre alineado a la izquierda; se ignora. */
  align?: "left" | "center";
}) {
  return (
    <div className={clsx("flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-2xl">
        <Heading id={id} className="text-2xl font-bold text-ink sm:text-[1.75rem]">
          {title}
        </Heading>
        {description ? <p className="mt-2 text-ink-3">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Enlaces                                                             */
/* ------------------------------------------------------------------ */

/** Link del router para rutas internas, <a> para externas (http abre pestaña nueva). */
export function SmartLink({
  to,
  className,
  children,
  ...rest
}: { to: string; className?: string; children: ReactNode } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  if (isExternal(to)) {
    const newTab = /^https?:/.test(to);
    return (
      <a href={to} className={className} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {children}
        {newTab ? <span className="sr-only"> (se abre en una pestaña nueva)</span> : null}
      </a>
    );
  }
  return (
    <Link to={to} className={className} {...rest}>
      {children}
    </Link>
  );
}

/** Enlace de texto con flecha (acciones secundarias: "Ver todos"). */
export function ArrowLink({ to, children, className }: { to: string; children: ReactNode; className?: string }) {
  const external = /^https?:/.test(to);
  return (
    <SmartLink to={to} className={clsx("link inline-flex items-center gap-1 font-semibold", className)}>
      {children}
      {external ? (
        <ArrowUpRight className="size-4" aria-hidden="true" />
      ) : (
        <ChevronRight className="size-4" aria-hidden="true" />
      )}
    </SmartLink>
  );
}

/**
 * Lista de enlaces con descripción (patrón GOV.UK): el formato base para
 * trámites y servicios. Más limpia y escaneable que una grilla de tarjetas.
 */
export function LinkList({
  items,
  columns = 1,
  className,
}: {
  items: { href: string; title: ReactNode; description?: ReactNode; meta?: ReactNode; key?: string }[];
  columns?: 1 | 2 | 3;
  className?: string;
}) {
  return (
    <ul
      className={clsx(
        "grid gap-x-10",
        columns === 2 && "md:grid-cols-2",
        columns === 3 && "md:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {items.map((it, i) => (
        <li key={it.key ?? i} className="border-t border-line py-4">
          <SmartLink to={it.href} className="link text-[1.05rem] font-semibold">
            {it.title}
            {/^https?:/.test(it.href) ? (
              <ArrowUpRight className="ml-1 inline size-4 align-[-2px]" aria-hidden="true" />
            ) : null}
          </SmartLink>
          {it.description ? <p className="mt-1 text-[0.95rem] text-ink-3">{it.description}</p> : null}
          {it.meta ? <div className="mt-2 flex flex-wrap gap-1.5">{it.meta}</div> : null}
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Aviso (info / ok / warn / danger) — fondo suave, ícono, sin franja  */
/* ------------------------------------------------------------------ */

const noticeTone: Record<Exclude<Tone, "neutral">, { box: string; icon: typeof Info }> = {
  info: { box: "bg-brand-soft text-ink", icon: Info },
  ok: { box: "bg-ok-soft text-ink", icon: CircleCheck },
  warn: { box: "bg-warn-soft text-ink", icon: TriangleAlert },
  danger: { box: "bg-danger-soft text-ink", icon: CircleAlert },
};

export function Notice({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: Exclude<Tone, "neutral">;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const { box, icon: I } = noticeTone[tone];
  const iconColor = { info: "text-brand", ok: "text-ok", warn: "text-warn", danger: "text-danger" }[tone];
  return (
    <div className={clsx("flex gap-3 rounded-xl p-4", box, className)} role={tone === "danger" ? "alert" : undefined}>
      <I className={clsx("mt-0.5 size-5 shrink-0", iconColor)} aria-hidden="true" />
      <div className="min-w-0 text-[0.95rem]">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className={clsx("text-ink-2", title && "mt-1")}>{children}</div> : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Acordeón (details/summary nativo)                                   */
/* ------------------------------------------------------------------ */

export function Disclosure({ summary, children, defaultOpen }: { summary: ReactNode; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="group border-b border-line [&_summary::-webkit-details-marker]:hidden" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold text-ink hover:text-brand">
        {summary}
        <ChevronDown className="size-5 shrink-0 text-ink-3 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="prose-measure pb-5 text-ink-2">{children}</div>
    </details>
  );
}

/* ------------------------------------------------------------------ */
/* Migas de pan + encabezado de página interna                         */
/* ------------------------------------------------------------------ */

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Ruta de navegación" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-ink-3">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 ? <ChevronRight className="size-3.5" aria-hidden="true" /> : null}
            {it.to ? (
              <Link to={it.to} className="link">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink-2">
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageIntro({
  title,
  description,
  breadcrumbs,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: { label: string; to?: string }[];
  children?: ReactNode;
  /** @deprecated Los eyebrows no se usan en este sistema; se ignora. */
  eyebrow?: string;
}) {
  return (
    <div className="border-b border-line bg-surface-2">
      <div className="container-page py-8 sm:py-12">
        <Breadcrumbs items={[{ label: "Inicio", to: "/" }, ...(breadcrumbs ?? [{ label: String(title) }])]} />
        <h1 className="mt-4 max-w-3xl text-3xl font-bold text-ink sm:text-[2.5rem]">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl text-lg text-ink-2">{description}</p> : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </div>
  );
}
