/**
 * Append-only spending log.
 *
 * Every request is recorded — refused ones too. A log that only keeps the
 * payments that went through cannot answer the question you actually ask it
 * later, which is "what did it try to do?".
 *
 * One JSON object per line, so the file stays readable and appendable without
 * rewriting what came before.
 */

import { appendFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const DEFAULT_PATH = 'data/ledger.jsonl'

/** @typedef {{
 *   at: string, address: string, amountUsd: number, reason: string,
 *   allowed: boolean, decidedBy: string|null, txHash: string|null
 * }} Entry */

export class Ledger {
  /** @param {string} path */
  constructor(path = DEFAULT_PATH) {
    this.path = path
  }

  /** @returns {Entry[]} */
  all() {
    if (!existsSync(this.path)) return []
    return readFileSync(this.path, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line))
  }

  /**
   * Entries recorded on the same UTC day as `at`. The budget resets at 00:00
   * GMT because that is the boundary the hackathon counts on, and a budget
   * that resets on a different clock than the leaderboard is a bug waiting.
   * @param {Date} at
   */
  onDay(at) {
    const day = at.toISOString().slice(0, 10)
    return this.all().filter((e) => e.at.slice(0, 10) === day)
  }

  /**
   * What has actually left the wallet today. Refused requests cost nothing and
   * must not consume budget, or a rejected payment would quietly shrink the
   * allowance.
   * @param {Date} at
   */
  spentOn(at) {
    return this.onDay(at)
      .filter((e) => e.allowed)
      .reduce((sum, e) => sum + e.amountUsd, 0)
  }

  /** @param {Entry} entry */
  record(entry) {
    mkdirSync(dirname(this.path), { recursive: true })
    appendFileSync(this.path, JSON.stringify(entry) + '\n', 'utf8')
    return entry
  }
}
