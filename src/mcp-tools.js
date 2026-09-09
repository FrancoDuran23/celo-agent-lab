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
 *
 * Every tool below declares an outputSchema, so every response is validated
 * against the exact shape its handler returns, and every caller can read that
 * shape from tools/list before ever calling the tool — not just guess at it
 * from a one-line description.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { seal } from './rubric.js'
import { blind } from './blind.js'
import { scanCandidate } from './injection.js'
import { score, dissent, applyInjectionPolicy } from './scoring.js'
import { buildRecord, commitRecord } from './record.js'
import { audit } from './committee.js'
import { commitmentOf } from './canonical.js'
import { buildSettlement, USDT, ATTRIBUTION_TAG } from './settlement.js'

/**
 * A tool with an outputSchema must return `structuredContent` (the object
 * itself) alongside `content` (the same object as JSON text) — the SDK
 * validates the former against the schema and rejects a response missing it.
 * `content` stays for clients that only read text.
 */
const json = (value) => ({
  content: [{ type: 'text', text: JSON.stringify(value, null, 2) }],
  structuredContent: value,
})
const fail = (message) => ({ isError: true, content: [{ type: 'text', text: message }] })

/** Every handler returns a sentence on failure, never a raw JS message. */
const guard = (fn) => async (args) => {
  try { return await fn(args) } catch (e) { return fail(e?.message ?? String(e)) }
}

const AXIS = z.object({
  key: z.string().describe('Stable identifier, used in every report and score'),
  label: z.string().describe('Human-readable name, shown in briefs and in the record'),
  measures: z.string().describe('The single question this axis answers, in one sentence'),
  weight: z.number().positive().describe('Relative importance; weights are normalised'),
  direction: z.enum(['lower_is_better', 'higher_is_better']),
  unit: z.string().describe('The unit every measurement on this axis must be in'),
})

const ON_INJECTION = z.enum(['flag', 'disqualify'])

const SEALED = z.object({
  id: z.string(), question: z.string(), scoreMax: z.number(),
  axes: z.array(AXIS), sealedAt: z.string(),
  onInjection: ON_INJECTION.optional().describe('What deliberate does with a candidate whose text tried to instruct an assessor'),
}).describe('The sealed rubric exactly as seal_rubric returned it. Do not edit it — its hash is the commitment.')

const BLINDED = z.array(z.record(z.any()))
  .describe('The blinded candidates exactly as prepare_candidates returned them')

const FINDING = z.object({
  rule: z.string().describe('Which detection pattern matched, e.g. "override" or "score_demand"'),
  excerpt: z.string().describe('The matched text, truncated'),
  field: z.string().describe('Path to the field the text was found in, e.g. "specs.note" or "features[0]"'),
})

const INTEGRITY = z.array(z.object({
  alias: z.string(),
  clean: z.boolean(),
  findings: z.array(FINDING),
})).describe('Injection-scan findings, one entry per candidate, in the same order as candidates')

const RANKING = z.array(z.object({
  alias: z.string(),
  axes: z.record(z.number().nullable())
    .describe('Points per axis key, 0..scoreMax, or null when fewer than two candidates reported that axis'),
  coverage: z.number().describe('Sum of the normalised weights of the axes this candidate was actually scored on'),
  total: z.number().describe('Weighted total, rescaled by coverage'),
})).describe('Every candidate, best first')

const DISSENT = z.array(z.object({
  axis: z.string(),
  measures: z.string(),
  preferred: z.string().describe('Alias of the candidate that led on this axis'),
  preferredMeasured: z.number().nullable(),
  winnerMeasured: z.number().nullable(),
  unit: z.string(),
})).describe('Every axis the winner did not win, published alongside the verdict')

const VERDICT = z.object({
  alias: z.string(),
  id: z.string().nullable(),
  total: z.number(),
  warning: z.string().optional().describe(
    "Present only when this candidate was flagged under the 'flag' policy: the score stands, the attempt is on the record.",
  ),
})

