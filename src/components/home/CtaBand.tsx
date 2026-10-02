import type { ReactNode } from "react";
import { ShaderCanvas } from "../../gpu/ShaderCanvas";

/**
 * Franja destacada sobre el shader "aguayo" (motivo textil andino).
 * El contenido va como children; el fondo tiene un fallback CSS.
 */
export function CtaBand({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`relative isolate overflow-hidden rounded-3xl bg-night-900 text-crema-50 ${className}`}>
      <ShaderCanvas shader="aguayo" className="absolute inset-0 -z-10" fallback={<AguayoFallback />} fps={30} />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(7_15_28/0.88)_0%,rgb(7_15_28/0.6)_55%,rgb(7_15_28/0.25)_100%)]"
      />
      {children}
    </section>
  );
}

function AguayoFallback() {
  return (
    <div
      className="h-full w-full"
      style={{
        backgroundColor: "#0b1626",
        backgroundImage: [
          "repeating-linear-gradient(0deg, transparent 0 46px, rgb(196 83 47 / .35) 46px 50px, transparent 50px 58px, rgb(224 166 59 / .3) 58px 60px, transparent 60px 96px)",
          "repeating-linear-gradient(45deg, rgb(106 76 147 / .18) 0 2px, transparent 2px 22px)",
          "repeating-linear-gradient(-45deg, rgb(217 135 127 / .14) 0 2px, transparent 2px 22px)",
        ].join(","),
      }}
    />
  );
}
