import { company } from '../site';
import type { LegalDoc } from './types';

const e = company.emails;

export const privacidad: LegalDoc = {
  slug: 'privacidad',
  title: 'Aviso de privacidad integral',
  summary: 'Qué datos personales tratamos, para qué, con quién los compartimos y cómo ejercer tus derechos ARCO.',
  intro: [
    `${company.legalName} (“Datecito”), con domicilio en ${company.address}, es responsable del tratamiento de tus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (la “Ley”) y su normatividad aplicable.`,
    { note: 'Creemos que la privacidad debe explicarse claro. Si sólo quieres lo esencial, consulta el Aviso de privacidad simplificado. Para cualquier duda escríbenos a ' + e.privacy + '.' },
  ],
  sections: [
    {
      id: 'datos',
      h: '1. Datos personales que tratamos',
      blocks: [
        { h3: 'Datos que tú nos das' },
        {
          ul: [
            '**Identificación y contacto:** nombre, fecha de nacimiento y correo electrónico.',
            '**Perfil:** fotos, género, a quién quieres conocer, lo que buscas y tu tipo de relación, intereses, equipos deportivos, música, idiomas, biografía, ocupación, respuestas a preguntas y otros datos opcionales que decidas mostrar.',
            '**Verificación:** selfie de verificación, la pose solicitada y el resultado de la revisión (aprobada o rechazada). Ver Política de datos sensibles.',
            '**Comunicaciones:** mensajes de chat, datecitos propuestos, reportes y conversaciones con soporte.',
            '**Contactos de confianza:** nombre y teléfono de las personas que tú elijas para Datecito Seguro.',
            '**Compras:** identificador de la transacción y estado de tu membresía (los datos de tu tarjeta los procesa Google Play o App Store; nosotros no los recibimos).',
          ],
        },
        { h3: 'Datos que obtenemos al usar el Servicio' },
        {
          ul: [
            '**Ubicación aproximada:** cuando lo permites, usamos tu ubicación del dispositivo mientras usas la app para mostrarte personas cercanas y Aquí y ahora. Nunca mostramos tu ubicación exacta a otras personas y no accedemos a ella en segundo plano.',
            '**Uso:** likes, matches, funciones que usas, horarios de conexión, ajustes y filtros.',
            '**Dispositivo y técnicos:** modelo, sistema operativo, idioma, identificadores del dispositivo y de la app, dirección IP, registros de errores y datos de cookies en el sitio web.',
          ],
        },
        { h3: 'Datos de terceros' },
        { ul: ['Otras personas usuarias pueden darnos información sobre ti al reportarte o al mencionarte en un reporte.', 'Si nos escribes desde el sitio web, recibimos los datos que incluyas en el formulario.'] },
      ],
    },
    {
      id: 'sensibles',
      h: '2. Datos personales sensibles',
      blocks: [
        'Algunos datos pueden revelar aspectos sensibles, por ejemplo tu orientación sexual (implícita en a quién quieres conocer), tu vida sexual o la imagen de tu rostro en la selfie de verificación. Sólo los tratamos con tu **consentimiento expreso**, que otorgas al completar esos campos o activar la verificación, y puedes retirarlo en cualquier momento. Consulta la Política de datos sensibles.',
      ],
    },
    {
      id: 'finalidades',
      h: '3. Para qué usamos tus datos',
      blocks: [
        { h3: 'Finalidades primarias (necesarias para el Servicio)' },
        {
          ul: [
            'Crear y administrar tu cuenta y verificar tu edad.',
            'Mostrar tu perfil y recomendarte perfiles compatibles según tus preferencias y ubicación aproximada.',
            'Permitir matches, chats, datecitos y la función Aquí y ahora.',
            'Operar Datecito Seguro: compartir tu plan con tus contactos de confianza, recordatorios de check-in y alertas de ayuda que tú actives.',
            'Prevenir, detectar e investigar fraude, spam, perfiles falsos, abusos y conductas que pongan en riesgo a la comunidad.',
            'Procesar compras y administrar tu membresía.',
            'Atender solicitudes de soporte, reportes y el ejercicio de tus derechos.',
            'Cumplir obligaciones legales y requerimientos de autoridades competentes.',
          ],
        },
        { h3: 'Finalidades secundarias (puedes negarte)' },
        {
          ul: [
            'Enviarte novedades, promociones y encuestas.',
            'Analizar el uso del Servicio de forma agregada para mejorar productos y desarrollar nuevas funciones.',
            'Mostrarte publicidad de Datecito en otras plataformas.',
          ],
        },
        'Si no deseas que tratemos tus datos para las finalidades secundarias, puedes indicarlo en Perfil › Ajustes › Notificaciones (novedades y promociones) o escribiendo a ' + e.privacy + '. Tu negativa no será motivo para negarte el Servicio.',
      ],
    },
    {
      id: 'transferencias',
      h: '4. Con quién compartimos tus datos',
      blocks: [
        { h3: 'Con otras personas usuarias' },
        'Tu perfil público (fotos, nombre, edad, distancia aproximada, insignia de verificación y lo que decidas mostrar) es visible para otras personas usuarias. Tus mensajes los ven sólo las personas con quienes conversas.',
        { h3: 'Encargados' },
        'Compartimos datos con proveedores que nos prestan servicios bajo contrato y con obligaciones de confidencialidad: alojamiento en la nube, envío de correos electrónicos y notificaciones, y almacenamiento de fotos. La revisión de verificaciones y de reportes la realiza personal de Datecito, no un proveedor externo.',
        { h3: 'Transferencias que no requieren tu consentimiento' },
        {
          table: {
            head: ['Destinatario', 'Finalidad'],
            rows: [
              ['Autoridades competentes', 'Cumplir requerimientos legales, órdenes judiciales o proteger la vida o integridad de una persona.'],
              ['Sociedades del mismo grupo, si llegaran a existir', 'Operación y soporte del Servicio bajo las mismas políticas.'],
              ['Adquirente en caso de fusión o venta', 'Continuidad del Servicio, manteniendo este Aviso.'],
            ],
          },
        },
        { h3: 'Transferencias que requieren tu consentimiento' },
        'Cuando actives Datecito Seguro, compartiremos con tus contactos de confianza los detalles del plan que tú elijas (lugar, hora y con quién). Ninguna otra transferencia de este tipo se realiza sin tu consentimiento.',
        { note: '**No vendemos tus datos personales.**' },
      ],
    },
    {
      id: 'arco',
      h: '5. Derechos ARCO y revocación del consentimiento',
      blocks: [
        'Tienes derecho a **Acceder** a tus datos, **Rectificarlos** si son inexactos, **Cancelarlos** cuando consideres que no se requieren y **Oponerte** a su tratamiento para fines específicos. También puedes revocar tu consentimiento y limitar el uso o divulgación de tus datos.',
        'Para ejercerlos, envía tu solicitud mediante el formulario de Derechos ARCO de este sitio o a ' + e.privacy + ', incluyendo:',
        {
          ul: [
            'Tu nombre y el correo asociado a tu cuenta.',
            'Documento que acredite tu identidad o, en su caso, la de tu representante legal.',
            'Descripción clara de los datos y del derecho que deseas ejercer.',
            'Cualquier otro elemento que facilite localizar tus datos.',
          ],
        },
        'Te responderemos en un plazo máximo de 20 días hábiles y, si procede, haremos efectiva la solicitud dentro de los 15 días hábiles siguientes. Muchos de estos derechos puedes ejercerlos directamente en la app: editar tu perfil o eliminar tu cuenta (Perfil › Ajustes › Cuenta). Para recibir una copia de tus datos, usa el formulario eligiendo “Acceso”.',
      ],
    },
    {
      id: 'conservacion',
      h: '6. Conservación',
      blocks: [
        'Conservamos tus datos mientras tu cuenta esté activa. Al eliminarla, borramos tu perfil, fotos, selfie, matches y mensajes de inmediato, y los respaldos de la base de datos se sobrescriben en un máximo de 14 días, salvo:',
        { ul: ['Información de seguridad y reportes (por ejemplo, para impedir que una cuenta eliminada por abuso vuelva a registrarse), que conservamos hasta 3 años.', 'Información de transacciones, que conservamos por el plazo que exigen las leyes fiscales.', 'Datos sujetos a una investigación, requerimiento legal o litigio.'] },
      ],
    },
    {
      id: 'seguridad',
      h: '7. Seguridad',
      blocks: ['Aplicamos medidas administrativas, técnicas y físicas para proteger tus datos: cifrado en tránsito, cifrado en reposo de mensajes, contactos de confianza y datos sensibles, contraseñas protegidas con Argon2id, control de accesos por rol, almacenamiento seguro de credenciales en tu dispositivo y monitoreo de actividad sospechosa. Ninguna medida es infalible; si detectamos una vulneración que afecte significativamente tus derechos, te lo informaremos sin demora.'],
    },
    {
      id: 'cookies',
      h: '8. Cookies y tecnologías similares',
      blocks: ['Nuestro sitio web usa cookies y tecnologías similares. Puedes administrarlas en Configuración de cookies. Más detalle en nuestra Política de cookies.'],
    },
    {
      id: 'menores',
      h: '9. Menores de edad',
      blocks: ['El Servicio es exclusivamente para mayores de 18 años. No recabamos intencionalmente datos de menores. Si sabes de una persona menor usando Datecito, repórtala en la app o escribe a ' + e.safety + '.'],
    },
    {
      id: 'internacional',
      h: '10. Transferencias internacionales',
      blocks: ['Algunos proveedores pueden almacenar datos fuera de México (por ejemplo, en Estados Unidos). En esos casos exigimos contractualmente un nivel de protección equivalente al previsto en la Ley.'],
    },
    {
      id: 'cambios',
      h: '11. Cambios a este Aviso',
      blocks: ['Podemos modificar este Aviso. Publicaremos la versión vigente en esta página e informaremos cambios relevantes en la app o por correo.'],
    },
    {
      id: 'autoridad',
      h: '12. Autoridad',
      blocks: ['Si consideras que tu derecho a la protección de datos fue vulnerado, puedes acudir ante la autoridad de protección de datos personales competente: la autoridad garante en materia de protección de datos personales (actualmente la Secretaría Anticorrupción y Buen Gobierno, tras la reforma de 2025).'],
    },
  ],
};

