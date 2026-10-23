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
      'Hiciste match. Ahora viene la parte que a todos nos pone nerviosos: el primer mensaje. La buena noticia es que no necesitas ser ingenios@, sólo específic@.',
      { h3: '1. Usa algo de su perfil' },
      '“¿Ese taco de la tercera foto es de la Roma? Necesito la dirección” funciona mucho mejor que un “hola, ¿cómo estás?”. Demuestra que leíste su perfil.',
      { h3: '2. Haz una pregunta fácil de contestar' },
      'Las preguntas abiertas pero ligeras invitan a seguir: “¿Cuál es tu plan perfecto de domingo?”.',
      { h3: '3. Propón pronto' },
      'Si la plática fluye, no la alargues semanas. Usa “Proponer datecito” y conviértelo en un plan concreto.',
    ],
  },
  {
    slug: 'ideas-de-datecito-cdmx',
    title: '15 ideas de datecito en CDMX que no son “ir por un café”',
    cat: 'Destinos',
    date: '1 oct 2026',
    read: '6 min',
    emoji: '🌮',
    color: '#0F3D32',
    excerpt: 'Desde trajineras al atardecer hasta clases de cerámica: planes para todos los presupuestos.',
    body: ['La Ciudad de México está llena de planes para una primera cita que rompen la rutina.', { ul: ['Caminar por el Bosque de Chapultepec y remar en el lago.', 'Mercado de San Juan para probar algo nuevo.', 'Cine de arte en la Cineteca Nacional.', 'Lucha libre en la Arena México.', 'Clase de cerámica en la Roma.', 'Atardecer en la terraza de un museo del Centro.', 'Recorrido de murales en el Centro Histórico.', 'Trajinera en Xochimilco por la mañana.'] }, 'Tip: para una primera cita elige lugares públicos y concurridos, y activa Datecito Seguro.'],
  },
  {
    slug: 'senales-de-alerta',
    title: 'Señales de alerta: cuándo es mejor no seguir la plática',
    cat: 'Seguridad',
    date: '24 sep 2026',
    read: '5 min',
    emoji: '🚩',
    color: '#EF5A5A',
    excerpt: 'Pedir dinero, apurarte a salir de la app o evitar las videollamadas son focos rojos.',
    body: ['Casi todas las personas en Datecito están aquí por las razones correctas. Aun así, conviene reconocer las señales de alerta:', { ul: ['Te pide dinero, regalos, recargas o que inviertas en algo.', 'Insiste en mover la plática a otra app muy rápido.', 'Evita videollamadas o encontrarse en lugares públicos.', 'Su historia cambia o no coincide con su perfil.', 'Te presiona o se enoja si pones límites.'] }, 'Si notas algo así, deja de responder, bloquea y reporta. Nunca es exagerado cuidarte.'],
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
    body: ['La química no siempre es un flechazo. A veces es la sensación de que el tiempo se fue rápido. Pregúntate: ¿me sentí yo mism@?, ¿hubo curiosidad mutua?, ¿quiero contarle algo que me pasó hoy?', 'Si la respuesta es sí, propón algo concreto y diferente para la segunda.'],
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
    slug: 'tendencias-citas-2026',
    title: 'Cómo ligamos en 2026: tendencias de la comunidad Datecito',
    cat: 'Cultura',
    date: '3 sep 2026',
    read: '7 min',
    emoji: '📊',
    color: '#FF8F7A',
    excerpt: 'Planes de día, citas activas y más honestidad desde el perfil.',
    body: ['Las citas de día van en aumento, cada vez más personas prefieren conocerse caminando o en un mercado, y la honestidad sobre lo que se busca es la nueva norma. [Datos ilustrativos: sustituir por métricas reales de la comunidad].'],
  },
];

export type City = { slug: string; name: string; state: string; ideas: string[]; blurb: string };

