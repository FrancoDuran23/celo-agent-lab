import { useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import type { ShaderName, ShaderUniforms } from "../shaders";
import { canUseWebGPU, prefersReducedMotion } from "./support";
import type { ShaderHandle } from "./runtime";

interface ShaderCanvasProps {
  shader: ShaderName;
  className?: string;
  /** Fondo CSS/SVG que se ve siempre debajo y queda solo si no hay WebGPU. */
  fallback?: ReactNode;
  uniforms?: ShaderUniforms;
  /** El puntero mueve sutilmente el fondo (parallax). */
  interactive?: boolean;
  fps?: number;
}

/**
 * Fondo decorativo animado con vgpu. Nunca bloquea el contenido:
 * el fallback se pinta primero y el canvas aparece con un fundido
 * cuando el primer cuadro está listo. Se pausa fuera de pantalla,
 * con la pestaña oculta y con prefers-reduced-motion.
 */
export function ShaderCanvas({ shader, className, fallback, uniforms, interactive = false, fps }: ShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<ShaderHandle | null>(null);
  const [ready, setReady] = useState(false);
  const uniformsKey = JSON.stringify(uniforms ?? {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canUseWebGPU()) return;

    let cancelled = false;
    let inView = true;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const cleanups: Array<() => void> = [];

    const sync = () => {
      handleRef.current?.setPlaying(inView && !document.hidden && !reduced.matches);
    };

    import("./runtime")
      .then(({ mountShader }) =>
        mountShader({
          shader,
          canvas,
          uniforms: JSON.parse(uniformsKey) as ShaderUniforms,
          fps,
          onFirstFrame: () => {
            if (!cancelled) setReady(true);
          },
        }),
      )
      .then((handle) => {
        if (cancelled) {
          handle.dispose();
          return;
        }
        handleRef.current = handle;
        document.documentElement.dataset.gpu = "on";

        const io = new IntersectionObserver(
          ([entry]) => {
            inView = entry?.isIntersecting ?? true;
            sync();
          },
          { rootMargin: "64px" },
        );
        io.observe(canvas);
        cleanups.push(() => io.disconnect());

        document.addEventListener("visibilitychange", sync);
        cleanups.push(() => document.removeEventListener("visibilitychange", sync));
        reduced.addEventListener("change", sync);
        cleanups.push(() => reduced.removeEventListener("change", sync));

        if (interactive && !prefersReducedMotion()) {
          const onMove = (e: PointerEvent) => {
            const r = canvas.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) return;
            handle.setPointer((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
          };
          window.addEventListener("pointermove", onMove, { passive: true });
          cleanups.push(() => window.removeEventListener("pointermove", onMove));
        }

        sync();
      })
      .catch((err: unknown) => {
        // Sin adaptador, compilación fallida, etc.: el fallback ya está en pantalla.
        document.documentElement.dataset.gpu = "off";
        console.warn("[ShaderCanvas] WebGPU no disponible, se usa el fondo estático.", err);
      });

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
      handleRef.current?.dispose();
      handleRef.current = null;
      setReady(false);
    };
    // uniformsKey cubre cambios de valor en `uniforms` sin depender de su identidad.
  }, [shader, uniformsKey, interactive, fps]);

  return (
    <div className={clsx("pointer-events-none overflow-hidden", className)} aria-hidden="true">
      {fallback ? <div className="absolute inset-0">{fallback}</div> : null}
      <canvas
        ref={canvasRef}
        className={clsx(
          "absolute inset-0 block h-full w-full transition-opacity duration-1000 ease-out",
          ready ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
