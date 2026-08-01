# Opciones funcionales

## Comandos

| Comando | Propósito | Red |
|---|---|---|
| `cano-screen init` | Crear configuración local mediante preguntas | No |
| `cano-screen init --seed file.json` | Replicar configuración en otro equipo | No |
| `cano-screen doctor` | Revisar Node, Playwright, Chromium y configuración | No |
| `cano-screen validate request.json` | Validar contrato y privacidad | No |
| `cano-screen plan request.json` | Aplicar defaults y ordenar acciones | No |
| `cano-screen capture request.json --mock` | Crear manifiestos sin abrir un sitio | No |
| `cano-screen auth <url> <name>` | Guardar una sesión autorizada | Sí |
| `cano-screen capture request.json --live` | Ejecutar el recorrido aprobado | Sí |

## Acciones

- `goto`: navegar a una URL autorizada.
- `click`: hacer clic y registrar centro del elemento.
- `fill`: reemplazar el contenido del campo.
- `type`: escribir con retraso entre teclas.
- `select`: elegir una opción.
- `press`: enviar una tecla.
- `waitFor`: esperar estado de un elemento.
- `pause`: esperar una duración fija para ritmo o generación.
- `screenshot`: guardar captura normal o `fullPage`.

## Salidas

- `capture-manifest.json`
- `actions.json`
- `diagnostics.json`
- video WebM opcional
- `trace.zip` opcional
- screenshots solicitados

## Privacidad

- `redact: true` es obligatorio en acciones sensibles.
- `redactions` aplica blur persistente por selector CSS.
- `allowedDomains` evita navegación fuera de objetivos autorizados.
- `storageStatePath` carga una sesión local ignorada por Git.

## Límites

- No resuelve CAPTCHAs ni evade controles.
- Los sitios pueden cambiar selectores o bloquear automatización.
- La redacción automática requiere revisión humana.
- La edición final, zooms y branding pertenecen al compositor.
