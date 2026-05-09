# MobileMoneyBridge-Relayer

> Open-source Node.js middleware that listens to M-Pesa, MTN MoMo, and Airtel Money webhooks and triggers corresponding Soroban smart contract settlements on the Stellar network.

[![CI](https://github.com/Stellar-Project-Hub/MobileMoneyBridge-Relayer/actions/workflows/ci.yml/badge.svg)](https://github.com/Stellar-Project-Hub/MobileMoneyBridge-Relayer/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-6DA55F?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## Overview

MobileMoneyBridge-Relayer is the off-chain middleware layer of the MobileMoneyBridge stack. It:

- **Receives** signed webhook callbacks from M-Pesa, MTN MoMo, and Airtel Money.
- **Normalises** provider-specific payloads into a unified internal format.
- **Relays** settlement instructions to the [MobileMoneyBridge-Contracts](https://github.com/Stellar-Project-Hub/MobileMoneyBridge-Contracts) Soroban contracts via the Stellar SDK.

## Directory Structure

```
MobileMoneyBridge-Relayer/
├── src/
│   ├── webhooks/          # Provider-specific webhook handlers
│   │   ├── mpesa.ts
│   │   ├── mtn.ts
│   │   └── airtel.ts
│   ├── relayer/           # Core relay logic (webhook → Stellar)
│   │   └── index.ts
│   ├── stellar/           # Stellar SDK / Soroban contract client
│   │   └── settlementClient.ts
│   ├── middleware/        # Express middleware (auth, validation)
│   │   └── verifySignature.ts
│   ├── types/             # Shared TypeScript interfaces
│   │   └── index.ts
│   ├── app.ts             # Express app setup
│   └── index.ts           # Entry point
├── tests/                 # Jest test suites
├── .github/
│   └── workflows/
│       └── ci.yml         # ESLint + Jest CI pipeline
├── .env.example
├── package.json
├── tsconfig.json
├── jest.config.json
├── CONTRIBUTING.md
└── README.md
```

## Prerequisites

- Node.js >= 20
- npm >= 10

## Setup

```bash
cp .env.example .env
# Fill in your keys in .env
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Test

```bash
npm test
```

## Lint

```bash
npm run lint
```

## Webhook Endpoints

| Method | Path | Provider |
|---|---|---|
| POST | `/webhooks/mpesa` | M-Pesa STK Push |
| POST | `/webhooks/mtn` | MTN MoMo |
| POST | `/webhooks/airtel` | Airtel Money |
| GET | `/health` | Health check |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).
