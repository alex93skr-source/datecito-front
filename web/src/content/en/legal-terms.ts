import { company, money } from '../../site';
import type { LegalDoc } from '../types';

const p = company.pricing;
const e = company.emails;

export const terminos: LegalDoc = {
  slug: 'terminos',
  title: 'Terms of Use',
  summary: 'The rules of the agreement between you and Datecito when you use the app, the website and our services.',
  intro: [
    `Welcome to Datecito. These Terms of Use (the “Terms”) are a binding contract between you and ${company.legalName} (“Datecito”, “we”), with its registered address at ${company.addressEn}. They govern your use of the Datecito mobile app, the website ${company.domain} and any other service we offer (together, the “Service”).`,
    { note: '**Please read them carefully.** By creating an account or using the Service you accept these Terms, our Privacy Notice, the Cookie Policy, the Subscription Terms and the Community Guidelines. If you do not agree, do not use the Service.' },
  ],
  sections: [
    {
      id: 'elegibilidad',
      h: '1. Who can use Datecito',
      blocks: [
        'To create an account and use the Service you represent and warrant that:',
        {
          ul: [
            'You are at least 18 years old.',
            'You have the legal capacity to enter into a binding contract with Datecito.',
            'You are not barred from using the Service under the laws of Mexico or any other applicable jurisdiction.',
            'You have not been convicted of a serious, violent or sexual crime, and you are not listed on any public sex-offender registry.',
            'You will comply with these Terms and all applicable local, state, national and international laws.',
            'You do not have another active Datecito account and have not previously been suspended or removed from the Service, unless we expressly authorized it.',
          ],
        },
        'We may ask you to verify your age or identity at any time. If we find that a person under 18 is using the Service, we will delete the account immediately.',
      ],
    },
    {
      id: 'cuenta',
      h: '2. Your account',
      blocks: [
        'You sign up with your email and a password; we confirm the email is yours with a one-time code. We do not offer sign-up with a phone number or third-party accounts.',
        'You are responsible for keeping your credentials confidential and for all activity on your account. If you believe someone accessed your account without authorization, write to us immediately at ' + e.support + '.',
        'Your account is personal and non-transferable. You may not sell, rent, assign or let anyone else use it.',
      ],
    },
    {
      id: 'servicio',
      h: '3. What Datecito is (and isn’t)',
      blocks: [
        'Datecito is a platform to meet people, chat and propose meetups (“datecitos”). Its features include Discover, Who Liked You, Matches, Chat, Datecitos, Here & Now, Super Likes, selfie verification, Trusted Contacts and Datecito Safe.',
        'Datecito is **not** a matchmaking agency, does not organize or attend meetups, does not make reservations at venues and does not guarantee that you will find a partner, get matches or that other people will reply to your messages.',
        'We may add, change or remove features, temporarily or permanently. Some features may only be available in certain cities, on certain devices or to members.',
      ],
    },
    {
      id: 'conducta',
      h: '4. Your conduct and community safety',
      blocks: [
        'When using Datecito you agree to treat other people with respect and to follow our Community Guidelines. In particular, you must not:',
        {
          ul: [
            'Impersonate anyone, lie about your age or use photos that are not yours.',
            'Harass, intimidate, threaten, discriminate against or defame anyone, inside or outside the app.',
            'Post or send sexually explicit content, nudity, graphic violence or hate speech.',
            'Request money, gifts, bank details or investments, or promote fraudulent schemes.',
            'Use the Service for commercial or advertising purposes, sex work, human trafficking or any illegal activity.',
            'Post personal information about others (address, phone number, financial data) without their consent.',
            'Use bots, scrapers, automation or any unauthorized means to access the Service or extract information.',
            'Interfere with the security or operation of the Service, or try to bypass technical measures or blocks.',
            'Record, share or threaten to share intimate images of another person without their consent.',
          ],
        },
        'Datecito does not run criminal background checks on its users. Selfie verification confirms that the person matches their photos but does not guarantee their identity, intentions or behavior. **You are responsible for your interactions**, and we recommend following our Safety Tips.',
      ],
    },
    {
      id: 'contenido',
      h: '5. Content',
      blocks: [
        { h3: '5.1 Your content' },
        'You are responsible for the photos, text, messages and other content you post or send (“Your Content”). You represent that you have the necessary rights to it and that it does not infringe third-party rights or the law.',
        'You keep ownership of Your Content. To operate the Service you grant us a worldwide, non-exclusive, royalty-free, transferable and sublicensable license to host, store, reproduce, adapt (for example, crop or compress), display and distribute Your Content within the Service, and in Datecito promotional materials only with your express consent. This license ends when you delete the content or your account, except for copies we must keep for legal or safety reasons.',
        { h3: '5.2 Other people’s content' },
        'Content from other users is the responsibility of whoever posts it. We do not pre-screen it, but we moderate it through human review and community reports, and may remove it if it breaks these rules.',
        { h3: '5.3 Our content' },
        'Datecito’s software, design, trademarks, logos, text and illustrations belong to us or our licensors and are protected by Mexico’s Federal Copyright Law and Federal Industrial Property Protection Law. We grant you a personal, limited, revocable and non-transferable license to use the app for personal, non-commercial purposes.',
      ],
    },
    {
      id: 'compras',
      h: '6. Membership and purchases',
      blocks: [
        `During the launch period the Service may be offered at no cost. Afterwards, full access will require a membership (monthly at ${money(p.monthly)} or yearly at ${money(p.yearly)}, or the local-currency equivalent shown by the store), and add-ons such as packs of ${p.superPackQty} Super Likes may be purchased.`,
        'Purchases are made through Google Play or the App Store and are also governed by Datecito’s Subscription Terms and the terms of the relevant store. Subscriptions renew automatically unless you cancel at least 24 hours before the end of the period.',
      ],
    },
    {
      id: 'moderacion',
      h: '7. Reports, suspension and termination',
      blocks: [
        'You can report profiles, messages or behavior from the app. We review reports discreetly and do not tell the reported person who reported them.',
        'We may warn you, limit features, suspend or delete your account without prior notice if we reasonably believe you broke these Terms or the Community Guidelines, if your conduct puts others at risk or if the law requires it. If we delete your account for a violation, you will not be entitled to a refund of purchases, except as provided by law.',
        'You can delete your account at any time in Profile › Settings › Account › Delete my account, or by following the instructions at datecito.com/en/eliminar-cuenta. Deleting your account does not automatically cancel a subscription purchased through a store.',
      ],
    },
    {
      id: 'responsabilidad',
      h: '8. Disclaimer and limitation of liability',
      blocks: [
        'The Service is provided “as is” and “as available”. To the extent permitted by law, we do not guarantee that it will be uninterrupted, error-free or secure at all times.',
        'To the maximum extent permitted by applicable law, Datecito will not be liable for indirect, incidental, consequential or punitive damages, or for the conduct, online or offline, of other users. Our total liability to you will not exceed the amount you paid us in the 12 months before the event giving rise to the claim.',
        'Nothing in these Terms limits your rights under Mexico’s Federal Consumer Protection Law or our liability for fraud or gross negligence.',
      ],
    },
    {
      id: 'indemnizacion',
      h: '9. Indemnification',
      blocks: ['You agree to hold harmless Datecito, its affiliates, directors, employees and agents from any claim, damage or expense (including reasonable attorneys’ fees) arising from your breach of these Terms, Your Content or your conduct with other users.'],
    },
    {
      id: 'terceros',
      h: '10. Third-party services',
      blocks: ['The Service may show links or integrations with third-party services (for example, WhatsApp to alert your trusted contacts, or the app stores). We do not control those services, and their use is governed by their own terms and privacy notices.'],
    },
    {
      id: 'disputas',
      h: '11. Governing law and disputes',
      blocks: [
        'These Terms are governed by the federal laws of the United Mexican States. Before filing any claim, please write to us at ' + e.legal + ' so we can try to resolve it in good faith within 30 days.',
        'For any dispute, the parties submit to the jurisdiction of the competent courts of [Mexico City], waiving any other venue, without prejudice to your right to go to Mexico’s Federal Consumer Protection Agency (PROFECO).',
      ],
    },
    {
      id: 'cambios',
      h: '12. Changes to these Terms',
      blocks: ['We may update these Terms to reflect changes to the Service or the law. If the changes are material, we will notify you in the app or by email at least 15 days in advance. If you keep using the Service after the effective date, you accept the updated Terms.'],
    },
    {
      id: 'contacto',
      h: '13. Contact',
      blocks: [`If you have questions about these Terms, write to ${e.legal} or to our address: ${company.addressEn}.`],
    },
  ],
};

