/**
 * Detección barata de WebGPU, sin importar vgpu. Si devuelve false, los
 * fondos se quedan con su versión CSS/SVG y nunca se descarga la librería.
 */
export function canUseWebGPU(): boolean {
  if (typeof navigator === "undefined" || !("gpu" in navigator)) return false;
  // Respeta "ahorro de datos" en navegadores que lo exponen.
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return false;
  return true;
}

export function prefersReducedMotion(): boolean {
  return typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
