# Spec — a committee that ends the deliberation

## The problem

When two options are close, the cost of deciding exceeds the difference between
them. You lose a Saturday to five browser tabs and pick the one you were
looking at when you got tired.

The known answer to this is to stop deciding — flip a coin, take the first
acceptable option. It works, and people who do it report being happier months
later. It has one flaw: **you cannot defend a coin flip afterwards.** Nobody
accepts "I chose it because it came up heads", least of all the person who
signs off on the spend.

So: a procedure that ends the deliberation *and* leaves a reason.

## What this is

Five assessors read the same candidates, each measuring one axis. Deterministic
code turns their measurements into a ranking. What comes back is a verdict, the
arithmetic behind it, and the dissent — every axis the winner lost.

**It does not sell the best decision. It sells the end of the decision.**

## What it is not

Not a recommendation engine, and not an opinion. The assessors never score. They
report measured values; `src/scoring.js` does the arithmetic against weights
that were committed before any candidate was seen.

## The committee

Each assessor has one axis, one declared bias, and one blind spot. The bias is
published, and that is the point: an assessor that declares which way it errs
can be discounted. One that claims neutrality cannot be audited — and in a
system where somebody pays, "I'm neutral" is exactly what a bought judge says.

| Assessor | Measures | Declared bias | Blind spot |
|---|---|---|---|
| **Price** | True unit cost, tax and shipping included | Would wait three weeks to save 15% | Does not care when it arrives or whether it works |
| **Delivery** | Arrival window, origin, in-country returns | Distrusts anything shipping from far away | Indifferent to quality if it arrives tomorrow |
| **Quality** | The gap between stated specs and review text | Weights one bad review above twenty good ones | Price does not exist for it |
| **Seller** | Reputation, returns, listing age | Punishes anything new, even when it is fine | Judges who sells, not what is sold |
| **Risk** | Warranty, return policy, cost when it fails | Catastrophises; assumes failure | The ordinary case, which is most cases |

Five, not four, so votes cannot tie.

## Why it can be trusted

The corruption surface is obvious: assessors are paid, so what stops a supplier
buying the outcome? Five defences, in order of operations.

1. **The rubric is sealed first.** Canonicalised, hashed and anchored on-chain
   *before* any candidate is seen. Weights cannot be retuned to fit a winner
   because the commitment is already public and dated by a block. This is the
   same move this hackathon makes on its own judging: publish the query before
   the entries arrive.

2. **Candidates are blinded.** Supplier identity is stripped, including the name
   repeated inside free text. Aliases are salted per round, so the same supplier
   is not always first.

3. **Listing text is data, never instruction.** Text that tries to instruct an
   assessor is detected and **recorded against the supplier** rather than
   silently stripped. An attempted bribe is the strongest signal on the page and
   burying it would throw away the best evidence the system produces.

4. **Assessors report, code scores.** A bought assessor can lie about a number,
   and a lie about a number is checkable against the source. What it cannot do
   is write persuasive prose and move a ranking, because prose is not an input
   to the arithmetic.

5. **The dissent ships with the verdict.** Every axis the winner lost, always.
   A verdict that only reports the case for the winner is advertising.

Not in scope yet: assessors staking against their own scoring. That is the
strongest defence and it is for after the hackathon.

## Who pays

**The buyer.** The buyer is the one whose Saturday is bleeding; the supplier
does not suffer your indecision. Pricing is cents, because the alternative is
staring at tabs for free — at ten dollars you go back to comparing out of spite.

Supplier-pays was considered and rejected: it is workable the way a testing
laboratory is workable (you pay to be tested, not to pass, and the failures get
published too) but it points the incentive at the wrong person for a product
whose value is *closure*.

## Committees are saved and reused

The five above are a starting point, not the product. A user reweights them for
what they actually buy, names it, and keeps it. The second decision costs
nothing to set up, which is the whole point for a product whose value is not
spending time.

**A saved committee is a sealed rubric, so its hash is its identity.** That is
what makes it worth sharing rather than merely convenient:

- Two people running `0x41c8d09f…` are provably applying the same criteria at
  the same weights — not "the same rubric" in the sense of both having read the
  same blog post.
- Forking someone's committee produces a different hash, so a modified copy can
  never pass as the original.
- A committee that gets used widely becomes a published standard for a category
  of decision, and its standing comes from the records it produced, not from
  whoever wrote it.

Weights are editable and axes can be added. Extraction instructions stay fixed:
a weight is a number in a sealed document and can be audited, an instruction in
prose cannot, and prose is where a rigged assessment would hide.

Personalisation is allowed; hiding it is not. Running five times with five
committees leaves five records.

## Where the money moves

On Celo mainnet, in a stablecoin, with gas paid in the same token via CIP-64 fee
abstraction — so nobody needs to hold CELO to use this.

The payment carries the record:

```
tx.data = [ transfer call ] [ 32-byte record hash ] [ ERC-8021 suffix ]
```

The attribution suffix stays last: the leaderboard query matches the ERC-8021
marker at the end of `tx.data` with no trailing wildcard, so anything appended
after it makes the transaction invisible. Verified against the published query.

One transaction pays for the work and dates the reasoning. There is no window in
which a record exists but is not yet anchored.

## What closes and what does not

| Target | Settles onchain? |
|---|---|
| APIs, data feeds, inference (x402) | Yes, today |
| Amazon retail, direct | No |
| AliExpress, direct | No |
| Amazon via gift card (Bitrefill, USDC) | Yes, but through an intermediary |

The committee deliberates over any set of candidates. The purchase completes
only where the merchant settles onchain; everywhere else the verdict is handed
back rather than pretending the loop closed.

AWS shipped Bedrock AgentCore Payments with Coinbase and Stripe in 2026 — agents
buying with stablecoins over x402, starting with APIs and paywalled content and
extending to merchant payments. The services path is not the small version. It
is the finished one.

## Surfaces

- **MCP server** — the assessors and the verdict, callable by any agent. This is
  the reviewable property for the AskBots Growth track.
- **Web page** — the same committee for a person, with the deliberation visible.
- **WebMCP** — the page's own tools, exposed to a browser agent. Support both
  `navigator.modelContext` and `document.modelContext`: the spec moved to
  `document` and Chrome deprecated `navigator` in 150, while the origin trial
  still ships it.

## Built

```
src/canonical.js   deterministic JSON and sha256 — without it a hash commits nothing
src/rubric.js      seal, validate, hash a rubric before any candidate is seen
src/blind.js       strip supplier identity, including from free text
src/injection.js   detect and record attempts to instruct an assessor
src/scoring.js     the arithmetic, and the dissent
src/record.js      the decision record and its commitment
src/celo.js        balances, fee-abstracted transfer, commitment anchoring
src/policy.js      spending limits — commoditised by ERC-7715, kept as substrate
src/ledger.js      append-only log, refusals included
src/mcp-server.js  four tools; none of them can edit the policy
```

## Next

- The five assessors: extraction per axis, reporting measurements only
- The landing page and the deliberation view
- The WebMCP layer
- Round one on AskBots — early, rough is fine, it is a wider gap to close
