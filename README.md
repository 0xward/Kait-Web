# KAIT

```text
██╗  ██╗ █████╗ ██╗████████╗
██║ ██╔╝██╔══██╗██║╚══██╔══╝
█████╔╝ ███████║██║   ██║   
██╔═██╗ ██╔══██║██║   ██║   
██║  ██╗██║  ██║██║   ██║   
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝   ╚═╝  
```

### The Gateway That Pays You

**Monetize your APIs with decentralized micro-payments. Deploy via CLI. Get paid in crypto per request.**

[![License: MIT](https://img.shields.io/badge/License-MIT-a89bb8.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/@kait/cli.svg)](https://www.npmjs.com/package/@kait/cli)
[![GitHub stars](https://img.shields.io/github/stars/kait/kait-web)](https://github.com/kait/kait-web)

---

##  Overview

**KAIT** is a decentralized API monetization gateway that enables developers to turn any API into a revenue stream in minutes. No backend setup, no payment gateway integration, no bullshit.

- **Pay-per-use pricing**: Users pay per API call, not monthly subscriptions
- **Smart contract escrow**: Automatic, trustless payments via blockchain
- **Micro-transactions**: Economically viable payments as low as $0.001
- **Global infrastructure**: Distributed network with 99.9% uptime SLA

---

## ⚡ Quick Start

### Install the CLI

```bash
npm install -g @kait/cli
```

### Initialize Your First API

```bash
kait init
kait deploy ./my-api
```

That's it. Your API is now live and monetized.

---

## 🚀 Features

### 🔌 Zero-Backend Deployment
Deploy any API endpoint with a single command. KAIT handles authentication, payment processing, and rate limiting automatically.

### 💰 Crypto-Native Payments
Accept payments in USDC, ETH, or other cryptocurrencies. Smart contracts handle escrow and automatic payouts.

### 📊 Real-Time Analytics
Monitor earnings, API calls, and user activity through a beautiful dashboard or CLI.

### 🔐 Secure & Trustless
No centralized custody. Funds are held in smart contract escrow and released automatically upon successful API calls.

### 🌍 Global Edge Network
Your API is automatically distributed across our edge network for low-latency access worldwide.

### 🛠️ Developer-First
Built by developers, for developers. CLI-first workflow, comprehensive docs, and open-source core.

---

## 🔄 How It Works

```text
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│  Developer  │─────▶│    KAIT      │◀─────│    User     │
│             │      │   Gateway    │      │             │
│  Deploy API │      │              │      │  Pay & Call │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                            ▼
                   ┌────────────────┐
                   │ Smart Contract │
                   │   Escrow       │
                   └────────────────┘
```

1. **Deploy**: Developer uploads API via CLI
2. **Register**: API metadata stored on IPFS, pricing on-chain
3. **Pay**: User deposits crypto to smart contract
4. **Call**: User calls API with authentication token
5. **Earn**: Developer receives payment automatically

---

## 📦 Installation

### Via npm (Recommended)

```bash
npm install -g @kait/cli
```

### Via Terminal (macOS/Linux)

```bash
curl -fsSL https://kait.dev/install.sh | bash
```

### Via GitHub

```bash
git clone https://github.com/kait/kait-web.git
cd kait-web
npm install
npm run build
```

---

## 💻 Usage

### Initialize a New API

```bash
kait init
```

This will create a `kait.config.json` file:

```json
{
  "name": "my-awesome-api",
  "version": "1.0.0",
  "endpoint": "https://your-server.com/api",
  "price_per_call": 0.001,
  "currency": "USDC",
  "description": "My monetized API endpoint"
}
```

### Deploy Your API

```bash
kait deploy
```

### Check Earnings

```bash
kait stats
```

### Withdraw Funds

```bash
kait withdraw
```

---

## 🌟 Example

Here's a real example of monetizing an AI image generation API:

```bash
$ kait deploy ./ai-image-api

✓ Uploading to IPFS...
✓ Registering to Smart Contract...
✓ API Live: https://kait.dev/api/ai-image-xyz123
✓ API Key: kait_live_abc456def789

Your API is now monetized!
Price: $0.001 per call
Network: Base Mainnet

Share this endpoint with your users:
https://kait.dev/api/ai-image-xyz123
```

---

## 📊 Dashboard

Access your developer dashboard at [https://app.kait.dev](https://app.kait.dev)

- View real-time earnings
- Monitor API call volume
- Manage API keys
- Withdraw funds
- Analytics & insights

---

## 🔧 Configuration

### Environment Variables

```bash
export KAIT_API_KEY="your_api_key"
export KAIT_NETWORK="base-mainnet"  # or "base-sepolia"
export KAIT_WALLET_ADDRESS="0x..."
```

### Supported Networks

- **Base Mainnet** (Production)
- **Base Sepolia** (Testnet)
- **Arbitrum One** (Coming soon)
- **Optimism** (Coming soon)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/kait/kait-web.git
cd kait-web
npm install
npm run dev
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Website**: [https://kait.dev](https://kait.dev)
- **Documentation**: [https://docs.kait.dev](https://docs.kait.dev)
- **Dashboard**: [https://app.kait.dev](https://app.kait.dev)
- **GitHub**: [https://github.com/kait/kait-web](https://github.com/kait/Kait-Web)
- **Discord**: [https://discord.gg/kait](https://discord.gg/kait)
- **Twitter**: [@kait_dev](https://twitter.com/kait_dev)

---

## 🛡️ Security

If you discover a security vulnerability, please email security@kait.dev instead of using the issue tracker.

---

## 👥 Authors

- **KAIT Research Team** - [kait.dev](https://kait.dev)

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Viem](https://viem.sh/)
- [Wagmi](https://wagmi.sh/)

---

```text
Made by KAIT Research • MIT License • 2026
```
