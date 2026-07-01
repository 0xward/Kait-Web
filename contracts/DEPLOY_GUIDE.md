# Deploying KaitGateway to Base Mainnet via Termux

No Hardhat, no Foundry. Just Node.js + two small scripts. `solc` here is the
pure JavaScript/WASM build of the Solidity compiler, so there's no native
toolchain to fight with on Android.

## 0. One-time setup

Install Node.js in Termux if you haven't already:

```
pkg update && pkg upgrade
pkg install nodejs git
node -v
```

You need Node 18 or newer. If `node -v` shows something older, run
`pkg install nodejs-lts` instead.

## 1. Get the contracts folder onto your phone

If you already have the KAIT project on your phone (e.g. you unzipped it),
just `cd` into `contracts/`. Otherwise transfer the `contracts/` folder
however is easiest for you (e.g. via `termux-setup-storage` + copying from
your Downloads folder, or `git clone` if it's in a repo).

```
cd kait-web/Kait-Web-main/contracts
```

## 2. Install the compile/deploy dependencies

```
npm install
```

This pulls in `solc`, `viem`, and `dotenv` -- nothing else. Should take well
under a minute.

## 3. Set up your private key

```
cp .env.example .env
```

Now edit `.env` (e.g. `nano .env`) and paste your private key after
`PRIVATE_KEY=`. This file never leaves your phone and is already excluded
from git via `.gitignore`.

**Important:** make sure the wallet behind that private key already holds a
small amount of ETH on Base mainnet to cover gas (deploying this contract
costs roughly 0.0003-0.0008 ETH depending on gas price at the time -- a few
cents to maybe a dollar). The deploy script will check your balance and
refuse to proceed if it's not enough.

## 4. Compile

```
npm run compile
```

You should see:

```
Compiling KaitGateway.sol ...
Compiled successfully.
ABI entries: 15
Bytecode size: 4812 bytes
Output written to: .../build/KaitGateway.json
```

If you see any line starting with `[ERROR]`, stop here and share it -- don't
proceed to deploy.

## 5. Deploy

```
npm run deploy
```

This will:
1. Connect to Base mainnet (`https://mainnet.base.org` by default).
2. Show your deployer address, wallet balance, and an estimated gas cost.
3. Ask you to type `deploy` to confirm before it sends anything. Nothing is
   sent until you type that.
4. Send the deployment transaction and wait for it to confirm.
5. Print the deployed contract address.

Example output:

```
Deployed successfully.
Contract address: 0x1234...abcd
Block:            18900123

Next step: put this in your frontend .env.local as:
NEXT_PUBLIC_GATEWAY_BASE=0x1234...abcd

View on BaseScan:
https://basescan.org/address/0x1234...abcd
```

## 6. Wire it up to the website

Copy that contract address into the frontend's environment. In the main
project folder (`Kait-Web-main/`, one level up from `contracts/`):

```
cd ..
cp .env.example .env.local   # if you haven't already
nano .env.local
```

Add this line (using the address you got in step 5):

```
NEXT_PUBLIC_GATEWAY_BASE=0x1234...abcd
```

Redeploy/restart the frontend (`npm run build && npm run start`, or push to
Vercel) and the dashboard + "Live on KAIT" sections will start reading real
on-chain data from your deployed contract.

## 7. (Optional) Verify the contract on BaseScan

Verifying lets anyone read the contract's source code directly on BaseScan
instead of just the bytecode -- good for trust/transparency. Go to:

```
https://basescan.org/address/<your contract address>#code
```

Click "Verify and Publish", choose:
- Compiler type: Solidity (Single file)
- Compiler version: v0.8.20
- License: MIT
- Optimization: Yes, 200 runs

Then paste the full contents of `KaitGateway.sol` and submit.

## What if I want to test on Sepolia first instead?

Totally reasonable if you want a dry run with fake ETH before mainnet. Get
free Base Sepolia ETH from a faucet (search "Base Sepolia faucet"), then run
the deploy script with:

```
BASE_RPC_URL=https://sepolia.base.org npm run deploy
```

Note the script still uses the `base` chain object internally for chain ID
purposes -- for a from-scratch testnet deploy you'd want chain ID 84532, so
if you go this route, ask and I'll give you a `baseSepolia`-targeted version
of the script.
