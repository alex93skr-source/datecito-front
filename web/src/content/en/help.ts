import { company, money } from '../../site';
import type { HelpArticle, HelpCategory } from '../help';

export const helpCategories: HelpCategory[] = [
  { slug: 'primeros-pasos', title: 'Getting started', icon: 'sparkle', desc: 'Create your account and build a profile people love.' },
  { slug: 'cuenta', title: 'Account & profile', icon: 'user', desc: 'Signing in, photos, details and deleting your account.' },
  { slug: 'descubrir', title: 'Discover & matches', icon: 'heart', desc: 'Likes, Super Likes, filters and how matching works.' },
  { slug: 'chat', title: 'Chat & datecitos', icon: 'chat', desc: 'Chatting, proposing plans and organizing your date.' },
  { slug: 'aqui-y-ahora', title: 'Here & Now', icon: 'radio', desc: 'Meet people nearby who are free today.' },
  { slug: 'membresia', title: 'Membership & payments', icon: 'star', desc: 'Plans, charges, cancellation and refunds.' },
  { slug: 'seguridad', title: 'Safety & reports', icon: 'shield', desc: 'Verification, Datecito Safe, blocking and reporting.' },
  { slug: 'privacidad', title: 'Privacy & data', icon: 'lock', desc: 'Your location, who sees you and your ARCO rights.' },
  { slug: 'tecnico', title: 'Technical issues', icon: 'help', desc: 'Errors, notifications and compatibility.' },
];

const p = company.pricing;

