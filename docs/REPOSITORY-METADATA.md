# Metadatos recomendados para GitHub

## Descripción

```text
Agent-ready Playwright skill for recording reproducible browser tutorials with sessions, traces, screenshots, privacy redaction and Mac/Windows setup.
```

## Topics

```text
playwright
browser-automation
screen-recording
tutorial-generator
claude-code
codex
typescript
privacy
```

## Propósito

Este repositorio controla únicamente el navegador y genera material fuente reproducible. No crea avatares, no edita el video final y no publica contenido.

## Tecnologías

- Node.js 20+
- Playwright
- Chromium
- Playwright Trace Viewer
- JSON contracts

## Entrada

Request JSON con URL, objetivo, viewport, sesión autorizada, acciones permitidas y reglas de redacción.

## Salida

- grabación WEBM opcional;
- screenshots;
- `actions.json`;
- `capture-manifest.json`;
- trace de Playwright;
- consola y red cuando se habilitan.

## Relación con la Suite

`cano-tutorial-suite` llama este skill para producir la etapa `screen`. El compositor consume después sus videos, screenshots y acciones.
