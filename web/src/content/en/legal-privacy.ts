import { company } from '../../site';
import type { LegalDoc } from '../types';

const e = company.emails;

export const privacidad: LegalDoc = {
  slug: 'privacidad',
  title: 'Comprehensive Privacy Notice',
  summary: 'What personal data we process, why, who we share it with and how to exercise your ARCO rights.',
  intro: [
    `${company.legalName} (“Datecito”), with its address at ${company.addressEn}, is responsible for processing your personal data under Mexico’s Federal Law on the Protection of Personal Data Held by Private Parties (the “Law”) and its applicable regulations.`,
    { note: 'We believe privacy should be explained clearly. If you only want the essentials, see the Short Privacy Notice. For any questions write to ' + e.privacy + '.' },
  ],
  sections: [
    {
      id: 'datos',
      h: '1. Personal data we process',
      blocks: [
        { h3: 'Data you give us' },
        {
          ul: [
            '**Identification and contact:** name, date of birth and email.',
            '**Profile:** photos, gender, who you want to meet, what you’re looking for and your relationship type, interests, sports teams, music, languages, bio, occupation, prompt answers and other optional details you choose to show.',
            '**Verification:** verification selfie, the requested pose and the review result (approved or rejected). See the Sensitive Data Policy.',
            '**Communications:** chat messages, proposed datecitos, reports and conversations with support.',
            '**Trusted contacts:** name and phone number of the people you choose for Datecito Safe.',
            '**Purchases:** transaction ID and membership status (your card details are processed by Google Play or the App Store; we never receive them).',
          ],
        },
        { h3: 'Data we collect when you use the Service' },
        {
          ul: [
            '**Approximate location:** when you allow it, we use your device location while you use the app to show you people nearby and Here & Now. We never show your exact location to others and never access it in the background.',
            '**Usage:** likes, matches, features you use, connection times, settings and filters.',
            '**Device and technical:** model, operating system, language, device and app identifiers, IP address, error logs and cookie data on the website.',
          ],
        },
        { h3: 'Data from third parties' },
        { ul: ['Other users may give us information about you when they report you or mention you in a report.', 'If you write to us from the website, we receive the data you include in the form.'] },
      ],
    },
    {
      id: 'sensibles',
      h: '2. Sensitive personal data',
      blocks: [
        'Some data may reveal sensitive aspects, such as your sexual orientation (implied by who you want to meet), your sex life or the image of your face in the verification selfie. We only process it with your **express consent**, which you give by filling in those fields or starting verification, and you can withdraw it at any time. See the Sensitive Data Policy.',
      ],
    },
    {
      id: 'finalidades',
      h: '3. How we use your data',
      blocks: [
        { h3: 'Primary purposes (required for the Service)' },
        {
          ul: [
            'Create and manage your account and verify your age.',
            'Show your profile and recommend compatible profiles based on your preferences and approximate location.',
            'Enable matches, chats, datecitos and the Here & Now feature.',
            'Run Datecito Safe: share your plan with your trusted contacts, check-in reminders and help alerts you trigger.',
            'Prevent, detect and investigate fraud, spam, fake profiles, abuse and behavior that puts the community at risk.',
            'Process purchases and manage your membership.',
            'Handle support requests, reports and the exercise of your rights.',
            'Comply with legal obligations and requests from competent authorities.',
          ],
        },
        { h3: 'Secondary purposes (you can opt out)' },
        {
          ul: [
            'Send you news, promotions and surveys.',
            'Analyze use of the Service in aggregate to improve products and build new features.',
            'Show you Datecito ads on other platforms.',
          ],
        },
        'If you don’t want us to process your data for secondary purposes, you can say so in Profile › Settings › Notifications (news and promotions) or by writing to ' + e.privacy + '. Opting out will not be a reason to deny you the Service.',
      ],
    },
    {
      id: 'transferencias',
      h: '4. Who we share your data with',
      blocks: [
        { h3: 'Other users' },
        'Your public profile (photos, name, age, approximate distance, verification badge and whatever you choose to show) is visible to other users. Your messages are only seen by the people you chat with.',
        { h3: 'Processors' },
        'We share data with providers who serve us under contract and confidentiality obligations: cloud hosting, email and notification delivery, and photo storage. Verification and report reviews are done by Datecito staff, not an external provider.',
        { h3: 'Transfers that do not require your consent' },
        {
          table: {
            head: ['Recipient', 'Purpose'],
            rows: [
              ['Competent authorities', 'Comply with legal requirements, court orders or protect a person’s life or safety.'],
              ['Companies in the same group, should any exist', 'Operation and support of the Service under the same policies.'],
              ['Acquirer in a merger or sale', 'Continuity of the Service, keeping this Notice.'],
            ],
          },
        },
        { h3: 'Transfers that require your consent' },
        'When you turn on Datecito Safe, we share the plan details you choose (place, time and who you’re with) with your trusted contacts. No other transfer of this kind happens without your consent.',
        { note: '**We do not sell your personal data.**' },
      ],
    },
    {
      id: 'arco',
      h: '5. ARCO rights and withdrawal of consent',
      blocks: [
        'You have the right to **Access** your data, **Rectify** it if inaccurate, **Cancel** it when you consider it no longer necessary and **Object** to its processing for specific purposes. You can also withdraw your consent and limit the use or disclosure of your data.',
        'To exercise them, send your request through this site’s ARCO Rights form or to ' + e.privacy + ', including:',
        {
          ul: [
            'Your name and the email linked to your account.',
            'A document proving your identity or, where applicable, that of your legal representative.',
            'A clear description of the data and the right you wish to exercise.',
            'Any other information that helps us locate your data.',
          ],
        },
        'We will respond within a maximum of 20 business days and, if applicable, carry out the request within the following 15 business days. You can exercise many of these rights directly in the app: edit your profile or delete your account (Profile › Settings › Account). To receive a copy of your data, use the form and choose “Access”.',
      ],
    },
    {
      id: 'conservacion',
      h: '6. Retention',
      blocks: [
        'We keep your data while your account is active. When you delete it, we erase your profile, photos, selfie, matches and messages immediately, and database backups are overwritten within 14 days at most, except:',
        { ul: ['Safety and report information (for example, to prevent an account removed for abuse from signing up again), which we keep for up to 3 years.', 'Transaction information, which we keep for the period required by tax laws.', 'Data subject to an investigation, legal request or litigation.'] },
      ],
    },
    {
      id: 'seguridad',
      h: '7. Security',
      blocks: ['We apply administrative, technical and physical measures to protect your data: encryption in transit, encryption at rest for messages, trusted contacts and sensitive data, passwords protected with Argon2id, role-based access control, secure credential storage on your device and monitoring of suspicious activity. No measure is foolproof; if we detect a breach that significantly affects your rights, we will inform you without delay.'],
    },
    {
      id: 'cookies',
      h: '8. Cookies and similar technologies',
      blocks: ['Our website uses cookies and similar technologies. You can manage them in Cookie settings. More detail in our Cookie Policy.'],
    },
    {
      id: 'menores',
      h: '9. Minors',
      blocks: ['The Service is exclusively for people 18 and older. We do not knowingly collect data from minors. If you know of a minor using Datecito, report them in the app or write to ' + e.safety + '.'],
    },
    {
      id: 'internacional',
      h: '10. International transfers',
      blocks: ['Some providers may store data outside Mexico (for example, in the United States). In those cases we contractually require a level of protection equivalent to that set out in the Law.'],
    },
    {
      id: 'cambios',
      h: '11. Changes to this Notice',
      blocks: ['We may modify this Notice. We will publish the current version on this page and announce material changes in the app or by email.'],
    },
    {
      id: 'autoridad',
      h: '12. Authority',
      blocks: ['If you believe your right to data protection has been violated, you may go to the competent personal data protection authority: the supervisory authority for personal data protection (currently the Secretaría Anticorrupción y Buen Gobierno, following the 2025 reform).'],
    },
  ],
};

