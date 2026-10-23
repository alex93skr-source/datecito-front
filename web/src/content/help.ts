import type { IconName } from '../components/Icon';
import { company, money } from '../site';
import type { Block } from './types';

export type HelpCategory = { slug: string; title: string; icon: IconName; desc: string };
export type HelpArticle = { slug: string; cat: string; title: string; body: Block[] };

export const helpCategories: HelpCategory[] = [
  { slug: 'primeros-pasos', title: 'Primeros pasos', icon: 'sparkle', desc: 'Crear tu cuenta, confirmar tu correo y armar un perfil que enamore.' },
  { slug: 'cuenta', title: 'Cuenta y perfil', icon: 'user', desc: 'Inicio de sesión, contraseña, fotos, datos y eliminar cuenta.' },
  { slug: 'descubrir', title: 'Descubrir y matches', icon: 'heart', desc: 'Likes, Super likes, quién te dio like, filtros y límites diarios.' },
  { slug: 'chat', title: 'Chat y datecitos', icon: 'chat', desc: 'Conversar, proponer planes con calendario y organizar tu cita.' },
  { slug: 'aqui-y-ahora', title: 'Aquí y ahora', icon: 'radio', desc: 'Conoce a quienes están en el mismo lugar que tú.' },
  { slug: 'membresia', title: 'Membresía y pagos', icon: 'star', desc: 'Precios, cobros, cancelación y reembolsos.' },
  { slug: 'seguridad', title: 'Seguridad y reportes', icon: 'shield', desc: 'Verificación, Datecito Seguro, bloquear y reportar.' },
  { slug: 'privacidad', title: 'Privacidad y datos', icon: 'lock', desc: 'Tu ubicación, quién te ve y tus derechos ARCO.' },
  { slug: 'tecnico', title: 'Problemas técnicos', icon: 'help', desc: 'Errores, notificaciones y compatibilidad.' },
];

const p = company.pricing;

