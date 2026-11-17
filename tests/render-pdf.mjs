// Genera los PDF de la familia KIT SEQ OP 480 y los guarda para revisar el diseño.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = path.resolve(new URL('..', import.meta.url).pathname);
const out = process.argv[2];
const fakeFs = fs.readFileSync(path.join(root, 'tests', 'fake-fs.js'), 'utf8');
const baseB64 = fs.readFileSync(path.join(root, 'tests', 'base-test.xlsx')).toString('base64');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.addInitScript(fakeFs);
await page.goto('file://' + path.join(root, 'index.html'));
await page.evaluate(b64 => { window.__files.set('Base de ítems.xlsm', Uint8Array.from(atob(b64), c => c.charCodeAt(0))); }, baseB64);
const txt = ['4132618C2@1@Z36@000123','4132618C2@2@Z36@000123','3510036C1@3@Z36@000123','4132618C2@4@Z36@000456','4069648W4E@5@Z36@000456','4132618C2@1@Z36@000789'].join('\n');
await page.evaluate(t => window.__txt.set('Planned_Trans_011.txt', t), txt);
await page.evaluate(async () => {
  // Entrada directa a la app (sin pasar por la pantalla de inicio) para generar PDF
  state.root = await window.showDirectoryPicker({ mode: 'readwrite' });
  state.user = 'tester';
  state.config = { capacidad: 8, linea: '2' };
  state.selected = new Set(['Z36']);
  state.txtDir = await state.root.getDirectoryHandle('TXT');
  state.txtFiles = await (async () => { const f = []; for await (const [n, h] of state.txtDir.entries()) if (h.kind === 'file') f.push({ name: n, file: await h.getFile() }); return f; })();
  await cargarBase(true);
  state.plan = parsePlanPaste('1-123\t9280\n1-456\t5788\n1-789\t5001\n1-100\t5002\n1-101\t5003\n1-102\t5004\n1-103\t5005\n1-104\t5006\n1-105\t5007\n1-106\t5008').rows;
  const matches = [];
  await findJobsAcrossFiles(state.txtFiles.map(f => ({ name: f.name, open: () => f.file.stream() })), { routers: state.selected, jobs: new Set(state.plan.map(r => r.jobKey)) }, r => matches.push(r));
  state.planeado = buildPlaneado(state.plan, matches, state.bdata).planeado.map(r => ({ ...r, familia: familyOf(r.item, state.bdata) }));
  state.familia = 'KIT SEQ OP 480';
  state.resumen = buildResumen(state.planeado, state.familia, state.bdata);
  state.pivot = buildPivot(state.resumen);
  state.bloques = buildEsqueletoBlocks(state.resumen, 8, '2', state.familia);
});
const uris = await page.evaluate(() => ({
  esq: pdfEsqueletos(state.bloques, { familia: state.familia, linea: '2' }).output('datauristring'),
  pivot: pdfPivot(state.pivot, { familia: state.familia, linea: '2' }).output('datauristring'),
  etq: pdfEtiquetas(paginarEtiquetas(buildEtiquetas(state.resumen, 8))).output('datauristring'),
}));
for (const [k, v] of Object.entries(uris)) fs.writeFileSync(path.join(out, k + '.pdf'), Buffer.from(v.split(',')[1], 'base64'));
console.log('ok', Object.keys(uris));
await browser.close();
