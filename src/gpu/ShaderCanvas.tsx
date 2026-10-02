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
}

/**
 * Fondo decorativo animado con vgpu. Nunca bloquea el contenido:
 * el fallback se pinta primero y el canvas aparece con un fundido
 * cuando el primer cuadro está listo. Se pausa fuera de pantalla,
 * con la pestaña oculta y con prefers-reduced-motion (cuadro fijo).
 */
export function ShaderCanvas({ shader, className, fallback, uniforms, interactive = false }: ShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const uniformsKey = JSON.stringify(uniforms ?? {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canUseWebGPU()) return;

    const controller = new AbortController();
    const { signal } = controller;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const cleanups: Array<() => void> = [];
    let handle: ShaderHandle | null = null;
    let inView = true;

    const sync = () => handle?.setPlaying(inView && !document.hidden && !reduced.matches);

    import("./runtime")
      .then(({ mountShader }) =>
        mountShader({
          shader,
          canvas,
          signal,
          uniforms: JSON.parse(uniformsKey) as ShaderUniforms,
          onFirstFrame: () => {
            if (!signal.aborted) setReady(true);
          },
          onLost: () => {
            // El dispositivo se perdió: volvemos al fallback.
            handle = null;
            if (!signal.aborted) setReady(false);
            document.documentElement.dataset.gpu = "off";
          },
        }),
      )
      .then((h) => {
        if (signal.aborted) {
          h.dispose();
          return;
        }
        handle = h;
        document.documentElement.dataset.gpu = "on";

        const io = new IntersectionObserver(
          ([entry]) => {
            inView = entry?.isIntersecting ?? true;
            sync();
          },
          { rootMargin: "256px" },
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
            handle?.setPointer((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
          };
          window.addEventListener("pointermove", onMove, { passive: true });
          cleanups.push(() => window.removeEventListener("pointermove", onMove));
        }

        sync();
      })
      .catch((err: unknown) => {
        if (signal.aborted) return; // desmontado antes de terminar: nada que reportar
        // Sin adaptador, compilación fallida, etc.: el fallback ya está en pantalla.
        document.documentElement.dataset.gpu = "off";
        console.warn("[ShaderCanvas] WebGPU no disponible, se usa el fondo estático.", err);
      });

    return () => {
      controller.abort();
      cleanups.forEach((fn) => fn());
      handle?.dispose();
      handle = null;
      setReady(false);
    };
    // uniformsKey cubre cambios de valor en `uniforms` sin depender de su identidad.
  }, [shader, uniformsKey, interactive]);

  return (
    <div className={clsx("pointer-events-none overflow-hidden", className)} aria-hidden="true">
      {fallback ? <div className="absolute inset-0">{fallback}</div> : null}
      <canvas
        ref={canvasRef}
        className={clsx(
          "absolute inset-0 block h-full w-full transition-opacity duration-1000 ease-out motion-reduce:transition-none",
          ready ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