export const cities: City[] = [
  { slug: 'ciudad-de-mexico', name: 'Ciudad de México', state: 'CDMX', blurb: 'Museos, mercados, terrazas y parques: la capital tiene un datecito para cada gusto.', ideas: ['Remar en el lago de Chapultepec', 'Tacos en la Roma o la Condesa', 'Cineteca Nacional', 'Mercado de Coyoacán', 'Lucha libre en la Arena México'] },
  { slug: 'guadalajara', name: 'Guadalajara', state: 'Jalisco', blurb: 'Tortas ahogadas, arte y noches tapatías.', ideas: ['Caminar por Chapultepec Gdl', 'Tlaquepaque y sus galerías', 'Mercado San Juan de Dios', 'Atardecer en el Bosque Los Colomos'] },
  { slug: 'monterrey', name: 'Monterrey', state: 'Nuevo León', blurb: 'Montañas, carne asada y el Paseo Santa Lucía.', ideas: ['Paseo Santa Lucía en lancha', 'Parque Fundidora', 'Barrio Antiguo', 'Chipinque al amanecer'] },
  { slug: 'puebla', name: 'Puebla', state: 'Puebla', blurb: 'Talavera, mole y el encanto del centro.', ideas: ['Callejón de los Sapos', 'Cholula y su pirámide', 'Mercado de Sabores', 'Estrella de Puebla'] },
  { slug: 'queretaro', name: 'Querétaro', state: 'Querétaro', blurb: 'Viñedos cercanos y un centro para caminar.', ideas: ['Ruta del arte, queso y vino', 'Acueducto al atardecer', 'Peña de Bernal', 'Centro histórico'] },
  { slug: 'merida', name: 'Mérida', state: 'Yucatán', blurb: 'Cenotes, cocina yucateca y noches de trova.', ideas: ['Paseo de Montejo en bici', 'Cenotes de Cuzamá', 'Noche mexicana en el Remate', 'Mercado Lucas de Gálvez'] },
  { slug: 'tijuana', name: 'Tijuana', state: 'Baja California', blurb: 'Cerveza artesanal, tacos y mar.', ideas: ['Playas de Tijuana', 'Pasaje Rodríguez', 'Ruta de cerveza artesanal', 'Valle de Guadalupe (cerca)'] },
  { slug: 'cancun', name: 'Cancún', state: 'Quintana Roo', blurb: 'Playa, snorkel y atardeceres en la laguna.', ideas: ['Atardecer en la laguna Nichupté', 'Isla Mujeres en ferry', 'Mercado 28', 'Snorkel en Punta Nizuc'] },
  { slug: 'leon', name: 'León', state: 'Guanajuato', blurb: 'Zona piel, guacamayas y escapadas a Guanajuato.', ideas: ['Calzada de los Héroes', 'Parque Metropolitano', 'Escapada a Guanajuato capital'] },
  { slug: 'oaxaca', name: 'Oaxaca', state: 'Oaxaca', blurb: 'Mezcal, mercados y calles llenas de color.', ideas: ['Andador de Macedonio Alcalá', 'Mercado 20 de Noviembre', 'Hierve el Agua', 'Clase de cocina oaxaqueña'] },
  { slug: 'bogota', name: 'Bogotá', state: 'Colombia', blurb: 'Próximamente: café, montañas y La Candelaria.', ideas: ['Monserrate', 'La Candelaria', 'Usaquén'] },
  { slug: 'madrid', name: 'Madrid', state: 'España', blurb: 'Próximamente: tapas, Retiro y atardeceres en el Templo de Debod.', ideas: ['Parque del Retiro', 'Templo de Debod', 'Mercado de San Miguel'] },
];

export type Job = { id: string; title: string; team: string; place: string; type: string };

