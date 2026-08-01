# AGENTS.md

This repository is `@cano/screen-tutorial-skill`.

1. Read `README.md`, `SECURITY.md`, `PRIVACY.md`, `USAGE_POLICY.md` and `SKILL.md` before changing behavior.
2. Use Node.js 20+ and portable paths via `node:path` and `node:os`.
3. Never hard-code macOS or Windows user paths.
4. Keep real browser calls disabled unless the operator passes an explicit live flag.
5. Preserve JSON contracts and add tests before changing them.
6. Do not commit private sessions, API keys, recordings, traces, media outputs or local profiles.
7. Do not add GitHub Actions workflows; verification runs locally.
8. Run `npm run verify` before completion.
