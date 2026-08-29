# celo-agent-lab

An autonomous agent on Celo that holds funds, verifies a condition, and settles
on-chain — built for the **Agents at Work** hackathon (Celo, Aug–Sep 2026).

## Status

The allowance core is in place: the policy engine, the ledger, the Celo client,
and an MCP server that exposes the whole thing to an agent. Not yet wired to a
browser surface.

```
src/policy.js       the rules. pure, deterministic, no I/O
src/ledger.js       append-only log of every request, allowed or refused
src/celo.js         balances, fee-abstracted transfers, attribution tag
src/allowance.js    the one path from a request to a transaction
src/mcp-server.js   four tools an agent can call
```

Run it as an MCP server with `npm run mcp`. The policy lives in
`allowance.config.json` and is edited by a person — no tool can raise a limit.

## On AskBots

This project is entered in the AskBots CLI Growth track, and it is a committee
of paid agents that judges things. The resemblance is deliberate, so it is worth
saying plainly rather than leaving someone to infer it.

AskBots settled a question we would otherwise have had to argue: **do people
actually pay agents for judgement?** They do — $0.11 a review, instantly, on
Celo, before this hackathon started. That premise did not need proving, only
pointing somewhere else.

Where it points is the difference:

| | AskBots | Quorum |
|---|---|---|
| Shape | One property, many reviewers | Many candidates, one verdict |
| Question | How good is the thing I built? | Which of these should I take? |
| Who pays | The builder, for feedback | The buyer, for closure |
| Output | Five opinions to act on | One answer, and what it lost on |

AskBots ends with information you go and use. Quorum ends with a decision, which
is the part that was actually stuck. Same proven mechanic, opposite end of the
problem.

We are also on the receiving end of it: this project gets reviewed by AskBots
bots like any other entry, and what they find is what we spend the hackathon
fixing.

## Design principle

> The agent asks. The code answers.

An agent is good at working out what it needs and bad at knowing when to stop.
So it only does the first part: it turns a goal into a payment request. Every
decision that moves money — the caps, the allowlist, the budget arithmetic — is
deterministic code in `src/policy.js`, which has no clock, no network and no
disk. Same inputs, same verdict, every time.

This is not a style preference. It is the security boundary: an agent that
cannot declare an outcome cannot be talked into declaring the wrong one. There
is deliberately no tool that edits the policy.

The rules run in order, and a refusal names the one that stopped it:

```
live · window · recipient · per_payment_cap · daily_budget
```

## Rails

| | |
|---|---|
| Network | Celo mainnet |
| Agent wallet | `0xfcC0144395337D6C3F108aF42212f4C49Fc3d982` |
| Identity | ERC-8004 Agent **#9789** — [8004scan](https://8004scan.io/agents/celo/9789) |
| Attribution | ERC-8021 tag `celo_c68db23b8b72` on every transaction |
| Gas | Paid in a stablecoin via Celo fee abstraction |

## Attribution

Every transaction this project sends carries its assigned ERC-8021 tag:

```ts
import { toDataSuffix } from '@celo/attribution-tags'

await wallet.sendTransaction({ to, value, data: toDataSuffix('celo_c68db23b8b72') })
```

## Hackathon

- Primary track: **AskBots CLI Growth** — scored on measured improvement between
  two rounds of agent review, not on starting position.
- Additional track: **Judges' Favorite**.

## Licence

MIT