export const privacidadSimplificado: LegalDoc = {
  slug: 'privacidad-simplificado',
  title: 'Aviso de privacidad simplificado',
  summary: 'La versión corta de cómo tratamos tus datos.',
  intro: [`${company.legalName} (“Datecito”) es responsable del tratamiento de tus datos personales.`],
  sections: [
    {
      id: 'para-que',
      h: '¿Para qué usamos tus datos?',
      blocks: [
        'Para crear tu cuenta, mostrar tu perfil, recomendarte personas cerca, permitir matches, chats y datecitos, operar Datecito Seguro, prevenir fraude y abusos, procesar tu membresía y darte soporte.',
        'De forma secundaria, y sólo si no te opones, para enviarte novedades y promociones, analizar el uso de la app y mostrarte publicidad de Datecito. Puedes negarte en Perfil › Ajustes › Notificaciones o en ' + e.privacy + '.',
      ],
    },
    {
      id: 'con-quien',
      h: '¿Con quién los compartimos?',
      blocks: ['Con otras personas usuarias (tu perfil público), con tus contactos de confianza cuando tú lo activas y con autoridades cuando la ley lo exige. **No vendemos tus datos.**'],
    },
    {
      id: 'integral',
      h: 'Aviso integral',
      blocks: ['Consulta el Aviso de privacidad integral en datecito.com/es/legal/privacidad.'],
    },
  ],
};

