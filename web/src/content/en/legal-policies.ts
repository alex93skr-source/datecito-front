import { company } from '../../site';
import type { LegalDoc } from '../types';

const e = company.emails;

export const normas: LegalDoc = {
  slug: 'normas-de-la-comunidad',
  title: 'Community Guidelines',
  summary: 'What’s OK and what’s not on Datecito. They apply inside and outside the app.',
  intro: [
    'Datecito exists to make meeting people exciting and safe. These guidelines apply to everything you do in the app: your profile, your messages, your dates and, when it affects our community, your conduct outside it.',
    { note: 'If someone breaks these guidelines, report them from their profile or the chat (⋯ menu › Report). It’s anonymous: the other person won’t know it was you.' },
  ],
  sections: [
    {
      id: 'autenticidad',
      h: 'Be yourself, for real',
      blocks: ['Use your real name or the one you go by day to day, recent photos that show your face and your real age. Don’t impersonate anyone, use other people’s photos or create fake or duplicate profiles.'],
    },
    {
      id: 'respeto',
      h: 'Respect, always',
      blocks: ['We don’t tolerate harassment, threats, insults or intimidation. If someone stops replying or says no, respect it. Insisting after a “no” is harassment.'],
    },
    {
      id: 'consentimiento',
      h: 'Consent',
      blocks: ['Never send sexual content to someone who didn’t ask for it. Sharing or threatening to share someone’s intimate images without their consent is prohibited and can be a crime (Mexico’s Olimpia Law). No one should feel pressured to meet, go somewhere private or do anything they don’t want to.'],
    },
    {
      id: 'odio',
      h: 'Zero discrimination and hate speech',
      blocks: ['Content that promotes, supports or incites hatred or violence based on race, ethnicity, nationality, religion, disability, gender, gender identity or expression, sexual orientation, age, appearance or social status is not allowed. You can have preferences; you can’t humiliate anyone for who they are.'],
    },
    {
      id: 'contenido',
      h: 'Content that isn’t allowed',
      blocks: [{ ul: ['Nudity or sexually explicit content in photos and profile.', 'Graphic violence, weapons used to intimidate, self-harm.', 'Selling or promoting drugs.', 'Other people’s personal information.', 'Photos of minors without an adult present, or any content that sexualizes minors (we report it to the authorities).'] }],
    },
    {
      id: 'fraude',
      h: 'No scams or business',
      blocks: ['Datecito is not for selling, promoting, recruiting or asking for money. Requesting transfers, gifts, crypto, “investments” or bank details is prohibited. Offering sexual services in exchange for money or benefits is also not allowed.'],
    },
    {
      id: 'menores',
      h: 'Adults only',
      blocks: ['You must be 18 or older. We immediately delete any account belonging to a minor.'],
    },
    {
      id: 'una-cuenta',
      h: 'One account per person',
      blocks: ['Don’t share your account or create additional ones. If we delete your account, you can’t create a new one.'],
    },
    {
      id: 'fuera',
      h: 'Conduct outside the app',
      blocks: ['We may act on accounts when we receive reliable information that someone seriously harmed another user outside Datecito, even if it didn’t happen in the app.'],
    },
    {
      id: 'consecuencias',
      h: 'What happens if they’re broken',
      blocks: ['Depending on severity, we may remove content, send a warning, limit features, temporarily suspend or permanently delete the account. In cases involving risk to life or serious crimes, we cooperate with authorities as required by law. If you think we made a mistake, you can appeal by writing to ' + e.safety + '.'],
    },
  ],
};

