import { useId } from "react";
import clsx from "clsx";

/**
 * Isologo de Rentas Jujuy redibujado en SVG a partir del logo oficial
 * (círculo azul con degradé, arco claro a la izquierda y "R" blanca).
 * Colores tomados del original: #2581C6 → #0068A3 → #00588C.
 */
export function LogoMark({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 40 40" className={clsx("shrink-0", className)} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-c`} x1="0.15" y1="0.1" x2="0.85" y2="0.95">
          <stop offset="0" stopColor="#2581c6" />
          <stop offset="0.55" stopColor="#0068a3" />
          <stop offset="1" stopColor="#00588c" />
        </linearGradient>
        <linearGradient id={`${id}-r`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e3e9ef" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="19" fill={`url(#${id}-c)`} />
      <path d="M9.6 6.2A17 17 0 0 0 9.6 33.8" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.9" />
      <text x="22.4" y="32.6" textAnchor="middle" fontSize="33" fontWeight="800" fill={`url(#${id}-r)`} fontFamily="inherit">
        R
      </text>
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-3", className)}>
      <LogoMark className="size-10" />
      <span className="flex flex-col leading-tight">
        <span className="text-[1.05rem] font-bold whitespace-nowrap text-ink">Rentas Jujuy</span>
        <span className="hidden text-[0.78rem] whitespace-nowrap text-ink-3 min-[420px]:block">
          Dirección Provincial de Rentas
        </span>
      </span>
    </span>
  );
}
