/**
 * Swap CELO for USDT on Celo, through the Uniswap V3 0.01% pool.
 *
 * One-off: the wallet was funded with CELO but AskBots escrows in USDT. Kept in
 * the repo because it is the only place the router address and the pool fee are
 * written down, and the next person to fund a round will need both.
 *
 * The private key is read from .env and never printed.
 */

import { createPublicClient, createWalletClient, http, parseUnits, formatUnits, erc20Abi } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { celo } from 'viem/chains'
import { readFileSync } from 'node:fs'

const AMOUNT_CELO = process.argv[2] ?? '40'
const SLIPPAGE = 0.02 // 2% floor; the quote showed none at this size

const CELO = '0x471EcE3750Da237f93B8E339c536989b8978a438'
const USDT = '0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e'
const ROUTER = '0x5615CDAb10dc425a742d643d949a7F474C01abc4'
const QUOTER = '0x82825d0554fA07f7FC52Ab63c961F330fdEFa8E8'
const FEE = 100

const env = Object.fromEntries(
  readFileSync('.env', 'utf8').split('\n').filter(Boolean).map((l) => {
    const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1)]
  }),
)

const account = privateKeyToAccount(env.AGENT_PRIVATE_KEY)
const transport = http(process.env.CELO_RPC_URL || 'https://forno.celo.org')
const pub = createPublicClient({ chain: celo, transport })
const wallet = createWalletClient({ account, chain: celo, transport })

const quoterAbi = [{
  type: 'function', name: 'quoteExactInputSingle', stateMutability: 'nonpayable',
  inputs: [{ type: 'tuple', components: [
    { name: 'tokenIn', type: 'address' }, { name: 'tokenOut', type: 'address' },
    { name: 'amountIn', type: 'uint256' }, { name: 'fee', type: 'uint24' },
    { name: 'sqrtPriceLimitX96', type: 'uint160' }] }],
  outputs: [{ name: 'amountOut', type: 'uint256' }, { name: 'sqrtPriceX96After', type: 'uint160' },
    { name: 'ticks', type: 'uint32' }, { name: 'gasEstimate', type: 'uint256' }],
}]

const routerAbi = [{
  type: 'function', name: 'exactInputSingle', stateMutability: 'payable',
  inputs: [{ type: 'tuple', components: [
    { name: 'tokenIn', type: 'address' }, { name: 'tokenOut', type: 'address' },
    { name: 'fee', type: 'uint24' }, { name: 'recipient', type: 'address' },
    { name: 'amountIn', type: 'uint256' }, { name: 'amountOutMinimum', type: 'uint256' },
    { name: 'sqrtPriceLimitX96', type: 'uint160' }] }],
  outputs: [{ name: 'amountOut', type: 'uint256' }],
}]

const amountIn = parseUnits(AMOUNT_CELO, 18)

console.log('  wallet   :', account.address)
console.log('  swapping :', AMOUNT_CELO, 'CELO -> USDT   (pool fee 0.01%)')

const before = {
  celo: await pub.getBalance({ address: account.address }),
  usdt: await pub.readContract({ address: USDT, abi: erc20Abi, functionName: 'balanceOf', args: [account.address] }),
}
console.log('  before   :', formatUnits(before.celo, 18), 'CELO /', formatUnits(before.usdt, 6), 'USDT')

const { result } = await pub.simulateContract({
  address: QUOTER, abi: quoterAbi, functionName: 'quoteExactInputSingle', account,
  args: [{ tokenIn: CELO, tokenOut: USDT, amountIn, fee: FEE, sqrtPriceLimitX96: 0n }],
})
const expected = result[0]
const floor = (expected * BigInt(Math.round((1 - SLIPPAGE) * 10000))) / 10000n
console.log('  quote    :', formatUnits(expected, 6), 'USDT   floor', formatUnits(floor, 6))

// 1. allowance
const allowance = await pub.readContract({
  address: CELO, abi: erc20Abi, functionName: 'allowance', args: [account.address, ROUTER],
})
if (allowance < amountIn) {
  console.log('  approving…')
  const h = await wallet.writeContract({ address: CELO, abi: erc20Abi, functionName: 'approve', args: [ROUTER, amountIn] })
  await pub.waitForTransactionReceipt({ hash: h })
  console.log('  approved :', h)
} else {
  console.log('  approval : already in place')
}

// 2. swap
console.log('  swapping…')
const hash = await wallet.writeContract({
  address: ROUTER, abi: routerAbi, functionName: 'exactInputSingle',
  args: [{
    tokenIn: CELO, tokenOut: USDT, fee: FEE, recipient: account.address,
    amountIn, amountOutMinimum: floor, sqrtPriceLimitX96: 0n,
  }],
})
const receipt = await pub.waitForTransactionReceipt({ hash })

const after = {
  celo: await pub.getBalance({ address: account.address }),
  usdt: await pub.readContract({ address: USDT, abi: erc20Abi, functionName: 'balanceOf', args: [account.address] }),
}

console.log('')
console.log('  status   :', receipt.status)
console.log('  tx       : https://celoscan.io/tx/' + hash)
console.log('  after    :', formatUnits(after.celo, 18), 'CELO /', formatUnits(after.usdt, 6), 'USDT')
console.log('  received :', formatUnits(after.usdt - before.usdt, 6), 'USDT')