export const suscripciones: LegalDoc = {
  slug: 'suscripciones',
  title: 'Subscription and Purchase Terms',
  summary: 'Prices, auto-renewal, cancellation, refunds and in-app purchases.',
  intro: ['These Subscription Terms supplement the Terms of Use and apply to any membership or product you buy on Datecito.'],
  sections: [
    {
      id: 'productos',
      h: '1. Available products',
      blocks: [
        {
          table: {
            head: ['Product', 'Reference price', 'Includes'],
            rows: [
              ['Monthly membership', `${money(p.monthly)} / month`, 'See who liked you; likes, chats and datecitos; Here & Now anywhere; all filters; 1 free Super Like every 3 days; Datecito Safe and verification.'],
              ['Yearly membership', `${money(p.yearly)} / year`, 'Everything in monthly for the price of 10 months: equals two months free.'],
              [`Pack of ${p.superPackQty} Super Likes`, money(p.superPack), 'One-time purchase. Super Likes don’t expire while your account is active.'],
            ],
          },
        },
        'Prices are in Mexican pesos. Outside Mexico, your store (Google Play or the App Store) will show the final price in your currency, taxes included, before you confirm payment.',
        'During the launch period we may offer the Service at no cost. We will notify you in advance before we start charging, and we will never charge you without you confirming a purchase.',
      ],
    },
    {
      id: 'renovacion',
      h: '2. Auto-renewal',
      blocks: [
        'Memberships renew automatically at the end of each period for the same term and at the current price, charged to the payment method in your store, unless you cancel at least 24 hours before the renewal date.',
        'If the price changes, we will notify you before it applies and, where the law or the store requires it, ask for your consent.',
      ],
    },
    {
      id: 'cancelacion',
      h: '3. How to cancel',
      blocks: [
        { ul: ['**Android:** Google Play › Profile › Payments & subscriptions › Subscriptions › Datecito › Cancel.', '**iPhone:** Settings › your name › Subscriptions › Datecito › Cancel Subscription.'] },
        'When you cancel you keep your benefits until the end of the period already paid. Deleting the app or your account does not cancel the subscription.',
      ],
    },
    {
      id: 'reembolsos',
      h: '4. Refunds',
      blocks: [
        'Because purchases are processed by Google Play or the App Store, refund requests are handled under each store’s policies. Datecito cannot issue refunds directly for store purchases.',
        'If you think you were charged by mistake, write to ' + e.support + ' and we will help you through the process. This does not limit your rights under Mexico’s Federal Consumer Protection Law.',
      ],
    },
    {
      id: 'virtuales',
      h: '5. Virtual items',
      blocks: ['Super Likes are limited licenses to use, with no monetary value, non-refundable (except as required by law) and non-transferable. They cannot be exchanged for money. If your account is deleted, unused items are lost.'],
    },
    {
      id: 'promociones',
      h: '6. Promotions and codes',
      blocks: ['We may offer free trials, discounts or promo codes subject to specific conditions stated in each promotion. A code can only be redeemed once per account, cannot be combined unless stated and has no cash value.'],
    },
    {
      id: 'profeco',
      h: '7. Consumer support',
      blocks: [`For questions write to ${e.support}. You can also contact Mexico’s Federal Consumer Protection Agency (PROFECO) at profeco.gob.mx or by phone at 55 5568 8722 / 800 468 8722.`],
    },
  ],
};

