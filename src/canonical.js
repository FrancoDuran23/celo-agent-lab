/**
 * Canonical serialisation and hashing.
 *
 * Every commitment in this project is a hash of a JSON document, and a hash is
 * only a commitment if the same document always produces the same bytes.
 * `JSON.stringify` does not guarantee that — key order follows insertion order,
 * so two objects that are equal can serialise differently and hash differently.
 *
 * So: keys sorted, no whitespace, UTF-8. Anyone holding the document can
 * recompute the hash and get the same answer we did.
 */

import { createHash } from 'node:crypto'

/** Recursively sort object keys. Arrays keep their order — it carries meaning. */
function sortDeep(value) {
  if (Array.isArray(value)) return value.map(sortDeep)
  if (value === null || typeof value !== 'object') return value
  return Object.keys(value)
    .sort()
    .reduce((out, key) => {
      out[key] = sortDeep(value[key])
      return out
    }, {})
}

/** Deterministic JSON for any plain value. */
export function canonicalize(value) {
  return JSON.stringify(sortDeep(value))
}

/**
 * sha256 of the canonical form, 0x-prefixed.
 * @returns {`0x${string}`} 32 bytes as hex
 */
export function commitmentOf(value) {
  const digest = createHash('sha256').update(canonicalize(value), 'utf8').digest('hex')
  return `0x${digest}`
}

/**
 * Recompute a commitment and compare. This is the function a third party runs
 * when they want to know whether the record they were handed is the record
 * that was anchored.
 */
export function verifyCommitment(value, commitment) {
  return commitmentOf(value).toLowerCase() === String(commitment).toLowerCase()
}
