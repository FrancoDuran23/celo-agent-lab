/**
 * Host de fondos WebGPU con vgpu. Se carga con import() dinámico desde
 * <ShaderCanvas>, así vgpu queda fuera del bundle inicial.
 *
 * - Un único `Gpu` (init) y un único `frameLoop` para todos los canvas
 *   (varios loops parten el reloj compartido de vgpu).
 * - Cada canvas tiene su surface y su Effect; los Effects no tienen
 *   dispose(), así que se reciclan en un pool por shader.
 * - Pérdida de dispositivo: se detiene todo, se avisa a cada capa (que
 *   vuelve a su fallback) y el próximo montaje crea un Gpu nuevo.
 */
import { effect, frame, frameLoop, init, surface, type Effect, type FrameLoopHandle, type Gpu, type Surface } from "vgpu";
import { SHADERS, type ShaderName, type ShaderUniforms } from "../shaders";

/**
 * El reloj de cada capa se envuelve en este valor. Los shaders son
 * periódicos en el mismo período (ver luz.wgsl), así el salto no se ve.
 */
const TIME_WRAP = 1200;

/** Pantallas táctiles o angostas: menos cuadros y menos píxeles (batería). */
const compact = () => matchMedia("(pointer: coarse), (max-width: 767px)").matches;

/**
 * Un velo de luz no tiene detalle fino: se dibuja por debajo de la
 * resolución CSS y el navegador lo escala con filtrado bilineal.
 * A la deriva lenta del velo, 30 (24 en móvil) cuadros sobran.
 */
const FPS = () => (compact() ? 24 : 30);
const RENDER_SCALE = () => (compact() ? 0.5 : 0.75);

interface Layer {
  shader: ShaderName;
  target: Surface;
  fx: Effect;
  extra: ShaderUniforms;
  time: number;
  size: [number, number];
  pointer: [number, number];
  pointerGoal: [number, number];
  playing: boolean;
  firstFrameSent: boolean;
  onFirstFrame?: () => void;
  onLost?: () => void;
}

interface Host {
  gpu: Gpu;
  layers: Set<Layer>;
  pool: Map<ShaderName, Effect[]>;
  loop: FrameLoopHandle | null;
  last: number;
  dead: boolean;
}

let hostPromise: Promise<Host> | null = null;

function getHost(): Promise<Host> {
  hostPromise ??= init({ powerPreference: "low-power" })
    .then((gpu) => {
      const host: Host = { gpu, layers: new Set(), pool: new Map(), loop: null, last: 0, dead: false };
      let warned = false;
      gpu.onError((err) => {
        if (!warned) console.warn("[vgpu]", err);
        warned = true;
      });
      void gpu.gpu.lost.then((info) => {
        if (info.reason === "destroyed") return;
        host.dead = true;
        host.loop?.stop();
        host.loop = null;
        hostPromise = null;
        for (const layer of host.layers) layer.onLost?.();
        host.layers.clear();
      });
      return host;
    })
    .catch((err: unknown) => {
      hostPromise = null;
      throw err;
    });
  return hostPromise;
}

function params(layer: Layer) {
  return { ...layer.extra, time: layer.time, resolution: layer.size, pointer: layer.pointer };
}

function markDrawn(layer: Layer) {
  if (layer.firstFrameSent) return;
  layer.firstFrameSent = true;
  layer.onFirstFrame?.();
}

/** Arranca o detiene el loop compartido según haya capas animándose. */
function syncLoop(host: Host) {
  let anyPlaying = false;
  for (const l of host.layers) if (l.playing) anyPlaying = true;

  if (anyPlaying && !host.loop && !host.dead) {
    host.last = performance.now();
    host.loop = frameLoop(
      host.gpu,
      (f) => {
        const now = performance.now();
        // Delta acotado: al volver de una pausa no hay saltos (y el reloj
        // sigue al tiempo real aunque se pierda algún cuadro).
        const dt = Math.min(0.25, (now - host.last) / 1000);
        host.last = now;
        for (const layer of host.layers) {
          if (!layer.playing) continue;
          layer.time = (layer.time + dt) % TIME_WRAP;
          layer.pointer[0] += (layer.pointerGoal[0] - layer.pointer[0]) * 0.06;
          layer.pointer[1] += (layer.pointerGoal[1] - layer.pointer[1]) * 0.06;
          layer.fx.set({ params: params(layer) });
          f.pass(layer.target, layer.fx);
          markDrawn(layer);
        }
      },
      { fps: FPS() },
    );
  } else if (!anyPlaying && host.loop) {
    host.loop.stop();
    host.loop = null;
  }
}

