// Valida la lógica central contra la hoja Planeado del Excel original (familia KIT SEQ OP 480).
import fs from 'node:fs';
import { buildPivot, buildResumen, buildEsqueletoBlocks, buildEtiquetas, parsePlanPaste, familyOf } from '../js/core.js';
const data = JSON.parse(fs.readFileSync(new URL('./planeado_ref.json', import.meta.url), 'utf8'));
const bdata = new Map(data.bdata.map(r => [r.item, { descripcion: r.desc, familia: r.familia }]));
const planeado = data.planeado.map(r => ({ ...r, familia: r.familia }));
const resumen = buildResumen(planeado, 'KIT SEQ OP 480', bdata);
const piv = buildPivot(resumen);
const r1 = piv.filas.find(f => f.item === '4132618C2');
console.log('pivot 4132618C2 =', r1?.cantidad, '(esperado 128) total =', piv.total, '(esperado 389)');
const bloques = buildEsqueletoBlocks(resumen, 8, 'Linea 2', 'KIT SEQ OP 480');
console.log('bloques', bloques.length, 'jobs en bloque 1', bloques[0].jobs.length, 'total', bloques.reduce((a, b) => a + b.total, 0));
const et = buildEtiquetas(resumen, 8);
console.log('etiquetas', et.length, et[0].texto, '|', et[8].texto);
const plan = parsePlanPaste('2-520202\t9280\n1-416441\t5788\n\n3-000123\n');
console.log('plan', plan.rows.map(r => [r.linea, r.jobKey, r.lineset]), plan.errors);
console.log('familia sin asignar', familyOf('XXX', bdata));
