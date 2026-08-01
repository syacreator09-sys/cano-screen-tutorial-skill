# Solución de problemas

## `playwright is not installed`

```bash
npm install
npx playwright install chromium
cano-screen doctor
```

## Chromium no aparece instalado

Ejecuta `npx playwright install chromium`. En equipos corporativos puede ser necesario permitir la descarga o configurar un proxy autorizado.

## La sesión expiró

Borra el archivo correspondiente en `.runtime/sessions/` y ejecuta nuevamente `cano-screen auth <url> <name>`.

## El dominio fue bloqueado

Agrega únicamente el dominio que controlas o estás autorizado a demostrar mediante `cano-screen init`. No uses una lista global como `*`.

## Un selector dejó de funcionar

La interfaz del sitio cambió. Ejecuta primero una prueba visible con una cuenta demo, actualiza el selector y corre `cano-screen validate request.json` antes del siguiente live run.

## El video no aparece

Playwright guarda el video cuando se cierra el contexto. Revisa `capture-manifest.json`. Si `recordVideo` está desactivado, vuelve a ejecutar `cano-screen init` o agrega `"recordVideo": true` a la solicitud.

## El trace contiene datos privados

No lo compartas. Elimina `.runtime/jobs/<project-id>/screen/trace.zip`, corrige `redactions` y repite la captura. Un trace puede contener DOM, red y estado visual aunque el video parezca limpio.

## CAPTCHA o verificación adicional

Detén la automatización y completa la verificación manualmente cuando el servicio lo permita. El skill no intenta resolver, evadir ni automatizar CAPTCHAs o controles de acceso.
