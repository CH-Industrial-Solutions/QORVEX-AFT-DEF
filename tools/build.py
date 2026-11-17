#!/usr/bin/env python3
"""Genera js/qorvex.js: un solo script clásico (funciona con doble clic en Edge, sin servidor).

Une los módulos js/*.js en el orden de dependencias, quita las líneas 'import' y la palabra
'export'. Editar los archivos fuente y volver a ejecutar:  python3 tools/build.py
"""
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ORDEN = ['logos.js', 'core.js', 'store.js', 'base.js', 'outputs.js', 'txt-source.js', 'audit.js', 'auth.js', 'legal.js', 'app.js']

partes = [
    '// QORVEX Sequence - archivo único (funciona con doble clic en Edge, sin servidor).\n'
    '// Generado por tools/build.py a partir de js/*.js. No editar a mano: editar los fuentes y regenerar.\n'
]
for nombre in ORDEN:
    texto = (RAIZ / 'js' / nombre).read_text(encoding='utf-8')
    texto = re.sub(r'^import [^;]*;\s*$', '', texto, flags=re.M)
    texto = re.sub(r'^export\s+(?=(async\s+)?(function|const|let|class)\b)', '', texto, flags=re.M)
    partes.append(f'\n// ---- js/{nombre} ----\n' + texto.strip() + '\n')

salida = RAIZ / 'js' / 'qorvex.js'
salida.write_text(''.join(partes), encoding='utf-8')
print(f'js/qorvex.js generado ({salida.stat().st_size} bytes)')
