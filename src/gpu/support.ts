/**
 * Detección barata de WebGPU, sin importar vgpu. Si devuelve false, los
 * fondos se quedan con su versión CSS y nunca se descarga la librería.
 */
export function canUseWebGPU(): boolean {
  if (typeof navigator === "undefined" || !("gpu" in navigator)) return false;
  // Respeta "ahorro de datos" en navegadores que lo exponen.
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return false;
  return true;
}

let adapterCheck: Promise<boolean> | null = null;

/**
 * ¿Hay una GPU de verdad? Un adaptador de software (p. ej. SwiftShader)
 * dibuja el velo con varios núcleos de CPU y frena toda la página: en ese
 * caso conviene el velo CSS. `?gpu=forzar` lo saltea para pruebas.
 */
export function hasHardwareGPU(): Promise<boolean> {
  adapterCheck ??= (async () => {
    if (!canUseWebGPU()) return false;
    if (new URLSearchParams(location.search).get("gpu") === "forzar") return true;
    try {
      const adapter = await navigator.gpu.requestAdapter({ powerPreference: "low-power" });
      if (!adapter) return false;
      const info = (adapter as GPUAdapter & { info?: { isFallbackAdapter?: boolean } }).info;
      return !info?.isFallbackAdapter;
    } catch {
      return false;
    }
  })();
  return adapterCheck;
}

export function prefersReducedMotion(): boolean {
  return typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Mouse o trackpad: el único caso en que el puntero mueve la luz. */
export function hasFinePointer(): boolean {
  return typeof matchMedia !== "undefined" && matchMedia("(hover: hover) and (pointer: fine)").matches;
}
