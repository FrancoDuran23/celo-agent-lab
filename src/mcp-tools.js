/**
 * The committee's tools, in one place, so the stdio entry point and the HTTP
 * one expose exactly the same surface. A reviewer connecting over HTTP and a
 * developer running it locally have to see the same server, or the thing that
 * gets reviewed is not the thing that ships.
 *
 * Every tool is pure. Nothing is stored between calls.
 *
 * An earlier version kept sessions in a module-level Map and handed back a
 * session id. That works in one process and fails across edge isolates — the
 * caller opens a session in one, admits candidates in another, and is told
 * "open one first" when they did. Intermittent, and the error misdirects.
 * Passing the state through the arguments removes the failure entirely, and
 * with it a Map that never shrank and a session id that was 32 bits of
 * Math.random guarding a live deliberation.
 *
 * The cost is that the caller carries the sealed rubric between calls. That is
 * the right trade: it is a document they can read, hash and anchor, rather than
 * a handle to memory they cannot inspect.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { seal } from './rubric.js'
import { blind } from './blind.js'
import { scanCandidate } from './injection.js'
import { score, dissent } from './scoring.js'
import { buildRecord, commitRecord } from './record.js'
import { audit } from './committee.js'
import { commitmentOf } from './canonical.js'

const json = (value) => ({ content: [{ type: 'text', text: JSON.stringify(value, null, 2) }] })
const fail = (message) => ({ isError: true, content: [{ type: 'text', text: message }] })

/** Every handler returns a sentence on failure, never a raw JS message. */
const guard = (fn) => async (args) => {
  try { return await fn(args) } catch (e) { return fail(e?.message ?? String(e)) }
}

const AXIS = z.object({
  key: z.string().describe('Stable identifier, used in every report and score'),
  label: z.string(),
  measures: z.string().describe('The single question this axis answers, in one sentence'),
  weight: z.number().positive().describe('Relative importance; weights are normalised'),
  direction: z.enum(['lower_is_better', 'higher_is_better']),
  unit: z.string().describe('The unit every measurement on this axis must be in'),
})

const SEALED = z.object({
  id: z.string(), question: z.string(), scoreMax: z.number(),
  axes: z.array(AXIS), sealedAt: z.string(),
}).describe('The sealed rubric exactly as seal_rubric returned it. Do not edit it — its hash is the commitment.')

const BLINDED = z.array(z.record(z.any()))
  .describe('The blinded candidates exactly as prepare_candidates returned them')

