// Abre index.html directamente desde el disco (file://), como lo hará el usuario en Edge.
import { createRequire } from 'node:module';
import path from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = path.resolve(new URL('..', import.meta.url).pathname);
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('file://' + path.join(root, 'index.html'));
const btn = await page.textContent('#btn-pick-root2');
console.log({ btn, errors });
await browser.close();
