import type { Block } from '../types';

export type Post = { slug: string; title: string; cat: string; date: string; read: string; emoji: string; color: string; excerpt: string; body: Block[] };

export const posts: Post[] = [
  {
    slug: 'primer-mensaje-que-si-funciona',
    title: 'The first message that actually works (and why “hi” isn’t enough)',
    cat: 'Tips',
    date: 'Oct 8, 2026',
    read: '4 min',
    emoji: '💬',
    color: '#FF6B6B',
    excerpt: 'Three simple formulas to break the ice without sounding scripted.',
    body: [
      'You matched. Now comes the part that makes all of us nervous: the first message. The good news is you don’t need to be witty, just specific.',
      { h3: '1. Use something from their profile' },
      '“Is that taco in your third photo from Roma? I need the address” works much better than “hi, how are you?”. It shows you read their profile. On Datecito you see what you have in common right away: interests, music, a team or an answered prompt. Start there.',
      { h3: '2. Ask something easy to answer' },
      'Open but light questions invite a reply: “What’s your perfect Sunday plan?”.',
      { h3: '3. Propose soon' },
      'If the conversation flows, don’t drag it out for weeks. Tap “Propose a datecito”, pick a day and time on the calendar and turn it into a concrete plan.',
    ],
  },
  {
    slug: 'ideas-de-datecito-cdmx',
    title: '8 date ideas in Mexico City that aren’t “grab a coffee”',
    cat: 'Destinations',
    date: 'Oct 1, 2026',
    read: '5 min',
    emoji: '🌮',
    color: '#0F3D32',
    excerpt: 'From dawn boat rides to pottery classes: plans for every budget.',
    body: ['Mexico City and its metro area are full of first-date plans that break the routine.', { ul: ['Walk through Chapultepec Forest and row on the lake.', 'San Juan Market to try something new.', 'Art-house cinema at the Cineteca Nacional.', 'Lucha libre at Arena México.', 'A pottery class in Roma.', 'Sunset on a museum terrace downtown.', 'Mural tour of the Historic Center.', 'A trajinera in Xochimilco in the morning.'] }, 'Tip: for a first date choose public, busy places and turn on Datecito Safe.'],
  },
  {
    slug: 'senales-de-alerta',
    title: 'Red flags: when it’s better to stop chatting',
    cat: 'Safety',
    date: 'Sep 24, 2026',
    read: '5 min',
    emoji: '🚩',
    color: '#EF5A5A',
    excerpt: 'Asking for money, rushing you off the app or avoiding meeting in public are red flags.',
    body: ['Almost everyone on Datecito is here for the right reasons. Still, it helps to recognize the red flags:', { ul: ['They ask for money, gifts, top-ups or to invest in something.', 'They insist on moving the conversation to another app very quickly.', 'They avoid verifying their profile or meeting in public places.', 'Their story changes or doesn’t match their profile.', 'They ask for intimate photos or pressure you when you set limits.'] }, 'If you notice anything like this, stop replying, block and report. Looking after yourself is never an overreaction.'],
  },
  {
    slug: 'segunda-cita',
    title: 'From first to second date: how to tell if there’s chemistry',
    cat: 'Relationships',
    date: 'Sep 17, 2026',
    read: '4 min',
    emoji: '✨',
    color: '#FFB199',
    excerpt: 'The subtle signs that you both want to do it again.',
    body: ['Chemistry isn’t always love at first sight. Sometimes it’s the feeling that time flew by. Ask yourself: could I be myself? Was there mutual curiosity? Do I want to tell them something that happened today?', 'If the answer is yes, suggest something concrete and different for the second one.'],
  },
  {
    slug: 'citas-y-ansiedad',
    title: 'Pre-date anxiety: what psychology says',
    cat: 'Wellbeing',
    date: 'Sep 10, 2026',
    read: '5 min',
    emoji: '🧘',
    color: '#1E5446',
    excerpt: 'Breathing, lowering expectations and picking a comfortable plan help more than you think.',
    body: ['Feeling nervous before a date is normal. A few strategies: choose a short plan in a place you know, have an exit planned, breathe slowly before walking in and remember the other person is probably nervous too.'],
  },
  {
    slug: 'por-que-limitamos-los-likes',
    title: 'Why Datecito gives you 30 likes a day (not unlimited)',
    cat: 'Culture',
    date: 'Sep 3, 2026',
    read: '4 min',
    emoji: '🌱',
    color: '#FF8F7A',
    excerpt: 'Less mindless swiping, more intention. This is how we designed the app’s pace.',
    body: [
      'On most dating apps you can swipe endlessly. The well-known result: likes that mean nothing, people who never reply and the feeling of being in a catalog.',
      'On Datecito you get 40 profiles and 30 likes a day. It’s not a punishment: it’s enough to meet people and few enough that a like still matters. And if you really liked someone, you also get a free Super Like every three days to tell them.',
      'Because we all slip with our thumb sometimes, anyone you passed on comes back after 14 days. A second chance for both of you.',
    ],
  },
];