const INTEGRITY_VERDICT = z.object({
  policy: ON_INJECTION,
  flagged: z.array(z.string()).describe('Aliases of candidates that tried to instruct an assessor'),
  winnerFlagged: z.boolean().describe("Always false under 'disqualify' — a flagged candidate cannot win what it was removed from"),
}).describe('The sealed injection policy, applied once, before scoring — not re-argued afterward')

const DISQUALIFIED = z.array(z.object({
  alias: z.string(),
  id: z.string().nullable(),
  findings: z.array(FINDING),
})).describe("Candidates removed from scoring under the 'disqualify' policy, with the findings that triggered it")

const RECORD = z.object({
  version: z.number(),
  decidedAt: z.string().describe('ISO-8601 timestamp of when deliberate produced this record'),
  actor: z.object({
    agentId: z.string().optional().describe('ERC-8004 token id acting here, if one was given'),
    requestedBy: z.string().optional().describe('Address that asked for the decision, if one was given'),
  }),
  rubric: z.object({
    sealed: SEALED,
    commitment: z.string(),
  }),
  candidates: z.array(z.object({
    alias: z.string(),
    id: z.string().nullable(),
  })).describe('What was judged, and who each alias turned out to be'),
  reports: z.array(z.object({
    alias: z.string(),
    measurements: z.record(z.number().nullable()),
  })).describe('Every measurement, so the arithmetic can be redone by hand'),
  ranking: RANKING,
  dissent: DISSENT,
  integrity: INTEGRITY,
  integrityVerdict: INTEGRITY_VERDICT.optional(),
  disqualified: DISQUALIFIED.optional(),
  verdict: VERDICT.nullable(),
  why: z.array(z.string()).optional().describe('Set only when no candidate could be chosen under the sealed policy'),
}).describe('The decision record: who asked, under which sealed rubric, what was measured, what won, and what the losing argument was.')

const SETTLEMENT_VERDICT = z.object({
  alias: z.string(),
  id: z.string().nullable(),
})

const SETTLEMENT_TRANSACTION = z.object({
  chainId: z.number(),
  to: z.string(),
  value: z.string(),
  data: z.string(),
}).describe('Unsigned transaction. Sign and send this from the buyer wallet — this server holds no keys.')

const SETTLEMENT_SUMMARY = z.object({
  payTo: z.string(),
  amount: z.string(),
  symbol: z.string(),
  commitment: z.string().describe('The record hash riding in the calldata'),
  attributionTag: z.string(),
})

