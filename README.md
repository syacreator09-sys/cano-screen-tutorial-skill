# CANO Screen Tutorial Skill

Automatiza tutoriales de navegador reproducibles con Playwright. Genera video WebM, screenshots, trazas, acciones cronometradas, coordenadas del cursor y diagnósticos sin guardar contraseñas en Git.

> English: clone, run `npm run init`, then use mock mode before authorizing a live browser session.

## Instalación rápida

```bash
git clone https://github.com/syacreator09-sys/cano-screen-tutorial-skill.git
cd cano-screen-tutorial-skill
npm install
npm run init
npx playwright install chromium
npm run verify
```

En Windows PowerShell 7, usa los mismos comandos o ejecuta `scripts/setup-windows.ps1`. En macOS también puedes ejecutar `scripts/setup-macos.sh`.

## Primera prueba segura

```bash
node bin/cano-screen.js doctor
node bin/cano-screen.js validate examples/image-generator.request.json
node bin/cano-screen.js capture examples/image-generator.request.json --mock
```

Mock no abre ninguna página. La salida queda en `.runtime/jobs/<project-id>/screen/`.

## Captura real

1. Configura dominios autorizados con `cano-screen init`.
2. Crea una sesión manual cuando el sitio requiera login:

```bash
node bin/cano-screen.js auth https://tool.example/login tool-demo
```

3. Referencia `.runtime/sessions/tool-demo.json` en la solicitud.
4. Ejecuta:

```bash
node bin/cano-screen.js capture request.json --live
```

Acciones disponibles: `goto`, `click`, `fill`, `type`, `select`, `press`, `waitFor`, `pause` y `screenshot`. Los selectores configurados en `redactions` permanecen visualmente difuminados durante la captura.

## Configuración repetible

Interactiva:

```bash
node bin/cano-screen.js init
```

Desde un archivo para instalar otra computadora:

```bash
node bin/cano-screen.js init --seed config/screen.example.json
```

La configuración real se guarda en `config/screen.local.json`, archivo ignorado por Git.

## Comandos

```text
cano-screen --help
cano-screen --version
cano-screen init
cano-screen doctor
cano-screen auth <url> <session-name>
cano-screen validate <request.json>
cano-screen plan <request.json>
cano-screen capture <request.json> --mock|--live
```

## Documentación

- [Configuración](docs/CONFIGURATION.md)
- [Opciones y contrato](docs/OPTIONS.md)
- [Solución de problemas](docs/TROUBLESHOOTING.md)
- [Seguridad](SECURITY.md)
- [Privacidad](PRIVACY.md)
- [Uso responsable](USAGE_POLICY.md)
- [Marca e identidad](BRAND_AND_IDENTITY.md)
- [Avisos de terceros](THIRD_PARTY_NOTICES.md)
- [Cambios](CHANGELOG.md)
- [MIT License](LICENSE)

La verificación es local. El repositorio no contiene GitHub Actions, telemetría, sesiones, credenciales ni grabaciones privadas.
