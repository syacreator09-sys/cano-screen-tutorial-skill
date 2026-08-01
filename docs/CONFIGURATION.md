# Configuración

## Asistente interactivo

```bash
cano-screen init
```

Preguntas:

1. Resolución predeterminada.
2. Navegador visible o headless.
3. Grabación WebM.
4. Trace de Playwright.
5. Dominios autorizados.
6. Selectores que deben difuminarse.
7. Timeout por acción.
8. Velocidad de escritura.

La respuesta se guarda en `config/screen.local.json` con permisos locales y queda excluida de Git.

## Instalación repetible

```bash
cano-screen init --seed config/screen.example.json
```

Modifica el archivo seed antes de usarlo en otra computadora. No incluyas cookies ni contraseñas.

## Dominios autorizados

Cuando `allowedDomains` contiene valores, cada navegación `goto` debe pertenecer al dominio o a uno de sus subdominios. Ejemplo:

```json
{"allowedDomains":["example.com"]}
```

Permite `example.com` y `app.example.com`, pero bloquea otros dominios.

## Sesiones

```bash
cano-screen auth https://example.com/login example-demo
```

La sesión se guarda en `.runtime/sessions/example-demo.json`. El archivo puede permitir acceso a la cuenta y debe tratarse como una contraseña. Bórralo cuando expire o deje de usarse.

## Redacción visual

`redactions` acepta selectores CSS. Se aplica blur, texto transparente y cursor invisible a los elementos coincidentes. Esta medida reduce el riesgo, pero el operador debe revisar video, screenshots y trace antes de compartirlos.

## Solicitud

```json
{
  "version":"1.1",
  "projectId":"demo-image-tool",
  "url":"https://example.com",
  "objective":"Mostrar un proceso autorizado",
  "storageStatePath":".runtime/sessions/example-demo.json",
  "actions":[
    {"id":"open","type":"goto","url":"https://example.com"},
    {"id":"prompt","type":"type","selector":"#prompt","value":"Producto en estudio","delayMs":35},
    {"id":"style","type":"select","selector":"#style","value":"photo"},
    {"id":"generate","type":"click","selector":"#generate"},
    {"id":"wait","type":"pause","durationMs":5000},
    {"id":"result","type":"screenshot"}
  ]
}
```