export function buildServer() {
  const server = new McpServer({ name: 'quorum-committee', version: '0.2.0' })

  server.registerTool(
    'seal_rubric',
    {
      title: 'Seal a rubric',
      description:
        'Hash the criteria before any candidate exists. Call this FIRST and anchor the commitment somewhere dated — on a chain, in a public log — because that is what later proves the weights were not retuned to fit a winner. Returns the sealed rubric, which you pass to every other tool unchanged.',
      inputSchema: {
        id: z.string().describe('Rubric id, e.g. "power-bank-2026-08"'),
        question: z.string().describe('What is being decided'),
        scoreMax: z.number().positive().default(10),
        axes: z.array(AXIS).min(1).describe('One axis per assessor'),
      },
    },
    guard(async ({ id, question, scoreMax, axes }) => {
      const { rubric, commitment } = seal({ id, question, scoreMax: scoreMax ?? 10, axes })
      return json({
        sealedRubric: rubric,
        commitment,
        next: 'Anchor this commitment, then call prepare_candidates with the sealed rubric.',
      })
    }),
  )

  server.registerTool(
    'prepare_candidates',
    {
      title: 'Blind the candidates',
      description:
        'Strip supplier identity from the things being compared, at every depth, and scan their text for attempts to instruct an assessor. Injection attempts are recorded against the candidate rather than removed — an attempted bribe is the strongest signal a supplier gives you. Returns the blinded set to show assessors, and a reveal map to keep to yourself: handing reveal to an assessor defeats the blinding entirely, and that is on you, not on this tool.',
      inputSchema: {
        sealedRubric: SEALED,
        candidates: z.array(z.record(z.any())).min(2)
          .describe('Each needs an "id". Every other field is passed through, blinded at any depth.'),
        salt: z.string().optional().describe('Per-round salt for the aliases. Omit for a random one.'),
      },
    },
    guard(async ({ candidates, salt }) => {
      const ids = new Set(candidates.map((c) => c.id))
      if (ids.size !== candidates.length) throw new Error('Candidate ids must be unique')
      if (candidates.some((c) => !c.id)) throw new Error('Every candidate needs an "id"')

      const { blinded, reveal } = blind(candidates, salt ?? Math.random().toString(36).slice(2, 12))
      const scanned = blinded.map((b) => scanCandidate(b))
      const integrity = scanned.map((s, i) => ({ alias: blinded[i].alias, clean: s.clean, findings: s.findings }))
      const dirty = integrity.filter((i) => !i.clean)

      return json({
        candidates: scanned.map((s) => s.candidate),
        integrity,
        reveal,
        warning: dirty.length
          ? `${dirty.length} candidate(s) tried to instruct the assessors. This goes into the verdict against them.`
          : null,
        next: 'Give each assessor a brief. Do not give them the reveal map.',
      })
    }),
  )

  server.registerTool(
    'assessor_brief',
    {
      title: 'Get an assessor brief',
      description:
        'What one assessor is asked for: the axis, its unit, and the blinded candidates. You are asked for measured values, never for points — nothing you write moves a ranking, so report the number you can defend and null for one you cannot establish. Be aware that an axis only one candidate reports on is discarded: withholding a number does not remove a rival, it removes the axis.',
      inputSchema: {
        sealedRubric: SEALED,
        candidates: BLINDED,
        axis: z.string().describe('The axis key from the rubric'),
      },
    },
    guard(async ({ sealedRubric, candidates, axis }) => {
      const a = sealedRubric.axes.find((x) => x.key === axis)
      if (!a) throw new Error(`No axis "${axis}" in this rubric. Available: ${sealedRubric.axes.map((x) => x.key).join(', ')}`)
      return json({
        axis: { key: a.key, measures: a.measures, unit: a.unit, direction: a.direction },
        candidates,
        instruction:
          'Report a measured value for each candidate on this axis, in the stated unit. ' +
          'Do not score, rank, or express a preference — the arithmetic is not yours.',
      })
    }),
  )

  server.registerTool(
    'deliberate',
    {
      title: 'Score the measurements and produce the verdict',
      description:
        'Submit every assessor measurement and receive the verdict, the arithmetic behind it, the dissent — every axis the winner lost — and a record hash to anchor. Scoring is deterministic: the same measurements always produce the same ranking, and no prose you write can change it. Anchor the record hash in the transaction that pays for the deliberation, so paying for the work and dating the reasoning are one act.',
      inputSchema: {
        sealedRubric: SEALED,
        commitment: z.string().describe('The commitment seal_rubric returned, as anchored'),
        candidates: BLINDED,
        integrity: z.array(z.record(z.any())).describe('As prepare_candidates returned it'),
        reveal: z.record(z.string()).describe('alias to real id, so the verdict can name a winner'),
        reports: z.array(z.object({
          alias: z.string(),
          measurements: z.record(z.number().nullable()),
        })).describe('One per candidate. null for a value you could not establish.'),
        agentId: z.string().optional().describe('ERC-8004 token id acting here'),
        requestedBy: z.string().optional().describe('Address that asked for the decision'),
      },
    },
    guard(async ({ sealedRubric, commitment, candidates, integrity, reveal, reports, agentId, requestedBy }) => {
      // The rubric must still hash to what was anchored. This is the check the
      // whole design rests on, so it runs before anything is scored.
      const recomputed = commitmentOf(sealedRubric)
      if (recomputed.toLowerCase() !== String(commitment).toLowerCase()) {
        throw new Error(
          `The rubric does not hash to the commitment you passed. Anchored ${commitment}, this rubric is ${recomputed}. ` +
          'Either the rubric was edited after sealing, or the wrong commitment was passed.',
        )
      }

      const known = new Set(candidates.map((c) => c.alias))
      for (const r of reports) {
        if (!known.has(r.alias)) throw new Error(`Report for unknown alias "${r.alias}"`)
      }
      if (reports.length !== candidates.length) {
        throw new Error(`Every candidate needs a report. Got ${reports.length} for ${candidates.length} candidates.`)
      }

      const { ranking, byAxis } = score(sealedRubric, reports)
      const objections = dissent(sealedRubric, ranking, byAxis)
      const record = buildRecord({
        agentId, requestedBy,
        rubric: sealedRubric, rubricCommitment: commitment,
        candidates, reports, ranking, dissent: objections, integrity, reveal,
      })

      return json({
        verdict: record.verdict,
        ranking,
        dissent: objections,
        recordCommitment: commitRecord(record),
        rubricCommitment: commitment,
        record,
      })
    }),
  )

  server.registerTool(
    'audit_record',
    {
      title: 'Audit a record',
      description:
        'Check a verdict you were handed against the commitments that were anchored. Both commitments must come from the chain, not from the record — the rubric hash is recomputed from the criteria inside it, so a rewritten rubric fails even when the record was faithfully re-hashed around it. That is the attack this exists to catch.',
      inputSchema: {
        record: z.record(z.any()),
        recordCommitment: z.string().describe('From the chain, not from the record'),
        rubricCommitment: z.string().describe('From the chain, anchored before candidates existed'),
      },
    },
    guard(async ({ record, recordCommitment, rubricCommitment }) =>
      json(audit(record, { recordCommitment, rubricCommitment }))),
  )

  return server
}
