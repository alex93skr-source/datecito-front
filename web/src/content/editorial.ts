import type { Block } from './types';

export type Post = { slug: string; title: string; cat: string; date: string; read: string; emoji: string; color: string; excerpt: string; body: Block[] };

export const posts: Post[] = [
  {
    slug: 'primer-mensaje-que-si-funciona',
    title: 'El primer mensaje que sí funciona (y por qué “hola” no basta)',
    cat: 'Consejos',
    date: '8 oct 2026',
    read: '4 min',
    emoji: '💬',
    color: '#FF6B6B',
    excerpt: 'Tres fórmulas sencillas para romper el hielo sin sonar a guion.',
    body: [
      'Hiciste match. Ahora viene la parte que a todos nos pone nerviosos: el primer mensaje. La buena noticia es que no necesitas ser una persona ingeniosa, sólo específica.',
      { h3: '1. Usa algo de su perfil' },
      '“¿Ese taco de la tercera foto es de la Roma? Necesito la dirección” funciona mucho mejor que un “hola, ¿cómo estás?”. Demuestra que leíste su perfil. En Datecito ves de entrada lo que tienen en común: intereses, música, equipo o una pregunta respondida. Empieza por ahí.',
      { h3: '2. Haz una pregunta fácil de contestar' },
      'Las preguntas abiertas pero ligeras invitan a seguir: “¿Cuál es tu plan perfecto de domingo?”.',
      { h3: '3. Propón pronto' },
      'Si la plática fluye, no la alargues semanas. Toca “¿Se arma? Propón un datecito”, elige día y hora en el calendario y conviértelo en un plan concreto.',
    ],
  },
  {
    slug: 'ideas-de-datecito-cdmx',
    title: '8 ideas de datecito en CDMX que no son “ir por un café”',
    cat: 'Destinos',
    date: '1 oct 2026',
    read: '5 min',
    emoji: '🌮',
    color: '#0F3D32',
    excerpt: 'Desde trajineras al amanecer hasta clases de cerámica: planes para todos los presupuestos.',
    body: ['La Ciudad de México y su área metropolitana están llenas de planes para una primera cita que rompen la rutina.', { ul: ['Caminar por el Bosque de Chapultepec y remar en el lago.', 'Mercado de San Juan para probar algo nuevo.', 'Cine de arte en la Cineteca Nacional.', 'Lucha libre en la Arena México.', 'Clase de cerámica en la Roma.', 'Atardecer en la terraza de un museo del Centro.', 'Recorrido de murales en el Centro Histórico.', 'Trajinera en Xochimilco por la mañana.'] }, 'Tip: para una primera cita elige lugares públicos y concurridos, y activa Datecito Seguro.'],
  },
  {
    slug: 'senales-de-alerta',
    title: 'Señales de alerta: cuándo es mejor no seguir la plática',
    cat: 'Seguridad',
    date: '24 sep 2026',
    read: '5 min',
    emoji: '🚩',
    color: '#EF5A5A',
    excerpt: 'Pedir dinero, apurarte a salir de la app o evitar verse en público son focos rojos.',
    body: ['Casi todas las personas en Datecito están aquí por las razones correctas. Aun así, conviene reconocer las señales de alerta:', { ul: ['Te pide dinero, regalos, recargas o que inviertas en algo.', 'Insiste en mover la plática a otra app muy rápido.', 'Evita verificar su perfil o encontrarse en lugares públicos.', 'Su historia cambia o no coincide con su perfil.', 'Te pide fotos íntimas o te presiona si pones límites.'] }, 'Si notas algo así, deja de responder, bloquea y reporta. Nunca es exagerado cuidarte.'],
  },
  {
    slug: 'segunda-cita',
    title: 'De la primera a la segunda cita: cómo saber si hay química',
    cat: 'Relaciones',
    date: '17 sep 2026',
    read: '4 min',
    emoji: '✨',
    color: '#FFB199',
    excerpt: 'Las señales sutiles de que ambos quieren repetir.',
    body: ['La química no siempre es un flechazo. A veces es la sensación de que el tiempo se fue rápido. Pregúntate: ¿pude ser yo?, ¿hubo curiosidad mutua?, ¿quiero contarle algo que me pasó hoy?', 'Si la respuesta es sí, propón algo concreto y diferente para la segunda.'],
  },
  {
    slug: 'citas-y-ansiedad',
    title: 'Ansiedad antes de una cita: lo que dice la psicología',
    cat: 'Bienestar',
    date: '10 sep 2026',
    read: '5 min',
    emoji: '🧘',
    color: '#1E5446',
    excerpt: 'Respirar, bajar expectativas y elegir un plan cómodo ayudan más de lo que crees.',
    body: ['Sentir nervios antes de una cita es normal. Algunas estrategias: elige un plan corto y en un lugar que conozcas, ten una salida planeada, respira lento antes de entrar y recuerda que la otra persona probablemente también está nerviosa.'],
  },
  {
    slug: 'por-que-limitamos-los-likes',
    title: 'Por qué Datecito te da 30 likes al día (y no infinitos)',
    cat: 'Cultura',
    date: '3 sep 2026',
    read: '4 min',
    emoji: '🌱',
    color: '#FF8F7A',
    excerpt: 'Menos deslizar sin pensar, más intención. Así diseñamos el ritmo de la app.',
    body: [
      'En la mayoría de las apps de citas puedes deslizar sin parar. El resultado conocido: likes que no significan nada, gente que no responde y la sensación de estar en un catálogo.',
      'En Datecito cada día recibes 40 perfiles y 30 likes. No es un castigo: es suficiente para conocer gente y poco para que un like deje de importar. Si alguien te gustó de verdad, tienes además un Super like gratis cada tres días para decírselo.',
      'Y como todos nos equivocamos con el pulgar, quien pasaste de largo vuelve a aparecer a los 14 días. Segunda oportunidad para ambos.',
    ],
  },
];

