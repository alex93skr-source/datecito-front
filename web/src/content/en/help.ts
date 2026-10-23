import type { IconName } from '../../components/Icon';
import { company, money } from '../../site';
import type { Block } from '../types';

export type HelpCategory = { slug: string; title: string; icon: IconName; desc: string };
export type HelpArticle = { slug: string; cat: string; title: string; body: Block[] };

export const helpCategories: HelpCategory[] = [
  { slug: 'primeros-pasos', title: 'Getting started', icon: 'sparkle', desc: 'Create your account, confirm your email and build a profile people love.' },
  { slug: 'cuenta', title: 'Account & profile', icon: 'user', desc: 'Signing in, password, photos, details and deleting your account.' },
  { slug: 'descubrir', title: 'Discover & matches', icon: 'heart', desc: 'Likes, Super Likes, who liked you, filters and daily limits.' },
  { slug: 'chat', title: 'Chat & datecitos', icon: 'chat', desc: 'Chatting, proposing plans with a calendar and organizing your date.' },
  { slug: 'aqui-y-ahora', title: 'Here & Now', icon: 'radio', desc: 'Meet the people who are in the same place as you.' },
  { slug: 'membresia', title: 'Membership & payments', icon: 'star', desc: 'Prices, charges, cancellation and refunds.' },
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
    body: [
      'Download Datecito and tap “Create my account”. All you need is an email address and a password of at least 8 characters with letters and numbers.',
      { ol: ['Enter your email and password, and accept the Terms and the Privacy Notice.', 'We send a 6-digit code to your email; type it in the app to confirm it’s yours.', 'Enter your name and date of birth (you must be 18 or older).', 'Choose your gender and who you want to meet.', 'Tell us what you’re looking for and, if you like, your relationship type.', 'Upload 2 to 7 photos that show your face.', 'Pick your interests, your music and, if you root for a team, which one.', 'Allow your approximate location to see people near you.'] },
      'If you close the app halfway through, no problem: when you come back you pick up right where you left off.',
    ],
  },
  {
    slug: 'no-llega-codigo',
    cat: 'primeros-pasos',
    title: 'I’m not getting the email code',
    body: [
      { ul: ['Check your spam or junk folder.', 'Wait a minute and tap “Resend code”; each code lasts 10 minutes.', 'Make sure you typed your email correctly: tap the back arrow to see and fix it.', 'If you used a work email, your company may block outside mail; try a personal one.'] },
      'If it still doesn’t arrive, write to ' + company.emails.support + ' and tell us the email you signed up with.',
    ],
  },
  {
    slug: 'buen-perfil',
    cat: 'primeros-pasos',
    title: 'Tips for a profile that works',
    body: [{ ul: ['Use recent, well-lit photos that show your face without sunglasses.', 'Include a photo doing something you enjoy.', 'Write a short, honest bio with something people can talk about.', 'Add interests, your music and your team: they’re the best icebreaker and show up as things in common.', 'Answer one or two profile prompts (“My ideal date…”).', 'Verify your profile: the badge builds trust and includes you in other people’s “Verified only” filter.'] }],
  },
  {
    slug: 'no-puedo-iniciar-sesion',
    cat: 'cuenta',
    title: 'I can’t sign in',
    body: [
      { ul: ['Check that the email and password are the ones you signed up with; capital letters in the email don’t matter.', 'If you forgot your password, tap “Forgot your password?”: we’ll email you a code to create a new one.', 'If your account isn’t verified yet, we’ll ask for the code from your email when you sign in; tap “Resend” if it expired.', 'If your account was suspended, you’ll see a notice when you try to sign in.'] },
      'If nothing works, write to ' + company.emails.support + ' from your account email.',
    ],
  },
  {
    slug: 'cambiar-contrasena',
    cat: 'cuenta',
    title: 'Change my password',
    body: ['Go to Profile › Settings › Account › Change password and enter the current one and the new one. If you don’t remember the current one, sign out and use “Forgot your password?” on the start screen. Changing it through recovery signs out any sessions open on other phones.'],
  },
  {
    slug: 'editar-perfil',
    cat: 'cuenta',
    title: 'Edit photos and profile details',
    body: ['Go to Profile › Edit profile. There you can change or reorder your photos (2 to 7), your bio, job, interests, teams, music, languages, basics and prompts. Use “Preview” to see your profile as others see it. Your date of birth can’t be changed; if there’s a mistake, contact us.'],
  },
  {
    slug: 'eliminar-cuenta',
    cat: 'cuenta',
    title: 'How do I delete my account?',
    body: [
      'Go to Profile › Settings › Account › Delete my account and confirm with your password. Your profile, photos, matches and conversations are deleted immediately and this can’t be undone.',
      { note: 'Deleting your account does **not** cancel your membership. Cancel it first from Google Play or the App Store.' },
      'If you can no longer sign in, write to ' + company.emails.privacy + ' from your account email with the subject “Delete my account”. If you just want a break, in Profile › Settings › Privacy you can hide yourself from Discover and keep your matches.',
    ],
  },
  {
    slug: 'como-funciona-match',
    cat: 'descubrir',
    title: 'How does a match work?',
    body: ['In Discover, like (heart) the people you’re interested in or pass (✕). If that person likes you too, it’s a match! and you can start chatting. With a Super Like, the other person does find out before deciding: your profile shows up first and highlighted for them.'],
  },
  {
    slug: 'quien-te-dio-like',
    cat: 'descubrir',
    title: 'See who liked you',
    body: [
      'In Connections you’ll see a banner with how many people liked you. Tap it to open the list.',
      { ul: ['**With a membership** (and during the free launch): you see their photos and profiles. If you like someone, tap “Match” and it’s an instant match, without spending your daily likes.', '**Without a membership:** you see how many people there are and silhouettes with their initial, age and area, but not their photos or profiles.'] },
      'People you already passed on or already matched with don’t appear in the list.',
    ],
  },
  {
    slug: 'limites-diarios',
    cat: 'descubrir',
    title: 'Why did I run out of likes or profiles today?',
    body: [
      'Datecito has a daily pace so every like means something and nobody burns through the app in one afternoon:',
      { ul: ['**40 profiles a day** in Discover. When you finish them you’ll see “You’ve seen your people for today”.', '**30 likes a day.** Below the buttons we tell you how many you have left. “Not interested” is unlimited.', 'Liking back someone who already liked you does **not** spend your likes.'] },
      'Everything resets at midnight (central Mexico time). Meanwhile, you can check who liked you, chat with your matches or use Here & Now.',
    ],
  },
  {
    slug: 'super-like',
    cat: 'descubrir',
    title: 'What is a Super Like?',
    body: [`A Super Like tells the other person you really liked them: your profile shows up first in their Discover with a “Super Liked you” tag. You get 1 free every 3 days and can buy packs of ${p.superPackQty} for ${money(p.superPack)}; purchased ones don’t expire while your account is active.`],
  },
  {
    slug: 'filtros',
    cat: 'descubrir',
    title: 'Using Discover filters',
    body: ['In Discover tap the filters icon. You can choose:', { ul: ['**I want to meet:** women, men or everyone.', '**Age** and **maximum distance** (always approximate).', '**Looking for…**: their intention (something serious, no-pressure dating…). You’ll only see people looking for what you pick.', '**Into…**: popular interests. They don’t hide anyone; we show you matching people first.', '**Verified profiles only.**'] }, 'There are no physical-appearance filters.'],
  },
  {
    slug: 'segunda-oportunidad',
    cat: 'descubrir',
    title: 'I passed on someone by mistake. Can I go back?',
    body: ['There’s no undo button, but there is a second chance: anyone you passed on comes back to your Discover after 14 days. If you already liked someone there’s no way to take it back; if you match, you can unmatch from the chat.'],
  },
  {
    slug: 'proponer-datecito',
    cat: 'chat',
    title: 'How do I propose a datecito?',
    body: ['In the chat tap “Propose a datecito”. Pick the kind of plan (coffee, food, bar, outdoors, culture or other), type the place and area, and choose the day and time on the calendar; days when you already have another date are marked. Your match gets the proposal in the chat: if they confirm, the date is on both your schedules and you can turn on Datecito Safe. Until they confirm it’s just an invitation; you can keep chatting to adjust the plan.'],
  },
  {
    slug: 'feedback-datecito',
    cat: 'chat',
    title: 'What is the “How did it go?” after the date for?',
    body: ['After a confirmed date we ask you, privately, how it went. Your answer is stored encrypted and never shared with the other person; it helps us spot behavior that isn’t OK and look after the community.'],
  },
  {
    slug: 'deshacer-match',
    cat: 'chat',
    title: 'Unmatch someone',
    body: ['In the chat tap ⋯ › Unmatch. The conversation disappears for both of you and that person won’t show up for you again. If something made you uncomfortable, you can block or report from the same menu.'],
  },
  {
    slug: 'sin-visto',
    cat: 'chat',
    title: 'Why can’t I see if they read my message?',
    body: ['It’s on purpose. On Datecito there’s no “seen”, “online”, “last active” or “typing…”, and you can’t send photos in chat either. We want you to chat without pressure, at your own pace.'],
  },
  {
    slug: 'que-es-aqui-y-ahora',
    cat: 'aqui-y-ahora',
    title: 'What is Here & Now?',
    body: ['It’s for when you’re at a café, a bar or an event and want to know who else is there and up for meeting people. Turn on Here & Now by typing the place and choosing how long you’ll stay (1, 2 or 3 hours), and see the people who also turned it on within a few meters of you. One tap sends a greeting; if the other person is interested, you open a chat. When time is up you stop appearing automatically. You can ask that only verified profiles see you.'],
  },
  {
    slug: 'ocultarme',
    cat: 'aqui-y-ahora',
    title: 'Hide from someone in Here & Now',
    body: ['Tap their profile and choose “Hide me from…”. That person won’t see you in Here & Now anymore. You can also turn off your session at any time.'],
  },
  {
    slug: 'precios',
    cat: 'membresia',
    title: 'How much does Datecito cost?',
    body: [`During launch Datecito is free. Afterwards there will be a single all-inclusive membership: ${money(p.monthly)} a month or ${money(p.yearly)} a year (two months free). It includes seeing who liked you, full Discover, chats, dates, Here & Now, all filters and 1 free Super Like every 3 days. Datecito Safe, verification and reporting or blocking are always free. Outside Mexico, the store shows the price in your currency.`],
  },
  {
    slug: 'cancelar-membresia',
    cat: 'membresia',
    title: 'How do I cancel my membership?',
    body: [{ ul: ['**Android:** Google Play › Profile › Payments & subscriptions › Subscriptions › Datecito › Cancel.', '**iPhone:** Settings › your name › Subscriptions › Datecito › Cancel.'] }, 'You keep your benefits until the end of the paid period. Your matches and chats aren’t deleted.'],
  },
  {
    slug: 'reembolso',
    cat: 'membresia',
    title: 'Requesting a refund',
    body: ['Purchases are processed by Google Play or the App Store, so refunds are requested from the store: on Google Play at play.google.com › Order history, and on Apple at reportaproblem.apple.com. If you need help, write to us.'],
  },
  {
    slug: 'restaurar-compra',
    cat: 'membresia',
    title: 'I paid but don’t see my membership',
    body: ['Close the app and open it again with the same Google Play or App Store account you paid with; the membership activates once the payment is confirmed. If it still doesn’t show after a few minutes, write to ' + company.emails.support + ' with your store order number.'],
  },
  {
    slug: 'verificar-perfil',
    cat: 'seguridad',
    title: 'How do I verify my profile?',
    body: [
      'Go to Safety › Verify my profile. The app shows you a random pose (for example, a peace sign or a hand on your chin); take a selfie doing it.',
      'A team member compares your selfie with your photos and checks the pose. It takes 48 to 72 hours; meanwhile you can use Datecito normally and your profile shows a “Verifying” tag. If approved, the badge appears next to your name; if not, you can try again with better light.',
      { note: 'Your selfie is stored encrypted, never shown on your profile and only seen by the team that reviews verifications. We don’t use automated facial recognition.' },
    ],
  },
  {
    slug: 'datecito-seguro',
    cat: 'seguridad',
    title: 'How does Datecito Safe work?',
    body: [
      'First save up to 3 trusted contacts in Safety › Trusted contacts (name and phone; they’re stored encrypted and don’t need to have Datecito).',
      'Before your date, open the confirmed datecito and tap “Turn on Datecito Safe”. Choose who to alert and how often you want us to ask if everything is OK: 15, 30, 45 or 60 minutes. When you turn it on, WhatsApp opens with a ready-made message (who, where and when); you send it.',
      'During the date you have at hand “I’m OK”, “Exit call” (a fake call to leave without explaining), “I need help” (prepares an urgent message for your contacts) and “Call 911”.',
    ],
  },
  {
    slug: 'reportar',
    cat: 'seguridad',
    title: 'How do I report someone?',
    body: ['On their profile or in the chat tap ⋯ › Report, choose the reason (inappropriate behavior, fake profile or spam, I’m worried about my safety, is a minor) and add details if you like. The person won’t know you reported them and a team member reviews it; reports about risk or minors are handled first. If you’re in immediate danger, call 911.'],
  },
  {
    slug: 'bloquear',
    cat: 'seguridad',
    title: 'Block someone',
    body: ['Tap ⋯ › Block on their profile or chat. They won’t be able to see or message you, and they won’t appear in your Discover or Here & Now. You can see and undo blocks in Profile › Settings › Blocked.'],
  },
  {
    slug: 'ubicacion',
    cat: 'privacidad',
    title: 'Who sees my location?',
    body: ['Nobody sees your exact location. We store an approximate location (to about a kilometer) and only show a rounded distance, for example “3 km away”. We use your location only while you use the app; never in the background. You can update it anytime in Profile › Settings › Location.'],
  },
  {
    slug: 'descargar-datos',
    cat: 'privacidad',
    title: 'Request a copy of my data',
    body: ['Send us your request from datecito.com/en/legal/arco choosing “Access”, or write to ' + company.emails.privacy + ' from your account email. We reply within 20 business days at most.'],
  },
  {
    slug: 'notificaciones',
    cat: 'tecnico',
    title: 'I’m not getting notifications',
    body: [{ ul: ['Check in Profile › Settings › Notifications that the ones you want are on.', 'Check your phone’s notification permissions for Datecito.', 'Turn off battery saver for Datecito.', 'Sign out and back in.'] }],
  },
  {
    slug: 'requisitos',
    cat: 'tecnico',
    title: 'Phone requirements',
    body: ['Datecito works on Android 7.0 or later and on iPhone with iOS 15.1 or later. We recommend keeping the latest version of the app.'],
  },
  {
    slug: 'app-se-cierra',
    cat: 'tecnico',
    title: 'The app closes or won’t load',
    body: [{ ol: ['Update Datecito to the latest version.', 'Restart your phone.', 'Check your internet connection.', 'If it continues, clear the cache (Android) or reinstall the app; your account isn’t lost.'] }, 'If the problem persists, write to us with your phone model and app version.'],
  },
];
