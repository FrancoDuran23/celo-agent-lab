#!/usr/bin/env node
/**
 * The allowance, exposed to an agent over MCP.
 *
 * Four tools, and the split between them is the point: an agent can look at
 * the rules and ask for a payment, but there is no tool that changes a limit.
 * The policy is edited by a person, in allowance.config.json. Handing an agent
 * the ability to raise its own budget would undo everything underneath.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { Allowance } from './allowance.js'

const allowance = new Allowance()

const server = new McpServer({
  name: 'celo-agent-allowance',
  version: '0.1.0',
})

const json = (value) => ({
  content: [{ type: 'text', text: JSON.stringify(value, null, 2) }],
})

server.registerTool(
  'allowance_status',
  {
    title: 'Allowance status',
    description:
      'What is left to spend today, the caps in force, the recipients you may pay, and whether the allowance is live. Read this before asking for a payment.',
    inputSchema: {},
  },
  async () => json(allowance.status()),
)

server.registerTool(
  'estimate_payment',
  {
    title: 'Estimate a payment',
    description:
      'What a payment would cost in fees, before anything is signed. Does not evaluate the policy and does not spend.',
    inputSchema: {
      address: z.string().describe('Recipient address, 0x-prefixed'),
      amountUsd: z.number().positive().describe('Amount in stablecoin units'),
    },
  },
  async ({ address, amountUsd }) => {
    const { gas, gasPrice, feeCurrency } = await allowance.estimate({ address, amountUsd })
    return json({
      gas: gas.toString(),
      gasPrice: gasPrice.toString(),
      feeCostRaw: (gas * gasPrice).toString(),
      feeCurrency,
      note: 'Gas is paid in the fee currency, not in CELO.',
    })
  },
)

server.registerTool(
  'request_payment',
  {
    title: 'Request a payment',
    description:
      'Ask the allowance to pay. The policy decides; you do not. Returns the verdict, every rule that was checked, and a transaction hash when it was allowed. A refusal names the rule that stopped it — read that rule rather than retrying the same request.',
    inputSchema: {
      address: z.string().describe('Recipient address, 0x-prefixed'),
      amountUsd: z.number().positive().describe('Amount in stablecoin units'),
      reason: z.string().describe('Why this payment is needed. Recorded in the ledger.'),
    },
  },
  async ({ address, amountUsd, reason }) => {
    const { verdict, txHash } = await allowance.request({ address, amountUsd, reason })
    return json({
      allowed: verdict.allowed,
      decidedBy: verdict.decidedBy,
      checks: verdict.checks,
      txHash,
      explorer: txHash ? `https://celoscan.io/tx/${txHash}` : null,
    })
  },
)

server.registerTool(
  'spending_log',
  {
    title: 'Spending log',
    description:
      'Every request made against this allowance, allowed or refused, with the rule that decided each one.',
    inputSchema: {
      limit: z.number().int().positive().max(200).optional().describe('How many entries, newest first'),
    },
  },
  async ({ limit }) => json(allowance.log({ limit: limit ?? 50 })),
)

await server.connect(new StdioServerTransport())
