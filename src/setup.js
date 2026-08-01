import { readFile } from 'node:fs/promises';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { normalizeScreenConfig, saveScreenConfig } from './config.js';

function yes(value, fallback) {
  const text = String(value ?? '').trim().toLowerCase();
  if (!text) return fallback;
  return ['y', 'yes', 's', 'si', 'sí', '1', 'true'].includes(text);
}

function presetViewport(value) {
  const key = String(value ?? '').trim().toLowerCase();
  if (['2', '1080p', '1920x1080'].includes(key)) return { width: 1920, height: 1080 };
  if (['3', 'vertical', '1080x1920', '9:16'].includes(key)) return { width: 1080, height: 1920 };
  return { width: 1440, height: 900 };
}

export async function runScreenSetup({ seedFile, outputFile = 'config/screen.local.json' } = {}) {
  if (seedFile) {
    const seed = JSON.parse(await readFile(seedFile, 'utf8'));
    return saveScreenConfig(seed, outputFile);
  }

  const rl = readline.createInterface({ input, output });
  try {
    output.write('\nCANO Screen Tutorial setup\n');
    output.write('No escribas contraseñas, cookies ni tokens en este asistente.\n\n');
    const viewport = presetViewport(await rl.question('Resolución predeterminada [1=1440x900, 2=1920x1080, 3=1080x1920] (1): '));
    const headless = yes(await rl.question('¿Ejecutar capturas automáticas sin mostrar el navegador? [S/n]: '), true);
    const recordVideo = yes(await rl.question('¿Grabar video WebM? [S/n]: '), true);
    const trace = yes(await rl.question('¿Guardar trace de Playwright para depuración? [S/n]: '), true);
    const domainsText = await rl.question('Dominios autorizados separados por coma (vacío = validar en cada solicitud): ');
    const extraRedactions = await rl.question('Selectores extra para ocultar, separados por coma (opcional): ');
    const timeoutText = await rl.question('Timeout por acción en milisegundos (30000): ');
    const typingText = await rl.question('Retraso entre teclas en milisegundos (35): ');
    const config = normalizeScreenConfig({
      viewport,
      headless,
      recordVideo,
      trace,
      allowedDomains: domainsText.split(',').map((v) => v.trim()).filter(Boolean),
      redactions: extraRedactions.split(',').map((v) => v.trim()).filter(Boolean),
      actionDefaults: {
        timeoutMs: Number(timeoutText) || 30000,
        typingDelayMs: Number(typingText) || 35
      }
    });
    return saveScreenConfig(config, outputFile);
  } finally {
    rl.close();
  }
}
