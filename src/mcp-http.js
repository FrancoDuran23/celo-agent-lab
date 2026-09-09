/**
 * The committee over HTTP, so a reviewer that is not on your machine can
 * actually connect to it.
 *
 * The stdio entry point is the right shape for an agent running locally and the
 * wrong shape for everything else: a remote reviewer cannot spawn a process on
 * your laptop. This exports a plain `fetch(Request) -> Response` handler, which
 * is what Cloudflare Workers, Deno and Vercel Edge all want, and what the MCP
 * Streamable HTTP transport speaks.
 *
 * Statelessness is real, not aspirational. Every tool takes what it needs as an
 * argument and stores nothing, so a caller can be answered by a different
 * isolate on every call and never notice. An earlier version claimed this while
 * keeping sessions in a module-level Map, which worked in one process and
 * failed across isolates with an error telling the caller to open a session
 * they had already opened.
 */

import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { LATEST_PROTOCOL_VERSION } from '@modelcontextprotocol/sdk/types.js'
import { buildServer, describeTools } from './mcp-tools.js'

// TOOLS never changes at runtime, so the ten z.toJSONSchema conversions run
// once, not on every request.
const TOOL_CATALOG = describeTools()

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, mcp-session-id, mcp-protocol-version, last-event-id',
  'access-control-expose-headers': 'mcp-session-id',
}

function withCors(res) {
  const headers = new Headers(res.headers)
  for (const [k, v] of Object.entries(CORS)) headers.set(k, v)
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers })
}

/** Shared between the landing page and the GET /mcp 405 body, so the two never drift apart. */
const QUICKSTART = [
  '1. seal_rubric — send criteria and weights; keep sealedRubric and commitment.',
  '2. prepare_candidates — send the sealedRubric and your candidates; keep candidates, integrity, reveal.',
  '3. assessor_brief — one axis at a time; assessors answer with measurements, never scores.',
  '4. deliberate — send everything back with the measurements; get the verdict, the dissent, the record and its hash.',
  '5. audit_record — anyone checks the record against the two anchored hashes. Then prepare_settlement pays the winner.',
  'Stateless: every call carries what it needs. Full JSON-RPC bodies for all steps: GET /mcp.',
]

/**
 * A complete deliberation as JSON-RPC, for a reader who has not connected an
 * MCP client yet: initialize, list the tools, then the five calls in order.
 * Every step is a POST to /mcp with these three headers — a GET here gets a
 * 405 because this server has nothing to push and holding a stream open for
 * it would just be a billed connection to nowhere.
 *
 * The server is stateless, so each step names the fields to carry forward
 * from the previous response. Placeholders in angle brackets are those.
 */
