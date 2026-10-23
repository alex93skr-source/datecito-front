// Catálogos de la interfaz (mismos valores que config/datecito.php en el backend).

/* ---------- Catálogos ---------- */

export const intents = ['Conocer a alguien especial', 'Algo serio, con calma', 'Conocer sin presión', 'Todavía lo estoy descubriendo'];

export const relationshipTypes = ['Monógama', 'Relación abierta', 'No monógama', 'Prefiero platicarlo'];

export const interestCatalog: { title: string; emoji: string; items: string[] }[] = [
  { title: 'Comida', emoji: '🍽️', items: ['Tacos', 'Cocina', 'Repostería', 'Brunch', 'Comida vegana', 'Sushi', 'Comida callejera', 'Mariscos', 'Pizza', 'Restaurantes nuevos'] },
  { title: 'Bebidas', emoji: '🍹', items: ['Café', 'Mezcal', 'Vino', 'Cerveza artesanal', 'Cocteles', 'Tequila', 'Micheladas', 'Pulque', 'Té', 'Sin alcohol'] },
  { title: 'Deportes', emoji: '🏆', items: ['Fútbol', 'Fútbol americano', 'Básquetbol', 'Béisbol', 'Box', 'Lucha libre', 'Fórmula 1', 'Tenis', 'Pádel', 'Gym', 'Running', 'Ciclismo', 'Natación', 'Yoga', 'Escalada'] },
  { title: 'Aire libre', emoji: '🌄', items: ['Senderismo', 'Campismo', 'Playa', 'Pueblos mágicos', 'Atardeceres'] },
  { title: 'Cultura', emoji: '🎭', items: ['Cine', 'Museos', 'Teatro', 'Libros', 'Arte', 'Fotografía', 'Arquitectura', 'Diseño', 'Stand-up', 'Historia'] },
  { title: 'Música y fiesta', emoji: '🎶', items: ['Conciertos', 'Vinilos', 'Karaoke', 'Bailar', 'Festivales', 'Tocar un instrumento', 'Antros', 'Cantinas'] },
  { title: 'En casa', emoji: '🛋️', items: ['Videojuegos', 'Series', 'Anime', 'Juegos de mesa', 'Plantas', 'Podcasts', 'Cerámica', 'Manualidades'] },
  { title: 'Viajes y causas', emoji: '🌎', items: ['Viajes', 'Road trips', 'Voluntariado', 'Mascotas', 'Medio ambiente', 'Idiomas'] },
];

const interestEmoji: Record<string, string> = {
  Tacos: '🌮', Cocina: '👩‍🍳', Repostería: '🧁', Brunch: '🥞', 'Comida vegana': '🥗', Sushi: '🍣', 'Comida callejera': '🌯', Mariscos: '🦐', Pizza: '🍕', 'Restaurantes nuevos': '🍴',
  Café: '☕', Mezcal: '🥃', Vino: '🍷', 'Cerveza artesanal': '🍺', Cocteles: '🍸', Tequila: '🥃', Micheladas: '🍻', Pulque: '🌵', Té: '🍵', 'Sin alcohol': '🧃',
  Fútbol: '⚽', 'Fútbol americano': '🏈', Básquetbol: '🏀', Béisbol: '⚾', Box: '🥊', 'Lucha libre': '🤼', 'Fórmula 1': '🏎️', Tenis: '🎾', Pádel: '🏓', Gym: '🏋️', Running: '🏃', Ciclismo: '🚴', Natación: '🏊', Yoga: '🧘', Escalada: '🧗',
  Senderismo: '🥾', Campismo: '⛺', Playa: '🏖️', 'Pueblos mágicos': '🏘️', Atardeceres: '🌅',
  Cine: '🎬', Museos: '🏛️', Teatro: '🎭', Libros: '📚', Arte: '🎨', Fotografía: '📷', Arquitectura: '🏙️', Diseño: '✏️', 'Stand-up': '🎤', Historia: '📜',
  Conciertos: '🎸', Vinilos: '💿', Karaoke: '🎙️', Bailar: '💃', Festivales: '🎪', 'Tocar un instrumento': '🎹', Antros: '🪩', Cantinas: '🍶',
  Videojuegos: '🎮', Series: '📺', Anime: '🍥', 'Juegos de mesa': '🎲', Plantas: '🪴', Podcasts: '🎧', Cerámica: '🏺', Manualidades: '🧶',
  Viajes: '✈️', 'Road trips': '🚗', Voluntariado: '🤝', Mascotas: '🐾', 'Medio ambiente': '🌱', Idiomas: '🗣️',
};

