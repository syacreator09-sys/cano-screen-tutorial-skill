---
name: cano-screen-tutorial
summary: Plan and capture reproducible browser tutorials with Playwright, action logs, screenshots, traces and privacy redaction.
triggers:
  - graba un tutorial de pantalla
  - captura este proceso web
  - crea un recorrido playwright
---

# CANO Screen Tutorial

1. Validate the request with `cano-screen validate <request.json>`.
2. Use `cano-screen capture <request.json> --mock` during planning and tests.
3. Use `--live` only after the operator authorizes network interaction and confirms the target account/session.
4. Never place passwords or tokens in the request file. Use pre-authorized Playwright storage state under `.runtime/sessions/`.
5. Return the generated `capture-manifest.json`, `actions.json`, screenshots and trace path to the caller.