export type City = { slug: string; name: string; state: string; ideas: string[]; blurb: string };

/** City idea guides. Datecito starts in the Mexico City metro area; the rest are inspiration. */
export const cities: City[] = [
  { slug: 'ciudad-de-mexico', name: 'Mexico City', state: 'CDMX and metro area', blurb: 'Museums, markets, terraces and parks: the capital has a date for every taste.', ideas: ['Row on Chapultepec lake', 'Tacos in Roma or Condesa', 'Cineteca Nacional', 'Coyoacán Market', 'Lucha libre at Arena México', 'A walk in Bosque de Aragón'] },
  { slug: 'guadalajara', name: 'Guadalajara', state: 'Jalisco', blurb: 'Tortas ahogadas, art and tapatío nights.', ideas: ['Stroll along Avenida Chapultepec', 'Tlaquepaque and its galleries', 'San Juan de Dios Market', 'Sunset at Los Colomos Forest'] },
  { slug: 'monterrey', name: 'Monterrey', state: 'Nuevo León', blurb: 'Mountains, carne asada and the Santa Lucía Riverwalk.', ideas: ['Boat ride on the Santa Lucía Riverwalk', 'Fundidora Park', 'Barrio Antiguo', 'Chipinque at sunrise'] },
  { slug: 'puebla', name: 'Puebla', state: 'Puebla', blurb: 'Talavera, mole and the charm of downtown.', ideas: ['Callejón de los Sapos', 'Cholula and its pyramid', 'Mercado de Sabores', 'Estrella de Puebla Ferris wheel'] },
  { slug: 'queretaro', name: 'Querétaro', state: 'Querétaro', blurb: 'Nearby vineyards and a walkable downtown.', ideas: ['Art, cheese and wine route', 'The aqueduct at sunset', 'Peña de Bernal', 'Historic downtown'] },
  { slug: 'merida', name: 'Mérida', state: 'Yucatán', blurb: 'Cenotes, Yucatecan food and trova nights.', ideas: ['Bike along Paseo de Montejo', 'Cuzamá cenotes', 'Mexican night at the Remate', 'Lucas de Gálvez Market'] },
  { slug: 'tijuana', name: 'Tijuana', state: 'Baja California', blurb: 'Craft beer, tacos and the sea.', ideas: ['Playas de Tijuana', 'Pasaje Rodríguez', 'Craft beer route', 'Valle de Guadalupe (nearby)'] },
  { slug: 'cancun', name: 'Cancún', state: 'Quintana Roo', blurb: 'Beach, snorkeling and lagoon sunsets.', ideas: ['Sunset at Nichupté Lagoon', 'Ferry to Isla Mujeres', 'Mercado 28', 'Snorkeling at Punta Nizuc'] },
  { slug: 'leon', name: 'León', state: 'Guanajuato', blurb: 'Leather district, parks and getaways to Guanajuato.', ideas: ['Calzada de los Héroes', 'Metropolitan Park', 'Getaway to Guanajuato city'] },
  { slug: 'oaxaca', name: 'Oaxaca', state: 'Oaxaca', blurb: 'Mezcal, markets and colorful streets.', ideas: ['Macedonio Alcalá walkway', '20 de Noviembre Market', 'Hierve el Agua', 'Oaxacan cooking class'] },
];
