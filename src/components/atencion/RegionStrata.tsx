import type { Region } from "../../data/types";

/**
 * "Mapa" abstracto y decorativo: las regiones de Jujuy como estratos, de la
 * Puna (arriba, la más alta) al Ramal. No representa geografía real.
 * Cada punto es una oficina; el estrato elegido en el filtro se resalta.
 */

const W = 280;
const H = 236;

type Wave = [amp: number, freq: number, phase: number];

function line(base: number, waves: Wave[], step = 4): [number, number][] {
  const pts: [number, number][] = [];
  for (let x = 0; x <= W; x += step) {
    const t = (x / W) * Math.PI * 2;
    const y = waves.reduce((acc, [a, f, p]) => acc + a * Math.sin(f * t + p), base);
    pts.push([x, Math.round(y * 10) / 10]);
  }
  return pts;
}

const LINES = [
  line(56, [
    [10, 1.15, 0.5],
    [5.5, 3.4, 1.2],
    [2.4, 7.6, 2.4],
  ]),
  line(96, [
    [5.5, 1.05, 2.1],
    [2.6, 2.8, 0.4],
  ]),
  line(132, [
    [5, 0.9, 3.0],
    [2.4, 2.4, 1.6],
  ]),
  line(168, [
    [4.5, 1.2, 0.3],
    [2.2, 3.1, 2.2],
  ]),
  line(200, [[2.2, 1, 1]]),
];

const BANDS: { region: Region; fill: string; ink: string }[] = [
  { region: "Puna", fill: "var(--violeta-500)", ink: "var(--crema-50)" },
  { region: "Quebrada", fill: "var(--terracota-500)", ink: "var(--crema-50)" },
  { region: "Valles", fill: "var(--ocre-500)", ink: "var(--night-900)" },
  { region: "Ramal", fill: "var(--salvia-500)", ink: "var(--night-900)" },
];

const toPath = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");

function bandPath(i: number) {
  const top = LINES[i]!;
  const bottom = [...LINES[i + 1]!].reverse();
  return `${toPath(top)} ${toPath(bottom).replace(/^M/, "L")} Z`;
}

/** y del centro del estrato i en la abscisa x. */
function midY(i: number, x: number) {
  const idx = Math.round(x / 4);
  const a = LINES[i]![idx]![1];
  const b = LINES[i + 1]![idx]![1];
  return (a + b) / 2;
}

export function RegionStrata({
  active,
  counts,
  central,
  className,
}: {
  active: Region | null;
  /** Oficinas por región; `central` marca la región de Casa Central. */
  counts: Partial<Record<Region, number>>;
  className?: string;
  central?: Region;
}) {
  const caba = counts.CABA ?? 0;
  const dim = (r: Region) => (active && active !== r ? 0.22 : 1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} aria-hidden="true" focusable="false">
      {/* Sol bajo, como en el logo */}
      <circle cx="238" cy="24" r="17" fill="var(--ocre-500)" opacity="0.18" />
      <circle cx="238" cy="24" r="7.5" fill="var(--ocre-300)" />

      {BANDS.map((b, i) => {
        const n = counts[b.region] ?? 0;
        const x0 = 150;
        const x1 = 262;
        const xs = n <= 1 ? [x1 - 30] : Array.from({ length: n }, (_, k) => x0 + (k * (x1 - x0)) / (n - 1));
        return (
          <g key={b.region} style={{ opacity: dim(b.region), transition: "opacity 300ms ease" }}>
            <path d={bandPath(i)} fill={b.fill} />
            <text
              x="14"
              y={midY(i, 40) + 4.5}
              fill={b.ink}
              style={{ font: "600 12px var(--font-mono)", letterSpacing: "0.14em", textTransform: "uppercase" }}
            >
              {b.region}
            </text>
            {xs.map((x, k) => {
              const xr = Math.round(x / 4) * 4;
              if (k === 0 && central === b.region) {
                return (
                  <circle
                    key={k}
                    cx={xr}
                    cy={midY(i, xr)}
                    r="6.5"
                    fill="var(--night-900)"
                    stroke="var(--crema-50)"
                    strokeWidth="2.5"
                  />
                );
              }
              return (
                <circle
                  key={k}
                  cx={xr}
                  cy={midY(i, xr)}
                  r="4.2"
                  fill="var(--crema-50)"
                  stroke="var(--night-900)"
                  strokeOpacity="0.55"
                  strokeWidth="1.5"
                />
              );
            })}
          </g>
        );
      })}

      {caba ? (
        <g style={{ opacity: dim("CABA"), transition: "opacity 300ms ease" }}>
          <rect x="14" y="210" width="80" height="24" rx="12" fill="var(--night-700)" stroke="var(--line-strong)" />
          <circle cx="29" cy="222" r="4.2" fill="var(--crema-50)" />
          <text
            x="42"
            y="226.5"
            fill="var(--crema-50)"
            style={{ font: "600 12px var(--font-mono)", letterSpacing: "0.14em", textTransform: "uppercase" }}
          >
            CABA
          </text>
        </g>
      ) : null}
    </svg>
  );
}
