import clsx from "clsx";

/**
 * Marca neutra del prototipo: monograma + nombre. No reproduce el logo
 * oficial del organismo (no disponible); se reemplaza cuando la DPR
 * provea el suyo.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={clsx("shrink-0", className)} aria-hidden="true">
      <rect width="32" height="32" rx="7" className="fill-celeste" />
      <text x="16" y="22.5" textAnchor="middle" fontSize="18" fontWeight="800" className="fill-white" fontFamily="inherit">
        R
      </text>
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-3", className)}>
      <LogoMark className="size-9" />
      <span className="flex flex-col leading-tight">
        <span className="text-[1.05rem] font-bold whitespace-nowrap text-ink">Rentas Jujuy</span>
        <span className="hidden text-[0.78rem] whitespace-nowrap text-ink-3 min-[420px]:block">Dirección Provincial de Rentas</span>
      </span>
    </span>
  );
}
