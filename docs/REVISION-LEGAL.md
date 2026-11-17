# Revisión legal — QORVEX Sequence

**Titular:** Ing. Carlos Alberto Hernández Hernández · CH Industrial Solutions
**Contacto:** charliealberth290116@outlook.es · 8115377033 · General Escobedo, Nuevo León, México
**Versión de los términos:** 2026-11-17

## Estado

El texto de Términos y privacidad es una base razonable para uso interno. **No sustituye la revisión de un abogado**, sobre todo para uso fuera de CH Industrial Solutions.

## Puntos a confirmar antes de uso externo

1. **Aviso de privacidad formal (LFPDPPP):** si la aplicación se usa con personal o datos de otra empresa, se requiere un aviso de privacidad formal, con la información que exige la ley (finalidades, datos, derechos ARCO, medios para ejercerlos, transferencias y cambios al aviso). El texto de la aplicación es de uso interno.
2. **Titularidad del software:** la aplicación se declara desarrollada de forma independiente por el titular, fuera de horario laboral y con equipo propio. Conviene conservar evidencia (fechas de los archivos, respaldos, facturas del equipo).
3. **Figura de CH Industrial Solutions:** confirmar si es una persona física con actividad empresarial o una persona moral. Si es una empresa aparte, el uso por CH debe ir por licencia escrita del titular.
4. **Licencia de uso para terceros:** si otra empresa usará la aplicación, debe firmarse una licencia (alcance, plazo, soporte, responsabilidad y terminación).
5. **Marca:** los logotipos y wallpapers de CH Industrial Solutions son de la marca. El paquete de branding indica que el emblema es una aproximación visual; no debe usarse en productos de otros clientes sin acuerdo.
6. **Bibliotecas de terceros:** jsPDF y jspdf-autotable (MIT) y SheetJS (Apache 2.0) requieren conservar sus avisos, que están en `LICENSES.md`.
7. **Usuario maestro ADMIN:** la contraseña (`admin2026`) está en el código fuente. Quien tenga el archivo `js/auth.js` puede verla. Si el riesgo lo requiere, conviene cambiarla por equipo o quitar el maestro al entregar a un cliente.
8. **Registro público:** las cuentas nuevas quedan pendientes y las aprueba un administrador. Conviene definir quién es administrador en cada empresa cliente.
9. **Responsabilidad:** la limitación de responsabilidad del texto debe revisarse frente al contrato de servicio que se firme con cada cliente.

## Dónde está el texto

- En la aplicación: pantalla de aceptación al entrar, enlace "Términos y privacidad" en el pie del acceso y tarjeta Legal y privacidad en Configuración.
- Fuente única: `js/legal.js`. Para cambios, editar ese archivo, subir `LEGAL_VERSION` y regenerar con `python3 tools/build.py`.
