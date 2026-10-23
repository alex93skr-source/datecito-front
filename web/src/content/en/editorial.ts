import type { City, Job, Post, PressItem } from '../editorial';

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
      'You matched. Now comes the part that makes everyone nervous: the first message. The good news is you don’t need to be witty, just specific.',
      { h3: '1. Use something from their profile' },
      '“Is that taco in your third photo from Roma? I need the address” works much better than “hi, how are you?”. It shows you read their profile.',
      { h3: '2. Ask an easy question' },
      'Open but light questions keep things going: “What’s your perfect Sunday plan?”.',
      { h3: '3. Propose early' },
      'If the conversation flows, don’t drag it out for weeks. Use “Propose a date” and turn it into a concrete plan.',
    ],
  },
  {
    slug: 'ideas-de-datecito-cdmx',
    title: '15 date ideas in Mexico City that aren’t “grab a coffee”',
    cat: 'Destinations',
    date: 'Oct 1, 2026',
    read: '6 min',
    emoji: '🌮',
    color: '#0F3D32',
    excerpt: 'From sunset trajineras to pottery classes: plans for every budget.',
    body: ['Mexico City is full of first-date plans that break the routine.', { ul: ['Walk through Chapultepec Forest and row on the lake.', 'Try something new at San Juan Market.', 'Art-house cinema at the Cineteca Nacional.', 'Lucha libre at Arena México.', 'Pottery class in Roma.', 'Sunset on a museum terrace downtown.', 'Mural tour in the Historic Center.', 'Morning trajinera ride in Xochimilco.'] }, 'Tip: for a first date choose public, busy places and turn on Datecito Safe.'],
  },
  {
    slug: 'senales-de-alerta',
    title: 'Red flags: when it’s better to stop chatting',
    cat: 'Safety',
    date: 'Sep 24, 2026',
    read: '5 min',
    emoji: '🚩',
    color: '#EF5A5A',
    excerpt: 'Asking for money, rushing you off the app or avoiding video calls are red flags.',
    body: ['Almost everyone on Datecito is here for the right reasons. Still, it helps to recognize the red flags:', { ul: ['They ask for money, gifts, top-ups or for you to invest in something.', 'They insist on moving the chat to another app very quickly.', 'They avoid video calls or meeting in public places.', 'Their story changes or doesn’t match their profile.', 'They pressure you or get angry when you set boundaries.'] }, 'If you notice something like this, stop replying, block and report. Taking care of yourself is never an overreaction.'],
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
    body: ['Chemistry isn’t always love at first sight. Sometimes it’s the feeling that time flew by. Ask yourself: did I feel like myself? Was there mutual curiosity? Do I want to tell them about something that happened today?', 'If the answer is yes, propose something concrete and different for the second date.'],
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
    body: ['Feeling nervous before a date is normal. Some strategies: pick a short plan in a place you know, have an exit planned, breathe slowly before going in and remember the other person is probably nervous too.'],
  },
  {
    slug: 'tendencias-citas-2026',
    title: 'How we date in 2026: trends from the Datecito community',
    cat: 'Culture',
    date: 'Sep 3, 2026',
    read: '7 min',
    emoji: '📊',
    color: '#FF8F7A',
    excerpt: 'Daytime plans, active dates and more honesty from the profile up.',
    body: ['Daytime dates are on the rise, more and more people prefer to meet while walking or at a market, and being honest about what you’re looking for is the new norm. [Illustrative data: replace with real community metrics].'],
  },
];

export const cities: City[] = [
  { slug: 'ciudad-de-mexico', name: 'Mexico City', state: 'CDMX', blurb: 'Museums, markets, terraces and parks: the capital has a date for every taste.', ideas: ['Row on Chapultepec lake', 'Tacos in Roma or Condesa', 'Cineteca Nacional', 'Coyoacán Market', 'Lucha libre at Arena México'] },
  { slug: 'guadalajara', name: 'Guadalajara', state: 'Jalisco', blurb: 'Tortas ahogadas, art and tapatío nights.', ideas: ['Stroll along Avenida Chapultepec', 'Tlaquepaque and its galleries', 'San Juan de Dios Market', 'Sunset at Los Colomos Forest'] },
  { slug: 'monterrey', name: 'Monterrey', state: 'Nuevo León', blurb: 'Mountains, carne asada and the Santa Lucía Riverwalk.', ideas: ['Boat ride on the Santa Lucía Riverwalk', 'Fundidora Park', 'Barrio Antiguo', 'Chipinque at sunrise'] },
  { slug: 'puebla', name: 'Puebla', state: 'Puebla', blurb: 'Talavera, mole and the charm of downtown.', ideas: ['Callejón de los Sapos', 'Cholula and its pyramid', 'Mercado de Sabores', 'Estrella de Puebla Ferris wheel'] },
  { slug: 'queretaro', name: 'Querétaro', state: 'Querétaro', blurb: 'Nearby vineyards and a walkable downtown.', ideas: ['Art, cheese and wine route', 'The aqueduct at sunset', 'Peña de Bernal', 'Historic downtown'] },
  { slug: 'merida', name: 'Mérida', state: 'Yucatán', blurb: 'Cenotes, Yucatecan food and trova nights.', ideas: ['Bike along Paseo de Montejo', 'Cuzamá cenotes', 'Mexican night at the Remate', 'Lucas de Gálvez Market'] },
  { slug: 'tijuana', name: 'Tijuana', state: 'Baja California', blurb: 'Craft beer, tacos and the sea.', ideas: ['Playas de Tijuana', 'Pasaje Rodríguez', 'Craft beer route', 'Valle de Guadalupe (nearby)'] },
  { slug: 'cancun', name: 'Cancún', state: 'Quintana Roo', blurb: 'Beach, snorkeling and lagoon sunsets.', ideas: ['Sunset at Nichupté Lagoon', 'Ferry to Isla Mujeres', 'Mercado 28', 'Snorkeling at Punta Nizuc'] },
  { slug: 'leon', name: 'León', state: 'Guanajuato', blurb: 'Leather district, parks and getaways to Guanajuato.', ideas: ['Calzada de los Héroes', 'Metropolitan Park', 'Getaway to Guanajuato city'] },
  { slug: 'oaxaca', name: 'Oaxaca', state: 'Oaxaca', blurb: 'Mezcal, markets and colorful streets.', ideas: ['Macedonio Alcalá walkway', '20 de Noviembre Market', 'Hierve el Agua', 'Oaxacan cooking class'] },
  { slug: 'bogota', name: 'Bogotá', state: 'Colombia', blurb: 'Coming soon: coffee, mountains and La Candelaria.', ideas: ['Monserrate', 'La Candelaria', 'Usaquén'] },
  { slug: 'madrid', name: 'Madrid', state: 'Spain', blurb: 'Coming soon: tapas, Retiro and sunsets at the Temple of Debod.', ideas: ['Retiro Park', 'Temple of Debod', 'San Miguel Market'] },
];

