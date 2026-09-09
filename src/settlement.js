/**
 * The payment to the winner — prepared, never sent.
 *
 * This server is public and stateless: it must never hold or receive a private
 * key. So this file stops one step short of a transaction. It builds the exact
 * calldata a payment needs and hands back `{ chainId, to, value, data }` for the
 * buyer's own wallet to sign and send. Nothing here talks to a node, a signer,
 * or the network — the same discipline `mcp-tools.js` already keeps, extended
 * to the one tool that touches money.
 *
 * The layout matches `celo.js`'s `transferData`, because it has to be read back
 * by the same query:
 *
 *   [ transfer call ] [ 32-byte commitment ] [ ERC-8021 suffix ]
 *
 * The attribution suffix is appended last, not because the earlier code
 * happened to write it that way, but because the leaderboard matches the
 * ERC-8021 marker at the END of `tx.data` with no trailing wildcard —
 * anything after it makes the whole transaction invisible to the leaderboard.
 * The commitment used here is the record's hash, not the rubric's: the payment
 * dates the *decision*, so paying the winner and dating the reasoning that
 * picked them are one act.
 */

import { toDataSuffix } from '@celo/attribution-tags'

export const USDT = { address: '0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e', decimals: 6, symbol: 'USDT' }
export const CHAIN_ID = 42220
export const ATTRIBUTION_TAG = 'celo_c68db23b8b72'

const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/
const COMMITMENT_RE = /^0x[0-9a-fA-F]{64}$/
const DECIMAL_RE = /^(\d+)(?:\.(\d+))?$/
const TRANSFER_SELECTOR = 'a9059cbb'

function leftPad32(hex) {
  return hex.padStart(64, '0')
}

/**
 * ERC-20 `transfer(address,uint256)` calldata, hand-encoded: no ABI library,
 * no network — just the four-byte selector and two 32-byte words.
 *
 * @param {`0x${string}`} to      0x-prefixed 40-hex-character address
 * @param {bigint} units          amount in the token's smallest unit
 * @returns {`0x${string}`}
 */
export function encodeTransfer(to, units) {
  return `0x${TRANSFER_SELECTOR}${leftPad32(to.slice(2).toLowerCase())}${leftPad32(units.toString(16))}`
}

/**
 * An exact decimal string to the token's smallest unit, as a BigInt. No
 * floating point anywhere in the path — a float can't represent "12.50" and
 * "48000" exactly at the same time, and a payment is the one place that gap
 * is unacceptable.
 *
 * @param {string} amountDecimalString  e.g. "48000" or "12.50"
 * @param {number} decimals
 * @returns {bigint}
 */
export function toUnits(amountDecimalString, decimals) {
  if (typeof amountDecimalString !== 'string') {
    throw new Error('Amount must be a decimal string, e.g. "48000" or "12.50", not a number.')
  }
  const match = DECIMAL_RE.exec(amountDecimalString)
  if (!match) {
    throw new Error(`"${amountDecimalString}" is not a valid non-negative decimal amount.`)
  }
  const [, whole, fraction = ''] = match
  if (fraction.length > decimals) {
    throw new Error(`"${amountDecimalString}" has more fractional digits than this token's ${decimals} decimals.`)
  }
  return BigInt(whole + fraction.padEnd(decimals, '0'))
}

/**
 * Prepare the settlement transaction. Pure: no signing, no sending, no key.
 * The caller is responsible for having already checked the record audits
 * intact — this function only shapes bytes, it does not re-run that check.
 *
 * @param {object} args
 * @param {`0x${string}`} args.payTo      the winner's payout address
 * @param {string} args.amount            decimal amount in the token's units
 * @param {`0x${string}`} args.commitment 32-byte record hash, anchored in the calldata
 * @param {{address: `0x${string}`, decimals: number}} [args.token] defaults to USDT
 * @returns {{ chainId: number, to: `0x${string}`, value: '0x0', data: `0x${string}` }}
 */
export function buildSettlement({ payTo, amount, commitment, token = USDT }) {
  if (!ADDRESS_RE.test(payTo)) {
    throw new Error(`"${payTo}" is not a 0x-prefixed 40-hex-character address.`)
  }
  if (!COMMITMENT_RE.test(commitment)) {
    throw new Error(`"${commitment}" is not a 0x-prefixed 32-byte (64-hex-character) commitment.`)
  }

  const units = toUnits(amount, token.decimals)
  const transferCall = encodeTransfer(payTo, units)
  const commitmentBytes = commitment.slice(2).toLowerCase()
  const suffix = toDataSuffix(ATTRIBUTION_TAG).slice(2)

  return {
    chainId: CHAIN_ID,
    to: token.address,
    value: '0x0',
    data: `${transferCall}${commitmentBytes}${suffix}`,
  }
}
