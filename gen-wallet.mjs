// Generates a fresh Celo agent wallet.
// The private key is written straight to .env and NEVER printed.
// Only the public address is shown.
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { existsSync, writeFileSync } from 'node:fs'

if (existsSync('.env')) {
  console.error('.env already exists — refusing to overwrite it.')
  console.error('Delete or rename it first if you really want a new wallet.')
  process.exit(1)
}

const privateKey = generatePrivateKey()
const { address } = privateKeyToAccount(privateKey)

writeFileSync(
  '.env',
  [
    `AGENT_PRIVATE_KEY=${privateKey}`,
    `AGENT_ADDRESS=${address}`,
    'CELO_RPC_URL=https://forno.celo.org',
    '',
  ].join('\n'),
  { mode: 0o600 },
)

console.log('')
console.log('  Wallet created. Private key written to .env (git-ignored).')
console.log('')
console.log('  ADDRESS:', address)
console.log('')
console.log('  Share the address freely. Never share .env.')
console.log('')