export const emojiFor = (interest: string) => interestEmoji[interest] ?? '';

/** Interés con su emoji, listo para mostrar. */
export const withEmoji = (interest: string) => (interestEmoji[interest] ? `${interestEmoji[interest]} ${interest}` : interest);

/** "¿A qué equipo le vas?": aparece al elegir el deporte. Mismos valores que el backend. */
export const sportTeams: Record<string, { league: string; teams: string[] }[]> = {
  Fútbol: [
    { league: 'Liga MX', teams: ['América', 'Chivas', 'Cruz Azul', 'Pumas', 'Tigres', 'Rayados', 'Toluca', 'Santos Laguna', 'Pachuca', 'León', 'Atlas', 'Puebla', 'Querétaro', 'Necaxa', 'Mazatlán', 'FC Juárez', 'Xolos', 'Atlético de San Luis'] },
    { league: 'Internacional', teams: ['Selección Mexicana', 'Real Madrid', 'Barcelona', 'Manchester United', 'Manchester City', 'Liverpool', 'Chelsea', 'Arsenal', 'Bayern Múnich', 'PSG', 'Juventus', 'Milan', 'Inter', 'Boca Juniors', 'River Plate'] },
  ],
  'Fútbol americano': [
    { league: 'NFL', teams: ['Cardinals', 'Falcons', 'Ravens', 'Bills', 'Panthers', 'Bears', 'Bengals', 'Browns', 'Cowboys', 'Broncos', 'Lions', 'Packers', 'Texans', 'Colts', 'Jaguars', 'Chiefs', 'Raiders', 'Chargers', 'Rams', 'Dolphins', 'Vikings', 'Patriots', 'Saints', 'Giants', 'Jets', 'Eagles', 'Steelers', '49ers', 'Seahawks', 'Buccaneers', 'Titans', 'Commanders'] },
  ],
  Básquetbol: [
    { league: 'NBA', teams: ['Hawks', 'Celtics', 'Nets', 'Hornets', 'Bulls', 'Cavaliers', 'Mavericks', 'Nuggets', 'Pistons', 'Warriors', 'Rockets', 'Pacers', 'Clippers', 'Lakers', 'Grizzlies', 'Heat', 'Bucks', 'Timberwolves', 'Pelicans', 'Knicks', 'Thunder', 'Magic', '76ers', 'Suns', 'Trail Blazers', 'Kings', 'Spurs', 'Raptors', 'Jazz', 'Wizards'] },
    { league: 'México', teams: ['Capitanes CDMX'] },
  ],
  Béisbol: [
    { league: 'México', teams: ['Diablos Rojos del México', 'Sultanes de Monterrey', 'Toros de Tijuana', 'Charros de Jalisco', 'Tomateros de Culiacán', 'Naranjeros de Hermosillo', 'Águilas de Mexicali', 'Algodoneros de Unión Laguna'] },
    { league: 'MLB', teams: ['Dodgers', 'Yankees', 'Red Sox', 'Cubs', 'Astros', 'Padres', 'Braves', 'Mets', 'Giants', 'Cardinals', 'Mariners', 'Rangers'] },
  ],
};

export const TEAMS_PER_SPORT = 2;

