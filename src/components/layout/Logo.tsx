import clsx from "clsx";

/**
 * Isotipo: estratos del Cerro de los Siete Colores dentro de un
 * cuadrado redondeado. Marca propia del prototipo (no es el logo oficial).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={clsx("shrink-0", className)} aria-hidden="true">
      <defs>
        <clipPath id="logo-clip">
          <rect width="40" height="40" rx="11" />
        </clipPath>
      </defs>
      <g clipPath="url(#logo-clip)">
        <rect width="40" height="40" fill="#13233d" />
        <path d="M0 22 C8 15 14 13 20 16 S32 12 40 9 V40 H0Z" fill="#6a4c93" />
        <path d="M0 26 C9 20 15 19 21 22 S33 18 40 15 V40 H0Z" fill="#7f9a62" />
        <path d="M0 30 C8 25 15 24 22 27 S33 23 40 21 V40 H0Z" fill="#d9877f" />
        <path d="M0 33.5 C9 29.5 16 29 23 31 S34 28 40 26.5 V40 H0Z" fill="#e0a63b" />
        <path d="M0 37 C10 33.5 17 33.5 24 35 S35 32.5 40 31.5 V40 H0Z" fill="#c4532f" />
        <circle cx="29" cy="10" r="3.2" fill="#f5ecdd" opacity="0.92" />
      </g>
    </svg>
  );
}

export function Logo({ tone = "default", className }: { tone?: "default" | "light"; className?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="size-9" />
      <span className="flex flex-col leading-none">
        <span
          className={clsx(
            "text-[1.15rem] font-semibold tracking-tight",
            tone === "light" ? "text-crema-50" : "text-ink",
          )}
        >
          Rentas <span className="font-serif text-[1.3rem] font-normal italic tracking-normal">Jujuy</span>
        </span>
        <span
          className={clsx(
            "mt-1 text-[0.62rem] font-medium tracking-[0.12em] uppercase",
            tone === "light" ? "text-crema-200/75" : "text-ink-3",
          )}
        >
          Dirección Provincial de Rentas
        </span>
      </span>
    </span>
  );
}
