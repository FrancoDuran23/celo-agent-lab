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

/**
 * Substrings that name who a candidate is, rather than what it offers.
 * Matched case-insensitively against the whole key, so `provider`,
 * `supplierName`, `vendor_id`, `meta.contact` and `Brand` all match. `id` is
 * deliberately absent — it is handled separately, removed and aliased as
 * before, not folded into this pattern.
 *
 * Substring matching over-strips on purpose: "name" inside "filename" still
 * strips the field. Losing an oddly-named field is cheap; a supplier's name
 * surviving because it sat under a key nobody anticipated is not.
 */
const IDENTITY_PATTERNS = [
  'supplier', 'brand', 'seller', 'vendor', 'provider', 'company', 'org',
  'organization', 'organisation', 'manufacturer', 'maker', 'contact', 'email',
  'phone', 'website', 'site', 'url', 'domain', 'logo', 'owner', 'author', 'name',
]

function isIdentifyingKey(key) {
  const k = key.toLowerCase()
  return IDENTITY_PATTERNS.some((p) => k.includes(p))
}

/** Every string at any depth under `value`, flattened into `out`. */
function collectStrings(value, out) {
  if (typeof value === 'string') out.push(value)
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out))
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => collectStrings(v, out))
}

/**
 * Every value that sat under an identifying key, at any depth, collected from
 * the whole candidate before anything is stripped — so `meta.org` feeds the
 * name list for `specs.note` even though the two live nowhere near each other.
 */
function collectIdentifyingNames(value, out) {
  if (Array.isArray(value)) {
    value.forEach((v) => collectIdentifyingNames(v, out))
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (k === 'identity') continue // caller-supplied names, folded in separately
      if (isIdentifyingKey(k)) collectStrings(v, out)
      else collectIdentifyingNames(v, out)
    }
  }
}

/**
 * Stable per-round alias, so the same supplier is not always "A".
 *
 * The index used to be appended, which made the alias positional and undid the
 * salt sitting next to it: candidate_xxxxxx_0 was always the first one
 * submitted, so anyone holding the input list de-anonymised it instantly.
 */
function alias(id, salt) {
  return `candidate_${createHash('sha256').update(`${salt}:${id}`).digest('hex').slice(0, 10)}`
}

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
const URL_RE = /\b(?:https?:\/\/|www\.)\S+/gi
const DOMAIN_RE = /\b[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.(?:com|io|ar|net|org|co|dev|app|ai|xyz|info|biz)\b/gi
const HANDLE_RE = /@[a-zA-Z0-9_]+/g

/**
 * Scrub the kinds of contact detail a supplier could hide behind a key this
 * tool never anticipated: an email, a link, a bare domain, an @handle. Order
 * matters — URLs and emails are matched first so a domain or handle inside
 * one of them is not left half-redacted by a narrower pattern running first.
 */
function scrubContacts(text) {
  return text
    .replace(URL_RE, '[redacted]')
    .replace(EMAIL_RE, '[redacted]')
    .replace(DOMAIN_RE, '[redacted]')
    .replace(HANDLE_RE, '[redacted]')
}

/**
 * Strip identity from a listing's free text. A supplier that repeats its own
 * name in the description would otherwise leak straight through the redaction.
 */
function scrubText(text, names) {
  if (!text) return text
  const named = names.reduce(
    (out, name) =>
      name && name.length > 2
        ? out.replace(new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '[redacted]')
        : out,
    String(text),
  )
  return scrubContacts(named)
}

/**
 * @param {Array<object>} candidates raw listings, each with an `id` and an
 *   optional `identity` array of extra strings the caller knows are
 *   identifying (trade names, a founder's name) that no key names.
 * @param {string} salt              per-round salt; changes the aliases
 * @returns {{ blinded: object[], reveal: Record<string, string> }}
 */
export function blind(candidates, salt) {
  const reveal = {}

  const blinded = candidates.map((candidate) => {
    const key = alias(candidate.id, salt)
    reveal[key] = candidate.id

    const names = []
    collectIdentifyingNames(candidate, names)
    if (Array.isArray(candidate.identity)) {
      for (const s of candidate.identity) if (typeof s === 'string') names.push(s)
    }

    // Walks into objects and arrays. Only touching top-level strings meant one
    // level of nesting carried the supplier's name straight through to the
    // assessor — { specs: { maker: "Acme" } } arrived intact.
    const walk = (value) => {
      if (typeof value === 'string') return scrubText(value, names)
      if (Array.isArray(value)) return value.map(walk)
      if (value && typeof value === 'object') {
        const o = {}
        for (const [k, v] of Object.entries(value)) {
          if (k === 'identity' || isIdentifyingKey(k)) continue
          o[k] = walk(v)
        }
        return o
      }
      return value
    }

    const out = { alias: key }
    for (const [field, value] of Object.entries(candidate)) {
      if (field === 'id' || field === 'identity' || isIdentifyingKey(field)) continue
      out[field] = walk(value)
    }
    return out
  })

  return { blinded, reveal }
}

/** Put the real identities back once scoring is finished. */
export function unblind(scored, reveal) {
  return scored.map((row) => ({ ...row, id: reveal[row.alias] ?? null }))
}