export const jobs: Job[] = [
  { id: 'rn-senior', title: 'Ingenier@ Senior React Native', team: 'Ingeniería', place: 'CDMX · Híbrido', type: 'Tiempo completo' },
  { id: 'backend-laravel', title: 'Ingenier@ Backend (PHP / Laravel)', team: 'Ingeniería', place: 'Remoto · México', type: 'Tiempo completo' },
  { id: 'ml-recos', title: 'Machine Learning Engineer, Recomendaciones', team: 'Datos', place: 'Remoto · LATAM', type: 'Tiempo completo' },
  { id: 'trust-safety', title: 'Especialista en Confianza y Seguridad', team: 'Confianza y Seguridad', place: 'CDMX · Híbrido', type: 'Tiempo completo' },
  { id: 'moderador', title: 'Moderador(a) de contenido (turno nocturno)', team: 'Confianza y Seguridad', place: 'Remoto · México', type: 'Tiempo completo' },
  { id: 'product-designer', title: 'Product Designer', team: 'Diseño', place: 'CDMX · Híbrido', type: 'Tiempo completo' },
  { id: 'growth', title: 'Growth Marketing Manager', team: 'Marketing', place: 'CDMX · Híbrido', type: 'Tiempo completo' },
  { id: 'community', title: 'Community Manager', team: 'Marketing', place: 'Guadalajara · Híbrido', type: 'Tiempo completo' },
  { id: 'cx', title: 'Agente de Experiencia de Usuari@', team: 'Soporte', place: 'Remoto · México', type: 'Medio tiempo' },
  { id: 'legal', title: 'Abogad@ de Privacidad y Protección de Datos', team: 'Legal', place: 'CDMX · Híbrido', type: 'Tiempo completo' },
];

export type PressItem = { date: string; title: string; text: string };

export const press: PressItem[] = [
  { date: '15 oct 2026', title: 'Datecito lanza Datecito Seguro: compartir tu plan y check-ins para cada cita', text: 'La nueva herramienta permite avisar a contactos de confianza dónde y con quién estarás, con recordatorios y acceso rápido al 911.' },
  { date: '1 oct 2026', title: 'Llega “Aquí y ahora”: conoce a personas disponibles cerca de ti hoy', text: 'Una forma de pasar del match al plan en el mismo día, con disponibilidad por tiempo limitado.' },
  { date: '15 sep 2026', title: 'Datecito abre su beta en Ciudad de México, Guadalajara y Monterrey', text: 'La app de citas mexicana enfocada en planes reales llega a sus primeras tres ciudades.' },
  { date: '1 sep 2026', title: 'Datecito presenta su identidad de marca', text: 'Verde profundo, coral y crema: una marca cálida y cercana para conocer personas.' },
];

export const techPosts = [
  { title: 'Cómo construimos Descubrir con React Native y animaciones a 60 fps', date: '2 oct 2026', tag: 'Móvil' },
  { title: 'Distancias aproximadas sin exponer la ubicación exacta', date: '18 sep 2026', tag: 'Privacidad' },
  { title: 'Moderación híbrida: modelos automáticos + revisión humana', date: '4 sep 2026', tag: 'Confianza y Seguridad' },
  { title: 'Nuestra API en Laravel: versionado, pruebas y despliegues', date: '21 ago 2026', tag: 'Backend' },
  { title: 'Compras dentro de la app: validación de recibos en el servidor', date: '7 ago 2026', tag: 'Pagos' },
];

export const stories = [
  { names: 'Mariana y Joaquín', city: 'CDMX', text: 'Hicimos match un martes y el jueves ya estábamos en un datecito de tacos. Seguimos probando taquerías juntos.', initials: 'MJ' },
  { names: 'Daniela y Sofía', city: 'Guadalajara', text: 'Lo que más me gustó fue poder proponer el plan dentro de la app. Cero vueltas, directo al café.', initials: 'DS' },
  { names: 'Rodrigo y Paola', city: 'Monterrey', text: 'Activé Datecito Seguro en nuestra primera cita y me sentí tranquila. Hoy vivimos juntos.', initials: 'RP' },
  { names: 'Andrés y Luis', city: 'Querétaro', text: 'Nos encontramos en Aquí y ahora un domingo por la tarde. Fue el mejor domingo del año.', initials: 'AL' },
  { names: 'Fernanda y Diego', city: 'Puebla', text: 'Los dos estábamos verificados y eso nos dio confianza desde el primer mensaje.', initials: 'FD' },
  { names: 'Carla y Emilio', city: 'Mérida', text: 'Nuestra primera cita fue en un cenote. La segunda, en otro. Ya vamos por el número 12.', initials: 'CE' },
];
