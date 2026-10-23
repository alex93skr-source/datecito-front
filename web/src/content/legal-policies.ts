import { company } from '../site';
import type { LegalDoc } from './types';

const e = company.emails;

export const normas: LegalDoc = {
  slug: 'normas-de-la-comunidad',
  title: 'Normas de la comunidad',
  summary: 'Lo que se vale y lo que no en Datecito. Aplican dentro y fuera de la app.',
  intro: [
    'Datecito existe para que conocer personas sea emocionante y seguro. Estas normas aplican a todo lo que haces en la app: tu perfil, tus mensajes, tus datecitos y, cuando afecta a nuestra comunidad, tu conducta fuera de ella.',
    { note: 'Si alguien incumple estas normas, repórtal@ desde su perfil o el chat (menú ⋯ › Reportar). Es anónimo: la otra persona no sabrá que fuiste tú.' },
  ],
  sections: [
    {
      id: 'autenticidad',
      h: 'Sé tú, de verdad',
      blocks: ['Usa tu nombre real o el que usas en tu día a día, fotos recientes donde se vea tu cara y tu edad real. No suplantes a nadie, no uses fotos de otras personas ni crees perfiles falsos o duplicados.'],
    },
    {
      id: 'respeto',
      h: 'Respeto siempre',
      blocks: ['No toleramos el acoso, las amenazas, los insultos ni la intimidación. Si alguien te deja de responder o te dice que no, respétalo. Insistir después de un “no” es acoso.'],
    },
    {
      id: 'consentimiento',
      h: 'Consentimiento',
      blocks: ['Nunca envíes contenido sexual a quien no lo pidió. Está prohibido compartir o amenazar con compartir imágenes íntimas de otra persona sin su consentimiento; esto puede ser delito (Ley Olimpia). Ninguna persona debe sentirse presionada a encontrarse, a ir a un lugar privado ni a hacer algo que no quiere.'],
    },
    {
      id: 'odio',
      h: 'Cero discriminación y discurso de odio',
      blocks: ['No se permite contenido que promueva, apoye o incite al odio o la violencia por raza, origen étnico, nacionalidad, religión, discapacidad, género, identidad o expresión de género, orientación sexual, edad, apariencia o condición social. Puedes tener preferencias; no puedes humillar a nadie por quien es.'],
    },
    {
      id: 'contenido',
      h: 'Contenido no permitido',
      blocks: [{ ul: ['Desnudez o contenido sexual explícito en fotos y perfil.', 'Violencia gráfica, armas usadas para intimidar, autolesiones.', 'Venta o promoción de drogas.', 'Información personal de terceros.', 'Fotos de menores sin un adulto presente, o cualquier contenido que sexualice a menores (lo reportamos a las autoridades).'] }],
    },
    {
      id: 'fraude',
      h: 'Nada de estafas ni negocios',
      blocks: ['Datecito no es para vender, promocionar, reclutar ni pedir dinero. Está prohibido solicitar transferencias, regalos, criptomonedas, “inversiones” o datos bancarios. Tampoco se permite ofrecer servicios sexuales a cambio de dinero o beneficios.'],
    },
    {
      id: 'menores',
      h: 'Sólo personas adultas',
      blocks: ['Debes tener 18 años o más. Eliminamos de inmediato cualquier cuenta de una persona menor de edad.'],
    },
    {
      id: 'una-cuenta',
      h: 'Una cuenta por persona',
      blocks: ['No compartas tu cuenta ni crees cuentas adicionales. Si eliminamos tu cuenta, no puedes crear una nueva.'],
    },
    {
      id: 'fuera',
      h: 'Conducta fuera de la app',
      blocks: ['Podemos actuar sobre cuentas cuando recibimos información confiable de que alguien cometió daño grave a otra persona usuaria fuera de Datecito, aunque no haya ocurrido en la app.'],
    },
    {
      id: 'consecuencias',
      h: 'Qué pasa si se incumplen',
      blocks: ['Según la gravedad, podemos retirar contenido, enviar una advertencia, limitar funciones, suspender temporalmente o eliminar la cuenta de forma permanente. En casos que involucren riesgo para la vida o delitos graves, colaboramos con las autoridades conforme a la ley. Si crees que nos equivocamos, puedes apelar escribiendo a ' + e.safety + '.'],
    },
  ],
};

