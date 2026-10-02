import clsx from "clsx";

const BASE = import.meta.env.BASE_URL;

/** Isologo oficial de Rentas Jujuy (imagen aportada, fondo transparente). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={`${BASE}brand/logo-rentas-96.png`}
      srcSet={`${BASE}brand/logo-rentas-96.png 1x, ${BASE}brand/logo-rentas-180.png 2x`}
      width={40}
      height={40}
      alt=""
      decoding="async"
      className={clsx("shrink-0 select-none", className)}
    />
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
