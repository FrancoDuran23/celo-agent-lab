/**
 * The rubric: what is being measured, and how much each axis is worth.
 *
 * This file exists because of one question — if the assessors are paid, what
 * stops a supplier from buying the outcome?
 *
 * The answer is not a promise. It is an order of operations: the rubric is
 * committed on-chain BEFORE any candidate is evaluated. After that the weights
 * cannot be quietly retuned to fit a winner, because the commitment is already
 * public and dated by a block.
 *
 * This is the same move the hackathon judging it makes on itself: publish the
 * query before the entries arrive, and let anyone read it.
 */

import { commitmentOf, verifyCommitment } from './canonical.js'

/**
 * @typedef {object} Axis
 * @property {string} key        stable identifier, used in scores
 * @property {string} label      what a person calls it
 * @property {string} measures   the single question this axis answers
 * @property {number} weight     relative importance; weights are normalised
 * @property {'lower_is_better'|'higher_is_better'} direction
 * @property {string} unit
 */

/**
 * @typedef {object} Rubric
 * @property {string} id
 * @property {string} question     what is being decided
 * @property {Axis[]} axes
 * @property {number} scoreMax     top of the per-axis scale
 */

export class RubricError extends Error {}

/**
 * Reject a rubric that cannot produce a defensible score. Every failure here
 * is a way a rigged evaluation could hide.
 */
export function validate(rubric) {
  if (!rubric || typeof rubric !== 'object') throw new RubricError('Rubric must be an object')
  if (!rubric.id) throw new RubricError('Rubric needs an id')
  if (!rubric.question) throw new RubricError('Rubric needs the question it decides')
  if (!Array.isArray(rubric.axes) || rubric.axes.length === 0) {
    throw new RubricError('Rubric needs at least one axis')
  }

  const seen = new Set()
  for (const axis of rubric.axes) {
    for (const field of ['key', 'label', 'measures', 'direction', 'unit']) {
      if (!axis[field]) throw new RubricError(`Axis "${axis.key ?? '?'}" is missing ${field}`)
    }
    if (seen.has(axis.key)) throw new RubricError(`Duplicate axis key "${axis.key}"`)
    seen.add(axis.key)

    if (!['lower_is_better', 'higher_is_better'].includes(axis.direction)) {
      throw new RubricError(`Axis "${axis.key}" has an unknown direction "${axis.direction}"`)
    }
    if (!(typeof axis.weight === 'number') || !(axis.weight > 0)) {
      throw new RubricError(`Axis "${axis.key}" needs a weight above zero`)
    }
  }

  if (!(typeof rubric.scoreMax === 'number') || rubric.scoreMax <= 0) {
    throw new RubricError('Rubric needs a scoreMax above zero')
  }

  return rubric
}

/** Weights as fractions of one, so a rubric can be written with any numbers. */
export function normalisedWeights(rubric) {
  const total = rubric.axes.reduce((sum, a) => sum + a.weight, 0)
  return Object.fromEntries(rubric.axes.map((a) => [a.key, a.weight / total]))
}

/**
 * Seal a rubric: validate it, hash it, and stamp when it was sealed.
 *
 * The returned commitment is what goes on-chain. Nothing about a candidate is
 * known at this point, which is the whole argument.
 */
export function seal(rubric, sealedAt = new Date()) {
  validate(rubric)
  const sealed = { ...rubric, sealedAt: sealedAt.toISOString() }
  return { rubric: sealed, commitment: commitmentOf(sealed) }
}

/**
 * Does this rubric match the commitment that was anchored?
 *
 * A buyer runs this before trusting a verdict, and a losing supplier runs it
 * when they suspect the criteria moved.
 */
export function matchesCommitment(sealedRubric, commitment) {
  return verifyCommitment(sealedRubric, commitment)
}
