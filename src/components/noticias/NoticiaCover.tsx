import { useId, useMemo, type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";
import type { PaletteColor } from "../../data/types";
import { PALETTE_HEX, hashString } from "./categorias";

/*
 * Portada generativa para noticias (no hay imágenes): cielo con un degradé
 * de la paleta, sol, un cordón de cerros al fondo, un cerro con estratos de
 * colores (guiño al Cerro de los Siete Colores) y una loma oscura al frente.
 * Todo se deriva del slug, así que cada noticia tiene siempre la misma.
 */

const NIGHT = "#0b1626";
const CREMA = "#fdfaf5";
const STRATA_EXTRA = ["#f0cc85", "#d9714e", "#f5ecdd", "#a8bb8a"];

type Pt = [number, number];

/** PRNG determinístico (mulberry32). */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

function ridge(rng: () => number, base: number, amp: number, n: number, peaky: boolean): Pt[] {
  const step = 440 / n;
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const jitter = i > 0 && i < n ? (rng() - 0.5) * step * 0.5 : 0;
    const lift = peaky ? (i % 2 ? 0.55 + 0.45 * rng() : 0.1 + 0.3 * rng()) : 0.2 + 0.8 * rng();
    pts.push([-20 + i * step + jitter, base - amp * lift]);
  }
  return pts;
}