export const datosSensibles: LegalDoc = {
  slug: 'datos-sensibles',
  title: 'Política de datos personales sensibles',
  summary: 'Cómo tratamos datos de orientación sexual, la selfie de verificación y otros datos sensibles.',
  intro: ['En una app de citas algunos datos son especialmente delicados. Esta política complementa el Aviso de privacidad integral y explica, con más detalle, cómo los protegemos.'],
  sections: [
    {
      id: 'cuales',
      h: '1. ¿Qué datos sensibles podemos tratar?',
      blocks: [
        {
          table: {
            head: ['Dato', 'De dónde viene', 'Para qué'],
            rows: [
              ['Orientación sexual e identidad de género', 'Tu género y a quién quieres conocer', 'Recomendarte perfiles compatibles.'],
              ['Imagen de tu rostro', 'Selfie de verificación con la pose solicitada', 'Que una persona del equipo confirme que tus fotos son tuyas y otorgarte la insignia de verificación.'],
              ['Tipo de relación y lo que buscas', 'Campos opcionales del perfil', 'Mostrarlos en tu perfil si tú lo decides y recomendarte personas afines.'],
              ['Vida sexual o intimidad', 'Contenido de tus mensajes', 'Sólo se procesa para entregar tus mensajes y, en su caso, investigar reportes.'],
            ],
          },
        },
      ],
    },
    {
      id: 'consentimiento',
      h: '2. Consentimiento expreso',
      blocks: ['Tratamos estos datos sólo con tu consentimiento expreso. Los campos opcionales siempre son opcionales y puedes borrarlos cuando quieras. La verificación por selfie se activa sólo si tú la inicias.'],
    },
    {
      id: 'biometria',
      h: '3. Verificación por selfie',
      blocks: [
        { ul: ['Una persona del equipo compara tu selfie con las fotos de tu perfil y comprueba que hiciste la pose solicitada. No generamos plantillas biométricas ni usamos reconocimiento facial automatizado.', 'La selfie se guarda cifrada en almacenamiento privado, nunca se muestra en tu perfil y se elimina a los 30 días de concluir la revisión; conservamos sólo el resultado (verificado / no verificado).', 'Nunca usamos tu selfie para publicidad ni la compartimos con terceros.'] },
      ],
    },
    {
      id: 'limites',
      h: '4. Límites que nos imponemos',
      blocks: [{ ul: ['No usamos datos sensibles para publicidad dirigida.', 'No los vendemos ni los compartimos con anunciantes.', 'No los inferimos a partir de tu actividad para fines distintos a los aquí descritos.', 'El acceso interno está restringido al personal que estrictamente lo necesita.'] }],
    },
    {
      id: 'derechos',
      h: '5. Tus derechos',
      blocks: ['Puedes acceder, corregir, eliminar o retirar tu consentimiento sobre estos datos en cualquier momento desde la app o escribiendo a ' + e.privacy + '.'],
    },
  ],
};