const TOOLS = [
  {
    name: 'seal_rubric',
    title: 'Seal a rubric',
    description:
      'This server is stateless: nothing is remembered between calls. Hash the criteria before any candidate exists. ' +
      'Call this FIRST and anchor the commitment somewhere dated — on a chain, in a public log — because that is what ' +
      'later proves the weights were not retuned to fit a winner. The response has three fields. Pass the `sealedRubric` ' +
      'field, not the whole response, to every other tool, unchanged; its hash is the commitment.',
    inputSchema: {
      id: z.string().describe('Rubric id, e.g. "power-bank-2026-08"'),
      question: z.string().describe('What is being decided'),
      scoreMax: z.number().positive().default(10),
      axes: z.array(AXIS).min(1).describe('One axis per assessor'),
      onInjection: ON_INJECTION.optional().describe(
        'What deliberate does with a candidate whose text tried to instruct an assessor. Sealed with the rubric so ' +
        "it cannot be chosen after seeing whom it hits. Default 'flag'.",
      ),
    },
    outputSchema: {
      sealedRubric: SEALED,
      commitment: z.string().describe('Hash of the sealed rubric. Anchor this before any candidate is seen.'),
      next: z.string(),
    },
    handler: async ({ id, question, scoreMax, axes, onInjection }) => {
      const { rubric, commitment } = seal({ id, question, scoreMax: scoreMax ?? 10, axes, onInjection })
      return json({
        sealedRubric: rubric,
        commitment,
        next: 'Anchor this commitment, then call prepare_candidates with the sealed rubric.',
      })
    },
  },

  {
    name: 'prepare_candidates',
    title: 'Blind the candidates',
    description:
      'Strip supplier identity at every depth: keys matching supplier, brand, vendor, provider, contact, name and ' +
      'similar patterns are removed, their values scrubbed from every string, and every string is also scrubbed of ' +
      "emails, URLs, domains and @handles. A name never told to this tool cannot be recognised — put trade names in " +
      '`identity`. Also scans for injected instructions, recorded against the candidate, not removed — the strongest ' +
      'signal a supplier gives you. Returns `candidates`/`integrity` for deliberate and `reveal` (alias to id); keep ' +
      'reveal to yourself, or the blinding is defeated.',
    inputSchema: {
      sealedRubric: SEALED,
      candidates: z.array(z.record(z.any())).min(2)
        .describe(
          'Each needs an "id". Every other field is passed through, blinded at any depth. Optional `identity`: ' +
          "string[] of extra identifying strings (trade names, a founder's name) to strip and scrub even though no " +
          'key names them.',
        ),
      salt: z.string().optional().describe('Per-round salt for the aliases. Omit for a random one.'),
    },
    outputSchema: {
      candidates: BLINDED,
      integrity: INTEGRITY,
      reveal: z.record(z.string()).describe('Alias to real candidate id. Keep this; pass it to nothing but audit_record\'s caller.'),
      warning: z.string().nullable(),
      next: z.string(),
    },
    handler: async ({ sealedRubric, candidates, salt }) => {
      const ids = new Set(candidates.map((c) => c.id))
      if (ids.size !== candidates.length) throw new Error('Candidate ids must be unique')
      if (candidates.some((c) => !c.id)) throw new Error('Every candidate needs an "id"')

      const { blinded, reveal } = blind(candidates, salt ?? Math.random().toString(36).slice(2, 12))
      const scanned = blinded.map((b) => scanCandidate(b))
      const integrity = scanned.map((s, i) => ({ alias: blinded[i].alias, clean: s.clean, findings: s.findings }))
      const dirty = integrity.filter((i) => !i.clean)
      const policy = sealedRubric.onInjection ?? 'flag'
      const consequence = policy === 'disqualify' ? 'disqualified before scoring' : 'flagged in the verdict'

      return json({
        candidates: scanned.map((s) => s.candidate),
        integrity,
        reveal,
        warning: dirty.length
          ? `${dirty.length} candidate(s) tried to instruct the assessors. Under the sealed policy '${policy}' they will be ${consequence}.`
          : null,
        next: 'Give each assessor a brief. Do not give them the reveal map.',
      })
    },
  },

  {
    name: 'assessor_brief',
    title: 'Get an assessor brief',
    description:
      'What one assessor is asked for: the axis, its unit, and the blinded candidates. You are asked for measured ' +
      'values, never for points — nothing you write moves a ranking, so report the number you can defend and null for ' +
      'one you cannot establish. Be aware that an axis only one candidate reports on is discarded: withholding a number ' +
      'does not remove a rival, it removes the axis.',
    inputSchema: {
      sealedRubric: SEALED,
      candidates: BLINDED,
      axis: z.string().describe('One of the `key` values in sealedRubric.axes, exactly as written (case-sensitive).'),
    },
    outputSchema: {
      axis: z.object({
        key: z.string(),
        measures: z.string(),
        unit: z.string(),
        direction: z.enum(['lower_is_better', 'higher_is_better']),
      }),
      candidates: BLINDED,
      instruction: z.string(),
    },
    handler: async ({ sealedRubric, candidates, axis }) => {
      const a = sealedRubric.axes.find((x) => x.key === axis)
      if (!a) throw new Error(`No axis "${axis}" in this rubric. Available: ${sealedRubric.axes.map((x) => x.key).join(', ')}`)
      return json({
        axis: { key: a.key, measures: a.measures, unit: a.unit, direction: a.direction },
        candidates,
        instruction:
          'Report a measured value for each candidate on this axis, in the stated unit. ' +
          'Do not score, rank, or express a preference — the arithmetic is not yours.',
      })
    },
  },

  {
    name: 'deliberate',
    title: 'Score the measurements and produce the verdict',
    description:
      'Submit every assessor measurement and receive the verdict, the arithmetic behind it, the dissent — every axis ' +
      'the winner lost — and a record hash to anchor. Scoring is deterministic: the same measurements always produce ' +
      'the same ranking, and no prose you write can change it. Pass the record to audit_record before ever paying on ' +
      'it, then to prepare_settlement, which anchors this hash in the payment calldata — so paying for the work and ' +
      'dating the reasoning are one act.',
    inputSchema: {
      sealedRubric: SEALED,
      commitment: z.string().describe(
        'The exact `commitment` string seal_rubric returned. Pass it as is; anchoring it on chain is recommended and ' +
        'is what audit_record checks against later, but this tool does not require a transaction.',
      ),
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
    outputSchema: {
      verdict: VERDICT.nullable().describe('The winner, or null when there was nothing to rank'),
      ranking: RANKING,
      dissent: DISSENT,
      integrityVerdict: INTEGRITY_VERDICT,
      disqualified: DISQUALIFIED,
      why: z.array(z.string()).optional().describe('Set only when no candidate could be chosen under the sealed policy'),
      recordCommitment: z.string().describe('Hash of `record`. Anchor this in the transaction that pays for the deliberation.'),
      rubricCommitment: z.string().describe('The commitment you passed in, echoed back for convenience'),
      record: RECORD,
    },
    handler: async ({ sealedRubric, commitment, candidates, integrity, reveal, reports, agentId, requestedBy }) => {
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

      // The injection policy is sealed into the rubric, so it is applied
      // before score() runs — 'disqualify' has to remove a candidate from the
      // field, not just from the story told about it afterward.
      const { candidates: scoredCandidates, reports: scoredReports, flagged, disqualified } =
        applyInjectionPolicy(sealedRubric, candidates, reports, integrity, reveal)

      const { ranking, byAxis } = score(sealedRubric, scoredReports)
      const objections = dissent(sealedRubric, ranking, byAxis)

      const integrityVerdict = {
        policy: sealedRubric.onInjection ?? 'flag',
        flagged: flagged.map((f) => f.alias),
        winnerFlagged: Boolean(ranking[0] && flagged.some((f) => f.alias === ranking[0].alias)),
      }

      const record = buildRecord({
        agentId, requestedBy,
        rubric: sealedRubric, rubricCommitment: commitment,
        candidates: scoredCandidates, reports: scoredReports,
        ranking, dissent: objections, integrity, integrityVerdict, disqualified, reveal,
      })

      return json({
        verdict: record.verdict,
        ranking,
        dissent: objections,
        integrityVerdict: record.integrityVerdict,
        disqualified: record.disqualified,
        ...(record.why ? { why: record.why } : {}),
        recordCommitment: commitRecord(record),
        rubricCommitment: commitment,
        record,
      })
    },
  },

  {
    name: 'audit_record',
    title: 'Audit a record',
    description:
      'Check a verdict you were handed against the commitments that were anchored. Both commitments must come from the ' +
      'chain, not from the record — the rubric hash is recomputed from the criteria inside it, so a rewritten rubric ' +
      'fails even when the record was faithfully re-hashed around it. That is the attack this exists to catch.',
    inputSchema: {
      record: z.record(z.any()).describe('The decision record exactly as deliberate returned it in `record`.'),
      recordCommitment: z.string().describe(
        'Read this from the anchoring transaction or wherever you published it, never from the record itself: a tampered record can carry a matching string.',
      ),
      rubricCommitment: z.string().describe(
        'Read this from the anchoring transaction or wherever you published it, never from the record itself: a tampered record can carry a matching string.',
      ),
    },
    outputSchema: {
      recordMatches: z.boolean().describe('Does the record hash to recordCommitment?'),
      rubricMatches: z.boolean().describe('Does the rubric inside the record hash to rubricCommitment?'),
      recomputedRubricCommitment: z.string().nullable().describe('The hash actually recomputed from record.rubric.sealed'),
      anchoredRubricCommitment: z.string().describe('The rubricCommitment you passed in, echoed back for comparison'),
      verdict: z.enum(['intact', 'do not trust this record']),
      why: z.array(z.string()).describe('One sentence per check that failed. Empty when the record is intact.'),
    },
    handler: async ({ record, recordCommitment, rubricCommitment }) =>
      json(audit(record, { recordCommitment, rubricCommitment })),
  },

  {
    name: 'prepare_settlement',
    title: 'Prepare the payment to the winner',
    description:
      "Given an audited verdict, prepare the payment to its winner: an unsigned ERC-20 transfer whose calldata " +
      "carries the record's hash immediately after the transfer call, followed by the ERC-8021 attribution suffix. " +
      "This tool never signs or sends anything — it hands back a transaction for the buyer's own wallet to sign, " +
      "because this server is public and stateless and must never hold or receive a private key. It re-runs the " +
      "audit itself and refuses to build a transaction for a record that does not hash to the anchored commitments, " +
      "so a tampered or fabricated record cannot be turned into a payment; it also refuses a record with no winner. " +
      "The committee blinds candidate identity during deliberation, so it never learns who the winner actually is — " +
      "the caller supplies `payTo` from their own candidate list, and should check it against `verdict.id` before " +
      "ever signing.",
    inputSchema: {
      record: z.record(z.any()).describe('The decision record exactly as deliberate returned it in `record`.'),
      recordCommitment: z.string().describe(
        'Read this from the anchoring transaction or wherever you published it, never from the record itself: a tampered record can carry a matching string.',
      ),
      rubricCommitment: z.string().describe(
        'Read this from the anchoring transaction or wherever you published it, never from the record itself: a tampered record can carry a matching string.',
      ),
      payTo: z.string().describe(
        "The winner's payout address. The committee blinds identity, so it does not know this; you do, from your own candidate list. Check it against verdict.id before signing.",
      ),
      amount: z.string().describe('Decimal amount in the token\'s units, e.g. "48000" or "12.50". A string, so no float rounding.'),
      symbol: z.enum(['USDT']).optional().describe('The settlement token. Only USDT for now.'),
    },
    outputSchema: {
      verdict: SETTLEMENT_VERDICT,
      transaction: SETTLEMENT_TRANSACTION,
      summary: SETTLEMENT_SUMMARY,
      next: z.string(),
    },
    handler: async ({ record, recordCommitment, rubricCommitment, payTo, amount, symbol }) => {
      const { verdict, why } = audit(record, { recordCommitment, rubricCommitment })
      if (verdict !== 'intact') {
        throw new Error(`Refusing to settle: ${why.join('; ')}`)
      }
      if (!record.verdict) {
        throw new Error('Refusing to settle: this record has no winner (every candidate was disqualified or nothing was ranked).')
      }

      const tokenSymbol = symbol ?? USDT.symbol
      const transaction = buildSettlement({ payTo, amount, commitment: recordCommitment, token: USDT })

      return json({
        verdict: { alias: record.verdict.alias, id: record.verdict.id },
        transaction,
        summary: { payTo, amount, symbol: tokenSymbol, commitment: recordCommitment, attributionTag: ATTRIBUTION_TAG },
        next: 'Sign and send this from the buyer wallet. The committee holds no keys; the record hash rides in the calldata so paying and dating the reasoning are one act.',
      })
    },
  },
]

export function buildServer() {
  const server = new McpServer({ name: 'quorum-committee', version: '0.2.0' })

  for (const tool of TOOLS) {
    server.registerTool(
      tool.name,
      { title: tool.title, description: tool.description, inputSchema: tool.inputSchema, outputSchema: tool.outputSchema },
      guard(tool.handler),
    )
  }

  return server
}

/**
 * The same catalog `tools/list` exposes, as plain JSON Schema, for a client
 * that has not connected yet — e.g. the HTTP landing page and the GET /mcp
 * error body.
 */
export function describeTools() {
  return TOOLS.map((tool) => ({
    name: tool.name,
    description: tool.description,
    inputSchema: z.toJSONSchema(z.object(tool.inputSchema)),
    outputSchema: z.toJSONSchema(z.object(tool.outputSchema)),
  }))
}