export const helpArticles: HelpArticle[] = [
  {
    slug: 'crear-cuenta',
    cat: 'primeros-pasos',
    title: 'How do I create my account?',
    body: ['Download Datecito from Google Play or the App Store and tap “Create account”. You can sign up with your phone, email, Google or Apple.', { ol: ['Confirm your number or email with the code we send you.', 'Enter your name and date of birth (you must be 18+).', 'Choose your gender and who you want to meet.', 'Upload at least 2 photos that show your face.', 'Allow your approximate location to see people nearby.'] }],
  },
  {
    slug: 'buen-perfil',
    cat: 'primeros-pasos',
    title: 'Tips for a profile that works',
    body: [{ ul: ['Use recent, well-lit photos where your face is visible without sunglasses.', 'Include a photo doing something you enjoy.', 'Write a short, honest bio with something to talk about.', 'Add interests: they’re the best icebreaker.', 'Verify your profile: verified profiles get more matches.'] }],
  },
  {
    slug: 'no-puedo-iniciar-sesion',
    cat: 'cuenta',
    title: 'I can’t sign in',
    body: [{ ul: ['Make sure you use the same method you signed up with (phone, email, Google or Apple).', 'If the SMS code doesn’t arrive, wait 60 seconds and tap “Resend”. Check your number has the right country code.', 'If you forgot your password, tap “Forgot your password?” on the sign-in screen.', 'If your account was suspended, you’ll see a notice when you try to sign in.'] }, 'If nothing works, write to ' + company.emails.support + ' from your account email.'],
  },
  {
    slug: 'editar-perfil',
    cat: 'cuenta',
    title: 'Edit profile photos and details',
    body: ['Go to Profile › Edit profile. There you can reorder or change your photos, bio, interests and optional details. Use “Preview” to see your profile as others see it. Your date of birth can’t be changed; if it’s wrong, contact us.'],
  },
  {
    slug: 'eliminar-cuenta',
    cat: 'cuenta',
    title: 'How do I delete my account?',
    body: ['Go to Profile › Settings › Account › Delete account. Your profile, matches and conversations will be permanently deleted.', { note: 'Deleting your account does **not** cancel your subscription. Cancel it first from Google Play or the App Store.' }, 'If you just want a break, you can pause your account: you’ll stop appearing in Discover but keep your matches.'],
  },
  {
    slug: 'como-funciona-match',
    cat: 'descubrir',
    title: 'How does a match work?',
    body: ['In Discover, like (heart) whoever interests you or pass (✕). If that person likes you back, it’s a match! and you can start chatting. Nobody knows you liked them until there’s a match, except with a Super Like.'],
  },
  {
    slug: 'super-like',
    cat: 'descubrir',
    title: 'What is a Super Like?',
    body: [`A Super Like lets the other person know you really liked them before they decide. Members get 1 free every day and can buy packs of ${p.superPackQty} for ${money(p.superPack)}.`],
  },
  {
    slug: 'filtros',
    cat: 'descubrir',
    title: 'Using filters: “Prefer” and “Only”',
    body: ['In Discover tap the filters icon. You can adjust age, distance and interests. Each filter has two modes:', { ul: ['**Prefer:** we show people who match the filter first, but others too.', '**Only:** we show only people who match the filter.'] }],
  },
  {
    slug: 'deshacer',
    cat: 'descubrir',
    title: 'I passed on someone by mistake. Can I go back?',
    body: ['Yes, members can tap “Undo” right after passing on a profile. If you already liked them there’s no way to take it back, but if you match you can unmatch from the chat.'],
  },
  {
    slug: 'proponer-datecito',
    cat: 'chat',
    title: 'How do I propose a datecito?',
    body: ['In the chat tap “Propose a date”. Pick the kind of plan (coffee, food, walk, bar…), the place, the day and the time. Your match can accept, suggest another time or decline. Once accepted, the date shows up in your plans and you can turn on Datecito Safe.'],
  },
  {
    slug: 'feedback-datecito',
    cat: 'chat',
    title: 'What is the post-date feedback for?',
    body: ['After a date we’ll privately ask how it went. Your answer is not shared with the other person; it helps us improve recommendations and detect behavior that isn’t OK.'],
  },
  {
    slug: 'deshacer-match',
    cat: 'chat',
    title: 'Unmatch someone',
    body: ['In the chat tap ⋯ › Unmatch. The conversation disappears for both of you and that person won’t show up again. If something made you uncomfortable, you can also report.'],
  },
  {
    slug: 'que-es-aqui-y-ahora',
    cat: 'aqui-y-ahora',
    title: 'What is Here & Now?',
    body: ['Here & Now shows you people near you who are also free to meet today. You set yourself as available for 1, 2 or 3 hours and appear on the list for people nearby. When the time ends, you automatically stop appearing.'],
  },
  {
    slug: 'ocultarme',
    cat: 'aqui-y-ahora',
    title: 'Hide from someone in Here & Now',
    body: ['Tap their profile and choose “Hide me from [name]”. That person will no longer see you in Here & Now. You can also turn off your availability at any time.'],
  },
  {
    slug: 'precios',
    cat: 'membresia',
    title: 'How much does Datecito cost?',
    body: [`During launch Datecito is free. After that there will be a single all-inclusive membership: monthly at ${money(p.monthly)} or yearly at ${money(p.yearly)} (includes 1 Boost per week). Your store will show the price in your currency.`],
  },
  {
    slug: 'cancelar-membresia',
    cat: 'membresia',
    title: 'How do I cancel my membership?',
    body: [{ ul: ['**Android:** Google Play › Profile › Payments & subscriptions › Subscriptions › Datecito › Cancel.', '**iPhone:** Settings › your name › Subscriptions › Datecito › Cancel.'] }, 'You keep your benefits until the end of the paid period.'],
  },
  {
    slug: 'reembolso',
    cat: 'membresia',
    title: 'Request a refund',
    body: ['Purchases are processed by Google Play or the App Store, so refunds are requested from the store: on Google Play via play.google.com › Order history, and on Apple via reportaproblem.apple.com. If you need help, write to us.'],
  },
  {
    slug: 'restaurar-compra',
    cat: 'membresia',
    title: 'I paid but don’t see my membership',
    body: ['Go to Profile › Membership › Restore purchase. Make sure you use the same Google or Apple account you paid with. If it still doesn’t appear, send us your order number.'],
  },
  {
    slug: 'verificar-perfil',
    cat: 'seguridad',
    title: 'How do I verify my profile?',
    body: ['Go to Profile › Safety › Verify profile and take a selfie copying the pose we show you. We compare your selfie with your photos and, if they match, you get the verification badge. It takes a few minutes.'],
  },
  {
    slug: 'datecito-seguro',
    cat: 'seguridad',
    title: 'How does Datecito Safe work?',
    body: ['Before your date, turn on Datecito Safe from the date. We share with your trusted contacts where, when and with whom you’ll be. You pick a check-in time; if you don’t confirm you’re OK, we’ll remind you and you can alert your contacts. During the date you have at hand: “Exit call”, “I need help” and “Call 911”.'],
  },
  {
    slug: 'reportar',
    cat: 'seguridad',
    title: 'How do I report someone?',
    body: ['On their profile or in the chat tap ⋯ › Report, choose the reason and add details if you want. The person won’t know you reported them. If you’re in immediate danger, call 911.'],
  },
  {
    slug: 'bloquear',
    cat: 'seguridad',
    title: 'Block someone',
    body: ['Tap ⋯ › Block on their profile or chat. They won’t be able to see you or message you. You can see and manage who you blocked in Settings › Blocked.'],
  },
  {
    slug: 'quien-me-escribe',
    cat: 'seguridad',
    title: 'Choose who can message me',
    body: ['In Settings › Privacy you can turn on “Only verified profiles can message me” or “I message first”, so nobody can message you until you do.'],
  },
  {
    slug: 'ubicacion',
    cat: 'privacidad',
    title: 'Who sees my location?',
    body: ['Nobody sees your exact location. We only show an approximate distance (for example, “3 km away”). We only use your location while you use the app; never in the background.'],
  },
  {
    slug: 'descargar-datos',
    cat: 'privacidad',
    title: 'Download a copy of my data',
    body: ['Go to Settings › Privacy › Download my data. We’ll email you a file within a maximum of 20 business days. You can also exercise your ARCO rights at datecito.com/en/legal/arco.'],
  },
  {
    slug: 'notificaciones',
    cat: 'tecnico',
    title: 'I’m not getting notifications',
    body: [{ ul: ['Check in Datecito Settings › Notifications that they’re turned on.', 'Check your phone’s notification permissions for Datecito.', 'Turn off battery saver for Datecito.', 'Sign out and sign back in.'] }],
  },
  {
    slug: 'requisitos',
    cat: 'tecnico',
    title: 'Phone requirements',
    body: ['Datecito works on Android 8.0 or later and on iPhone with iOS 16 or later. We recommend keeping the app up to date.'],
  },
  {
    slug: 'app-se-cierra',
    cat: 'tecnico',
    title: 'The app closes or won’t load',
    body: [{ ol: ['Update Datecito to the latest version.', 'Restart your phone.', 'Check your internet connection.', 'If it continues, clear the cache (Android) or reinstall the app; your account won’t be lost.'] }, 'If the problem persists, write to us with your phone model and app version.'],
  },
];