function example() {
  const call = (id, name, args) => ({
    jsonrpc: '2.0', id, method: 'tools/call', params: { name, arguments: args },
  })
  const axes = [
    { key: 'price', label: 'Price', measures: 'total delivered cost', weight: 3, direction: 'lower_is_better', unit: 'usd' },
    { key: 'capacity', label: 'Capacity', measures: 'rated capacity', weight: 2, direction: 'higher_is_better', unit: 'mah' },
  ]
  return {
    note: 'Seven POSTs to /mcp with this header set. Steps 4–7 paste fields from earlier responses; the server remembers nothing.',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json, text/event-stream',
      'mcp-protocol-version': LATEST_PROTOCOL_VERSION,
    },
    sequence: [
      {
        step: '1. initialize',
        body: {
          jsonrpc: '2.0', id: 1, method: 'initialize',
          params: { protocolVersion: LATEST_PROTOCOL_VERSION, capabilities: {}, clientInfo: { name: 'example-client', version: '0.1.0' } },
        },
      },
      { step: '2. tools/list', body: { jsonrpc: '2.0', id: 2, method: 'tools/list' } },
      {
        step: '3. seal_rubric — fix the criteria before seeing a candidate',
        body: call(3, 'seal_rubric', { id: 'power-bank-2026-09', question: 'Which power bank should we buy?', axes }),
        carry: 'From the response keep structuredContent.sealedRubric and structuredContent.commitment. Anchor the commitment somewhere dated.',
      },
      {
        step: '4. prepare_candidates — blind them and scan for instructions',
        body: call(4, 'prepare_candidates', {
          sealedRubric: '<sealedRubric from step 3>',
          candidates: [
            { id: 'baseus-20k', supplier: 'Baseus', price: 31, capacity: 20000 },
            { id: 'anker-10k', supplier: 'Anker', price: 26, capacity: 10000 },
          ],
        }),
        carry: 'Keep candidates, integrity and reveal. Show assessors the candidates; never the reveal map.',
      },
      {
        step: '5. assessor_brief — what one assessor is asked for, one axis at a time',
        body: call(5, 'assessor_brief', { sealedRubric: '<sealedRubric from step 3>', candidates: '<candidates from step 4>', axis: 'price' }),
        carry: 'The assessor reports a measured value per candidate, never a score. Repeat per axis.',
      },
      {
        step: '6. deliberate — score the measurements, produce the verdict and the dissent',
        body: call(6, 'deliberate', {
          sealedRubric: '<sealedRubric from step 3>',
          commitment: '<commitment from step 3>',
          candidates: '<candidates from step 4>',
          integrity: '<integrity from step 4>',
          reveal: '<reveal from step 4>',
          reports: [
            { alias: '<alias of baseus-20k from step 4>', measurements: { price: 31, capacity: 20000 } },
            { alias: '<alias of anker-10k from step 4>', measurements: { price: 26, capacity: 10000 } },
          ],
        }),
        carry: 'Keep record and recordCommitment. Anchor recordCommitment in the transaction that pays for the deliberation.',
      },
      {
        step: '7. audit_record — anyone, later, checks the record against what was anchored',
        body: call(7, 'audit_record', { record: '<record from step 6>', recordCommitment: '<recordCommitment from step 6>', rubricCommitment: '<commitment from step 3>' }),
        carry: 'Expect verdict "intact". Optional step 8: prepare_settlement with the same record and commitments, plus the winner’s address and an amount, returns the USDT transfer for the buyer’s wallet to sign.',
      },
    ],
  }
}

/** A card at the root, so a human who opens the URL is not met with a 404. */
function landing(url) {
  return new Response(
    JSON.stringify({
      name: 'quorum-committee',
      description:
        'A committee of five assessors that ends a deliberation and leaves a reason. ' +
        'The rubric is sealed before any candidate is seen; assessors report measurements ' +
        'and never scores; the dissent ships with the verdict.',
      transport: 'streamable-http',
      endpoint: new URL('/mcp', url).toString(),
      tools: TOOL_CATALOG.map((t) => ({ name: t.name, description: t.description })),
      quickstart: QUICKSTART,
      stateless: true,
      source: 'https://github.com/FrancoDuran23/celo-agent-lab',
      note: 'POST JSON-RPC to /mcp with accept: application/json, text/event-stream. GET /mcp returns the full tool schemas and a pasteable seven-step example.',
    }, null, 2),
    { headers: { 'content-type': 'application/json', ...CORS } },
  )
}

export async function handle(request) {
  const url = new URL(request.url)

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })
  if (url.pathname === '/' || url.pathname === '') return landing(url)
  if (url.pathname !== '/mcp') {
    return new Response(JSON.stringify({ error: 'Not found. The MCP endpoint is /mcp' }), {
      status: 404, headers: { 'content-type': 'application/json', ...CORS },
    })
  }

  // Stateless: there is no server-initiated message to deliver, so the SSE
  // stream a client opens with GET would be held open forever on a transport
  // nothing can ever write to — a billed connection per client, for nothing.
  if (request.method === 'GET') {
    return new Response(
      JSON.stringify({
        error: 'This server is stateless. POST JSON-RPC to /mcp; there is no server-initiated stream.',
        note: 'Full JSON schemas are at the end of this body under `schemas`, and always available via tools/list.',
        quickstart: QUICKSTART,
        example: example(),
        tools: TOOL_CATALOG.map((t) => ({ name: t.name, description: t.description })),
        schemas: TOOL_CATALOG,
      }, null, 2),
      { status: 405, headers: { 'content-type': 'application/json', allow: 'POST, OPTIONS', ...CORS } },
    )
  }

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless: no session id, no server-side memory
    enableJsonResponse: true,
  })

  try {
    await buildServer().connect(transport)
    return withCors(await transport.handleRequest(request))
  } catch (err) {
    return new Response(
      JSON.stringify({
        jsonrpc: '2.0',
        error: { code: -32603, message: 'Internal error', data: String(err && err.message || err) },
        id: null,
      }),
      { status: 500, headers: { 'content-type': 'application/json', ...CORS } },
    )
  }
}

export default { fetch: handle }