export const autoridades: LegalDoc = {
  slug: 'autoridades',
  title: 'Law Enforcement Guide',
  summary: 'How authorities can request information about Datecito accounts.',
  intro: ['This guide is intended exclusively for law enforcement and judicial authorities. If you are a user and need help, visit the Help Center or the Safety Center.'],
  sections: [
    {
      id: 'principios',
      h: '1. Principles',
      blocks: ['Datecito respects its users’ privacy and only provides information upon receiving a valid request issued by a competent authority, properly grounded and reasoned, in accordance with applicable Mexican law.'],
    },
    {
      id: 'como',
      h: '2. How to submit a request',
      blocks: [
        'Send the signed official letter in PDF to ' + e.authorities + ' or to our address: ' + company.addressEn + '. The request must include:',
        { ul: ['Requesting authority, letter number and investigation or case file number.', 'Legal basis.', 'Account identifiers: email or user ID (a name alone is not enough).', 'Specific information requested and time period.', 'Contact details of the responsible official.'] },
      ],
    },
    {
      id: 'emergencias',
      h: '3. Emergencies',
      blocks: ['If there is an imminent risk to a person’s life or physical safety, we may provide information on an expedited basis. Write to ' + e.authorities + ' with the subject “EMERGENCY” and describe the nature of the risk.'],
    },
    {
      id: 'conservacion',
      h: '4. Preservation requests',
      blocks: ['We can preserve an account’s information for 90 days while the formal request is obtained, upon official request.'],
    },
    {
      id: 'notificacion',
      h: '5. User notification',
      blocks: ['Unless legally prohibited or it would put an investigation or a person at risk, we may notify the user before disclosing their information.'],
    },
  ],
};

export const accesibilidad: LegalDoc = {
  slug: 'accesibilidad',
  title: 'Accessibility Statement',
  summary: 'Our commitment to making Datecito usable by everyone.',
  intro: ['We want Datecito to be for everyone. We work to make the app and this site accessible using the Web Content Accessibility Guidelines (WCAG) 2.2, level AA, as our reference. We are a small team and keep improving.'],
  sections: [
    {
      id: 'medidas',
      h: 'What we do',
      blocks: [{ ul: ['Sufficient color contrast in text and buttons.', 'Full keyboard navigation with visible focus.', 'Accessible labels on icons and controls for screen readers (VoiceOver and TalkBack).', 'Text that adapts to the system font size.', 'Haptic and text feedback, not just color.', 'Manual review with screen readers.'] }],
    },
    {
      id: 'limitaciones',
      h: 'Known limitations',
      blocks: ['Some photos uploaded by users may lack alternative text. We are working on optional automatic descriptions.'],
    },
    {
      id: 'contacto',
      h: 'Tell us',
      blocks: ['If you find an accessibility barrier, write to ' + e.accessibility + '. We reply within 5 business days.'],
    },
  ],
};

export const seguridadInformatica: LegalDoc = {
  slug: 'seguridad-informatica',
  title: 'Security and Responsible Disclosure',
  summary: 'How we protect the platform and how to report vulnerabilities.',
  intro: ['Protecting your information is central to Datecito. If you are a security researcher and found a vulnerability, we want to know.'],
  sections: [
    {
      id: 'medidas',
      h: '1. How we protect Datecito',
      blocks: [{ ul: ['TLS encryption on all communications.', 'Session tokens stored in the device’s secure storage.', 'Rate limits and automation detection.', 'Code review and dependency scanning.', 'Least-privilege principle for internal access.'] }],
    },
    {
      id: 'reportar',
      h: '2. How to report a vulnerability',
      blocks: [
        'Send your report to ' + e.security + ' with a description, steps to reproduce, potential impact and your contact details.',
        { ul: ['Do not access, modify or delete other users’ data.', 'Do not perform denial-of-service tests, social engineering or physical attacks.', 'Only use test accounts you own.', 'Give us a reasonable period (90 days) to fix it before public disclosure.'] },
      ],
    },
    {
      id: 'compromiso',
      h: '3. Our commitment',
      blocks: ['We will acknowledge receipt within 3 business days, keep you posted and, if you acted in good faith under this policy, we will not take legal action against you. If you wish, we will credit you publicly.'],
    },
    {
      id: 'alcance',
      h: '4. Scope',
      blocks: [{ ul: ['Datecito app for Android and iOS.', 'Datecito API.', company.domain + ' and subdomains.'] }],
    },
  ],
};
