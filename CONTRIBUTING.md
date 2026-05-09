# Contributing to MobileMoneyBridge-Relayer

Thank you for contributing! This project is part of the Stellar ecosystem and welcomes async contributors of all experience levels.

## Table of Contents

- [Getting Started](#getting-started)
- [Directory Structure](#directory-structure)
- [Development Workflow](#development-workflow)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Issue Labels](#issue-labels)
- [Style Guide](#style-guide)

---

## Getting Started

1. **Fork** the repository: `https://github.com/Stellar-Project-Hub/MobileMoneyBridge-Relayer`
2. **Clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/MobileMoneyBridge-Relayer.git
   cd MobileMoneyBridge-Relayer
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Copy environment variables**:
   ```bash
   cp .env.example .env
   ```
5. **Run tests** to verify your setup:
   ```bash
   npm test
   ```

---

## Directory Structure

```
src/
├── webhooks/          # One file per provider — parse raw callbacks into WebhookPayload
├── relayer/           # Orchestrates the webhook → Stellar settlement flow
├── stellar/           # Stellar SDK wrapper and Soroban contract client
├── middleware/        # Express middleware (signature verification, rate limiting)
├── types/             # Shared TypeScript interfaces (WebhookPayload, SettlementRequest, …)
├── app.ts             # Express app and route registration
└── index.ts           # Server entry point
tests/                 # Jest tests mirroring src/ structure
```

Adding a new provider? Create `src/webhooks/<provider>.ts`, export a `parse<Provider>Payload` function and a handler, then register the route in `src/app.ts`.

---

## Development Workflow

1. Pick an open issue and comment to claim it.
2. Branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. Make changes. Keep commits atomic.
4. Verify locally:
   ```bash
   npm run lint
   npm test
   ```
5. Push and open a Pull Request against `main`.

---

## Submitting a Pull Request

- Reference the issue: `Closes #N`.
- All CI checks must pass.
- One maintainer approval required to merge.

---

## Issue Labels

| Label | Meaning |
|---|---|
| `good first issue` | Suitable for first-time contributors |
| `enhancement` | New feature or improvement |
| `bug` | Something is broken |
| `security` | Security-sensitive change |
| `documentation` | Docs-only change |
| `testing` | Test coverage improvement |
| `help wanted` | Maintainers welcome community input |

---

## Style Guide

- All code in TypeScript with strict mode enabled.
- No `any` types without a comment explaining why.
- Every exported function must have a JSDoc comment.
- Write at least one Jest test per new handler or utility function.
- Run `npm run lint` before committing.