export const cookies: LegalDoc = {
  slug: 'cookies',
  title: 'Política de cookies',
  summary: 'Qué cookies y tecnologías similares usamos en el sitio web y cómo administrarlas.',
  intro: ['Esta Política explica cómo Datecito usa cookies, píxeles y tecnologías similares en ' + company.domain + '.'],
  sections: [
    {
      id: 'que-son',
      h: '1. ¿Qué son las cookies?',
      blocks: ['Las cookies son pequeños archivos que un sitio guarda en tu navegador para recordar información sobre tu visita. Tecnologías similares incluyen el almacenamiento local del navegador, píxeles y SDKs en la app.'],
    },
    {
      id: 'tipos',
      h: '2. Tipos de cookies que usamos',
      blocks: [
        {
          table: {
            head: ['Categoría', 'Para qué sirve', '¿Puedes desactivarla?'],
            rows: [
              ['Estrictamente necesarias', 'Seguridad, prevención de fraude, recordar tu decisión sobre cookies e idioma, balanceo de carga.', 'No'],
              ['Analítica y rendimiento', 'Contar visitas, medir qué páginas funcionan mejor y detectar errores. No se usa por ahora.', 'Sí'],
              ['Personalización', 'Recordar preferencias de visualización adicionales. No se usa por ahora.', 'Sí'],
              ['Publicidad', 'Medir la efectividad de campañas de Datecito y mostrarte anuncios relevantes en otros sitios. No se usa por ahora.', 'Sí'],
            ],
          },
        },
      ],
    },
    {
      id: 'lista',
      h: '3. Cookies específicas',
      blocks: [
        {
          table: {
            head: ['Nombre', 'Proveedor', 'Categoría', 'Duración'],
            rows: [
              ['datecito.cookies.v1', 'Datecito', 'Necesaria', 'Persistente (hasta que la borres)'],
              ['datecito.lang', 'Datecito', 'Necesaria', 'Persistente (hasta que la borres)'],
            ],
          },
        },
        'Hoy sólo usamos esas dos entradas de almacenamiento local; no hay cookies de terceros. Si integramos analítica o publicidad, actualizaremos esta tabla y te pediremos consentimiento antes de activarlas.',
      ],
    },
    {
      id: 'administrar',
      h: '4. Cómo administrarlas',
      blocks: ['Puedes cambiar tus preferencias en cualquier momento con el enlace “Configuración de cookies” al pie de cada página. También puedes bloquearlas o borrarlas desde tu navegador; ten en cuenta que algunas funciones del sitio podrían dejar de funcionar.'],
    },
    {
      id: 'contacto',
      h: '5. Contacto',
      blocks: ['Dudas sobre esta política: ' + e.privacy + '.'],
    },
  ],
};
