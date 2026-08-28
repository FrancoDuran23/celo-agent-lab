/**
 * The allowance: policy, ledger and chain wired together.
 *
 * The single rule this file exists to enforce is the order of operations —
 * evaluate, then record, and only pay when the verdict allowed it. Nothing
 * else in the codebase may call `pay` directly.
 */

import { readFileSync } from 'node:fs'
import { evaluate } from './policy.js'
import { Ledger } from './ledger.js'
import * as chain from './celo.js'

const CONFIG_PATH = process.env.ALLOWANCE_CONFIG || 'allowance.config.json'

export function loadPolicy(path = CONFIG_PATH) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

export class Allowance {
  constructor({ policy = loadPolicy(), ledger = new Ledger(), privateKey = process.env.AGENT_PRIVATE_KEY } = {}) {
    this.policy = policy
    this.ledger = ledger
    this.privateKey = privateKey
  }

  get address() {
    return chain.walletFor(this.privateKey).account.address
  }

  /** What is left, what the caps are, whether the allowance is live. */
  status(at = new Date()) {
    const spent = this.ledger.spentOn(at)
    const today = this.ledger.onDay(at)
    return {
      live: this.policy.revoked !== true,
      address: this.address,
      attributionTag: this.policy.attributionTag,
      dailyBudgetUsd: this.policy.dailyBudgetUsd,
      spentTodayUsd: Number(spent.toFixed(6)),
      remainingTodayUsd: Number((this.policy.dailyBudgetUsd - spent).toFixed(6)),
      perPaymentCapUsd: this.policy.perPaymentCapUsd,
      window: this.policy.window,
      recipients: this.policy.recipients,
      requestsToday: today.length,
      paidToday: today.filter((e) => e.allowed).length,
      refusedToday: today.filter((e) => !e.allowed).length,
    }
  }

  /** Run the rules without spending anything. */
  dryRun(request, at = new Date()) {
    return evaluate({
      request,
      policy: this.policy,
      spentTodayUsd: this.ledger.spentOn(at),
      at,
    })
  }

  /** What a payment would cost in fees, before anything is signed. */
  estimate(request) {
    return chain.estimate({
      from: this.address,
      to: request.address,
      amountUsd: request.amountUsd,
      symbol: this.policy.token,
      feeSymbol: this.policy.feeCurrency,
      tag: this.policy.attributionTag,
    })
  }

  /**
   * The one path from a request to a transaction.
   *
   * @param {{address: string, amountUsd: number, reason: string}} request
   * @returns {Promise<{verdict: object, txHash: string|null}>}
   */
  async request(request, at = new Date()) {
    const verdict = this.dryRun(request, at)

    let txHash = null
    if (verdict.allowed) {
      txHash = await chain.pay({
        privateKey: this.privateKey,
        to: request.address,
        amountUsd: request.amountUsd,
        symbol: this.policy.token,
        feeSymbol: this.policy.feeCurrency,
        tag: this.policy.attributionTag,
      })
    }

    this.ledger.record({
      at: at.toISOString(),
      address: request.address,
      amountUsd: request.amountUsd,
      reason: request.reason,
      allowed: verdict.allowed,
      decidedBy: verdict.decidedBy,
      txHash,
    })

    return { verdict, txHash }
  }

  /** Every request made, its verdict, and the rule that decided it. */
  log({ limit = 50 } = {}) {
    return this.ledger.all().slice(-limit).reverse()
  }

  balances() {
    return chain.balances(this.address)
  }
}