export const privacidadSimplificado: LegalDoc = {
  slug: 'privacidad-simplificado',
  title: 'Short Privacy Notice',
  summary: 'The short version of how we handle your data.',
  intro: [`${company.legalName} (“Datecito”) is responsible for processing your personal data.`],
  sections: [
    {
      id: 'para-que',
      h: 'What do we use your data for?',
      blocks: [
        'To create your account, show your profile, recommend people nearby, enable matches, chats and datecitos, run Datecito Safe, prevent fraud and abuse, process your membership and give you support.',
        'Secondarily, and only if you don’t opt out, to send you news and promotions, analyze app usage and show you Datecito ads. You can opt out in Profile › Settings › Notifications or at ' + e.privacy + '.',
      ],
    },
    {
      id: 'con-quien',
      h: 'Who do we share it with?',
      blocks: ['With other users (your public profile), with your trusted contacts when you turn it on and with authorities when the law requires it. **We do not sell your data.**'],
    },
    {
      id: 'integral',
      h: 'Comprehensive notice',
      blocks: ['See the Comprehensive Privacy Notice at datecito.com/en/legal/privacidad.'],
    },
  ],
};

export const datosSensibles: LegalDoc = {
  slug: 'datos-sensibles',
  title: 'Sensitive Personal Data Policy',
  summary: 'How we handle sexual orientation, the verification selfie and other sensitive data.',
  intro: ['In a dating app some data is especially delicate. This policy supplements the Comprehensive Privacy Notice and explains in more detail how we protect it.'],
  sections: [
    {
      id: 'cuales',
      h: '1. What sensitive data may we process?',
      blocks: [
        {
          table: {
            head: ['Data', 'Where it comes from', 'What for'],
            rows: [
              ['Sexual orientation and gender identity', 'Your gender and who you want to meet', 'Recommend compatible profiles.'],
              ['Image of your face', 'Verification selfie with the requested pose', 'Let a team member confirm your photos are yours and grant you the verification badge.'],
              ['Relationship type and what you’re looking for', 'Optional profile fields', 'Show them on your profile if you choose and recommend like-minded people.'],
              ['Sex life or intimacy', 'Content of your messages', 'Only processed to deliver your messages and, where applicable, investigate reports.'],
            ],
          },
        },
      ],
    },
    {
      id: 'consentimiento',
      h: '2. Express consent',
      blocks: ['We only process this data with your express consent. Optional fields are always optional and you can delete them whenever you want. Selfie verification only starts if you start it.'],
    },
    {
      id: 'biometria',
      h: '3. Selfie verification',
      blocks: [
        { ul: ['A team member compares your selfie with your profile photos and checks that you made the requested pose. We do not generate biometric templates or use automated facial recognition.', 'The selfie is stored encrypted in private storage, never shown on your profile, and deleted 30 days after the review ends; we keep only the result (verified / not verified).', 'We never use your selfie for advertising or share it with third parties.'] },
      ],
    },
    {
      id: 'limites',
      h: '4. Limits we set for ourselves',
      blocks: [{ ul: ['We do not use sensitive data for targeted advertising.', 'We do not sell it or share it with advertisers.', 'We do not infer it from your activity for purposes other than those described here.', 'Internal access is restricted to staff who strictly need it.'] }],
    },
    {
      id: 'derechos',
      h: '5. Your rights',
      blocks: ['You can access, correct, delete or withdraw your consent for this data at any time from the app or by writing to ' + e.privacy + '.'],
    },
  ],
};

