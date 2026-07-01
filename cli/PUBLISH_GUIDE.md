# Publishing @kait/cli to npm

This CLI has already been built, tested, and validated (compile + install +
every command runs). What's left is only the parts that need your own npm
account -- Claude can't hold or use your npm credentials, so this is the
part you run yourself.

## 0. One-time: create an npm account (skip if you already have one)

Go to https://www.npmjs.com/signup and create an account. Free.

If you want the exact package name `@kait/cli` (scoped under `@kait`), the
first time you publish anything under that scope, npm creates the
organization for you automatically -- no separate step needed.

## 1. Log in from Termux

```
cd kait-web/Kait-Web-main/cli
npm login
```

This opens a browser-based login flow (or asks for username/password + OTP
depending on your npm account settings). Follow the prompts.

Verify it worked:

```
npm whoami
```

Should print your npm username.

## 2. Install and sanity-check

```
npm install
node bin/kait.js --version
node bin/kait.js --help
```

You should see `1.0.0` and the full command list.

## 3. Publish

Because the package name starts with `@kait/`, it's a "scoped" package.
Scoped packages default to private (paid) unless you explicitly mark them
public:

```
npm publish --access public
```

That's it. Once it finishes, anyone in the world can run:

```
npm install -g @kait/cli
```

## 4. Verify it's live

```
npm view @kait/cli
```

Or check the page directly: https://www.npmjs.com/package/@kait/cli

## Publishing updates later

Bump the version in `package.json` first (npm refuses to publish the same
version twice):

```
npm version patch   # 1.0.0 -> 1.0.1, for bug fixes
npm version minor    # 1.0.0 -> 1.1.0, for new features
npm publish --access public
```

## If the contract address changes

The CLI's default gateway addresses live in `src/config.js`
(`DEFAULT_GATEWAY`). Right now they're empty strings, which means every user
runs `kait init` and pastes in the gateway address manually (you'll show it
to them, or it lives in your docs). Once you've deployed `KaitGateway.sol`
(see `../contracts/DEPLOY_GUIDE.md`), you can either:

- Keep asking users to paste it during `kait init` (simplest, no republish
  needed), or
- Hardcode it into `DEFAULT_GATEWAY.base` in `src/config.js`, bump the
  version, and republish -- then `kait init` will suggest it automatically.
