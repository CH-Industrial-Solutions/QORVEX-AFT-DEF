// Flujo de la nueva distribución: acceso, inicio (tarjetas + configuración rápida), cruce,
// familia -> vistas previas de esqueletos y etiquetas, PDF, configuración (usuarios y respaldos).
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = path.resolve(new URL('..', import.meta.url).pathname);
const fakeFs = fs.readFileSync(path.join(root, 'tests', 'fake-fs.js'), 'utf8');
const baseB64 = fs.readFileSync(path.join(root, 'tests', 'base-test.xlsx')).toString('base64');
const txt = [
  '4132618C2@1@Z36@000123', '4132618C2@2@Z36@000123', '3510036C1@3@Z36@000123',
  '4132618C2@4@Z36@000456', '4069648W4E@5@Z36@000456', '4132618C2@1@Z36@000789', '',
].join('\n');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.addInitScript(fakeFs);
await page.goto('file://' + path.join(root, 'index.html'));
await page.evaluate(({ b64, txt }) => {
  window.__files.set('Base de ítems.xlsm', Uint8Array.from(atob(b64), c => c.charCodeAt(0)));
  window.__txt.set('Planned_Trans_011.txt', txt);
}, { b64: baseB64, txt });

// Acceso: primer uso -> administrador
await page.click('#btn-pick-root2');
await page.waitForSelector('#view-login:not([hidden])');
await page.fill('#user-name', 'ADMIN');
await page.fill('#user-pass', 'admin2026');
await page.click('#btn-login'); await page.waitForSelector('#view-terminos:not([hidden])'); await page.check('#acepto-terminos'); await page.click('#btn-acepto');
await page.waitForSelector('#view-inicio:not([hidden])');
const cards = await page.locator('#view-inicio .acceso-rap').count();
const etiquetasCards = (await page.locator('#view-inicio .acceso-rap b').allTextContents());
const hdr = await page.textContent('#hdr-usuario');
const cabecera = { cards, etiquetasCards, hdr, navVisible: await page.isVisible('#nav') };
const familiaDisabledAntes = await page.isDisabled('#q-familia');

// Operaciones: pegar jobs (todos de línea 1), leer routers, elegir Z36, cruzar
await page.click('#nav button[data-tab="config"]');
await page.click('#btn-read-routers'); await page.waitForTimeout(200);
await page.click('.chip[data-r="Z36"]');
await page.click('#nav button[data-tab="operaciones"]');
await page.click('#plan-paste');
await page.keyboard.insertText('1-123\t9280\n1-456\t5788\n1-999999\t5000');
await page.waitForTimeout(100);
await page.click('#nav button[data-tab="inicio"]');
await page.click('#btn-cruce'); await page.waitForTimeout(400);
const cruceResumen = (await page.textContent('#load-result')).replace(/\s+/g, ' ');
const avisoLineaMixta = await page.locator('#load-result .aviso').count();

// Inicio: familias disponibles, línea automática
await page.click('#nav button[data-tab="inicio"]');
const familias = await page.locator('#q-familia option').allTextContents();
const lineaAuto = await page.inputValue('#q-linea');
await page.selectOption('#q-familia', 'KIT SEQ OP 480');
await page.waitForTimeout(200);
const qStatus = await page.textContent('#q-status');

// Esqueletos: vista previa y PDF
await page.click('.acceso-rap[data-go="esqueletos"]');
const paginas = await page.locator('#esq-preview .pagina').count();
const pivotFilas = await page.locator('#esq-pivot tr').count();
await page.click('#btn-imprimir-esq'); await page.waitForTimeout(700);
const pdfEsq = await page.textContent('#esq-status');
const pdfPiv = pdfEsq;

// Etiquetas
await page.click('#nav button[data-tab="inicio"]');
await page.click('.acceso-rap[data-go="etiquetas"]');
const etiquetas = await page.locator('#etq-preview .etq').count();
await page.click('#btn-imprimir-etq'); await page.waitForTimeout(400);
const pdfEtq = await page.textContent('#etq-status');

// Configuración rápida: facilidad 12 y aplicar
await page.click('#nav button[data-tab="inicio"]');
await page.selectOption('#q-capacidad', '12');
await page.click('#q-aplicar'); await page.waitForTimeout(200);
const aplicado = await page.textContent('#q-status');

// Configuración: alta de operador y respaldo
await page.click('#nav button[data-tab="config"]');
await page.fill('#alta-empleado', '25170'); await page.fill('#alta-nombre', 'Operador Uno');
await page.fill('#alta-pass', '4321');
await page.click('#btn-alta'); await page.waitForTimeout(200);
const altaStatus = await page.textContent('#usr-status');
const usuarios = await page.locator('#usuarios-rows tr').count();
await page.click('#btn-respaldar'); await page.waitForTimeout(200);
const respaldo = await page.textContent('#resp-status');

// Salir y entrar como operador: no ve el alta
await page.click('#btn-salir'); await page.waitForSelector('#view-login:not([hidden])');
await page.fill('#user-name', '25170'); await page.fill('#user-pass', '4321');
await page.click('#btn-login'); await page.waitForSelector('#view-terminos:not([hidden])'); await page.check('#acepto-terminos'); await page.click('#btn-acepto'); await page.waitForSelector('#view-inicio:not([hidden])');
const hdrOperador = await page.textContent('#hdr-usuario');
await page.click('#nav button[data-tab="config"]');
const altaOculta = await page.isHidden('#admin-usuarios');

console.log(JSON.stringify({
  cabecera, familiaDisabledAntes, cruceResumen, avisoLineaMixta, familias, lineaAuto, qStatus,
  paginas, pivotFilas, pdfEsq, pdfPiv, etiquetas, pdfEtq, aplicado, altaStatus, usuarios, respaldo,
  hdrOperador, altaOculta, errors,
}, null, 2));
await browser.close();
