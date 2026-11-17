// Prueba de acceso y términos: aviso desde el pie, registro como capturista pendiente,
// aprobación por el administrador maestro, permisos de capturista, aceptación de términos
// (cancelar no deja entrar; aceptar se guarda y no vuelve a pedirse).
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = path.resolve(new URL('..', import.meta.url).pathname);
const fakeFs = fs.readFileSync(path.join(root, 'tests', 'fake-fs.js'), 'utf8');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.addInitScript(fakeFs);
await page.goto('file://' + path.join(root, 'index.html'));
const usuariosJson = () => page.evaluate(() => JSON.parse(window.__files.get('usuarios.json') || '{"users":[]}'));
const resultados = {};

// 1) Aviso desde el pie de la tarjeta de acceso
await page.click('.pie [data-legal]');
resultados.avisoAbre = await page.evaluate(() => document.getElementById('dlg-legal').open);
resultados.avisoSecciones = await page.locator('#legal-contenido h4').count();
await page.click('#btn-cerrar-legal');

// 2) Carpeta de trabajo y registro (pestaña Registrarse)
await page.click('#btn-pick-root2');
await page.waitForSelector('#view-login:not([hidden])');
await page.click('#tab-registro');
await page.fill('#reg-empleado', '25164'); await page.fill('#reg-nombre', 'Carlos Hernandez');
await page.fill('#reg-pass', '1234'); await page.fill('#reg-pass2', '1234');
await page.click('#btn-registrar');
await page.waitForFunction(() => document.getElementById('login-status').textContent.includes('Debes aceptar el aviso'));
resultados.registroExigeCasilla = true;
await page.check('#reg-acepto');
await page.click('#btn-registrar');
await page.waitForFunction(() => document.getElementById('login-status').textContent.includes('pendiente de aprobación'));
resultados.registroPendiente = true;
let u = await usuariosJson();
const reg = u.users.find(x => x.name === '25164');
resultados.registroCapturistaPendiente = !!reg && reg.rol === 'capturista' && reg.estado === 'pendiente' && !!reg.terminos;

// 3) Un pendiente no puede entrar
await page.click('#tab-login');
await page.fill('#user-name', '25164'); await page.fill('#user-pass', '1234');
await page.click('#btn-login');
await page.waitForFunction(() => document.getElementById('login-status').textContent.includes('pendiente de aprobación'));
resultados.pendienteNoEntra = await page.isHidden('#view-inicio');

// 4) Maestro ADMIN: contraseña incorrecta y luego correcta; términos: cancelar y aceptar
await page.fill('#user-name', 'ADMIN'); await page.fill('#user-pass', 'otra');
await page.click('#btn-login');
await page.waitForFunction(() => document.getElementById('login-status').textContent.includes('Contraseña incorrecta'));
await page.fill('#user-pass', 'admin2026');
await page.click('#btn-login');
await page.waitForSelector('#view-terminos:not([hidden])');
await page.click('#btn-no-acepto');
await page.waitForFunction(() => document.getElementById('login-status').textContent.includes('debes aceptar'));
resultados.cancelarNoEntra = await page.isHidden('#view-inicio');
await page.fill('#user-name', 'ADMIN'); await page.fill('#user-pass', 'admin2026');
await page.click('#btn-login');
await page.waitForSelector('#view-terminos:not([hidden])');
await page.check('#acepto-terminos');
await page.click('#btn-acepto');
await page.waitForSelector('#view-inicio:not([hidden])');
u = await usuariosJson();
const maestro = u.users.find(x => x.name === 'ADMIN');
resultados.maestroAceptaTerminos = !!(maestro && maestro.terminos && maestro.terminos.version === '2026-11-17-2');
const auditoria = await page.evaluate(() => window.__files.get('registro_auditoria.jsonl') || '');
resultados.auditoriaRegistro = auditoria.includes('registro_solicitado') && auditoria.includes('terminos_aceptados');

// 5) Configuración: aprobar la solicitud pendiente como capturista
await page.click('#nav button[data-tab="config"]');
await page.waitForSelector('#pendientes-bloque:not([hidden])');
resultados.pendientesVisibles = true;
resultados.tarjetasAdminVisibles = await page.locator('[data-solo-admin]:visible').count();
await page.click('[data-aprobar="25164"]');
await page.waitForFunction(() => document.getElementById('pend-status').textContent.includes('aprobado'));
u = await usuariosJson();
resultados.aprobadoActivo = u.users.find(x => x.name === '25164').estado === 'activo';
resultados.versionEnConfig = await page.textContent('#legal-version');
resultados.aceptacionEnConfig = (await page.textContent('#legal-acepto')).includes('Tu aceptación');

// 6) Capturista: entra sin volver a aceptar y no ve las tarjetas de administrador
await page.click('#btn-salir'); await page.waitForSelector('#view-login:not([hidden])');
await page.fill('#user-name', '25164'); await page.fill('#user-pass', '1234');
await page.click('#btn-login');
await page.waitForSelector('#view-inicio:not([hidden])');
resultados.capturistaSinNuevaAceptacion = await page.isHidden('#view-terminos');
resultados.capturistaRolEnCabecera = (await page.textContent('#estado-usuario')).includes('Capturista');
await page.click('#nav button[data-tab="config"]');
resultados.capturistaSinTarjetasAdmin = (await page.locator('[data-solo-admin]:visible').count()) === 0;
resultados.capturistaSinAlta = await page.isHidden('#admin-usuarios');

// 7) Maestro vuelve a entrar sin pedir aceptación
await page.click('#btn-salir'); await page.waitForSelector('#view-login:not([hidden])');
await page.fill('#user-name', 'ADMIN'); await page.fill('#user-pass', 'admin2026');
await page.click('#btn-login');
await page.waitForSelector('#view-inicio:not([hidden])');
resultados.maestroSinNuevaAceptacion = true;

console.log(JSON.stringify({ resultados, errors }, null, 2));
await browser.close();
const fallos = Object.entries(resultados).filter(([, v]) => v === false || v === 0);
if (fallos.length || errors.length) { console.error('FALLÓ:', fallos, errors); process.exit(1); }
console.log('legal-flow OK');
