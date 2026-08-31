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
import { seal, matchesCommitment } from './rubric.js'
import { blind } from './blind.js'
import { scanCandidate } from './injection.js'
import { score, dissent } from './scoring.js'
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
  }

  /**
   * Admit the candidates. Identity is stripped before anything reads them, and
   * any text that tries to instruct an assessor is recorded rather than removed
   * — an attempted bribe is the strongest signal a supplier ever gives you.
   *
   * @param {Array<object>} candidates each needs an `id`
   */
  admit(candidates) {
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

    const known = new Set(this.candidates.map((c) => c.alias))
    for (const r of reports) {
      if (!known.has(r.alias)) throw new CommitteeError(`Report for unknown alias "${r.alias}"`)
    }
    if (reports.length !== this.candidates.length) {
      throw new CommitteeError('Every candidate needs a report, even an empty one')
    }

    const { ranking, byAxis } = score(this.rubric, reports)
    const objections = dissent(this.rubric, ranking, byAxis)

    const record = buildRecord({
      agentId,
      requestedBy,
      rubric: this.rubric,
      rubricCommitment: this.rubricCommitment,
      candidates: this.candidates,
      reports,
      ranking,
      dissent: objections,
      integrity: this.integrity,
      reveal: this.reveal,
      at,
    })

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
  const { recordMatches, rubricMatches } = verifyRecord(record, { recordCommitment, rubricCommitment })
  return {
    recordMatches,
    rubricMatches,
    sealedBeforeCandidates: matchesCommitment(record.rubric ? { ...record.rubric } : {}, rubricCommitment) || rubricMatches,
    verdict: recordMatches && rubricMatches ? 'intact' : 'do not trust this record',
  }
}
