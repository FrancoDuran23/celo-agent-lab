/**
 * The decision record.
 *
 * This is the product. Not the verdict — the verdict is one field in it.
 *
 * Spending limits are a solved problem: ERC-7715 grants a scoped, time-bounded
 * permission with a per-call cap and a total ceiling, and wallets ship it. What
 * no standard answers is the case where an agent stayed inside its limit and
 * still chose badly. Nothing on-chain says what it considered, what it rejected,
 * or on whose behalf it was acting.
 *
 * So the record carries: who asked, under which sealed rubric, what was
 * measured, what won, and what the losing argument was. It is hashed, and the
 * hash rides in the payment transaction — one transaction pays for the work and
 * dates the reasoning.
 */

import { commitmentOf, verifyCommitment } from './canonical.js'

/**
 * Assemble a decision record. Field order is irrelevant — the canonical form
 * sorts keys before hashing — but the shape is the contract a verifier reads.
 *
 * @param {object} args
 * @param {string} args.agentId            ERC-8004 token id acting here
 * @param {string} args.requestedBy        address that asked for the decision
 * @param {object} args.rubric             the sealed rubric
 * @param {string} args.rubricCommitment   what was anchored before evaluating
 * @param {object[]} args.candidates       blinded candidates as assessed
 * @param {object[]} args.reports          per-assessor measurements
 * @param {object[]} args.ranking          from scoring.score
 * @param {object[]} args.dissent          from scoring.dissent
 * @param {object[]} args.integrity        injection findings, per candidate
 * @param {Record<string,string>} args.reveal alias to real identity
 * @param {Date} args.at
 */
export function buildRecord({
  agentId,
  requestedBy,
  rubric,
  rubricCommitment,
  candidates,
  reports,
  ranking,
  dissent,
  integrity,
  reveal,
  at = new Date(),
}) {
  const winner = ranking[0] ?? null

  return {
    version: 1,
    decidedAt: at.toISOString(),

    // On whose behalf, and under what authority.
    actor: { agentId, requestedBy },

    // The criteria, and proof they predate the candidates.
    rubric: {
      id: rubric.id,
      question: rubric.question,
      sealedAt: rubric.sealedAt,
      commitment: rubricCommitment,
      axes: rubric.axes.map((a) => ({
        key: a.key,
        measures: a.measures,
        weight: a.weight,
        direction: a.direction,
        unit: a.unit,
      })),
    },

    // What was judged, and who each alias turned out to be.
    candidates: candidates.map((c) => ({ alias: c.alias, id: reveal[c.alias] ?? null })),

    // Every measurement, so the arithmetic can be redone by hand.
    reports,
    ranking,

    // What the winner lost on. Always present, even when empty.
    dissent,

    // Suppliers who tried to instruct the assessors, named.
    integrity,

    verdict: winner
      ? { alias: winner.alias, id: reveal[winner.alias] ?? null, total: winner.total }
      : null,
  }
}

/** The 32-byte commitment that goes on-chain. */
export function commitRecord(record) {
  return commitmentOf(record)
}

/**
 * Verify a record against what was anchored.
 *
 * Two questions, and both have to hold: was this record the one anchored, and
 * was the rubric inside it the one sealed beforehand? A record that passes the
 * first and fails the second means the criteria were rewritten after the fact.
 */
export function verifyRecord(record, { recordCommitment, rubricCommitment }) {
  return {
    recordMatches: verifyCommitment(record, recordCommitment),
    rubricMatches: record.rubric?.commitment?.toLowerCase() === String(rubricCommitment).toLowerCase(),
  }
}
