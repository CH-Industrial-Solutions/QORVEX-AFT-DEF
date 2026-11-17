// Texto legal de QORVEX Sequence (CH Industrial Solutions). Es el único lugar donde se edita:
// la pantalla de aceptación, el aviso de Términos y privacidad y la tarjeta Legal usan este archivo.
// Cuando cambie el texto, sube LEGAL_VERSION: los usuarios volverán a aceptar al entrar.

export const LEGAL_VERSION = '2026-11-17-2';

export const LEGAL_TITULAR = {
  empresa: 'CH Industrial Solutions',
  titular: 'Ing. Carlos Alberto Hernández Hernández',
  correo: 'charliealberth290116@outlook.es',
  telefono: '8115377033',
  ubicacion: 'General Escobedo, Nuevo León, México',
};

export const LEGAL_SECCIONES = [
  {
    titulo: 'Derechos de autor',
    parrafos: [
      '© 2026 Ing. Carlos Alberto Hernández Hernández, titular de CH Industrial Solutions. Todos los derechos reservados.',
      'QORVEX Sequence (código fuente, diseño de interfaz, textos, plantillas de impresión, logotipos y marca de CH Industrial Solutions) está protegido por la Ley Federal del Derecho de Autor y por los tratados internacionales aplicables.',
      'Queda prohibido copiar, modificar, distribuir, sublicenciar, vender o descompilar la aplicación, total o parcialmente, sin autorización escrita del titular.',
      'Propiedad y uso autorizado: QORVEX Sequence fue desarrollado de forma independiente por Ing. Carlos Alberto Hernández Hernández, titular de CH Industrial Solutions, fuera de su horario laboral y con equipo y conexión propios. Su uso por personas o empresas distintas a su titular está permitido mediante licencia escrita otorgada por el titular.',
    ],
  },
  {
    titulo: 'Licencias de terceros',
    parrafos: [
      'La aplicación incluye bibliotecas de terceros. Sus avisos de licencia completos se conservan en el archivo LICENCIAS.md del proyecto.',
      'jsPDF 2.5.1: © 2010-2021 James Hall y colaboradores. Licencia MIT.',
      'jspdf-autotable 3.8.2: © 2024 Simon Bengtsson. Licencia MIT.',
      'SheetJS (xlsx) 1.15.0: © SheetJS LLC. Licencia Apache 2.0.',
      'Las fuentes Helvetica y Symbol del PDF son fuentes estándar de los lectores PDF; la aplicación no incorpora archivos de fuente de terceros.',
    ],
  },
  {
    titulo: 'Protección de datos personales',
    parrafos: [
      'Responsable del tratamiento: CH Industrial Solutions, a través de su titular Ing. Carlos Alberto Hernández Hernández. Contacto: correo charliealberth290116@outlook.es, teléfono 8115377033, General Escobedo, Nuevo León, México.',
      'Datos personales que trata la aplicación: número de empleado, nombre, contraseña (solo se guarda cifrada) y el registro de acciones de cada usuario (fecha, hora, usuario y tipo de acción).',
      'Finalidad: controlar el acceso a la aplicación y saber qué usuario realizó cada cambio, cruce o impresión.',
      'Almacenamiento: los datos se guardan en la carpeta de trabajo elegida en el equipo donde se usa la aplicación. La aplicación no envía datos personales a servidores ni a terceros.',
      'Derechos de acceso, rectificación, cancelación y oposición: el usuario puede solicitarlos al contacto indicado. El administrador puede dar de alta usuarios, aprobar solicitudes y restablecer contraseñas dentro de la aplicación.',
      'El uso de estos datos se limita a la operación interna de la empresa.',
    ],
  },
  {
    titulo: 'Privacidad y confidencialidad',
    parrafos: [
      'La información que se carga o genera en la aplicación (archivos TXT de planeación, Base de ítems, jobs, routers, secuencias, pivots, esqueletos y etiquetas en PDF) es confidencial y de uso interno de la operación.',
      'Quien tiene acceso debe abstenerse de divulgarla o de usarla para fines distintos a su trabajo.',
      'La aplicación no se conecta a internet ni comparte información con terceros. Las impresiones y PDF se guardan solo dentro de la carpeta de trabajo.',
    ],
  },
  {
    titulo: 'Autenticación y control de usuarios',
    parrafos: [
      'Cada persona entra con su No. de empleado y una contraseña personal. Existe un usuario administrador maestro (ADMIN) con acceso total.',
      'El registro crea cuentas de capturista en estado pendiente. Solo un administrador puede aprobarlas y asignarles rol (capturista o administrador).',
      'Las contraseñas se guardan con PBKDF2-SHA256, 210,000 iteraciones y sal aleatoria de 16 bytes. Nunca se guardan en texto plano.',
      'Solo un administrador puede dar de alta usuarios, aprobar solicitudes y restablecer contraseñas. Cada usuario debe aceptar estos términos antes de usar la aplicación.',
      'Cada usuario es responsable de su contraseña y no debe compartirla. Al terminar debe usar el botón Salir.',
      'Límite: la autenticación protege el uso cotidiano y la trazabilidad, pero no sustituye los permisos del sistema operativo. Quien tenga acceso sin restricciones a la carpeta de trabajo puede copiar sus archivos.',
    ],
  },
  {
    titulo: 'Seguridad informática',
    parrafos: [
      'La aplicación funciona de forma local en Microsoft Edge (o Chrome). No requiere servidor ni conexión a internet.',
      'La carpeta de trabajo se autoriza con el selector del navegador, que pide permiso de lectura y escritura. Elige solo una carpeta con acceso restringido en el equipo.',
      'Se crean respaldos automáticos de usuarios, configuración y registro en la carpeta de respaldos. Conviene copiarlos periódicamente a un medio separado.',
      'El equipo debe tener sesión de Windows protegida con contraseña, antivirus actualizado y las actualizaciones del sistema instaladas.',
      'No deben usarse equipos compartidos sin cerrar la sesión de la aplicación.',
    ],
  },
  {
    titulo: 'Términos de uso y responsabilidades',
    parrafos: [
      'La aplicación se usa para la planeación, el cruce de jobs con el TXT, la generación de esqueletos, pivots y etiquetas, y la consulta de rangos por familia de la operación interna.',
      'El usuario es responsable de revisar los datos de entrada (TXT, Base de ítems y jobs pegados) y los resultados antes de imprimir o compartir los documentos.',
      'Está prohibido alterar, borrar o falsear el registro de auditoría o los respaldos.',
      'La aplicación se entrega tal cual. El titular puede hacer mejoras, pero no responde por pérdidas indirectas, de producción o de datos derivadas de errores en los archivos de origen, de equipos sin protección o de uso indebido.',
      'Usar la aplicación implica aceptar estos términos. Si cambian, se pedirá aceptarlos de nuevo.',
    ],
  },
  {
    titulo: 'Propiedad de la información y bases de datos',
    parrafos: [
      'La información de la operación (TXT de planeación, Base de ítems.xlsm, jobs, routers, secuencias e impresiones) pertenece a la empresa que la genera y la utiliza.',
      'La aplicación solo lee la Base de ítems; no la modifica.',
      'La estructura, los módulos, las plantillas de impresión y los textos de la aplicación son propiedad de su titular, según la sección de derechos de autor.',
      'Los respaldos y el registro de auditoría pertenecen a la empresa usuaria y deben conservarse según sus propias políticas.',
    ],
  },
  {
    titulo: 'Cumplimiento normativo',
    parrafos: [
      'La aplicación se diseñó considerando la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y su reglamento, y la Ley Federal del Derecho de Autor.',
      'El cumplimiento también depende del uso que la empresa le dé. Si la aplicación se usa con personal o datos de otra empresa, se requiere un aviso de privacidad formal conforme a la LFPDPPP.',
      'Este texto es informativo y está sujeto a revisión legal.',
    ],
  },
  {
    titulo: 'Documentación, mantenimiento y trazabilidad',
    parrafos: [
      'Versión de los términos: ' + LEGAL_VERSION + '. La aceptación de cada usuario se guarda en usuarios.json con fecha y versión.',
      'Registro de auditoría: inicios de sesión, aceptaciones de términos, cambios de configuración, cruces, impresiones y altas de usuarios se guardan en registro_auditoria.jsonl con fecha, hora y usuario.',
      'Documentación técnica: README.md del proyecto, con instrucciones de instalación, mantenimiento y generación del archivo único js/qorvex.js.',
      'El mantenimiento corre a cargo del titular. Los cambios se registran en el historial del proyecto con fecha y versión.',
    ],
  },
];

// Pinta el texto legal dentro de un contenedor (solo con textContent: no interpreta HTML).
export function renderLegal(contenedor) {
  contenedor.replaceChildren();
  for (const sec of LEGAL_SECCIONES) {
    const h = document.createElement('h4');
    h.textContent = sec.titulo;
    contenedor.appendChild(h);
    for (const texto of sec.parrafos) {
      const p = document.createElement('p');
      p.textContent = texto;
      contenedor.appendChild(p);
    }
  }
}
