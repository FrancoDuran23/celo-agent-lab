/**
 * The policy engine.
 *
 * Pure and deterministic: no clock, no network, no disk. Everything it needs
 * arrives as an argument, so the same inputs always produce the same verdict.
 *
 * This is the security boundary of the whole project. A language model turns a
 * human sentence into a PaymentRequest; from that point on nothing it says can
 * influence the outcome. The model can ask. Only these rules can answer.
 */

/** @typedef {{ address: string, amountUsd: number, reason: string }} PaymentRequest */
/** @typedef {{ rule: string, passed: boolean, detail: string }} Check */
/** @typedef {{ allowed: boolean, decidedBy: string|null, checks: Check[] }} Verdict */

const RULES = ['live', 'window', 'recipient', 'per_payment_cap', 'daily_budget']

/** Minutes since midnight for an "HH:MM" string. */
function minutesOfDay(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/**
 * Local wall-clock minutes for `at` in `timeZone`, without pulling in a date
 * library: Intl gives us the hour and minute an observer in that zone sees.
 */
function localMinutes(at, timeZone) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(at)
  const get = (t) => Number(parts.find((p) => p.type === t).value)
  return get('hour') * 60 + get('minute')
}

const usd = (n) => `$${n.toFixed(2)}`
const norm = (addr) => String(addr).toLowerCase()

/**
 * Evaluate a payment request against the policy.
 *
 * Every rule runs even after one fails, so the caller can show the whole
 * picture rather than only the first objection. `decidedBy` names the first
 * rule that refused — that is the one worth reporting.
 *
 * @param {object} args
 * @param {PaymentRequest} args.request
 * @param {object} args.policy      parsed allowance.config.json
 * @param {number} args.spentTodayUsd
 * @param {Date}   args.at          the instant to judge against
 * @returns {Verdict}
 */
export function evaluate({ request, policy, spentTodayUsd, at }) {
  const checks = []
  let decidedBy = null

  const fail = (rule) => {
    if (decidedBy === null) decidedBy = rule
  }

  // 1. Is the allowance live at all? One flag stops every future payment.
  const live = policy.revoked !== true
  checks.push({
    rule: 'live',
    passed: live,
    detail: live ? 'Allowance is live' : 'Allowance has been revoked',
  })
  if (!live) fail('live')

  // 2. Time window. An agent working at 4am is either a bug or an intruder.
  const now = localMinutes(at, policy.window.timeZone)
  const from = minutesOfDay(policy.window.from)
  const to = minutesOfDay(policy.window.to)
  const inWindow = from <= to ? now >= from && now <= to : now >= from || now <= to
  checks.push({
    rule: 'window',
    passed: inWindow,
    detail: inWindow
      ? `Inside the ${policy.window.from}–${policy.window.to} window`
      : `Outside the ${policy.window.from}–${policy.window.to} window`,
  })
  if (!inWindow) fail('window')

  // 3. Recipient allowlist. The rule that stops an agent talked into paying
  //    an address it read somewhere.
  const allowed = policy.recipients.find((r) => norm(r.address) === norm(request.address))
  checks.push({
    rule: 'recipient',
    passed: Boolean(allowed),
    detail: allowed
      ? `Recipient is on the list — ${allowed.label}`
      : `Recipient ${request.address} is not on the list`,
  })
  if (!allowed) fail('recipient')

  // 4. Per-payment cap. Bounds the damage of any single mistake.
  const underCap = request.amountUsd <= policy.perPaymentCapUsd
  checks.push({
    rule: 'per_payment_cap',
    passed: underCap,
    detail: underCap
      ? `${usd(request.amountUsd)} is under the ${usd(policy.perPaymentCapUsd)} cap`
      : `${usd(request.amountUsd)} is over the ${usd(policy.perPaymentCapUsd)} cap`,
  })
  if (!underCap) fail('per_payment_cap')

  // 5. Daily budget. Bounds the damage of many correct-looking payments.
  const wouldBe = spentTodayUsd + request.amountUsd
  const fits = wouldBe <= policy.dailyBudgetUsd
  checks.push({
    rule: 'daily_budget',
    passed: fits,
    detail: fits
      ? `Would take today to ${usd(wouldBe)} of ${usd(policy.dailyBudgetUsd)}`
      : `Would take today to ${usd(wouldBe)}, over ${usd(policy.dailyBudgetUsd)}`,
  })
  if (!fits) fail('daily_budget')

  return { allowed: decidedBy === null, decidedBy, checks }
}

export { RULES }
