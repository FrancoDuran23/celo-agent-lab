// Registers this agent's ERC-8004 identity on Celo mainnet.
// Reads AGENT_PRIVATE_KEY from .env. The key is never printed or logged.
import { createWalletClient, createPublicClient, http, encodeFunctionData, formatEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { celo } from 'viem/chains'
import { readFileSync } from 'node:fs'

const env = Object.fromEntries(
  readFileSync('.env', 'utf8').split('\n').filter(Boolean).map(l => {
    const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1)]
  }),
)

const REGISTRY = '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432'
const AGENT_URI = 'https://raw.githubusercontent.com/FrancoDuran23/celo-agent-lab/main/.well-known/agent.json'
const ABI = [{
  type: 'function', name: 'register',
  inputs: [{ type: 'string', name: 'agentURI' }],
  outputs: [{ type: 'uint256' }], stateMutability: 'nonpayable',
}]

const account = privateKeyToAccount(env.AGENT_PRIVATE_KEY)
const transport = http('https://forno.celo.org')
const wallet = createWalletClient({ account, chain: celo, transport })
const client = createPublicClient({ chain: celo, transport })

console.log('  desde   :', account.address)
console.log('  enviando register()…')

const hash = await wallet.sendTransaction({
  to: REGISTRY,
  data: encodeFunctionData({ abi: ABI, functionName: 'register', args: [AGENT_URI] }),
})
console.log('  tx hash :', hash)
console.log('  esperando confirmación…')

const receipt = await client.waitForTransactionReceipt({ hash })
console.log('  estado  :', receipt.status)
console.log('  bloque  :', receipt.blockNumber)
console.log('  gas real:', receipt.gasUsed, '→', formatEther(receipt.gasUsed * receipt.effectiveGasPrice), 'CELO')

// ERC-721 Transfer(from, to, tokenId) — tokenId is the 4th topic
const TRANSFER = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
const log = receipt.logs.find(l => l.topics[0] === TRANSFER && l.topics.length === 4)
if (log) {
  const agentId = BigInt(log.topics[3]).toString()
  console.log('')
  console.log('  ✅ AGENT ID :', agentId)
  console.log('  8004scan   : https://8004scan.io/agents/celo/' + agentId)
  console.log('  celoscan   : https://celoscan.io/nft/0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/' + agentId)
} else {
  console.log('  (no encontré el evento Transfer; revisá la tx en celoscan)')
}
console.log('  tx         : https://celoscan.io/tx/' + hash)
