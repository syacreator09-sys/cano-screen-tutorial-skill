# Contributing

## Development requirements

- Node.js 20 or 22.
- Changes must work on Windows, macOS and Linux.
- Add or update tests before changing a contract or observable behavior.
- Keep mock mode usable without provider credentials.
- Never commit `.runtime/`, browser sessions, real account data or generated recordings.

## Workflow

1. Create a focused feature branch.
2. Run `npm test`, `npm run check` and `npm run audit:release`.
3. Update `README.md`, `SKILL.md` or `docs/OPTIONS.md` when behavior changes.
4. Open a pull request describing security, privacy and cross-platform impact.

## Commit style

Use concise conventional prefixes such as `feat:`, `fix:`, `docs:`, `test:` and `chore:`.

## Security reports

Do not disclose vulnerabilities or leaked credentials in a public issue. Use GitHub's private vulnerability reporting or Security Advisory flow when available.