export const propiedadIntelectual: LegalDoc = {
  slug: 'propiedad-intelectual',
  title: 'Intellectual Property Policy',
  summary: 'How we protect our trademarks and how to report content that infringes your rights.',
  intro: ['Datecito respects the intellectual property rights of others and expects its users to do the same. This policy explains how to report possible infringement and how to use our trademarks.'],
  sections: [
    {
      id: 'marcas',
      h: '1. Our trademarks',
      blocks: [
        '“Datecito”, the heart-and-sparks logo, “Here & Now” (“Aquí y ahora”), “Datecito Safe” (“Datecito Seguro”) and other distinctive signs are trademarks of ' + company.legalName + '. They may not be used without prior written authorization.',
        'If you want to use our brand for press or partnerships, see the Brand Assets page or write to ' + e.press + '.',
      ],
    },
    {
      id: 'derechos-autor',
      h: '2. Reporting copyright infringement',
      blocks: [
        'If you believe content posted on Datecito infringes your copyright, send a notice to ' + e.ip + ' with the following information:',
        {
          ol: [
            'Your full name, address, phone number and email.',
            'A description of the protected work you believe was infringed.',
            'The exact location of the content on Datecito (profile name, screenshots).',
            'A statement, under penalty of perjury, that you believe in good faith that the use is not authorized by the owner, their agent or the law.',
            'A statement that the information in the notice is accurate and that you own the rights or are authorized to act on the owner’s behalf.',
            'Your physical or electronic signature.',
          ],
        },
        'This procedure addresses the obligations of online service providers under Mexico’s Federal Copyright Law. We may share the notice with the person who posted the content so they can file a counter-notice if appropriate.',
      ],
    },
    {
      id: 'marcas-terceros',
      h: '3. Reporting trademark infringement',
      blocks: ['If someone uses your trademark on Datecito in a way that may cause confusion, send us at ' + e.ip + ' your contact details, the trademark registration number, the jurisdiction and the location of the content.'],
    },
    {
      id: 'reincidencia',
      h: '4. Repeat infringers',
      blocks: ['We will delete the accounts of users who repeatedly infringe the intellectual property rights of others.'],
    },
  ],
};
