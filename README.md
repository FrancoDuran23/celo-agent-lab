# celo-agent-lab

A committee of assessors that ends a deliberation and leaves a reason —
built for the **Agents at Work** hackathon (Celo, Aug–Sep 2026).

The product is the record, not the verdict — the verdict is one field in it.
The rubric is sealed before any candidate is seen; assessors report
measurements and never scores; the dissent ships with the verdict. The record
carries who asked, under which sealed rubric, what was measured, what won, and
what the losing argument was. It is hashed, and the hash rides in the payment
transaction — one transaction pays for the work and dates the reasoning.

## How it works

Seal. The rubric is committed before a single candidate is read. This is what
stops the weights being retuned to fit a winner.

Blind. Identity is stripped before an assessor sees a candidate. This is what
stops an assessor favouring the supplier who paid without anyone writing an
instruction to do so.

Measure. Assessors report a measured value per axis and do not score. This is
what stops a bought assessor moving the ranking with persuasive prose.

Score. Those measurements become a ranking under the rubric that was already
sealed. This is the defence that survives a corrupted assessor: a lie about a
number is checkable against the listing; prose is not an input.

Dissent. The axes on which the winner did not win ship with the verdict,
always. This is what stops a verdict that only reports the case for the winner
from burying the losing argument a buyer needs in order to disagree on purpose.

Record. The decision is assembled into one document: who asked, under which
sealed rubric, what was measured, what won, and what the losing argument was.
This is what answers the case no spending limit covers — an agent that stayed
inside its cap and still chose badly.

Anchor. The record is hashed and the hash rides in the payment transaction.
This is what dates the reasoning: one transaction pays for the work and puts
the commitment on-chain.

## Files

```
src/blind.js            blind the candidates before an assessor sees them
src/canonical.js        canonical serialisation and hashing
src/celo.js             everything that touches the chain
src/committee.js        the one path from a set of candidates to a signed verdict
src/injection.js        listing text is data; it is never an instruction
src/mcp-committee.js    the committee over stdio, for a local agent
src/mcp-http.js         the committee over HTTP, so a reviewer not on this machine can connect
src/mcp-tools.js        the committee's tools, shared by the stdio and HTTP entries
src/record.js           the decision record
src/rubric.js           what is being measured, and how much each axis is worth
src/scoring.js          scoring; deterministic, and deliberately dull
```

Earlier iteration, kept for history:

```
src/allowance.js        policy, ledger and chain wired together
src/ledger.js           append-only spending log
src/mcp-server.js       the allowance, exposed to an agent over MCP
src/policy.js           the policy engine
```

## Connect to it

The committee is deployed and reachable. Point any MCP client at:

```
https://quorum-committee.celo-agent-lab.workers.dev/mcp
```

Streamable HTTP, and stateless — every tool takes what it needs as an argument
and the server stores nothing between calls. A client can be answered by a
different edge isolate on every request and never notice, which is the only way
a multi-call flow survives on an edge runtime. `GET /mcp` returns 405 on
purpose: there is no server-initiated stream to hold open.

The caller carries the sealed rubric between calls. That is the trade, and it is
the right one: a document they can read, hash and anchor, rather than a handle to
memory on our side that they cannot inspect.

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

### Round 1

Baseline, n=10: Q2 (ease of connection) 7.3, Q7 (does what it sets out to do)
6.2.

Reviewers found:

- no output schemas
- `audit_record.record` undescribed
- a GET-only client sees a wall
- `deliberate` did not act on injection findings
- README described a different project

Round 2 addresses each of these.

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
| Live MCP endpoint | `https://quorum-committee.celo-agent-lab.workers.dev/mcp` |
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
