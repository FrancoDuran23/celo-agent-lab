/** Runs the HTTP MCP handler on Node, to check it before deploying anywhere. */
import { createServer } from 'node:http'
import { handle } from './src/mcp-http.js'

const PORT = process.env.PORT || 8787

createServer(async (req, res) => {
  const chunks = []
  for await (const c of req) chunks.push(c)
  const body = chunks.length ? Buffer.concat(chunks) : undefined
  const request = new Request(`http://localhost:${PORT}${req.url}`, {
    method: req.method, headers: req.headers,
    body: ['GET','HEAD'].includes(req.method) ? undefined : body,
  })
  const out = await handle(request)
  res.writeHead(out.status, Object.fromEntries(out.headers))
  res.end(out.body ? Buffer.from(await out.arrayBuffer()) : undefined)
}).listen(PORT, () => console.log('listening on http://localhost:'+PORT))
