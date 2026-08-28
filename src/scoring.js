/**
 * Scoring. Deterministic, and deliberately dull.
 *
 * The assessors do not score. They report a measured value per axis — a price,
 * a latency, a delivery window — and this file turns those values into a
 * ranking using the rubric that was sealed before anyone looked at a candidate.
 *
 * That split is the defence that survives a corrupted assessor. A bought
 * assessor can lie about a number, and a lie about a number is checkable
 * against the listing. What it cannot do is write persuasive prose and move
 * the ranking, because prose is not an input here.
 */

import { normalisedWeights } from './rubric.js'

/**
 * Normalise raw measurements onto 0..scoreMax within the field of candidates.
 *
 * Relative rather than absolute: "cheapest here" is answerable, "cheap" is not,
 * and an absolute band would need a threshold somebody could tune afterwards.
 * When every candidate ties, everyone gets full marks — the axis simply does
 * not separate them, and pretending otherwise would invent a winner.
 */
function normalise(values, direction, scoreMax) {
  const present = values.filter((v) => typeof v === 'number' && Number.isFinite(v))
  if (present.length === 0) return values.map(() => null)

  const min = Math.min(...present)
  const max = Math.max(...present)
  const span = max - min

  return values.map((v) => {
    if (typeof v !== 'number' || !Number.isFinite(v)) return null
    if (span === 0) return scoreMax
    const position = direction === 'lower_is_better' ? (max - v) / span : (v - min) / span
    return Number((position * scoreMax).toFixed(3))
  })
}

/**
 * @param {object} rubric   a sealed rubric
 * @param {Array<{alias: string, measurements: Record<string, number|null>}>} reports
 * @returns {{ ranking: object[], byAxis: Record<string, object[]> }}
 */
export function score(rubric, reports) {
  const weights = normalisedWeights(rubric)
  const byAxis = {}

  for (const axis of rubric.axes) {
    const raw = reports.map((r) => r.measurements?.[axis.key] ?? null)
    const points = normalise(raw, axis.direction, rubric.scoreMax)
    byAxis[axis.key] = reports.map((r, i) => ({
      alias: r.alias,
      measured: raw[i],
      points: points[i],
      unit: axis.unit,
    }))
  }

  const ranking = reports.map((report, i) => {
    const axes = {}
    let total = 0
    let covered = 0

    for (const axis of rubric.axes) {
      const points = byAxis[axis.key][i].points
      axes[axis.key] = points
      if (points !== null) {
        total += points * weights[axis.key]
        covered += weights[axis.key]
      }
    }

    // Rescale by the weight actually covered, so a candidate that failed to
    // report an axis is not silently rewarded for the missing data.
    const weighted = covered > 0 ? total / covered : 0

    return {
      alias: report.alias,
      axes,
      coverage: Number(covered.toFixed(4)),
      total: Number(weighted.toFixed(3)),
    }
  })

  ranking.sort((a, b) => b.total - a.total || a.alias.localeCompare(b.alias))
  return { ranking, byAxis }
}

/**
 * The dissent: axes on which the winner did not win.
 *
 * Published with the verdict, always. A verdict that only reports the case for
 * the winner is advertising, and the losing argument is the part a buyer needs
 * in order to disagree with us on purpose.
 */
export function dissent(rubric, ranking, byAxis) {
  if (ranking.length < 2) return []
  const winner = ranking[0].alias

  return rubric.axes
    .map((axis) => {
      const column = byAxis[axis.key].filter((c) => c.points !== null)
      if (column.length === 0) return null
      const best = column.reduce((a, b) => (b.points > a.points ? b : a))
      if (best.alias === winner) return null
      const winnerCell = byAxis[axis.key].find((c) => c.alias === winner)
      return {
        axis: axis.key,
        measures: axis.measures,
        preferred: best.alias,
        preferredMeasured: best.measured,
        winnerMeasured: winnerCell?.measured ?? null,
        unit: axis.unit,
      }
    })
    .filter(Boolean)
}
