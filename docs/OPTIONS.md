# Functional Options

## Commands

| Command | Purpose | Network activity |
|---|---|---|
| `cano-screen doctor` | Check Node, platform, Playwright and runtime path | No |
| `cano-screen validate request.json` | Validate contract and privacy rules | No |
| `cano-screen plan request.json` | Normalize defaults and action order | No |
| `cano-screen capture request.json --mock` | Produce deterministic manifests without opening a site | No |
| `cano-screen auth <url> <name>` | Open a visible browser and save an authorized session | Yes, approved target only |
| `cano-screen capture request.json --live` | Execute the allow-listed Playwright flow | Yes, approved target only |

## Supported actions

- `goto`
- `click`
- `fill`
- `press`
- `waitFor`
- `screenshot`

## Outputs

- `capture-manifest.json`
- `actions.json`
- optional browser video
- optional Playwright trace
- screenshots selected by the request

## Privacy controls

- `redact: true` for sensitive fill actions.
- `redactions` for selectors that should be hidden during composition.
- `storageStatePath` for an ignored, pre-authorized session.

## Current limits

- No CAPTCHA solving or access-control bypass.
- No guarantee that every site remains compatible after UI changes.
- Visual redaction must be reviewed before publication.
- The skill captures source material; final cursor animation, zoom and branded editing belong to the composer.
