# Privacy

## Default behavior

This project has no analytics, advertising identifiers, background telemetry, or maintainer-operated cloud service. Mock mode runs locally and does not contact target websites.

## Live browser mode

Live mode opens the URL selected by the operator and sends normal browser traffic directly to that website. The maintainers do not receive that traffic. The target website and any services embedded in it may process data according to their own privacy policies.

## Local sensitive data

Authorized Playwright sessions, cookies, local storage, traces, screenshots, recordings, console logs and network metadata can contain personal or confidential information. They are stored under `.runtime/` by default and are excluded from Git.

Delete local runtime data when it is no longer required:

```bash
rm -rf .runtime
```

```powershell
Remove-Item -Recurse -Force .runtime
```

## Recording and redaction

Automatic redaction reduces risk but cannot guarantee that every private value is hidden. Review the recording, screenshots, trace and action log before sharing or publishing them.

## Operator responsibilities

Only record accounts and systems you are authorized to access. Obtain consent when another person's information, communications, image or work may appear. Follow the target site's terms, privacy notices and applicable law.