export const musicGenres = ['Pop', 'Rock', 'Indie', 'Reggaetón', 'Regional mexicano', 'Electrónica', 'Jazz', 'Salsa', 'Hip hop', 'R&B', 'Cumbia', 'Trova', 'Alternativo', 'Clásica', 'Metal', 'K-pop'];

export const languages = ['Español', 'Inglés', 'Francés', 'Portugués', 'Alemán', 'Italiano', 'Lengua de señas', 'Náhuatl'];

export type BasicKey = 'drink' | 'smoke' | 'exercise' | 'pets' | 'kids' | 'education' | 'zodiac';

export const basicQuestions: { key: BasicKey; label: string; icon: string; options: string[] }[] = [
  { key: 'drink', label: 'Alcohol', icon: 'wine-outline', options: ['No tomo', 'Socialmente', 'Con frecuencia'] },
  { key: 'smoke', label: 'Tabaco', icon: 'cloud-outline', options: ['No fumo', 'A veces', 'Sí fumo'] },
  { key: 'exercise', label: 'Ejercicio', icon: 'barbell-outline', options: ['Diario', 'Algunas veces', 'Casi nunca'] },
  { key: 'pets', label: 'Mascotas', icon: 'paw-outline', options: ['Tengo perro', 'Tengo gato', 'Otra mascota', 'Sin mascotas', 'Quiero tener'] },
  { key: 'kids', label: 'Hijos', icon: 'happy-outline', options: ['Tengo hijos', 'Quiero algún día', 'No quiero', 'Aún no lo sé'] },
  { key: 'education', label: 'Estudios', icon: 'school-outline', options: ['Preparatoria', 'Universidad', 'Posgrado', 'Otro'] },
  { key: 'zodiac', label: 'Signo', icon: 'moon-outline', options: ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'] },
];

export const promptOptions = [
  'Mi datecito ideal',
  'Me ganas si…',
  'Un domingo perfecto…',
  'Mi red flag es…',
  'Algo que no sabías de mí',
  'Lo que más valoro',
  'La canción que no puedo dejar de escuchar',
  'Mi lugar favorito de la ciudad',
];

/** Tipos de plan para proponer un datecito (sin catálogo de lugares). */
export type PlanKind = 'cafe' | 'comida' | 'bar' | 'naturaleza' | 'cultura' | 'otro';
export const planKinds: { key: PlanKind; label: string; icon: string }[] = [
  { key: 'cafe', label: 'Café', icon: 'cafe-outline' },
  { key: 'comida', label: 'Comida', icon: 'restaurant-outline' },
  { key: 'bar', label: 'Bar', icon: 'wine-outline' },
  { key: 'naturaleza', label: 'Aire libre', icon: 'leaf-outline' },
  { key: 'cultura', label: 'Cultura', icon: 'ticket-outline' },
  { key: 'otro', label: 'Otro plan', icon: 'sparkles-outline' },
];

export const timeSlots = ['Hoy en la tarde', 'Mañana', 'Viernes por la tarde', 'Sábado', 'Domingo por la mañana'];

/* ---------- Seguridad ---------- */

export const safetyTips = [
  { icon: 'people-outline', title: 'Conózcanse en un lugar público', text: 'Elige cafés, parques o lugares concurridos para las primeras citas.' },
  { icon: 'share-social-outline', title: 'Comparte tu plan', text: 'Activa Datecito Seguro para avisar a alguien de confianza.' },
  { icon: 'heart-outline', title: 'Confía en tu instinto', text: 'Si algo no se siente bien, puedes irte cuando quieras. No le debes explicaciones a nadie.' },
  { icon: 'car-outline', title: 'Ten tu propio transporte', text: 'Así decides cuándo llegar y cuándo irte.' },
];

/** Palabras que disparan el aviso "¿Seguro que quieres enviar esto?" (maqueta). */
export const flaggedWords = ['estúpida', 'estúpido', 'pendeja', 'pendejo', 'puta', 'perra', 'zorra', 'fea', 'gorda', 'idiota', 'nudes', 'pack'];
