import { createPublicClient, http, encodeFunctionData, formatEther } from 'viem'
import { celo } from 'viem/chains'

const client = createPublicClient({ chain: celo, transport: http('https://forno.celo.org') })
const REGISTRY = '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432'
const FROM = '0xfcC0144395337D6C3F108aF42212f4C49Fc3d982'
const URI = 'https://raw.githubusercontent.com/FrancoDuran23/celo-agent-lab/main/.well-known/agent.json'

const ABI = [{ type:'function', name:'register', inputs:[{type:'string',name:'agentURI'}], outputs:[{type:'uint256'}], stateMutability:'nonpayable' }]
const data = encodeFunctionData({ abi: ABI, functionName: 'register', args: [URI] })

const [gas, gasPrice, bal] = await Promise.all([
  client.estimateGas({ account: FROM, to: REGISTRY, data }),
  client.getGasPrice(),
  client.getBalance({ address: FROM }),
])
const cost = gas * gasPrice
const ARS = 112.51
console.log(`  gas estimado : ${gas}`)
console.log(`  gasPrice     : ${Number(gasPrice)/1e9} gwei`)
console.log(`  COSTO        : ${formatEther(cost)} CELO   =  AR$ ${(Number(formatEther(cost))*ARS).toFixed(2)}`)
console.log(`  balance      : ${formatEther(bal)} CELO`)
console.log(`  queda        : ${formatEther(bal - cost)} CELO`)
console.log(`  agentURI     : ${URI}`)