export const helpArticles: HelpArticle[] = [
  {
    slug: 'crear-cuenta',
    cat: 'primeros-pasos',
    title: '¿Cómo creo mi cuenta?',
    body: [
      'Descarga Datecito y toca “Crear mi cuenta”. Sólo necesitas un correo electrónico y una contraseña de al menos 8 caracteres con letras y números.',
      { ol: ['Escribe tu correo y tu contraseña, y acepta los Términos y el Aviso de privacidad.', 'Te enviamos un código de 6 dígitos a tu correo; escríbelo en la app para confirmar que es tuyo.', 'Escribe tu nombre y fecha de nacimiento (debes tener 18 años o más).', 'Elige tu género y a quién quieres conocer.', 'Cuéntanos qué buscas y, si quieres, tu tipo de relación.', 'Sube de 2 a 7 fotos donde se vea tu cara.', 'Elige tus intereses, tu música y, si le vas a algún equipo, dinos cuál.', 'Permite tu ubicación aproximada para ver personas cerca de ti.'] },
      'Si cierras la app a la mitad, no pasa nada: al volver retomas en el paso donde te quedaste.',
    ],
  },
  {
    slug: 'no-llega-codigo',
    cat: 'primeros-pasos',
    title: 'No me llega el código por correo',
    body: [
      { ul: ['Revisa la carpeta de spam o correo no deseado.', 'Espera un minuto y toca “Reenviar código”; cada código dura 10 minutos.', 'Confirma que escribiste bien tu correo: toca la flecha de atrás para verlo y corregirlo.', 'Si usas un correo del trabajo, puede que tu empresa bloquee correos externos; prueba con uno personal.'] },
      'Si después de esto no llega, escríbenos a ' + company.emails.support + ' indicando el correo con el que te registraste.',
    ],
  },
  {
    slug: 'buen-perfil',
    cat: 'primeros-pasos',
    title: 'Consejos para un perfil que funcione',
    body: [{ ul: ['Usa fotos recientes, con buena luz y donde se vea tu cara sin lentes oscuros.', 'Incluye una foto haciendo algo que disfrutas.', 'Escribe una bio corta, honesta y con algo de lo que se pueda platicar.', 'Agrega intereses, tu música y tu equipo: son el mejor rompehielos y se muestran en común con la otra persona.', 'Responde una o dos preguntas del perfil (“Mi datecito ideal…”).', 'Verifica tu perfil: la insignia da confianza y te incluye en el filtro “Sólo verificados” de los demás.'] }],
  },
  {
    slug: 'no-puedo-iniciar-sesion',
    cat: 'cuenta',
    title: 'No puedo iniciar sesión',
    body: [
      { ul: ['Revisa que el correo y la contraseña sean los mismos con los que te registraste; las mayúsculas en el correo no importan.', 'Si olvidaste tu contraseña, toca “¿Olvidaste tu contraseña?”: te mandamos un código por correo para crear una nueva.', 'Si tu cuenta aún no está verificada, al entrar te pediremos el código de tu correo; toca “Reenviar” si venció.', 'Si tu cuenta fue suspendida, verás un aviso al intentar entrar.'] },
      'Si nada funciona, escríbenos a ' + company.emails.support + ' desde el correo de tu cuenta.',
    ],
  },
  {
    slug: 'cambiar-contrasena',
    cat: 'cuenta',
    title: 'Cambiar mi contraseña',
    body: ['Ve a Perfil › Ajustes › Cuenta › Cambiar contraseña y escribe la actual y la nueva. Si no recuerdas la actual, cierra sesión y usa “¿Olvidaste tu contraseña?” en la pantalla de inicio. Al cambiarla por recuperación se cierran las sesiones abiertas en otros teléfonos.'],
  },
  {
    slug: 'editar-perfil',
    cat: 'cuenta',
    title: 'Editar fotos y datos del perfil',
    body: ['Ve a Perfil › Editar perfil. Ahí puedes cambiar o reordenar tus fotos (de 2 a 7), tu bio, ocupación, intereses, equipos, música, idiomas, lo básico y tus preguntas. Usa “Vista previa” para ver tu perfil como lo ven los demás. Tu fecha de nacimiento no se puede cambiar; si hay un error, contáctanos.'],
  },
  {
    slug: 'eliminar-cuenta',
    cat: 'cuenta',
    title: '¿Cómo elimino mi cuenta?',
    body: [
      'Ve a Perfil › Ajustes › Cuenta › Eliminar mi cuenta y confirma con tu contraseña. Se borran de inmediato tu perfil, fotos, matches y conversaciones, y no se puede deshacer.',
      { note: 'Eliminar tu cuenta **no** cancela tu membresía. Cancélala primero desde Google Play o App Store.' },
      'Si ya no puedes entrar a la app, escríbenos a ' + company.emails.privacy + ' desde el correo de tu cuenta con el asunto “Eliminar mi cuenta”. Si sólo quieres un descanso, en Perfil › Ajustes › Privacidad puedes ocultarte de Descubrir y conservar tus matches.',
    ],
  },
  {
    slug: 'como-funciona-match',
    cat: 'descubrir',
    title: '¿Cómo funciona un match?',
    body: ['En Descubrir, da like (corazón) a quien te interese o pasa (✕). Si esa persona también te da like, ¡es match! y pueden empezar a conversar. Con un Super like, la otra persona sí se entera antes de decidir: tu perfil le aparece primero y destacado.'],
  },
  {
    slug: 'quien-te-dio-like',
    cat: 'descubrir',
    title: 'Ver quién te dio like',
    body: [
      'En Conexiones verás un aviso con cuántas personas te dieron like. Tócalo para abrir la lista.',
      { ul: ['**Con membresía** (y durante el lanzamiento gratuito): ves sus fotos y perfiles. Si te gusta alguien, toca “Hacer match” y el match es inmediato, sin gastar tus likes del día.', '**Sin membresía:** ves cuántas personas son y siluetas con su inicial, edad y zona, pero no sus fotos ni sus perfiles.'] },
      'Las personas que ya pasaste de largo o con quienes ya hiciste match no aparecen en la lista.',
    ],
  },
  {
    slug: 'limites-diarios',
    cat: 'descubrir',
    title: '¿Por qué se acabaron mis likes o mis perfiles de hoy?',
    body: [
      'Datecito tiene un ritmo diario para que cada like signifique algo y para que nadie se acabe la app en una tarde:',
      { ul: ['**40 perfiles al día** en Descubrir. Cuando los terminas, verás “Ya viste a tus personas de hoy”.', '**30 likes al día.** Abajo de los botones te decimos cuántos te quedan. “No me interesa” no tiene límite.', 'Corresponder a alguien que ya te dio like **no** gasta tus likes.'] },
      'Todo se reinicia a medianoche (hora del centro de México). Mientras, puedes revisar quién te dio like, platicar con tus matches o usar Aquí y ahora.',
    ],
  },
  {
    slug: 'super-like',
    cat: 'descubrir',
    title: '¿Qué es un Super like?',
    body: [`Un Super like le avisa a la otra persona que te gustó mucho: tu perfil le aparece primero en Descubrir con la etiqueta “Te dio un Super like”. Tienes 1 gratis cada 3 días y puedes comprar paquetes de ${p.superPackQty} por ${money(p.superPack)}; los comprados no caducan mientras tu cuenta esté activa.`],
  },
  {
    slug: 'filtros',
    cat: 'descubrir',
    title: 'Usar los filtros de Descubrir',
    body: ['En Descubrir toca el ícono de filtros. Puedes elegir:', { ul: ['**Quiero conocer a:** mujeres, hombres o todas las personas.', '**Edad** y **distancia máxima** (siempre aproximada).', '**Que busque…**: la intención (algo serio, conocer sin presión…). Sólo verás a quienes busquen lo que elijas.', '**Que le guste…**: intereses populares. No ocultan a nadie; te mostramos primero a quienes coinciden.', '**Sólo perfiles verificados.**'] }, 'No hay filtros por apariencia física.'],
  },
  {
    slug: 'segunda-oportunidad',
    cat: 'descubrir',
    title: 'Pasé a alguien por error, ¿puedo regresar?',
    body: ['No hay botón de deshacer, pero sí segunda oportunidad: quien pasaste de largo vuelve a aparecer en tu Descubrir a los 14 días. Si ya diste like no hay forma de retirarlo; si hacen match, puedes quitar el match desde el chat.'],
  },
  {
    slug: 'proponer-datecito',
    cat: 'chat',
    title: '¿Cómo propongo un datecito?',
    body: ['Dentro del chat toca “¿Se arma? Propón un datecito”. Elige el tipo de plan (café, comida, bar, aire libre, cultura u otro), escribe el lugar y la zona, y elige el día y la hora en el calendario; verás marcados los días en que ya tienes otro datecito. Tu match recibe la propuesta en el chat: si confirma, el datecito queda agendado para ambos y puedes activar Datecito Seguro. Hasta que confirme es sólo una invitación; pueden seguir platicando para ajustar el plan.'],
  },
  {
    slug: 'feedback-datecito',
    cat: 'chat',
    title: '¿Para qué es el “¿Cómo te fue?” después del datecito?',
    body: ['Después de un datecito confirmado te preguntamos, en privado, cómo te fue. Tu respuesta se guarda cifrada y nunca se comparte con la otra persona; nos ayuda a detectar comportamientos que no se valen y a cuidar a la comunidad.'],
  },
  {
    slug: 'deshacer-match',
    cat: 'chat',
    title: 'Quitar un match',
    body: ['En el chat toca ⋯ › Quitar match. La conversación desaparece para ambos y esa persona no volverá a aparecerte. Si algo te incomodó, desde el mismo menú puedes bloquear o reportar.'],
  },
  {
    slug: 'sin-visto',
    cat: 'chat',
    title: '¿Por qué no veo si leyeron mi mensaje?',
    body: ['Es a propósito. En Datecito no hay “visto”, “en línea”, “última conexión” ni “escribiendo…”, y tampoco se pueden mandar fotos en el chat. Queremos que platiques sin presión y a tu ritmo.'],
  },
  {
    slug: 'que-es-aqui-y-ahora',
    cat: 'aqui-y-ahora',
    title: '¿Qué es Aquí y ahora?',
    body: ['Es para cuando estás en un café, un bar o un evento y quieres saber quién más está ahí con ganas de conocer gente. Activas Aquí y ahora escribiendo el lugar y eligiendo cuánto tiempo estarás (1, 2 o 3 horas), y ves a quienes también lo activaron a unos metros de ti. Con un toque les mandas un saludo; si la otra persona quiere, abren chat. Al terminar el tiempo dejas de aparecer automáticamente. Puedes pedir que sólo te vean perfiles verificados.'],
  },
  {
    slug: 'ocultarme',
    cat: 'aqui-y-ahora',
    title: 'Ocultarme de una persona en Aquí y ahora',
    body: ['Toca el perfil y elige “Ocultarme de…”. Esa persona ya no te verá en Aquí y ahora. También puedes apagar tu sesión en cualquier momento.'],
  },
  {
    slug: 'precios',
    cat: 'membresia',
    title: '¿Cuánto cuesta Datecito?',
    body: [`Durante el lanzamiento Datecito es gratis. Después habrá una sola membresía con todo incluido: ${money(p.monthly)} al mes o ${money(p.yearly)} al año (dos meses gratis). Incluye ver quién te dio like, Descubrir completo, chats, datecitos, Aquí y ahora, todos los filtros y 1 Super like gratis cada 3 días. Datecito Seguro, la verificación y reportar o bloquear son gratis siempre. Fuera de México, la tienda muestra el precio en tu moneda.`],
  },
  {
    slug: 'cancelar-membresia',
    cat: 'membresia',
    title: '¿Cómo cancelo mi membresía?',
    body: [{ ul: ['**Android:** Google Play › Perfil › Pagos y suscripciones › Suscripciones › Datecito › Cancelar.', '**iPhone:** Ajustes › tu nombre › Suscripciones › Datecito › Cancelar.'] }, 'Conservas los beneficios hasta el final del periodo pagado. Tus matches y chats no se borran.'],
  },
  {
    slug: 'reembolso',
    cat: 'membresia',
    title: 'Solicitar un reembolso',
    body: ['Las compras se procesan por Google Play o App Store, así que el reembolso se solicita a la tienda: en Google Play desde play.google.com › Historial de pedidos, y en Apple desde reportaproblem.apple.com. Si necesitas ayuda, escríbenos.'],
  },
  {
    slug: 'restaurar-compra',
    cat: 'membresia',
    title: 'Pagué pero no veo mi membresía',
    body: ['Cierra la app y vuelve a abrirla con la misma cuenta de Google Play o App Store con la que pagaste; la membresía se activa al confirmarse el pago. Si después de unos minutos sigue sin aparecer, escríbenos a ' + company.emails.support + ' con tu número de pedido de la tienda.'],
  },
  {
    slug: 'verificar-perfil',
    cat: 'seguridad',
    title: '¿Cómo verifico mi perfil?',
    body: [
      'Ve a Seguridad › Verificar mi perfil. La app te muestra una pose al azar (por ejemplo, la señal de paz o la mano en la barbilla); tómate una selfie haciéndola.',
      'Una persona del equipo compara tu selfie con tus fotos y comprueba la pose. Tarda entre 48 y 72 horas; mientras tanto puedes usar Datecito con normalidad y tu perfil muestra la etiqueta “En verificación”. Si se aprueba, aparece la insignia junto a tu nombre; si no, puedes volver a intentarlo con mejor luz.',
      { note: 'Tu selfie se guarda cifrada, nunca se muestra en tu perfil y sólo la ve el equipo que revisa verificaciones. No usamos reconocimiento facial automatizado.' },
    ],
  },
  {
    slug: 'datecito-seguro',
    cat: 'seguridad',
    title: '¿Cómo funciona Datecito Seguro?',
    body: [
      'Primero guarda hasta 3 contactos de confianza en Seguridad › Contactos de confianza (nombre y teléfono; se guardan cifrados y no necesitan tener Datecito).',
      'Antes de tu cita, abre el datecito confirmado y toca “Activar Datecito Seguro”. Elige a quién avisar y cada cuánto quieres que te preguntemos si todo va bien: 15, 30, 45 o 60 minutos. Al activarlo se abre WhatsApp con un mensaje listo (con quién, dónde y a qué hora); tú lo envías.',
      'Durante la cita tienes a la mano “Estoy bien”, “Llamada de salida” (una llamada falsa para irte sin explicaciones), “Necesito ayuda” (prepara un mensaje urgente para tus contactos) y “Llamar al 911”.',
    ],
  },
  {
    slug: 'reportar',
    cat: 'seguridad',
    title: '¿Cómo reporto a alguien?',
    body: ['En su perfil o en el chat toca ⋯ › Reportar, elige el motivo (comportamiento inapropiado, perfil falso o spam, me preocupa mi seguridad, es menor de edad) y agrega detalles si quieres. La persona no sabrá que la reportaste y una persona del equipo lo revisa; los reportes de riesgo o de menores se atienden primero. Si estás en peligro inmediato, llama al 911.'],
  },
  {
    slug: 'bloquear',
    cat: 'seguridad',
    title: 'Bloquear a alguien',
    body: ['Toca ⋯ › Bloquear en su perfil o chat. No podrá verte ni escribirte, y tampoco aparecerá en tu Descubrir ni en Aquí y ahora. Puedes ver y deshacer bloqueos en Perfil › Ajustes › Bloqueados.'],
  },
  {
    slug: 'ubicacion',
    cat: 'privacidad',
    title: '¿Quién ve mi ubicación?',
    body: ['Nadie ve tu ubicación exacta. Guardamos una ubicación aproximada (a un kilómetro) y mostramos sólo una distancia redondeada, por ejemplo “a 3 km”. Usamos tu ubicación únicamente mientras usas la app; nunca en segundo plano. Puedes actualizarla cuando quieras en Perfil › Ajustes › Ubicación.'],
  },
  {
    slug: 'descargar-datos',
    cat: 'privacidad',
    title: 'Pedir una copia de mis datos',
    body: ['Envíanos tu solicitud desde datecito.com/es/legal/arco eligiendo “Acceso”, o escribe a ' + company.emails.privacy + ' desde el correo de tu cuenta. Te respondemos en un máximo de 20 días hábiles.'],
  },
  {
    slug: 'notificaciones',
    cat: 'tecnico',
    title: 'No me llegan notificaciones',
    body: [{ ul: ['Revisa en Perfil › Ajustes › Notificaciones que estén activadas las que te interesan.', 'Revisa los permisos de notificaciones de tu teléfono para Datecito.', 'Desactiva el modo de ahorro de batería para Datecito.', 'Cierra sesión y vuelve a entrar.'] }],
  },
  {
    slug: 'requisitos',
    cat: 'tecnico',
    title: 'Requisitos del teléfono',
    body: ['Datecito funciona en Android 7.0 o más reciente y en iPhone con iOS 15.1 o más reciente. Te recomendamos tener la versión más reciente de la app.'],
  },
  {
    slug: 'app-se-cierra',
    cat: 'tecnico',
    title: 'La app se cierra o no carga',
    body: [{ ol: ['Actualiza Datecito a la última versión.', 'Reinicia tu teléfono.', 'Revisa tu conexión a internet.', 'Si continúa, borra la caché (Android) o reinstala la app; tu cuenta no se pierde.'] }, 'Si el problema sigue, escríbenos con el modelo de tu teléfono y la versión de la app.'],
  },
];