export type City = { slug: string; name: string; state: string; ideas: string[]; blurb: string };

/** Guías de ideas por ciudad. Datecito empieza en el área metropolitana de la CDMX; las demás son inspiración. */
export const cities: City[] = [
  { slug: 'ciudad-de-mexico', name: 'Ciudad de México', state: 'CDMX y área metropolitana', blurb: 'Museos, mercados, terrazas y parques: la capital tiene un datecito para cada gusto.', ideas: ['Remar en el lago de Chapultepec', 'Tacos en la Roma o la Condesa', 'Cineteca Nacional', 'Mercado de Coyoacán', 'Lucha libre en la Arena México', 'Caminar el Bosque de Aragón'] },
  { slug: 'guadalajara', name: 'Guadalajara', state: 'Jalisco', blurb: 'Tortas ahogadas, arte y noches tapatías.', ideas: ['Caminar por Chapultepec Gdl', 'Tlaquepaque y sus galerías', 'Mercado San Juan de Dios', 'Atardecer en el Bosque Los Colomos'] },
  { slug: 'monterrey', name: 'Monterrey', state: 'Nuevo León', blurb: 'Montañas, carne asada y el Paseo Santa Lucía.', ideas: ['Paseo Santa Lucía en lancha', 'Parque Fundidora', 'Barrio Antiguo', 'Chipinque al amanecer'] },
  { slug: 'puebla', name: 'Puebla', state: 'Puebla', blurb: 'Talavera, mole y el encanto del centro.', ideas: ['Callejón de los Sapos', 'Cholula y su pirámide', 'Mercado de Sabores', 'Estrella de Puebla'] },
  { slug: 'queretaro', name: 'Querétaro', state: 'Querétaro', blurb: 'Viñedos cercanos y un centro para caminar.', ideas: ['Ruta del arte, queso y vino', 'Acueducto al atardecer', 'Peña de Bernal', 'Centro histórico'] },
  { slug: 'merida', name: 'Mérida', state: 'Yucatán', blurb: 'Cenotes, cocina yucateca y noches de trova.', ideas: ['Paseo de Montejo en bici', 'Cenotes de Cuzamá', 'Noche mexicana en el Remate', 'Mercado Lucas de Gálvez'] },
  { slug: 'tijuana', name: 'Tijuana', state: 'Baja California', blurb: 'Cerveza artesanal, tacos y mar.', ideas: ['Playas de Tijuana', 'Pasaje Rodríguez', 'Ruta de cerveza artesanal', 'Valle de Guadalupe (cerca)'] },
  { slug: 'cancun', name: 'Cancún', state: 'Quintana Roo', blurb: 'Playa, snorkel y atardeceres en la laguna.', ideas: ['Atardecer en la laguna Nichupté', 'Isla Mujeres en ferry', 'Mercado 28', 'Snorkel en Punta Nizuc'] },
  { slug: 'leon', name: 'León', state: 'Guanajuato', blurb: 'Zona piel, guacamayas y escapadas a Guanajuato.', ideas: ['Calzada de los Héroes', 'Parque Metropolitano', 'Escapada a Guanajuato capital'] },
  { slug: 'oaxaca', name: 'Oaxaca', state: 'Oaxaca', blurb: 'Mezcal, mercados y calles llenas de color.', ideas: ['Andador de Macedonio Alcalá', 'Mercado 20 de Noviembre', 'Hierve el Agua', 'Clase de cocina oaxaqueña'] },
];
