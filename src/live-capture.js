import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { assertAllowedUrl } from './privacy.js';

async function applyRedactions(page, selectors) {
  if (!selectors.length) return;
  const rules = selectors.map((selector) => `${selector}{filter:blur(14px)!important;color:transparent!important;text-shadow:none!important;caret-color:transparent!important;}`).join('\n');
  await page.addStyleTag({ content: rules }).catch(() => {});
}

async function executeAction(page, action, plan, outDir) {
  if (action.type === 'goto') {
    const url = action.url ?? plan.url;
    assertAllowedUrl(url, plan.allowedDomains);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: action.timeoutMs });
    await applyRedactions(page, plan.redactions);
    return {};
  }
  if (action.type === 'pause') {
    await page.waitForTimeout(action.durationMs);
    return {};
  }
  if (action.type === 'screenshot') {
    await applyRedactions(page, plan.redactions);
    const file = `${action.id}.png`;
    await page.screenshot({ path: path.join(outDir, file), fullPage: Boolean(action.fullPage) });
    return { screenshot: file };
  }
  const locator = page.locator(action.selector);
  const box = await locator.boundingBox().catch(() => null);
  if (action.type === 'click') await locator.click({ timeout: action.timeoutMs });
  if (action.type === 'fill') await locator.fill(String(action.value ?? ''), { timeout: action.timeoutMs });
  if (action.type === 'type') {
    await locator.click({ timeout: action.timeoutMs });
    await locator.pressSequentially(String(action.value ?? ''), { delay: action.delayMs });
  }
  if (action.type === 'select') await locator.selectOption(action.value, { timeout: action.timeoutMs });
  if (action.type === 'press') await locator.press(action.value ?? 'Enter', { timeout: action.timeoutMs });
  if (action.type === 'waitFor') await locator.waitFor({ state: action.state ?? 'visible', timeout: action.timeoutMs });
  await applyRedactions(page, plan.redactions);
  return box ? { cursor: { x: Math.round(box.x + box.width / 2), y: Math.round(box.y + box.height / 2) } } : {};
}

export async function runLiveCapture(plan, outDir) {
  let chromium;
  try { ({ chromium } = await import('playwright')); }
  catch { throw new Error('playwright is not installed. Run npm install and npx playwright install chromium'); }

  assertAllowedUrl(plan.url, plan.allowedDomains);
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: plan.headless });
  const contextOptions = { viewport: plan.viewport, storageState: plan.storageStatePath ?? undefined };
  if (plan.recordVideo) contextOptions.recordVideo = { dir: path.join(outDir, 'video'), size: plan.viewport };
  const context = await browser.newContext(contextOptions);
  let traceRunning = false;
  if (plan.trace) {
    await context.tracing.start({ screenshots: true, snapshots: true, sources: true, title: plan.projectId });
    traceRunning = true;
  }
  const page = await context.newPage();
  const video = page.video();
  const logged = [];
  const consoleMessages = [];
  const pageErrors = [];
  const screenshots = [];
  page.on('console', (message) => consoleMessages.push({ type: message.type(), text: message.text() }));
  page.on('pageerror', (error) => pageErrors.push({ name: error.name, message: error.message }));

  let failure = null;
  try {
    for (const action of plan.actions) {
      const started = Date.now();
      try {
        const extra = await executeAction(page, action, plan, outDir);
        if (extra.screenshot) screenshots.push(extra.screenshot);
        logged.push({ ...action, ...extra, startMs: started, endMs: Date.now(), status: 'ok', value: action.redact ? '[REDACTED]' : action.value });
      } catch (error) {
        logged.push({ id: action.id, type: action.type, startMs: started, endMs: Date.now(), status: 'failed', error: error.message });
        failure = { actionId: action.id, message: error.message };
        break;
      }
    }
  } finally {
    if (traceRunning) await context.tracing.stop({ path: path.join(outDir, 'trace.zip') }).catch(() => {});
    await context.close();
    await browser.close();
  }

  const absoluteVideoPath = video ? await video.path().catch(() => null) : null;
  const relativeVideoPath = absoluteVideoPath ? path.relative(outDir, absoluteVideoPath).split(path.sep).join('/') : null;
  await writeFile(path.join(outDir, 'actions.json'), `${JSON.stringify({ projectId: plan.projectId, actions: logged }, null, 2)}\n`);
  await writeFile(path.join(outDir, 'diagnostics.json'), `${JSON.stringify({ consoleMessages, pageErrors }, null, 2)}\n`);
  const manifest = {
    version: '1.1',
    projectId: plan.projectId,
    mode: 'live',
    status: failure ? 'FAILED' : 'CAPTURED',
    failure,
    actionsFile: 'actions.json',
    diagnostics: 'diagnostics.json',
    trace: plan.trace ? 'trace.zip' : null,
    video: relativeVideoPath,
    screenshots
  };
  await writeFile(path.join(outDir, 'capture-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  if (failure) throw new Error(`capture failed at ${failure.actionId}: ${failure.message}`);
  return manifest;
}
