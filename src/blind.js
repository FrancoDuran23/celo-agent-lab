/**
 * Blind the candidates before an assessor sees them.
 *
 * An assessor that knows it is looking at the supplier who paid can favour
 * them without anyone writing an instruction to do so. Removing the identity
 * removes the option — the same reason a jury sees evidence and not the
 * defendant's bank balance.
 *
 * The mapping back to real identities stays here, on the orchestration side.
 * It goes into the record after scoring, never into the prompt.
 */

import { createHash } from 'node:crypto'

/** Fields that name who a candidate is, rather than what it offers. */
const IDENTIFYING = ['supplier', 'brand', 'seller', 'vendor', 'name', 'url', 'domain', 'logo']

/** Stable per-round alias, so the same supplier is not always "A". */
function alias(id, salt, index) {
  const h = createHash('sha256').update(`${salt}:${id}`).digest('hex')
  return `candidate_${h.slice(0, 6)}_${index}`
}

/**
 * Strip identity from a listing's free text. A supplier that repeats its own
 * name in the description would otherwise leak straight through the redaction.
 */
function scrubText(text, names) {
  if (!text) return text
  return names.reduce(
    (out, name) =>
      name && name.length > 2
        ? out.replace(new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '[redacted]')
        : out,
    String(text),
  )
}

/**
 * @param {Array<object>} candidates raw listings, each with an `id`
 * @param {string} salt              per-round salt; changes the aliases
 * @returns {{ blinded: object[], reveal: Record<string, string> }}
 */
export function blind(candidates, salt) {
  const reveal = {}

  const blinded = candidates.map((candidate, index) => {
    const key = alias(candidate.id, salt, index)
    reveal[key] = candidate.id

    const names = IDENTIFYING.map((f) => candidate[f]).filter((v) => typeof v === 'string')

    const out = { alias: key }
    for (const [field, value] of Object.entries(candidate)) {
      if (field === 'id' || IDENTIFYING.includes(field)) continue
      out[field] = typeof value === 'string' ? scrubText(value, names) : value
    }
    return out
  })

  return { blinded, reveal }
}

/** Put the real identities back once scoring is finished. */
export function unblind(scored, reveal) {
  return scored.map((row) => ({ ...row, id: reveal[row.alias] ?? null }))
}
