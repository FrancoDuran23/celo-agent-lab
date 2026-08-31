#!/usr/bin/env node
/**
 * The committee, exposed to an agent over MCP.
 *
 * Read the tool names in order and the guarantee is visible without reading a
 * line of the implementation: a session is opened with a rubric, candidates are
 * admitted after it is sealed, assessors report measurements, and the verdict
 * is computed. There is deliberately no tool that scores a candidate, and none
 * that edits a rubric once a session holds it.
 *
 * That absence is the product. An assessor with a `set_score` tool could be
 * bought; one that can only report a number can lie about a number, and a lie
 * about a number is checkable against the listing.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { Session, audit } from './committee.js'

const sessions = new Map()

const server = new McpServer({ name: 'quorum-committee', version: '0.1.0' })

const json = (value) => ({ content: [{ type: 'text', text: JSON.stringify(value, null, 2) }] })
const fail = (message) => ({ isError: true, content: [{ type: 'text', text: message }] })

const AXIS = z.object({
  key: z.string().describe('Stable identifier, used in every report and score'),
  label: z.string(),
  measures: z.string().describe('The single question this axis answers, in one sentence'),
  weight: z.number().positive().describe('Relative importance; weights are normalised'),
  direction: z.enum(['lower_is_better', 'higher_is_better']),
  unit: z.string().describe('The unit every measurement on this axis must be in'),
})

server.registerTool(
  'open_session',
  {
    title: 'Open a session',
    description:
      'Seal a rubric and open a deliberation. The rubric is canonicalised and hashed here, before any candidate is seen — that commitment is what makes the verdict auditable later, so open the session first and gather candidates after. Returns the session id and the rubric commitment.',
    inputSchema: {
      id: z.string().describe('Rubric id, e.g. "power-bank-2026-08"'),
      question: z.string().describe('What is being decided'),
      scoreMax: z.number().positive().default(10),
      axes: z.array(AXIS).min(1).describe('One axis per assessor'),
    },
  },
  async ({ id, question, scoreMax, axes }) => {
    try {
      const s = new Session({ id, question, scoreMax: scoreMax ?? 10, axes })
      const sid = `s_${Math.random().toString(16).slice(2, 10)}`
      sessions.set(sid, s)
      return json({
        sessionId: sid,
        rubricCommitment: s.rubricCommitment,
        sealedAt: s.rubric.sealedAt,
        axes: s.rubric.axes.map((a) => a.key),
        note: 'Anchor this commitment on-chain before admitting candidates if you want the seal to be provable.',
      })
    } catch (e) {
      return fail(e.message)
    }
  },
)

server.registerTool(
  'admit_candidates',
  {
    title: 'Admit candidates',
    description:
      'Hand the session the things being compared. Supplier identity is stripped before anything reads them, including a name repeated inside the description, and aliases are salted per session. Text that tries to instruct an assessor is recorded against that candidate rather than removed. Returns the blinded candidates you will assess and the integrity findings.',
    inputSchema: {
      sessionId: z.string(),
      candidates: z
        .array(z.record(z.any()))
        .min(2)
        .describe('Each needs an "id". Any other field is passed through, blinded.'),
    },
  },
  async ({ sessionId, candidates }) => {
    const s = sessions.get(sessionId)
    if (!s) return fail(`No session "${sessionId}". Open one first.`)
    try {
      const { candidates: blinded, integrity } = s.admit(candidates)
      const dirty = integrity.filter((i) => !i.clean)
      return json({
        candidates: blinded,
        integrity,
        warning: dirty.length
          ? `${dirty.length} candidate(s) tried to instruct the assessors. This is recorded in the verdict against them.`
          : null,
      })
    } catch (e) {
      return fail(e.message)
    }
  },
)

server.registerTool(
  'assessor_brief',
  {
    title: 'Get an assessor brief',
    description:
      'What one assessor is asked for: the axis, its unit, and the blinded candidates. Read this before measuring. You are asked for values, never for points — nothing you write moves a ranking, so write the number you can defend.',
    inputSchema: {
      sessionId: z.string(),
      axis: z.string().describe('The axis key from the rubric'),
    },
  },
  async ({ sessionId, axis }) => {
    const s = sessions.get(sessionId)
    if (!s) return fail(`No session "${sessionId}".`)
    try {
      return json(s.brief(axis))
    } catch (e) {
      return fail(e.message)
    }
  },
)

server.registerTool(
  'close_session',
  {
    title: 'Close the session and get the verdict',
    description:
      'Submit every assessor measurement and receive the verdict, the arithmetic behind it, the dissent — every axis the winner lost — and the record hash to anchor. Scoring is deterministic and happens here: the same measurements always produce the same ranking.',
    inputSchema: {
      sessionId: z.string(),
      reports: z
        .array(
          z.object({
            alias: z.string(),
            measurements: z.record(z.number().nullable()),
          }),
        )
        .describe('One per candidate. Use null for a value you could not establish.'),
      agentId: z.string().optional().describe('ERC-8004 token id acting here'),
      requestedBy: z.string().optional().describe('Address that asked for the decision'),
    },
  },
  async ({ sessionId, reports, agentId, requestedBy }) => {
    const s = sessions.get(sessionId)
    if (!s) return fail(`No session "${sessionId}".`)
    try {
      const { record, commitment, ranking, dissent } = s.close(reports, { agentId, requestedBy })
      return json({
        verdict: record.verdict,
        ranking,
        dissent,
        recordCommitment: commitment,
        rubricCommitment: s.rubricCommitment,
        record,
        note: 'Anchor recordCommitment in the transaction that pays for this deliberation. One transaction pays for the work and dates the reasoning.',
      })
    } catch (e) {
      return fail(e.message)
    }
  },
)

server.registerTool(
  'audit_record',
  {
    title: 'Audit a record',
    description:
      'Check a verdict you were handed against the commitments on chain. Answers two questions: is this the record that was anchored, and is the rubric inside it the one that was sealed before the candidates were known. A record that passes the first and fails the second means the criteria were rewritten after the fact.',
    inputSchema: {
      record: z.record(z.any()),
      recordCommitment: z.string(),
      rubricCommitment: z.string(),
    },
  },
  async ({ record, recordCommitment, rubricCommitment }) =>
    json(audit(record, { recordCommitment, rubricCommitment })),
)

await server.connect(new StdioServerTransport())
