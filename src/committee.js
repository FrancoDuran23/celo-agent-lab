/**
 * The committee: the one path from a set of candidates to a signed verdict.
 *
 * Everything here already existed in pieces — rubric, blind, injection, scoring,
 * record. This file is the order they have to run in, and the order is the
 * product:
 *
 *   seal the rubric  →  blind the candidates  →  scan for instructions
 *                    →  collect measurements  →  score  →  dissent  →  record
 *
 * The seal happens before a single candidate is read. Nothing downstream can
 * move a weight, because the commitment is already fixed by then.
 */

import { randomBytes } from 'node:crypto'
import { seal } from './rubric.js'
import { blind } from './blind.js'
import { scanCandidate } from './injection.js'
import { score, dissent, applyInjectionPolicy } from './scoring.js'
import { buildRecord, commitRecord, verifyRecord } from './record.js'

export class CommitteeError extends Error {}

/**
 * A session holds one deliberation. It is created from a rubric, and the rubric
 * is sealed on construction — you cannot open a session and then decide what to
 * measure.
 */
export class Session {
  /**
   * @param {object} rubric
   * @param {object} [opts]
   * @param {string} [opts.salt]  per-round salt for the blinding aliases
   * @param {Date}   [opts.at]
   */
  constructor(rubric, { salt = randomBytes(8).toString('hex'), at = new Date() } = {}) {
    const sealed = seal(rubric, at)
    this.rubric = sealed.rubric
    this.rubricCommitment = sealed.commitment
    this.salt = salt
    this.openedAt = at
    this.candidates = null
    this.reveal = null
    this.integrity = null
    this.closedAt = null
  }

  /**
   * Admit the candidates. Identity is stripped before anything reads them, and
   * any text that tries to instruct an assessor is recorded rather than removed
   * — an attempted bribe is the strongest signal a supplier ever gives you.
   *
   * @param {Array<object>} candidates each needs an `id`
   */
  admit(candidates) {
    // A session admits once. Sealing the rubric buys nothing if the candidate
    // set can be swapped underneath it: admit, close, admit again, close again,
    // and every record produced carries the same anchored commitment. An
    // operator would just re-roll until the answer was the one they wanted, and
    // all of the contradictory verdicts would audit clean.
    if (this.candidates) {
      throw new CommitteeError(
        'This session already admitted candidates. Open a new session — which seals a new rubric — rather than re-running this one.',
      )
    }
    if (!Array.isArray(candidates) || candidates.length < 2) {
      throw new CommitteeError('A committee needs at least two candidates to compare')
    }
    const ids = new Set(candidates.map((c) => c.id))
    if (ids.size !== candidates.length) throw new CommitteeError('Candidate ids must be unique')

    const { blinded, reveal } = blind(candidates, this.salt)

    const scanned = blinded.map((b) => scanCandidate(b))
    this.candidates = scanned.map((s) => s.candidate)
    this.reveal = reveal
    this.integrity = scanned.map((s, i) => ({
      alias: blinded[i].alias,
      clean: s.clean,
      findings: s.findings,
    }))

    return { candidates: this.candidates, integrity: this.integrity }
  }

  /** What an assessor is asked for: one measurement per axis, per candidate. */
  brief(axisKey) {
    const axis = this.rubric.axes.find((a) => a.key === axisKey)
    if (!axis) throw new CommitteeError(`No axis "${axisKey}" in this rubric`)
    if (!this.candidates) throw new CommitteeError('No candidates admitted yet')
    return {
      axis: { key: axis.key, measures: axis.measures, unit: axis.unit, direction: axis.direction },
      candidates: this.candidates,
      instruction:
        'Report a measured value for each candidate on this axis, in the stated unit. ' +
        'Do not score, rank, or express a preference — the arithmetic is not yours. ' +
        'Return null for a candidate whose value you cannot establish from the material.',
    }
  }

  /**
   * Close the session on a set of reports and produce the record.
   *
   * @param {Array<{alias: string, measurements: Record<string, number|null>}>} reports
   */
  close(reports, { agentId, requestedBy, at = new Date() } = {}) {
    if (!this.candidates) throw new CommitteeError('No candidates admitted yet')
    // Closing twice would mint a second record under the same seal, and both
    // would audit clean. One seal, one verdict.
    if (this.closedAt) {
      throw new CommitteeError(
        `This session was already closed at ${this.closedAt}. A sealed rubric produces one verdict; open a new session to deliberate again.`,
      )
    }

    const known = new Set(this.candidates.map((c) => c.alias))
    for (const r of reports) {
      if (!known.has(r.alias)) throw new CommitteeError(`Report for unknown alias "${r.alias}"`)
    }
    if (reports.length !== this.candidates.length) {
      throw new CommitteeError('Every candidate needs a report, even an empty one')
    }

    // The injection policy is sealed into the rubric, so it runs before
    // score() ever sees a measurement — 'disqualify' has to remove a
    // candidate from the field, not just from the story told about it after.
    const { candidates, reports: scoredReports, flagged, disqualified } =
      applyInjectionPolicy(this.rubric, this.candidates, reports, this.integrity, this.reveal)

    const { ranking, byAxis } = score(this.rubric, scoredReports)
    const objections = dissent(this.rubric, ranking, byAxis)

    const integrityVerdict = {
      policy: this.rubric.onInjection ?? 'flag',
      flagged: flagged.map((f) => f.alias),
      winnerFlagged: Boolean(ranking[0] && flagged.some((f) => f.alias === ranking[0].alias)),
    }

    const record = buildRecord({
      agentId,
      requestedBy,
      rubric: this.rubric,
      rubricCommitment: this.rubricCommitment,
      candidates,
      reports: scoredReports,
      ranking,
      dissent: objections,
      integrity: this.integrity,
      integrityVerdict,
      disqualified,
      reveal: this.reveal,
      at,
    })

    this.closedAt = at.toISOString()
    return { record, commitment: commitRecord(record), ranking, byAxis, dissent: objections }
  }
}

/**
 * Check a verdict you were handed against what is on chain.
 *
 * Two questions, and both have to hold. A record that matches its own hash but
 * whose rubric does not match the sealed one means the criteria were rewritten
 * after the candidates were known — which is the exact failure the seal exists
 * to make visible.
 */
export function audit(record, { recordCommitment, rubricCommitment }) {
  const { recordMatches, rubricMatches, recomputedRubricCommitment } = verifyRecord(record, {
    recordCommitment,
    rubricCommitment,
  })

  const why = []
  if (!recordMatches) why.push('the record does not hash to the anchored value — it was edited after anchoring')
  if (!rubricMatches) why.push('the rubric inside the record does not hash to the sealed commitment — the criteria were rewritten')

  return {
    recordMatches,
    rubricMatches,
    recomputedRubricCommitment,
    anchoredRubricCommitment: rubricCommitment,
    verdict: recordMatches && rubricMatches ? 'intact' : 'do not trust this record',
    why,
  }
}
