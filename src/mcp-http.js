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
 * Statelessness is deliberate. A new transport and a new server per request
 * means no session survives between calls, which costs a round trip and buys
 * the ability to run on an edge runtime with no shared memory. The committee
 * itself is unaffected — a Session is created, used and closed inside one call
 * chain, and the record it produces is the durable thing, not the process.
 */

import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { buildServer } from './mcp-tools.js'

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
      tools: ['open_session', 'admit_candidates', 'assessor_brief', 'close_session', 'audit_record'],
      source: 'https://github.com/FrancoDuran23/celo-agent-lab',
      note: 'POST JSON-RPC to /mcp with accept: application/json, text/event-stream.',
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
