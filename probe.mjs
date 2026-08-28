import { createPublicClient, http, toFunctionSelector, encodeFunctionData, decodeFunctionResult } from 'viem'

const RPC = 'https://forno.celo.org'
const REGISTRY = '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432'
const FROM = '0xfcC0144395337D6C3F108aF42212f4C49Fc3d982'
const URI = 'https://raw.githubusercontent.com/FrancoDuran23/celo-agent-lab/main/.well-known/agent.json'

const client = createPublicClient({ transport: http(RPC) })

const candidates = [
  'function register(string agentURI) returns (uint256)',
  'function register(string agentURI, address owner) returns (uint256)',
  'function register(string tokenURI) returns (uint256 agentId)',
  'function newAgent(string agentURI, address owner) returns (uint256)',
  'function registerAgent(string agentURI) returns (uint256)',
]

for (const sig of candidates) {
  const abi = [sig]
  const name = sig.match(/function (\w+)/)[1]
  const args = sig.includes('address') ? [URI, FROM] : [URI]
  let sel = '?'
  try { sel = toFunctionSelector(sig) } catch {}
  try {
    const res = await client.call({
      account: FROM,
      to: REGISTRY,
      data: encodeFunctionData({ abi: [{ type:'function', name,
        inputs: sig.includes('address') ? [{type:'string'},{type:'address'}] : [{type:'string'}],
        outputs: [{type:'uint256'}], stateMutability:'nonpayable' }], functionName: name, args }),
    })
    console.log(`  OK   ${sel}  ${sig.slice(9, 60)}`)
    console.log(`       -> devuelve: ${res.data}`)
  } catch (e) {
    const m = (e.shortMessage || e.message || '').split('\n')[0].slice(0, 90)
    console.log(`  --   ${sel}  ${name}(...)  ${m}`)
  }
}
