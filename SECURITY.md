# Security Policy

## Supported versions

Security fixes are applied to the latest release and the active `main` branch.

## Reporting a vulnerability

Do not open a public issue containing exploits, credentials, private recordings or account data. Use GitHub private vulnerability reporting or a private Security Advisory when available. Include affected version, reproduction steps, impact and suggested mitigation.

## Security boundaries

- Mock mode is the default and performs no target-site interaction.
- Live browser execution requires an explicit `--live` flag and an operator-selected URL.
- The skill does not solve CAPTCHAs, bypass access controls or evade anti-abuse systems.
- Authorized sessions, cookies, screenshots, traces, videos, console logs and network metadata are sensitive local artifacts.

## Secret and data handling

- Keep runtime artifacts under `.runtime/`.
- Never commit API keys, passwords, cookies, storage state, account exports or real personal data.
- Use demo accounts and least-privilege permissions whenever possible.
- Run `npm run audit:release` before sharing or publishing the repository.
- Review all recordings and traces before distribution; automatic redaction is not a guarantee.

## Dependency updates

Review Playwright, Chromium and transitive dependency advisories before enabling live use in production environments.
