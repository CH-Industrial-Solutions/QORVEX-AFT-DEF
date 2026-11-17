// Usuarios locales de la carpeta de trabajo.
// Archivo: usuarios.json en la carpeta de trabajo. Contraseñas guardadas como
// PBKDF2-SHA256 con sal aleatoria; nunca en texto plano.
// Roles: 'admin' (administrador) y 'capturista'. El registro crea capturistas pendientes;
// un administrador los aprueba y les asigna rol. Sirve para trazabilidad (registro de auditoría);
// no es un control de acceso fuerte frente a quien tenga acceso a la carpeta.

const ITER = 210000;
const enc = new TextEncoder();

// Usuario maestro: acceso total. Sus credenciales son fijas y no se cambian desde la app.
export const MASTER = { name: 'ADMIN', pass: 'admin2026', nombre: 'Administrador maestro' };

function toHex(buf) { return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join(''); }
function fromHex(hex) { return Uint8Array.from(hex.match(/../g).map(h => parseInt(h, 16))); }

export async function hashPassword(password, saltHex) {
  const salt = saltHex ? fromHex(saltHex) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' }, key, 256);
  return { salt: toHex(salt), hash: toHex(bits), iterations: ITER };
}

export async function verifyPassword(password, record) {
  const { hash } = await hashPassword(password, record.salt);
  return hash === record.hash;
}

async function readUsers(dirHandle) {
  try {
    const fh = await dirHandle.getFileHandle('usuarios.json');
    const data = JSON.parse(await (await fh.getFile()).text());
    return data.users || [];
  } catch (e) {
    if (e.name === 'NotFoundError') return [];
    throw e;
  }
}

async function writeUsers(dirHandle, users) {
  const fh = await dirHandle.getFileHandle('usuarios.json', { create: true });
  const w = await fh.createWritable();
  await w.write(JSON.stringify({ users }, null, 2));
  await w.close();
}

// Roles antiguos ('operador') pasan a 'capturista'.
function normRol(rol) { return rol === 'admin' ? 'admin' : 'capturista'; }

function rolDe(users, rec) {
  if (rec.maestro) return 'admin';
  if (rec.rol) return normRol(rec.rol);
  return users[0] === rec ? 'admin' : 'capturista';
}

function estadoDe(rec) { return rec.estado || 'activo'; }

function esMaestro(username) { return username.trim().toUpperCase() === MASTER.name; }

// Garantiza que el maestro aparezca en usuarios.json (para aceptación de términos y auditoría).
async function asegurarMaestro(dirHandle) {
  const users = await readUsers(dirHandle);
  if (users.some(u => u.maestro)) return;
  users.push({ name: MASTER.name, nombre: MASTER.nombre, rol: 'admin', estado: 'activo', maestro: true, created: new Date().toISOString() });
  await writeUsers(dirHandle, users);
}

// Lista para la pantalla de Configuración (sin contraseñas).
export async function listUsers(dirHandle) {
  const users = await readUsers(dirHandle);
  return users.map(u => ({
    name: u.name, nombre: u.nombre || u.name, rol: rolDe(users, u), estado: estadoDe(u),
    maestro: !!u.maestro, created: u.created || '',
  }));
}

// Crea un usuario. El registro público usa rol 'capturista' y estado 'pendiente'.
export async function createUser(dirHandle, username, password, nombre, rol = 'capturista', estado = 'activo') {
  const name = username.trim();
  if (!name) throw new Error('Escribe el No. de empleado.');
  if (esMaestro(name)) throw new Error('Ese usuario está reservado.');
  if (password.length < 4) throw new Error('La contraseña debe tener al menos 4 caracteres.');
  const users = await readUsers(dirHandle);
  if (users.some(u => u.name.toLowerCase() === name.toLowerCase())) throw new Error('Ese usuario ya existe.');
  const rolFinal = normRol(rol);
  const rec = await hashPassword(password);
  const nombreFinal = (nombre || name).trim();
  users.push({ name, nombre: nombreFinal, rol: rolFinal, estado, ...rec, created: new Date().toISOString() });
  await writeUsers(dirHandle, users);
  return { name, nombre: nombreFinal, rol: rolFinal, estado };
}

// El administrador aprueba una solicitud pendiente y le asigna rol.
export async function aprobarUsuario(dirHandle, username, rol) {
  const users = await readUsers(dirHandle);
  const rec = users.find(u => u.name.toLowerCase() === username.trim().toLowerCase());
  if (!rec) throw new Error('Ese No. de empleado no existe.');
  rec.estado = 'activo';
  rec.rol = normRol(rol);
  await writeUsers(dirHandle, users);
  return { name: rec.name, rol: rec.rol };
}

export async function resetPassword(dirHandle, username, password) {
  if (esMaestro(username)) throw new Error('La contraseña del administrador maestro no se cambia desde la aplicación.');
  if (password.length < 4) throw new Error('La contraseña debe tener al menos 4 caracteres.');
  const users = await readUsers(dirHandle);
  const rec = users.find(u => u.name.toLowerCase() === username.trim().toLowerCase());
  if (!rec) throw new Error('Ese No. de empleado no existe.');
  Object.assign(rec, await hashPassword(password));
  await writeUsers(dirHandle, users);
  return rec.name;
}

export async function login(dirHandle, username, password) {
  if (esMaestro(username)) {
    if (password !== MASTER.pass) throw new Error('Contraseña incorrecta.');
    await asegurarMaestro(dirHandle);
    return { name: MASTER.name, nombre: MASTER.nombre, rol: 'admin' };
  }
  const users = await readUsers(dirHandle);
  const rec = users.find(u => u.name.toLowerCase() === username.trim().toLowerCase());
  if (!rec) throw new Error('Usuario no encontrado. Regístrate o pide a un administrador que te dé de alta.');
  if (estadoDe(rec) === 'pendiente') throw new Error('Tu cuenta está pendiente de aprobación por un administrador.');
  if (!(await verifyPassword(password, rec))) throw new Error('Contraseña incorrecta.');
  return { name: rec.name, nombre: rec.nombre || rec.name, rol: rolDe(users, rec) };
}

// Aceptación de términos: se guarda en el mismo registro del usuario ({ version, fecha }).
export async function terminosDe(dirHandle, username) {
  const users = await readUsers(dirHandle);
  const rec = users.find(u => u.name.toLowerCase() === username.trim().toLowerCase());
  return (rec && rec.terminos) || null;
}

export async function aceptarTerminos(dirHandle, username, version) {
  const users = await readUsers(dirHandle);
  const rec = users.find(u => u.name.toLowerCase() === username.trim().toLowerCase());
  if (!rec) throw new Error('Usuario no encontrado.');
  rec.terminos = { version, fecha: new Date().toISOString() };
  await writeUsers(dirHandle, users);
  return rec.terminos;
}
