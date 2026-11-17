# QORVEX Sequence

Aplicación web de una sola página para generar esqueletos, pivots y etiquetas de la familia QORVEX. Se abre con doble clic en `index.html` en Microsoft Edge (o Chrome). No requiere servidor ni conexión a internet.

Titular: Ing. Carlos Alberto Hernández Hernández · CH Industrial Solutions.
Derechos de autor, licencias, privacidad y términos: ver la sección **Términos y privacidad** dentro de la aplicación, `LICENSES.md` y `docs/REVISION-LEGAL.md`.

## Estructura

| Ruta | Contenido |
|---|---|
| `index.html` | Pantallas, estilos enlazados y scripts. |
| `js/*.js` | Módulos fuente: `core`, `store`, `base`, `outputs`, `txt-source`, `audit`, `auth`, `legal`, `app`, `logos`. |
| `js/qorvex.js` | Archivo único generado a partir de `js/*.js`. Es lo que carga `index.html`. |
| `js/vendor/` | Bibliotecas de terceros (ver `LICENSES.md`). |
| `css/` | Tema oscuro (`theme.css`), fondo (`fondo.css`), marca (`marca.css`) y tema claro (`tema-claro.css`). |
| `tools/build.py` | Genera `js/qorvex.js`. |
| `tests/` | Pruebas en Node y Playwright. |
| `docs/REVISION-LEGAL.md` | Pendientes de revisión legal antes de uso externo. |

## Uso en la PC

1. Abrir `index.html` con doble clic.
2. Elegir la carpeta de trabajo. Ahí se guardan `usuarios.json`, `configuracion.json`, `registro_auditoria.jsonl`, respaldos, impresiones y la `Base de ítems.xlsm`.
3. Entrar con el usuario maestro **ADMIN** (acepta los términos al primer ingreso) o crear una cuenta con **Registrarse**.
4. El TXT de planeación se lee desde la carpeta TXT (por defecto `TXT` dentro de la carpeta de trabajo).

## Acceso y roles

- **Usuario maestro:** `ADMIN` (contraseña fija del sistema). Tiene acceso total. No aparece en la lista de solicitudes y su contraseña no se cambia desde la app.
- **Administrador:** aprueba solicitudes, da de alta usuarios, asigna rol, restablece contraseñas y administra formato, carpetas y respaldos.
- **Capturista:** opera Inicio, Operaciones, Bases de datos, Reportes, esqueletos y etiquetas. Ve Routers y Legal en Configuración, pero no las tarjetas de administrador.
- **Registrarse:** crea una cuenta de capturista en estado pendiente. No puede entrar hasta que un administrador la apruebe y le asigne rol.

## Mantenimiento

- Editar siempre los módulos de `js/` (no `js/qorvex.js`).
- Regenerar el archivo único después de cada cambio:
  ```
  python3 tools/build.py
  ```
- Cambios visuales o de estilo: `css/`.
- Cambios en textos legales: editar `js/legal.js`. Al cambiar `LEGAL_VERSION`, todos los usuarios vuelven a aceptar los términos al entrar.
- Al cambiar archivos, subir el parámetro `?v=` de `index.html` (y de los scripts) para que el navegador no use la copia anterior.
- Pruebas (requieren Node y Playwright con Chromium):
  ```
  node tests/core.test.mjs
  node tests/txt-source.test.mjs
  node tests/auth.test.mjs
  node tests/flow-inicio.mjs
  node tests/legal-flow.mjs
  ```

## Trazabilidad

- **Registro de auditoría** (`registro_auditoria.jsonl`): cada inicio de sesión, aceptación de términos, cambio de configuración, cruce, impresión, alta de usuario, respaldo y cierre de sesión se guarda con fecha, hora y usuario.
- **Aceptación de términos** (en `usuarios.json`, dentro del registro de cada usuario): versión y fecha.
- **Respaldos**: se crean automáticamente al cambiar configuración o usuarios, y también manualmente desde Configuración.
- **Versiones**: la versión de los términos aparece en Configuración, en el apartado Legal y privacidad. Los cambios de código se registran en el historial del proyecto con fecha.

## Seguridad y datos

- Las contraseñas se guardan con PBKDF2-SHA256 (210,000 iteraciones, sal aleatoria). No se guardan en texto plano.
- Los datos viven solo en la carpeta de trabajo del equipo. La aplicación no envía información a internet.
- La autenticación protege el uso cotidiano y la trazabilidad; no sustituye los permisos del sistema operativo sobre la carpeta de trabajo.
