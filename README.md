# celo-agent-lab

An autonomous agent on Celo that holds funds, verifies a condition, and settles
on-chain — built for the **Agents at Work** hackathon (Celo, Aug–Sep 2026).

## Status

Day 1. The agent identity, wallet and settlement rails are being set up first;
the product surface is being defined. Commits track the work across the whole
hackathon window rather than a final-weekend push.

## Design principle

> The model extracts. The code decides.

A small language model is good at reading unstructured input and bad at
arithmetic, comparison and rule evaluation. So the model only does the first
part: it turns human input into a structured claim. Every decision that moves
money — the arithmetic, the rule checks, the settle-or-refund verdict — is
deterministic code.

This is not a style preference. It is the security boundary: a model that cannot
declare an outcome cannot be talked into declaring the wrong one.

## Rails

| | |
|---|---|
| Network | Celo mainnet |
| Agent wallet | `0xfcC0144395337D6C3F108aF42212f4C49Fc3d982` |
| Identity | ERC-8004 (`0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`) |
| Attribution | ERC-8021 tag on every transaction |
| Gas | Paid in a stablecoin via Celo fee abstraction |

## Hackathon

- Primary track: **AskBots CLI Growth** — scored on measured improvement between
  two rounds of agent review, not on starting position.
- Additional track: **Judges' Favorite**.

## Licence

MIT
