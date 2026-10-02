/**
 * Runtime de fondos WebGPU con vgpu. Este módulo se carga con import()
 * dinámico desde <ShaderCanvas>, así vgpu queda fuera del bundle inicial.
 *
 * Un único `Gpu` (init()) se comparte entre todos los canvas de la página;
 * cada canvas tiene su propio surface, effect y frameLoop.
 */
import { effect, frame, frameLoop, init, surface, type FrameLoopHandle, type Gpu } from "vgpu";
import { SHADERS, type ShaderName, type ShaderUniforms } from "../shaders";

let gpuPromise: Promise<Gpu> | null = null;

function getGpu(): Promise<Gpu> {
  gpuPromise ??= init().catch((err) => {
    gpuPromise = null;
    throw err;
  });
  return gpuPromise;
}

export interface MountOptions {
  shader: ShaderName;
  canvas: HTMLCanvasElement;
  /** Valores extra del struct `params` (además de time/resolution/pointer). */
  uniforms?: ShaderUniforms;
  /** Tope de cuadros por segundo; los fondos decorativos no necesitan 120 fps. */
  fps?: number;
  /** Tiempo inicial en segundos (elige un cuadro lindo para el estado estático). */
  startTime?: number;
  onFirstFrame?: () => void;
}

export interface ShaderHandle {
  /** Posición del puntero normalizada 0..1 dentro del canvas. */
  setPointer(x: number, y: number): void;
  setUniforms(values: ShaderUniforms): void;
  /** Anima (true) o congela en el cuadro actual (false). */
  setPlaying(playing: boolean): void;
  dispose(): void;
}

export async function mountShader(opts: MountOptions): Promise<ShaderHandle> {
  const def = SHADERS[opts.shader];
  const gpu = await getGpu();
  const target = surface(gpu, opts.canvas, { dpr: [1, 1.5], alphaMode: "premultiplied" });

  let extra: ShaderUniforms = { ...def.defaults, ...opts.uniforms };
  let time = opts.startTime ?? def.startTime ?? 0;
  let size: [number, number] = [Math.max(1, target.size[0]), Math.max(1, target.size[1])];
  const pointer: [number, number] = [0.5, 0.5];
  const pointerGoal: [number, number] = [0.5, 0.5];

  const params = () => ({ ...extra, time, resolution: size, pointer });
  const fx = effect(gpu, def.source, { set: { params: params() }, label: `fondo:${opts.shader}` });
  // Precompila el pipeline fuera del frame para que el primer cuadro no tironee.
  await fx.compile({ colors: [target.format] });

  let disposed = false;
  let firstFrameSent = false;
  let loop: FrameLoopHandle | null = null;
  let last = 0;

  const drawOnce = () => {
    if (disposed) return;
    fx.set({ params: params() });
    frame(gpu, (f) => f.pass(target, fx));
    if (!firstFrameSent) {
      firstFrameSent = true;
      opts.onFirstFrame?.();
    }
  };

  // Redibujo diferido: onResize puede dispararse dentro de un frame y
  // frame() anidado es inválido, así que se agenda para el próximo rAF.
  let pending = 0;
  const requestDraw = () => {
    if (pending || loop || disposed) return;
    pending = requestAnimationFrame(() => {
      pending = 0;
      if (!loop) drawOnce();
    });
  };

  const offResize = target.onResize((e) => {
    size = [Math.max(1, e.width), Math.max(1, e.height)];
    // Redibuja aunque esté pausado, para que el cuadro estático no quede estirado.
    requestDraw();
  });

  const start = () => {
    if (loop || disposed) return;
    last = performance.now();
    loop = frameLoop(
      gpu,
      (f) => {
        const now = performance.now();
        // Clamp: al volver de una pestaña oculta no saltamos de golpe.
        time += Math.min(0.1, (now - last) / 1000);
        last = now;
        pointer[0] += (pointerGoal[0] - pointer[0]) * 0.06;
        pointer[1] += (pointerGoal[1] - pointer[1]) * 0.06;
        fx.set({ params: params() });
        f.pass(target, fx);
        if (!firstFrameSent) {
          firstFrameSent = true;
          opts.onFirstFrame?.();
        }
      },
      { fps: opts.fps ?? 45 },
    );
  };

  const stop = () => {
    loop?.stop();
    loop = null;
  };

  requestDraw();

  return {
    setPointer(x, y) {
      pointerGoal[0] = Math.min(1, Math.max(0, x));
      pointerGoal[1] = Math.min(1, Math.max(0, y));
    },
    setUniforms(values) {
      extra = { ...extra, ...values };
      requestDraw();
    },
    setPlaying(playing) {
      if (playing) start();
      else stop();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(pending);
      stop();
      offResize();
      target.dispose();
    },
  };
}
