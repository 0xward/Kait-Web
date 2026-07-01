# @kait/cli

Deploy and manage pay-per-call APIs on [KAIT](https://kait-web.vercel.app) — the
decentralized API monetization gateway on Base.

```
npm install -g @kait/cli
kait init
kait deploy
```

## Commands

| Command | What it does |
|---|---|
| `kait init` | One-time setup: wallet private key, network, gateway contract address. Saved to `~/.kait/config.json` (never sent anywhere, never leaves your machine). |
| `kait deploy` | Register a new API for monetization. Prompts for name, endpoint, payment token (USDC or ETH), and price per call, then sends an on-chain transaction. |
| `kait list` | List all APIs you've registered on the configured gateway, with live call/volume stats read directly from the contract. |
| `kait withdraw` | Withdraw your accumulated earnings (`--token usdc` or `--token eth`, defaults to USDC). |
| `kait pause <apiId>` | Pause an API so it stops accepting payments. |
| `kait resume <apiId>` | Resume a paused API. |
| `kait status` | Show your connected wallet, network, ETH balance, and gateway address. |

Run `kait <command> --help` for the full option list of any command.

## How it works

Every command that changes state (`deploy`, `withdraw`, `pause`, `resume`)
sends a real on-chain transaction to the `KaitGateway` smart contract using
the private key you provided during `kait init`. Read-only commands
(`list`, `status`) just call the contract's public view functions — no gas,
no signature needed.

Your private key is stored locally in `~/.kait/config.json` with restrictive
file permissions (`0600`). It is never transmitted anywhere except as a
transaction signature sent directly to the Base RPC node.

## Requirements

- Node.js 18 or newer
- A wallet with a small amount of ETH on Base (for gas) — deploying,
  withdrawing, pausing, and resuming each cost a small transaction fee
- The `KaitGateway` contract address for your network. If you're running
  your own instance, see
  [`contracts/DEPLOY_GUIDE.md`](https://github.com/0xward/Kait-Web/blob/main/contracts/DEPLOY_GUIDE.md)
  in the main repo for how to deploy it yourself.

## License

MIT