export const autoridades: LegalDoc = {
  slug: 'autoridades',
  title: 'Guía para autoridades',
  summary: 'Cómo pueden las autoridades solicitar información sobre cuentas de Datecito.',
  intro: ['Esta guía está dirigida exclusivamente a autoridades de procuración e impartición de justicia. Si eres usuari@ y necesitas ayuda, visita el Centro de ayuda o el Centro de seguridad.'],
  sections: [
    {
      id: 'principios',
      h: '1. Principios',
      blocks: ['Datecito respeta la privacidad de sus usuari@s y entrega información únicamente cuando recibe un requerimiento válido emitido por autoridad competente, debidamente fundado y motivado, conforme a la legislación mexicana aplicable.'],
    },
    {
      id: 'como',
      h: '2. Cómo enviar un requerimiento',
      blocks: [
        'Envía el oficio en formato PDF, firmado, a ' + e.authorities + ' o a nuestro domicilio: ' + company.address + '. El requerimiento debe incluir:',
        { ul: ['Autoridad solicitante, número de oficio y carpeta de investigación o expediente.', 'Fundamento legal.', 'Identificadores de la cuenta: número de celular, correo electrónico o identificador de usuari@ (no basta con el nombre).', 'Información específica solicitada y periodo.', 'Datos de contacto de la persona servidora pública responsable.'] },
      ],
    },
    {
      id: 'emergencias',
      h: '3. Emergencias',
      blocks: ['Si existe un riesgo inminente para la vida o la integridad física de una persona, podemos entregar información de forma expedita. Escribe a ' + e.authorities + ' con el asunto “EMERGENCIA” y describe la naturaleza del riesgo.'],
    },
    {
      id: 'conservacion',
      h: '4. Solicitudes de conservación',
      blocks: ['Podemos conservar la información de una cuenta por [90] días mientras se obtiene el requerimiento formal, previa solicitud oficial.'],
    },
    {
      id: 'notificacion',
      h: '5. Notificación a usuari@s',
      blocks: ['Salvo prohibición legal o riesgo para una investigación o para una persona, podemos notificar a la persona usuaria antes de entregar su información.'],
    },
  ],
};

export const accesibilidad: LegalDoc = {
  slug: 'accesibilidad',
  title: 'Declaración de accesibilidad',
  summary: 'Nuestro compromiso para que todas las personas puedan usar Datecito.',
  intro: ['Queremos que Datecito sea para todas las personas. Trabajamos para que la app y este sitio sean accesibles conforme a las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.2, nivel AA.'],
  sections: [
    {
      id: 'medidas',
      h: 'Lo que hacemos',
      blocks: [{ ul: ['Contraste de color suficiente en textos y botones.', 'Navegación completa con teclado y foco visible.', 'Etiquetas accesibles en íconos y controles para lectores de pantalla (VoiceOver y TalkBack).', 'Texto que se adapta al tamaño de fuente del sistema.', 'Retroalimentación háptica y textual, no sólo por color.', 'Pruebas con personas usuarias con discapacidad.'] }],
    },
    {
      id: 'limitaciones',
      h: 'Limitaciones conocidas',
      blocks: ['Algunas fotos subidas por personas usuarias pueden no tener descripción alternativa. Estamos trabajando en descripciones automáticas opcionales.'],
    },
    {
      id: 'contacto',
      h: 'Cuéntanos',
      blocks: ['Si encuentras una barrera de accesibilidad, escríbenos a ' + e.accessibility + '. Respondemos en un máximo de 5 días hábiles.'],
    },
  ],
};

export const seguridadInformatica: LegalDoc = {
  slug: 'seguridad-informatica',
  title: 'Seguridad informática y divulgación responsable',
  summary: 'Cómo protegemos la plataforma y cómo reportar vulnerabilidades.',
  intro: ['La seguridad de tu información es parte central de Datecito. Si eres investigador(a) de seguridad y encontraste una vulnerabilidad, queremos saberlo.'],
  sections: [
    {
      id: 'medidas',
      h: '1. Cómo protegemos Datecito',
      blocks: [{ ul: ['Cifrado TLS en todas las comunicaciones.', 'Tokens de sesión guardados en el almacenamiento seguro del dispositivo.', 'Límites de intentos y detección de automatizaciones.', 'Revisión de código y análisis de dependencias.', 'Principio de mínimo privilegio en accesos internos.'] }],
    },
    {
      id: 'reportar',
      h: '2. Cómo reportar una vulnerabilidad',
      blocks: [
        'Envía tu reporte a ' + e.security + ' con una descripción, pasos para reproducirlo, impacto potencial y tus datos de contacto.',
        { ul: ['No accedas, modifiques ni elimines datos de otras personas usuarias.', 'No realices pruebas de denegación de servicio, ingeniería social ni ataques físicos.', 'Usa sólo cuentas de prueba propias.', 'Danos un plazo razonable (90 días) para corregir antes de divulgar públicamente.'] },
      ],
    },
    {
      id: 'compromiso',
      h: '3. Nuestro compromiso',
      blocks: ['Confirmaremos la recepción en 3 días hábiles, te mantendremos informad@ y, si actuaste de buena fe conforme a esta política, no emprenderemos acciones legales en tu contra. Reconoceremos tu aporte en nuestro salón de la fama si así lo deseas.'],
    },
    {
      id: 'alcance',
      h: '4. Alcance',
      blocks: [{ ul: ['App Datecito para Android e iOS.', 'API de Datecito.', company.domain + ' y subdominios.'] }],
    },
  ],
};
