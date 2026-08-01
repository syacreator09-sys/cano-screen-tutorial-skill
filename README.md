# CANO Screen Tutorial Skill

Plan, execute and capture browser tutorials with a deterministic JSON contract. It supports a dependency-free mock mode and a Playwright live mode when `playwright` is installed.

## Quick start

```bash
npm install
npm run verify
node bin/cano-screen.js doctor
node bin/cano-screen.js validate examples/image-generator.request.json
node bin/cano-screen.js capture examples/image-generator.request.json --mock
```

## Live capture

```bash
npx playwright install chromium
node bin/cano-screen.js capture examples/image-generator.request.json --live
```

Live mode only runs allow-listed actions (`goto`, `click`, `fill`, `press`, `waitFor`, `screenshot`). Credentials and sessions belong in `.runtime/` and are never committed.

## Authorized sessions

Create a reusable browser session once, without storing passwords in Git:

```bash
node bin/cano-screen.js auth https://tool.example/login tool-demo
```

The resulting storage state is saved under `.runtime/sessions/` and can be referenced with `storageStatePath` in a request.

## Documentation

- [Functional options](docs/OPTIONS.md)
- [Security](SECURITY.md)
- [Privacy](PRIVACY.md)
- [Responsible use](USAGE_POLICY.md)
- [Brand and identity rights](BRAND_AND_IDENTITY.md)
- [Third-party notices](THIRD_PARTY_NOTICES.md)
- [Contributing](CONTRIBUTING.md)
- [MIT License](LICENSE)

Verification is local only; this repository intentionally contains no GitHub Actions workflows.