export const jobs: Job[] = [
  { id: 'rn-senior', title: 'Senior React Native Engineer', team: 'Engineering', place: 'Mexico City · Hybrid', type: 'Full-time' },
  { id: 'backend-laravel', title: 'Backend Engineer (PHP / Laravel)', team: 'Engineering', place: 'Remote · Mexico', type: 'Full-time' },
  { id: 'ml-recos', title: 'Machine Learning Engineer, Recommendations', team: 'Data', place: 'Remote · LATAM', type: 'Full-time' },
  { id: 'trust-safety', title: 'Trust & Safety Specialist', team: 'Trust & Safety', place: 'Mexico City · Hybrid', type: 'Full-time' },
  { id: 'moderador', title: 'Content Moderator (night shift)', team: 'Trust & Safety', place: 'Remote · Mexico', type: 'Full-time' },
  { id: 'product-designer', title: 'Product Designer', team: 'Design', place: 'Mexico City · Hybrid', type: 'Full-time' },
  { id: 'growth', title: 'Growth Marketing Manager', team: 'Marketing', place: 'Mexico City · Hybrid', type: 'Full-time' },
  { id: 'community', title: 'Community Manager', team: 'Marketing', place: 'Guadalajara · Hybrid', type: 'Full-time' },
  { id: 'cx', title: 'User Experience Agent', team: 'Support', place: 'Remote · Mexico', type: 'Part-time' },
  { id: 'legal', title: 'Privacy & Data Protection Lawyer', team: 'Legal', place: 'Mexico City · Hybrid', type: 'Full-time' },
];

export const press: PressItem[] = [
  { date: 'Oct 15, 2026', title: 'Datecito launches Datecito Safe: share your plan and check-ins for every date', text: 'The new tool lets you tell trusted contacts where and with whom you’ll be, with reminders and quick access to 911.' },
  { date: 'Oct 1, 2026', title: '“Here & Now” arrives: meet people who are free near you today', text: 'A way to go from match to plan on the same day, with time-limited availability.' },
  { date: 'Sep 15, 2026', title: 'Datecito opens its beta in Mexico City, Guadalajara and Monterrey', text: 'The Mexican dating app focused on real plans arrives in its first three cities.' },
  { date: 'Sep 1, 2026', title: 'Datecito unveils its brand identity', text: 'Deep green, coral and cream: a warm, friendly brand for meeting people.' },
];

export const techPosts = [
  { title: 'How we built Discover with React Native and 60 fps animations', date: 'Oct 2, 2026', tag: 'Mobile' },
  { title: 'Approximate distances without exposing exact location', date: 'Sep 18, 2026', tag: 'Privacy' },
  { title: 'Hybrid moderation: automated models + human review', date: 'Sep 4, 2026', tag: 'Trust & Safety' },
  { title: 'Our Laravel API: versioning, testing and deploys', date: 'Aug 21, 2026', tag: 'Backend' },
  { title: 'In-app purchases: server-side receipt validation', date: 'Aug 7, 2026', tag: 'Payments' },
];

export const stories = [
  { names: 'Mariana & Joaquín', city: 'Mexico City', text: 'We matched on a Tuesday and by Thursday we were on a taco date. We’re still trying taquerías together.', initials: 'MJ' },
  { names: 'Daniela & Sofía', city: 'Guadalajara', text: 'What I liked most was being able to propose the plan inside the app. No back and forth, straight to coffee.', initials: 'DS' },
  { names: 'Rodrigo & Paola', city: 'Monterrey', text: 'I turned on Datecito Safe on our first date and felt at ease. Today we live together.', initials: 'RP' },
  { names: 'Andrés & Luis', city: 'Querétaro', text: 'We found each other on Here & Now one Sunday afternoon. Best Sunday of the year.', initials: 'AL' },
  { names: 'Fernanda & Diego', city: 'Puebla', text: 'We were both verified, and that gave us confidence from the first message.', initials: 'FD' },
  { names: 'Carla & Emilio', city: 'Mérida', text: 'Our first date was at a cenote. The second, at another one. We’re on number 12 now.', initials: 'CE' },
];