/** Línea quebrada (cerros) o curva suave Catmull-Rom → Bézier (lomas), cerrada abajo. */
function toPath(pts: Pt[], smooth: boolean): string {
  const [first] = pts;
  if (!first) return "";
  let d = `M${r1(first[0])} ${r1(first[1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    if (!smooth) {
      d += `L${r1(p2[0])} ${r1(p2[1])}`;
      continue;
    }
    const p0 = pts[i - 1] ?? p1;
    const p3 = pts[i + 2] ?? p2;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return `${d}L420 ${H + 20}L-20 ${H + 20}Z`;
}

/** Alto del paisaje en unidades del viewBox (400 × H), estirado al ancho de la tarjeta. */
const H = 160;

function buildCover(slug: string, color: PaletteColor) {
  const rng = mulberry32(hashString(slug));
  const pick = <T,>(list: T[]) => list[Math.floor(rng() * list.length)]!;

  const a = PALETTE_HEX[color];
  const others = (Object.keys(PALETTE_HEX) as PaletteColor[]).filter((c) => c !== color).map((c) => PALETTE_HEX[c]);
  const b = pick(others);
  const angle = Math.round(150 + rng() * 50);

  // Sol: posición en % del contenedor y tamaño en % del ancho (cqw), para que sea redondo a cualquier proporción.
  // Siempre a la derecha: arriba a la izquierda va la categoría.
  const sun = { x: r1(50 + rng() * 36), y: r1(18 + rng() * 20), size: r1(7 + rng() * 4) };

  const far = toPath(ridge(rng, 74 + rng() * 8, 34 + rng() * 14, 7 + Math.floor(rng() * 4), true), false);

  // Cerro de estratos: una loma con forma de campana centrada en algún punto del ancho.
  const cx = 110 + rng() * 180;
  const hw = 150 + rng() * 60;
  const top = 40 + rng() * 16;
  const foot = H + 12; // el pie queda fuera de cuadro: el cerro nace desde abajo
  const mound: Pt[] = [];
  for (let i = 0; i <= 8; i++) {
    const x = -20 + i * 55 + (i > 0 && i < 8 ? (rng() - 0.5) * 18 : 0);
    const k = Math.max(0, Math.cos((Math.min(Math.abs(x - cx) / hw, 1) * Math.PI) / 2)) ** 1.2;
    mound.push([x, foot - (foot - top) * k * (0.86 + rng() * 0.14)]);
  }
  const mid = toPath(mound, true);
  const front = toPath(ridge(rng, 152 + rng() * 4, 26 + rng() * 12, 3 + Math.floor(rng() * 2), false), true);

  // Estratos: bandas inclinadas (como en el Cerro de los Siete Colores) recortadas
  // por la silueta del cerro. Se superponen 1 unidad para evitar filetes claros.
  const pool = [...others, a, ...STRATA_EXTRA];
  const tilt = (rng() < 0.5 ? -1 : 1) * (24 + rng() * 40);
  const wave = (rng() - 0.5) * 16;
  const bands: { d: string; fill: string }[] = [];
  let y = top - Math.abs(tilt) / 2 - 10;
  while (y < H + Math.abs(tilt) / 2 + 10) {
    const y1 = y + 4.5 + rng() * 5;
    const yb = y1 + 1;
    bands.push({
      d: `M-20 ${r1(y - tilt / 2)}Q200 ${r1(y + wave)} 420 ${r1(y + tilt / 2)}L420 ${r1(yb + tilt / 2)}Q200 ${r1(yb + wave)} -20 ${r1(yb - tilt / 2)}Z`,
      fill: pick(pool),
    });
    y = y1;
  }

  // Sombra del cerro del lado opuesto al sol.
  const shadeFromLeft = sun.x > 50;

  return { a, b, angle, sun, far, mid, front, bands, shadeFromLeft };
}

/**
 * El contenedor es `relative` (por la textura `.grain`); el tamaño lo da
 * `className`. Los `children` se apilan sobre la ilustración (p. ej. la
 * categoría); el dibujo en sí es decorativo y queda oculto a lectores.
 */
export function NoticiaCover({
  slug,
  color,
  className,
  landscapeClassName = "h-[72%]",
  children,
}: {
  slug: string;
  color: PaletteColor;
  className?: string;
  /**
   * Alto del paisaje (se estira al ancho). Con una relación fija (p. ej.
   * `aspect-[2/1]`) el cerro no se deforma aunque la portada crezca en alto.
   */
  landscapeClassName?: string;
  children?: ReactNode;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const clipId = `nc-clip-${uid}`;
  const shadeId = `nc-shade-${uid}`;
  const c = useMemo(() => buildCover(slug, color), [slug, color]);
  const sunStyle = (k: number, opacity: number): CSSProperties => ({
    left: `${c.sun.x}%`,
    top: `${c.sun.y}%`,
    width: `${c.sun.size * k}cqw`,
    background: CREMA,
    opacity,
  });

  return (
    <div
      className={clsx("grain @container overflow-hidden", className)}
      style={{ backgroundImage: `linear-gradient(${c.angle}deg, ${c.a} 0%, ${c.b} 100%)` }}
    >
      <span aria-hidden="true" className={SUN} style={sunStyle(2.6, 0.12)} />
      <span aria-hidden="true" className={SUN} style={sunStyle(1, 0.72)} />
      <svg
        viewBox={`0 0 400 ${H}`}
        preserveAspectRatio="none"
        className={clsx("absolute inset-x-0 bottom-0 w-full", landscapeClassName)}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <clipPath id={clipId}>
            <path d={c.mid} />
          </clipPath>
          <linearGradient id={shadeId} x1={c.shadeFromLeft ? "0" : "1"} x2={c.shadeFromLeft ? "1" : "0"} y1="0" y2="0">
            <stop offset="0" stopColor={NIGHT} stopOpacity=".42" />
            <stop offset=".55" stopColor={NIGHT} stopOpacity=".08" />
            <stop offset="1" stopColor={NIGHT} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={c.far} fill={NIGHT} opacity=".2" />
        <g clipPath={`url(#${clipId})`}>
          {c.bands.map((band, i) => (
            <path key={i} d={band.d} fill={band.fill} />
          ))}
          <rect x="-20" y="0" width="440" height={H + 20} fill={`url(#${shadeId})`} />
        </g>
        <path d={c.front} fill={NIGHT} opacity=".66" />
      </svg>
      {children}
    </div>
  );
}

const SUN = "absolute aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full";
