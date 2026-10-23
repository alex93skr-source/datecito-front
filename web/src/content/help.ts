import type { IconName } from '../components/Icon';
import { company, money } from '../site';
import type { Block } from './types';

export type HelpCategory = { slug: string; title: string; icon: IconName; desc: string };
export type HelpArticle = { slug: string; cat: string; title: string; body: Block[] };

export const helpCategories: HelpCategory[] = [
  { slug: 'primeros-pasos', title: 'Primeros pasos', icon: 'sparkle', desc: 'Crear tu cuenta y armar un perfil que enamore.' },
  { slug: 'cuenta', title: 'Cuenta y perfil', icon: 'user', desc: 'Inicio de sesión, fotos, datos y eliminar cuenta.' },
  { slug: 'descubrir', title: 'Descubrir y matches', icon: 'heart', desc: 'Likes, Super likes, filtros y cómo funciona el match.' },
  { slug: 'chat', title: 'Chat y datecitos', icon: 'chat', desc: 'Conversar, proponer planes y organizar tu cita.' },
  { slug: 'aqui-y-ahora', title: 'Aquí y ahora', icon: 'radio', desc: 'Conoce gente disponible cerca de ti hoy.' },
  { slug: 'membresia', title: 'Membresía y pagos', icon: 'star', desc: 'Planes, cobros, cancelación y reembolsos.' },
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
    body: ['Descarga Datecito en Google Play o App Store y toca “Crear cuenta”. Puedes registrarte con tu celular, correo, Google o Apple.', { ol: ['Confirma tu número o correo con el código que te enviamos.', 'Escribe tu nombre y fecha de nacimiento (debes tener 18+).', 'Elige tu género y a quién quieres conocer.', 'Sube al menos 2 fotos donde se vea tu cara.', 'Permite tu ubicación aproximada para ver personas cerca.'] }],
  },
  {
    slug: 'buen-perfil',
    cat: 'primeros-pasos',
    title: 'Consejos para un perfil que funcione',
    body: [{ ul: ['Usa fotos recientes, con buena luz y donde se vea tu cara sin lentes oscuros.', 'Incluye una foto haciendo algo que disfrutas.', 'Escribe una bio corta, honesta y con algo de lo que se pueda platicar.', 'Agrega intereses: son el mejor rompehielos.', 'Verifica tu perfil: los perfiles verificados reciben más matches.'] }],
  },
  {
    slug: 'no-puedo-iniciar-sesion',
    cat: 'cuenta',
    title: 'No puedo iniciar sesión',
    body: [{ ul: ['Revisa que uses el mismo método con el que te registraste (celular, correo, Google o Apple).', 'Si no recibes el código por SMS, espera 60 segundos y toca “Reenviar”. Revisa que tu número tenga la lada correcta.', 'Si olvidaste tu contraseña, toca “¿Olvidaste tu contraseña?” en la pantalla de inicio.', 'Si tu cuenta fue suspendida, verás un aviso al intentar entrar.'] }, 'Si nada funciona, escríbenos a ' + company.emails.support + ' desde el correo de tu cuenta.'],
  },
  {
    slug: 'editar-perfil',
    cat: 'cuenta',
    title: 'Editar fotos y datos del perfil',
    body: ['Ve a Perfil › Editar perfil. Ahí puedes reordenar o cambiar tus fotos, bio, intereses y datos opcionales. Usa “Vista previa” para ver tu perfil como lo ven los demás. Tu fecha de nacimiento no se puede cambiar; si hay un error, contáctanos.'],
  },
  {
    slug: 'eliminar-cuenta',
    cat: 'cuenta',
    title: '¿Cómo elimino mi cuenta?',
    body: ['Ve a Perfil › Ajustes › Cuenta › Eliminar cuenta. Se borrarán tu perfil, matches y conversaciones de forma permanente.', { note: 'Eliminar tu cuenta **no** cancela tu suscripción. Cancélala primero desde Google Play o App Store.' }, 'Si sólo quieres un descanso, puedes pausar tu cuenta: dejarás de aparecer en Descubrir, pero conservarás tus matches.'],
  },
  {
    slug: 'como-funciona-match',
    cat: 'descubrir',
    title: '¿Cómo funciona un match?',
    body: ['En Descubrir, da like (corazón) a quien te interese o pasa (✕). Si esa persona también te da like, ¡es match! y pueden empezar a conversar. Nadie sabe que le diste like hasta que hay match, salvo con un Super like.'],
  },
  {
    slug: 'super-like',
    cat: 'descubrir',
    title: '¿Qué es un Super like?',
    body: [`Un Super like le avisa a la otra persona que te gustó mucho antes de que decida. Con membresía tienes 1 gratis cada día y puedes comprar paquetes de ${p.superPackQty} por ${money(p.superPack)}.`],
  },
  {
    slug: 'filtros',
    cat: 'descubrir',
    title: 'Usar filtros: “Prefiero” y “Sólo”',
    body: ['En Descubrir toca el ícono de filtros. Puedes ajustar edad, distancia e intereses. Cada filtro tiene dos modos:', { ul: ['**Prefiero:** te mostramos primero a quien cumple el filtro, pero también a otras personas.', '**Sólo:** te mostramos únicamente a quien cumple el filtro.'] }],
  },
  {
    slug: 'deshacer',
    cat: 'descubrir',
    title: 'Pasé a alguien por error, ¿puedo regresar?',
    body: ['Sí, con membresía puedes tocar “Deshacer” justo después de pasar un perfil. Si ya diste like, no hay forma de retirarlo, pero si hacen match puedes deshacer el match desde el chat.'],
  },
  {
    slug: 'proponer-datecito',
    cat: 'chat',
    title: '¿Cómo propongo un datecito?',
    body: ['Dentro del chat toca “Proponer datecito”. Elige el tipo de plan (café, comida, caminata, bar…), el lugar, el día y la hora. Tu match puede aceptar, sugerir otro horario o declinar. Cuando acepta, el datecito aparece en tus planes y puedes activar Datecito Seguro.'],
  },
  {
    slug: 'feedback-datecito',
    cat: 'chat',
    title: '¿Para qué es el feedback después del datecito?',
    body: ['Después de un datecito te preguntaremos, en privado, cómo te fue. Tu respuesta no se comparte con la otra persona; nos ayuda a mejorar recomendaciones y detectar comportamientos que no se valen.'],
  },
  {
    slug: 'deshacer-match',
    cat: 'chat',
    title: 'Deshacer un match',
    body: ['En el chat toca ⋯ › Deshacer match. La conversación desaparecerá para ambos y esa persona no volverá a aparecerte. Si algo te hizo sentir incómod@, también puedes reportar.'],
  },
  {
    slug: 'que-es-aqui-y-ahora',
    cat: 'aqui-y-ahora',
    title: '¿Qué es Aquí y ahora?',
    body: ['Aquí y ahora te muestra personas cerca de ti que también están disponibles para verse hoy. Activas tu disponibilidad por 1, 2 o 3 horas y apareces en la lista de quienes estén cerca. Al terminar el tiempo dejas de aparecer automáticamente.'],
  },
  {
    slug: 'ocultarme',
    cat: 'aqui-y-ahora',
    title: 'Ocultarme de una persona en Aquí y ahora',
    body: ['Toca el perfil y elige “Ocultarme de [nombre]”. Esa persona ya no te verá en Aquí y ahora. También puedes desactivar tu disponibilidad en cualquier momento.'],
  },
  {
    slug: 'precios',
    cat: 'membresia',
    title: '¿Cuánto cuesta Datecito?',
    body: [`Durante el lanzamiento Datecito es gratis. Después habrá una sola membresía con todo incluido: mensual de ${money(p.monthly)} o anual de ${money(p.yearly)} (incluye 1 Boost por semana). Tu tienda te mostrará el precio en tu moneda.`],
  },
  {
    slug: 'cancelar-membresia',
    cat: 'membresia',
    title: '¿Cómo cancelo mi membresía?',
    body: [{ ul: ['**Android:** Google Play › Perfil › Pagos y suscripciones › Suscripciones › Datecito › Cancelar.', '**iPhone:** Ajustes › tu nombre › Suscripciones › Datecito › Cancelar.'] }, 'Conservas los beneficios hasta el final del periodo pagado.'],
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
    body: ['Ve a Perfil › Membresía › Restaurar compra. Asegúrate de usar la misma cuenta de Google o Apple con la que pagaste. Si sigue sin aparecer, envíanos tu número de pedido.'],
  },
  {
    slug: 'verificar-perfil',
    cat: 'seguridad',
    title: '¿Cómo verifico mi perfil?',
    body: ['Ve a Perfil › Seguridad › Verificar perfil y toma una selfie siguiendo la pose que te indicamos. Comparamos tu selfie con tus fotos y, si coinciden, recibes la insignia de verificación. Toma unos minutos.'],
  },
  {
    slug: 'datecito-seguro',
    cat: 'seguridad',
    title: '¿Cómo funciona Datecito Seguro?',
    body: ['Antes de tu cita, activa Datecito Seguro desde el datecito. Compartimos con tus contactos de confianza dónde, cuándo y con quién estarás. Eliges una hora de check-in; si no confirmas que estás bien, te recordaremos y podrás avisar a tus contactos. Durante la cita tienes a la mano: “Llamada de salida”, “Necesito ayuda” y “Llamar al 911”.'],
  },
  {
    slug: 'reportar',
    cat: 'seguridad',
    title: '¿Cómo reporto a alguien?',
    body: ['En su perfil o en el chat toca ⋯ › Reportar, elige el motivo y agrega detalles si quieres. La persona no sabrá que la reportaste. Si estás en peligro inmediato, llama al 911.'],
  },
  {
    slug: 'bloquear',
    cat: 'seguridad',
    title: 'Bloquear a alguien',
    body: ['Toca ⋯ › Bloquear en su perfil o chat. No podrá verte ni escribirte. Puedes ver y administrar a quién bloqueaste en Ajustes › Bloqueados.'],
  },
  {
    slug: 'quien-me-escribe',
    cat: 'seguridad',
    title: 'Elegir quién puede escribirme',
    body: ['En Ajustes › Privacidad puedes activar “Sólo perfiles verificados pueden escribirme” o “Yo escribo primero”, para que nadie te mande mensaje hasta que tú lo hagas.'],
  },
  {
    slug: 'ubicacion',
    cat: 'privacidad',
    title: '¿Quién ve mi ubicación?',
    body: ['Nadie ve tu ubicación exacta. Mostramos sólo una distancia aproximada (por ejemplo, “a 3 km”). Usamos tu ubicación sólo mientras usas la app; nunca en segundo plano.'],
  },
  {
    slug: 'descargar-datos',
    cat: 'privacidad',
    title: 'Descargar una copia de mis datos',
    body: ['Ve a Ajustes › Privacidad › Descargar mis datos. Te enviaremos un archivo a tu correo en un máximo de 20 días hábiles. También puedes ejercer tus derechos ARCO desde datecito.com/es/legal/arco.'],
  },
  {
    slug: 'notificaciones',
    cat: 'tecnico',
    title: 'No me llegan notificaciones',
    body: [{ ul: ['Revisa en Ajustes › Notificaciones de Datecito que estén activadas.', 'Revisa los permisos de notificaciones de tu teléfono para Datecito.', 'Desactiva el modo de ahorro de batería para Datecito.', 'Cierra sesión y vuelve a entrar.'] }],
  },
  {
    slug: 'requisitos',
    cat: 'tecnico',
    title: 'Requisitos del teléfono',
    body: ['Datecito funciona en Android 8.0 o superior y en iPhone con iOS 16 o superior. Te recomendamos tener la versión más reciente de la app.'],
  },
  {
    slug: 'app-se-cierra',
    cat: 'tecnico',
    title: 'La app se cierra o no carga',
    body: [{ ol: ['Actualiza Datecito a la última versión.', 'Reinicia tu teléfono.', 'Revisa tu conexión a internet.', 'Si continúa, borra la caché (Android) o reinstala la app; tu cuenta no se pierde.'] }, 'Si el problema sigue, escríbenos con el modelo de tu teléfono y la versión de la app.'],
  },
];
