/**
 * Everything that touches the chain.
 *
 * Two Celo specifics carry the project:
 *
 *   Fee abstraction (CIP-64) — the `feeCurrency` field lets a transaction pay
 *   its own gas in a stablecoin. An agent funded with cUSD needs nothing else;
 *   without it, every wallet would also have to hold CELO, and the second
 *   token is exactly the kind of friction that stops an agent mid-task.
 *
 *   Attribution tags (ERC-8021) — `toDataSuffix` appends a marker to the
 *   transaction's data. It changes nothing about what the transaction does; it
 *   only makes it countable as ours.
 */

import { createPublicClient, createWalletClient, http, erc20Abi, parseUnits, formatUnits, encodeFunctionData, concatHex } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { celo } from 'viem/chains'
import { toDataSuffix } from '@celo/attribution-tags'

export const RPC_URL = process.env.CELO_RPC_URL || 'https://forno.celo.org'

/** Tokens this agent can hold, spend, and pay gas in. */
export const TOKENS = {
  CELO: { address: '0x471EcE3750Da237f93B8E339c536989b8978a438', decimals: 18 },
  cUSD: { address: '0x765DE816845861e75A25fCA122bb6898B8B1282a', decimals: 18 },
  cEUR: { address: '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73', decimals: 18 },
  USDC: { address: '0xcebA9300f2b948710d2653dD7B07f33A8B32118C', decimals: 6 },
  USDT: { address: '0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e', decimals: 6 },
}

export function token(symbol) {
  const t = TOKENS[symbol]
  if (!t) throw new Error(`Unknown token "${symbol}". Known: ${Object.keys(TOKENS).join(', ')}`)
  return t
}

const transport = http(RPC_URL)

export const publicClient = createPublicClient({ chain: celo, transport })

/** Wallet client for the agent. Reads the key at call time, never stores it. */
export function walletFor(privateKey) {
  const account = privateKeyToAccount(privateKey)
  return { account, client: createWalletClient({ account, chain: celo, transport }) }
}

/** Native CELO plus every token in TOKENS, as decimal strings. */
export async function balances(address) {
  const native = await publicClient.getBalance({ address })
  const out = { CELO: formatUnits(native, 18) }

  await Promise.all(
    Object.entries(TOKENS)
      .filter(([symbol]) => symbol !== 'CELO')
      .map(async ([symbol, t]) => {
        const raw = await publicClient.readContract({
          address: t.address,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [address],
        })
        out[symbol] = formatUnits(raw, t.decimals)
      }),
  )

  return out
}

/**
 * An ERC-20 transfer with an optional commitment anchored in it, the
 * attribution tag appended, and gas payable in a stablecoin.
 *
 * Layout matters:
 *
 *   [ transfer call ] [ 32-byte commitment ] [ ERC-8021 suffix ]
 *
 * The attribution suffix has to be last. The leaderboard query matches the
 * ERC-8021 marker at the END of `tx.data` with no trailing wildcard, so
 * anything appended after it makes the whole transaction invisible to the
 * leaderboard. Verified against the published query and against
 * `fromDataSuffix`, which still decodes the tag with a commitment in front.
 *
 * The commitment is the hash of a decision record. Paying for the work and
 * dating the reasoning are then the same transaction — there is no window in
 * which the record exists but is not yet anchored.
 */
function transferData({ to, amount, tag, commitment }) {
  const call = encodeFunctionData({
    abi: erc20Abi,
    functionName: 'transfer',
    args: [to, amount],
  })
  const parts = commitment ? [call, commitment, toDataSuffix(tag)] : [call, toDataSuffix(tag)]
  return concatHex(parts)
}

/**
 * Read a commitment back out of a sent transaction.
 *
 * Sits between the end of the 68-byte ERC-20 transfer call and the 35-byte
 * attribution suffix. Returns null when the transaction carried no commitment,
 * which is the honest answer for every transaction that was not one of ours.
 */
export async function commitmentIn(hash) {
  const tx = await publicClient.getTransaction({ hash })
  const data = tx.input
  const CALL_BYTES = 4 + 32 + 32
  const SUFFIX_BYTES = 35
  const start = 2 + CALL_BYTES * 2
  const end = data.length - SUFFIX_BYTES * 2
  if (end - start !== 64) return null
  return `0x${data.slice(start, end)}`
}

/** @returns {Promise<{ gas: bigint, gasPrice: bigint, feeCurrency: string }>} */
export async function estimate({ from, to, amountUsd, symbol, feeSymbol, tag, commitment }) {
  const t = token(symbol)
  const fee = token(feeSymbol)
  const amount = parseUnits(String(amountUsd), t.decimals)

  const gas = await publicClient.estimateGas({
    account: from,
    to: t.address,
    data: transferData({ to, amount, tag, commitment }),
    feeCurrency: fee.address,
  })

  const gasPrice = await publicClient.getGasPrice({ feeCurrency: fee.address })
  return { gas, gasPrice, feeCurrency: fee.address }
}

/**
 * Send the payment. Only ever called after the policy has allowed it — this
 * function does not second-guess the verdict, and must never be reachable
 * from anywhere that skips it.
 *
 * @returns {Promise<`0x${string}`>} transaction hash
 */
export async function pay({ privateKey, to, amountUsd, symbol, feeSymbol, tag, commitment }) {
  const t = token(symbol)
  const fee = token(feeSymbol)
  const { account, client } = walletFor(privateKey)
  const amount = parseUnits(String(amountUsd), t.decimals)

  return client.sendTransaction({
    account,
    to: t.address,
    data: transferData({ to, amount, tag, commitment }),
    feeCurrency: fee.address,
  })
}

/** Wait for the receipt of a sent payment. */
export function confirm(hash) {
  return publicClient.waitForTransactionReceipt({ hash })
}