export interface MountOptions {
  shader: ShaderName;
  canvas: HTMLCanvasElement;
  /** Valores extra del struct `params` (además de time/resolution/pointer). */
  uniforms?: ShaderUniforms;
  /** Tiempo inicial en segundos (también es el cuadro estático con reduced-motion). */
  startTime?: number;
  /** Cancela el montaje (StrictMode / desmontaje antes de terminar). */
  signal?: AbortSignal;
  onFirstFrame?: () => void;
  /** El dispositivo se perdió: la capa debe volver a su fallback. */
  onLost?: () => void;
}

export interface ShaderHandle {
  /** Posición del puntero normalizada 0..1 dentro del canvas. */
  setPointer(x: number, y: number): void;
  setUniforms(values: ShaderUniforms): void;
  /** Anima (true) o congela en el cuadro actual (false). */
  setPlaying(playing: boolean): void;
  dispose(): void;
}

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) throw new DOMException("Montaje cancelado", "AbortError");
}

export async function mountShader(opts: MountOptions): Promise<ShaderHandle> {
  const def = SHADERS[opts.shader];
  const host = await getHost();
  // Chequeo después de cada await: sólo el montaje vigente toca el canvas.
  throwIfAborted(opts.signal);

  const target = surface(host.gpu, opts.canvas, { dpr: RENDER_SCALE(), alphaMode: "opaque" });
  const pooled = host.pool.get(opts.shader)?.pop();
  const layer: Layer = {
    shader: opts.shader,
    target,
    fx: pooled ?? effect(host.gpu, def.source, { label: `fondo:${opts.shader}` }),
    extra: { ...def.defaults, ...opts.uniforms },
    time: opts.startTime ?? def.startTime ?? 0,
    size: [Math.max(1, target.size[0]), Math.max(1, target.size[1])],
    pointer: [0.5, 0.5],
    pointerGoal: [0.5, 0.5],
    playing: false,
    firstFrameSent: false,
    onFirstFrame: opts.onFirstFrame,
    onLost: opts.onLost,
  };

  try {
    layer.fx.set({ params: params(layer) });
    // Precompila fuera del frame (con la firma del target) para que el primer cuadro no tironee.
    if (!pooled) await layer.fx.compile({ colors: [target.format] });
    throwIfAborted(opts.signal);
  } catch (err) {
    target.dispose();
    host.pool.set(opts.shader, [...(host.pool.get(opts.shader) ?? []), layer.fx]);
    throw err;
  }

  let disposed = false;
  let pending = 0;

  // Un cuadro suelto (pausado o con reduced-motion). Diferido a rAF porque
  // onResize puede dispararse dentro de un frame y frame() anidado es inválido.
  const requestDraw = () => {
    if (pending || layer.playing || disposed || host.dead) return;
    pending = requestAnimationFrame(() => {
      pending = 0;
      if (layer.playing || disposed || host.dead) return;
      layer.fx.set({ params: params(layer) });
      frame(host.gpu, (f) => f.pass(target, layer.fx));
      markDrawn(layer);
    });
  };

  const offResize = target.onResize((e) => {
    layer.size = [Math.max(1, e.width), Math.max(1, e.height)];
    requestDraw();
  });
  // Sin loop nadie corre el auto-resize del surface; frame() lo hace.
  const resizeObserver = new ResizeObserver(() => requestDraw());
  resizeObserver.observe(opts.canvas);

  host.layers.add(layer);
  requestDraw();

  return {
    setPointer(x, y) {
      layer.pointerGoal[0] = Math.min(1, Math.max(0, x));
      layer.pointerGoal[1] = Math.min(1, Math.max(0, y));
    },
    setUniforms(values) {
      layer.extra = { ...layer.extra, ...values };
      requestDraw();
    },
    setPlaying(playing) {
      if (disposed || layer.playing === playing) return;
      layer.playing = playing;
      syncLoop(host);
      if (!playing) requestDraw();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(pending);
      resizeObserver.disconnect();
      offResize();
      host.layers.delete(layer);
      syncLoop(host);
      if (!host.dead) {
        target.dispose();
        host.pool.set(layer.shader, [...(host.pool.get(layer.shader) ?? []), layer.fx]);
      }
    },
  };
}