export const cookies: LegalDoc = {
  slug: 'cookies',
  title: 'Cookie Policy',
  summary: 'Which cookies and similar technologies we use on the website and how to manage them.',
  intro: ['This Policy explains how Datecito uses cookies, pixels and similar technologies on ' + company.domain + '.'],
  sections: [
    {
      id: 'que-son',
      h: '1. What are cookies?',
      blocks: ['Cookies are small files a website stores in your browser to remember information about your visit. Similar technologies include browser local storage, pixels and SDKs in the app.'],
    },
    {
      id: 'tipos',
      h: '2. Types of cookies we use',
      blocks: [
        {
          table: {
            head: ['Category', 'What it does', 'Can you turn it off?'],
            rows: [
              ['Strictly necessary', 'Security, fraud prevention, remembering your cookie and language choices, load balancing.', 'No'],
              ['Analytics and performance', 'Count visits, measure which pages work best and detect errors. Not used for now.', 'Yes'],
              ['Personalization', 'Remember additional display preferences. Not used for now.', 'Yes'],
              ['Advertising', 'Measure the effectiveness of Datecito campaigns and show you relevant ads on other sites. Not used for now.', 'Yes'],
            ],
          },
        },
      ],
    },
    {
      id: 'lista',
      h: '3. Specific cookies',
      blocks: [
        {
          table: {
            head: ['Name', 'Provider', 'Category', 'Duration'],
            rows: [
              ['datecito.cookies.v1', 'Datecito', 'Necessary', 'Persistent (until you delete it)'],
              ['datecito.lang', 'Datecito', 'Necessary', 'Persistent (until you delete it)'],
            ],
          },
        },
        'Today we only use those two local-storage entries; there are no third-party cookies. If we integrate analytics or advertising, we will update this table and ask for your consent before enabling them.',
      ],
    },
    {
      id: 'administrar',
      h: '4. How to manage them',
      blocks: ['You can change your preferences at any time with the “Cookie settings” link in the footer of every page. You can also block or delete them from your browser; note that some site features may stop working.'],
    },
    {
      id: 'contacto',
      h: '5. Contact',
      blocks: ['Questions about this policy: ' + e.privacy + '.'],
    },
  ],
};
