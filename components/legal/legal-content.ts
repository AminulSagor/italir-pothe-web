export type LegalSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalDocument = {
  title: string;
  effectiveDate: string;
  introduction: string;
  sections: LegalSection[];
};

const fallbackSupportEmail = "support@italirpothe.com";

export const supportEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || fallbackSupportEmail;

export const privacyPolicy: LegalDocument = {
  title: "Privacy Policy",
  effectiveDate: "Effective July 13, 2026",
  introduction:
    "This Privacy Policy explains how Italir Pothe collects, uses, stores, and shares information when you use our public website, mobile application when available, backend services, learning features, certificate-verification service, customer support, and related services.",

  sections: [
    {
      title: "1. Scope of this policy",
      paragraphs: [
        "This policy applies to visitors to the Italir Pothe public website, learners, community members, mobile-app users, webinar participants, certificate holders, and people who contact our support team.",
        "The public website can be browsed without signing in. Additional information may be collected when you contact us, use certificate verification, access the mobile application, register for a service, or interact with learning features.",
      ],
    },
    {
      title: "2. Information we collect",
      paragraphs: [
        "We collect information that is reasonably necessary to provide, secure, operate, personalize, and improve Italir Pothe.",
      ],
      bullets: [
        "Website and contact information: your name, email address, phone number, message content, and other information you voluntarily submit through a contact form, email, or support request.",
        "Account and profile information: your full name, email address or phone number, password hash, verification status, profile photo, preferences, and internal account identifiers.",
        "Learning information: course enrollment, lesson progress, quiz and examination answers, scores, certificates, streaks, XP, achievements, saved items, AI Tutor results, strengths, and recommended focus areas.",
        "Content and communications: messages, attachments, reports, support requests, CV details, generated documents, webinar interactions, and information you intentionally provide through learning or communication features.",
        "Audio, video, and uploaded media: microphone audio, transcripts, speaking-test recordings, webinar participation, calls, photos, documents, and camera input when you choose to use a related feature.",
        "Purchase and entitlement information: order identifiers, purchased packages or courses, price, currency, discounts, payment provider, payment status, refunds, and digital balances such as AI minutes, text tokens, CV credits, rewards, or streak freezes.",
        "Certificate information: certificate identifiers, learner name, course or examination details, issue date, status, and limited information required to provide public certificate verification.",
        "Device and technical information: device type, platform, browser, operating system, app version, timezone, IP address, request logs, push-notification tokens, diagnostic information, and security events.",
        "Safety and moderation information: blocks, reports, uploaded evidence, moderation decisions, and records required to prevent abuse or protect users and the platform.",
      ],
    },
    {
      title: "3. Device permissions",
      paragraphs: [
        "Depending on the feature you choose to use, the mobile application may request access to your microphone, camera, photos, notifications, network connection, or selected files.",
        "You can deny or later revoke optional permissions through your device settings. The associated feature may not work correctly when a required permission is disabled.",
        "The current version of the application does not require access to your precise device location or address-book contacts unless a future feature clearly requests that permission and provides an appropriate explanation.",
      ],
    },
    {
      title: "4. How we use information",
      bullets: [
        "Respond to enquiries, contact requests, account-deletion requests, and customer-support messages.",
        "Create, verify, authenticate, maintain, and protect user accounts.",
        "Deliver courses, practice activities, quizzes, examinations, certificates, CV tools, webinars, messages, calls, notifications, rewards, and purchased digital services.",
        "Verify certificates and display limited certificate information when a valid verification identifier is submitted.",
        "Personalize lessons and AI Tutor responses using learner level, recent context, mistakes, goals, and learning progress.",
        "Process orders, confirm payments, grant digital entitlements, prevent duplicate transactions, and manage refunds or disputes.",
        "Operate, troubleshoot, secure, moderate, analyze, maintain, and improve the website, application, backend, and related services.",
        "Comply with legal obligations, enforce our Terms and Conditions, prevent fraud, and protect Italir Pothe, its users, and the public.",
      ],
    },
    {
      title: "5. AI Tutor and voice processing",
      paragraphs: [
        "AI Tutor text, voice, writing assistance, translation, pronunciation, and level-test requests may be sent to artificial-intelligence, speech-to-text, text-to-speech, and real-time communication providers to generate a response.",
        "Information sent for processing may include your prompt, recent conversation context, selected lesson or topic, learner level, audio, transcript, and information required to produce an educational response.",
        "Live audio may be processed as a stream. Speaking-exam recordings, uploaded files, transcripts, assessment results, or recent conversation context may be retained when reasonably necessary to provide the requested feature.",
        "Do not submit highly sensitive personal, financial, medical, legal, or identity information that is not necessary for language learning.",
      ],
    },
    {
      title: "6. Service providers and information sharing",
      paragraphs: [
        "We do not sell personal information. We do not share personal information for unrelated cross-service behavioral advertising unless we provide clear notice and obtain any consent required by applicable law.",
        "We may share limited information with service providers only when reasonably necessary to operate, secure, support, or improve Italir Pothe.",
      ],
      bullets: [
        "Cloud hosting, database, file-storage, content-delivery, email, security, and infrastructure providers, including AWS-based services where configured.",
        "Firebase or similar providers for push notifications and device-message delivery.",
        "OpenAI, Pipecat, LiveKit, or similar providers for AI processing, transcription, speech generation, and real-time AI sessions.",
        "Agora or similar communication providers for calls, audio, video, and webinar functionality.",
        "Google Play, Apple, Stripe, or another displayed payment provider for purchases, payment verification, refunds, fraud prevention, or transaction support.",
        "Authorized employees, administrators, moderators, instructors, or support personnel who require access to perform their assigned responsibilities.",
        "Authorities, professional advisers, or other parties when disclosure is required by law, necessary to protect rights or safety, or connected with a lawful business transaction subject to appropriate safeguards.",
      ],
    },
    {
      title: "7. Public certificate verification",
      paragraphs: [
        "Italir Pothe may provide a public certificate-verification feature. A person who enters or opens a valid certificate identifier may be shown limited information needed to confirm whether the certificate is authentic.",
        "Displayed information may include the certificate holder’s name, certificate title, course or examination, issue date, verification status, and certificate identifier.",
        "Do not publicly share your certificate identifier unless you are comfortable allowing another person to verify the certificate.",
      ],
    },
    {
      title: "8. External book purchases",
      paragraphs: [
        "The Italir Pothe website may include links to books offered through external third-party platforms. Clicking a purchase link may take you to another website.",
        "Italir Pothe does not directly receive complete payment-card information entered on external platforms. The third party’s privacy policy and purchasing terms govern the information collected and processed during an order.",
      ],
    },
    {
      title: "9. Data retention and account deletion",
      paragraphs: [
        "We retain account and service information while an account is active and for as long as reasonably necessary for the purposes described in this policy.",
        "Retention periods may vary based on the type of information, operational requirements, payment disputes, security needs, fraud prevention, legal obligations, accounting requirements, and backup cycles.",
        "You can initiate account deletion through Settings → Privacy & Legal → Delete Account when that option is available in the mobile application.",
        "After a verified deletion request, account access is disabled and direct profile identifiers are deleted, removed, or anonymized through our retention process. Limited records may be retained when required for accounting, legal compliance, security, fraud prevention, transaction history, or dispute resolution.",
        "You may also submit a deletion request through the public account-deletion page or contact support. Protected backup copies may remain for a limited period before being overwritten and are not used for ordinary product activity.",
      ],
    },
    {
      title: "10. Your choices and rights",
      bullets: [
        "Review or update available account and profile information, subject to identity and verification requirements.",
        "Control microphone, camera, photo, file, and notification permissions through your device settings.",
        "Choose whether to submit optional contact forms, upload content, or use AI and voice features.",
        "Block users and use available reporting or moderation tools.",
        "Request access, correction, deletion, restriction, objection, or a copy of personal information where applicable law provides those rights.",
        "Withdraw consent for optional processing without affecting processing already lawfully completed.",
      ],
    },
    {
      title: "11. Security",
      paragraphs: [
        "We use reasonable administrative, technical, and organizational safeguards designed to protect information. These safeguards may include authenticated APIs, password hashing, access controls, secure token handling, encrypted network connections, monitoring, and restricted administrative access.",
        "No website, application, transmission, or storage system can guarantee absolute security. Keep your password and verification codes private and contact us promptly if you suspect unauthorized access.",
      ],
    },
    {
      title: "12. International processing",
      paragraphs: [
        "Italir Pothe and its service providers may process information in countries other than the country where you live.",
        "Where required, we use reasonable contractual, technical, organizational, or legal safeguards for international processing and transfers.",
      ],
    },
    {
      title: "13. Children",
      paragraphs: [
        "Italir Pothe is not directed to children under 13.",
        "When the law where a user lives requires a higher minimum age, the user may access the service only with valid permission from a parent or legal guardian.",
        "Contact us if you believe a child has provided personal information without appropriate authorization.",
      ],
    },
    {
      title: "14. External links",
      paragraphs: [
        "The public website and application may contain links to third-party websites, stores, social networks, communication services, or other external platforms.",
        "We are not responsible for the privacy practices, security, availability, or content of third-party services. Review the relevant third party’s policies before submitting information.",
      ],
    },
    {
      title: "15. Changes to this policy",
      paragraphs: [
        "We may update this Privacy Policy when our services, technology, providers, operational practices, or legal requirements change.",
        "We will update the effective date and provide additional notice when a change is material or when applicable law requires notice.",
      ],
    },
    {
      title: "16. Contact us",
      paragraphs: [
        `For privacy questions, requests, account-deletion enquiries, or complaints, contact ${supportEmail}. Include the email address or phone number associated with your account when relevant so we can securely verify and respond to your request.`,
      ],
    },
  ],
};

export const termsOfService: LegalDocument = {
  title: "Terms & Conditions",
  effectiveDate: "Effective July 13, 2026",
  introduction:
    "These Terms and Conditions govern your access to and use of the Italir Pothe public website, mobile application when available, learning content, AI Tutor, webinars, certificate-verification service, community features, digital purchases, and related services.",

  sections: [
    {
      title: "1. Acceptance of these Terms",
      paragraphs: [
        "By accessing or using Italir Pothe, you agree to these Terms and Conditions and acknowledge our Privacy Policy.",
        "If you do not agree with these Terms, do not use the relevant service.",
        "Browsing the public website does not require an account. Additional conditions may apply when you create an account, purchase a service, participate in a webinar, or use the mobile application.",
      ],
    },
    {
      title: "2. Eligibility",
      paragraphs: [
        "You must be at least 13 years old to create an account or independently use account-based features.",
        "If applicable law requires a higher minimum age, you may use the service only with valid permission from a parent or legal guardian who accepts these Terms on your behalf.",
      ],
    },
    {
      title: "3. Your account",
      bullets: [
        "Provide accurate and current registration information.",
        "Maintain access to your verified email address or phone number.",
        "Protect your password, one-time codes, and other authentication credentials.",
        "Do not share, sell, transfer, or allow another person to misuse your account.",
        "Notify support promptly if you suspect unauthorized access.",
        "You are responsible for activity performed through your account unless applicable law provides otherwise.",
      ],
    },
    {
      title: "4. Website and application availability",
      paragraphs: [
        "The Italir Pothe public website provides information about our business, learning services, courses, books, webinars, and certificates.",
        "The mobile application may be marked as coming soon until it is publicly released. A coming-soon notice is informational and does not guarantee a particular release date, device, country, platform, or feature.",
        "Some services may be unavailable depending on device, language, region, account status, subscription, course access, or technical limitations.",
      ],
    },
    {
      title: "5. Learning services",
      paragraphs: [
        "Italir Pothe may provide Italian-language courses, practical learning activities, quizzes, examinations, certificates, AI-assisted learning, guided speaking practice, webinars, CV-building tools, messages, calls, rewards, and digital learning products.",
        "We may add, improve, replace, limit, suspend, or discontinue features. We will try to provide reasonable notice when a material change significantly affects a paid service, unless an urgent security, legal, operational, or technical issue requires immediate action.",
      ],
    },
    {
      title: "6. Educational and AI limitations",
      paragraphs: [
        "AI-generated responses, translations, pronunciation feedback, writing corrections, level estimates, transcripts, and speech recognition may be incomplete, inaccurate, or inappropriate for a particular situation.",
        "You should review important output before relying on it.",
        "Italir Pothe is an educational service. It does not provide legal, immigration, medical, financial, employment, or other regulated professional advice.",
        "Using Italir Pothe does not guarantee language proficiency, examination results, employment, residency, admission, certification recognition, or any other official outcome.",
      ],
    },
    {
      title: "7. Acceptable use",
      paragraphs: [
        "You must use Italir Pothe lawfully, honestly, and respectfully. You must not:",
      ],
      bullets: [
        "Harass, threaten, exploit, deceive, impersonate, or abuse another person.",
        "Share another person’s private information without proper authorization.",
        "Upload illegal, abusive, deceptive, infringing, sexually exploitative, malicious, or unsafe content.",
        "Record, reproduce, or distribute another person’s voice, video, messages, or personal information without all required permissions.",
        "Interfere with the website, application, servers, APIs, security systems, or access controls.",
        "Introduce malware, probe security, scrape protected content, reverse engineer restricted functionality, or use unauthorized automation.",
        "Manipulate purchases, credits, rewards, examinations, certificates, referrals, rankings, or platform systems.",
        "Use AI, communication, or community features to facilitate unlawful activity or violate another person’s rights.",
      ],
    },
    {
      title: "8. User content",
      paragraphs: [
        "You retain ownership of content that you create and upload.",
        "You grant Italir Pothe a limited, worldwide, non-exclusive license to host, store, process, reproduce, transmit, adapt, moderate, and display that content only as reasonably necessary to operate, secure, support, and improve the service.",
        "You confirm that you have all rights and permissions required for content you submit.",
        "You may remove certain content through available product tools or request assistance from support, subject to legal, security, moderation, and operational retention requirements.",
      ],
    },
    {
      title: "9. Community, calls, webinars, and moderation",
      paragraphs: [
        "Messages, calls, webinars, reports, and community interactions must comply with these Terms.",
        "We may use automated systems and authorized personnel to investigate reports, protect users, enforce safety rules, remove content, restrict features, or suspend accounts.",
        "Blocking and reporting features are not emergency services. Contact local emergency services when immediate assistance is required.",
      ],
    },
    {
      title: "10. Courses, examinations, and certificates",
      paragraphs: [
        "Course completion, scores, examination outcomes, and certificate eligibility are determined according to the requirements displayed for the relevant learning activity.",
        "We may withhold, revoke, correct, or invalidate a certificate when it was issued because of fraud, impersonation, manipulation, administrative error, payment reversal, or violation of these Terms.",
        "A certificate confirms the information displayed by Italir Pothe. It does not guarantee acceptance by an employer, government authority, educational institution, professional body, or another third party.",
      ],
    },
    {
      title: "11. Public certificate verification",
      paragraphs: [
        "Certificates may include a public verification identifier or verification link.",
        "Anyone with access to a valid identifier may be able to view limited certificate information required to confirm authenticity.",
        "You are responsible for deciding whether to share your certificate or verification identifier publicly.",
      ],
    },
    {
      title: "12. Purchases, digital credits, and refunds",
      bullets: [
        "Prices, taxes, currencies, package contents, validity periods, and payment terms are displayed before purchase and may vary by platform, country, or provider.",
        "Digital purchases may be processed by Google Play, Apple, Stripe, or another displayed payment provider. The provider’s payment and refund rules may also apply.",
        "AI minutes, AI text tokens, CV credits, streak freezes, rewards, and similar digital entitlements are personal, non-transferable, not legal tender, and have no cash value unless applicable law requires otherwise.",
        "Digital entitlements may be reversed when a payment is refunded, cancelled, charged back, duplicated, fraudulent, unauthorized, or granted in error.",
        "Refund requests are handled according to the displayed offer, the purchasing provider’s rules, and mandatory consumer-protection law.",
      ],
    },

    {
      title: "13. Third-party services and links",
      paragraphs: [
        "Italir Pothe may use or link to third-party services such as app stores, payment providers, OpenAI, Pipecat, LiveKit, Agora, Firebase, AWS, WhatsApp, Facebook, email, or phone services.",
        "Third-party services operate under their own terms and privacy policies.",
        "To the extent permitted by law, Italir Pothe is not responsible for third-party content, availability, transactions, policies, security, or services outside our reasonable control.",
      ],
    },
    {
      title: "15. Intellectual property",
      paragraphs: [
        "The Italir Pothe name, logos, website, application, software, designs, lessons, books, course materials, media, branding, and service content are owned by Italir Pothe or its licensors.",
        "We grant you a limited, revocable, non-exclusive, non-transferable license to access the service and use authorized learning content for personal, non-commercial educational purposes.",
        "You may not copy, reproduce, sell, publish, redistribute, sublicense, scrape, or create unauthorized derivative works from protected Italir Pothe content.",
      ],
    },
    {
      title: "16. Privacy",
      paragraphs: [
        "Our Privacy Policy explains how personal information is collected, used, retained, protected, and shared.",
        "By using the service, you acknowledge the Privacy Policy and any permission or consent request presented for a particular feature.",
      ],
    },
    {
      title: "17. Suspension, termination, and account deletion",
      paragraphs: [
        "You may stop using Italir Pothe at any time and may request account deletion through available application settings or our public account-deletion page.",
        "We may warn, restrict, suspend, or terminate access when reasonably necessary for security, fraud prevention, non-payment, legal compliance, serious or repeated violations, or protection of users and the service.",
        "Terms that by their nature should continue after termination, including intellectual-property, payment, disclaimer, liability, and dispute provisions, remain effective.",
      ],
    },
    {
      title: "18. Service availability and disclaimers",
      paragraphs: [
        "We work to provide a reliable service, but availability may be interrupted by maintenance, updates, network conditions, provider outages, device limitations, security incidents, or events outside our reasonable control.",
        "To the extent permitted by law, the service is provided on an “as is” and “as available” basis.",
        "Nothing in these Terms excludes, restricts, or modifies consumer rights that cannot legally be excluded or restricted.",
      ],
    },
    {
      title: "19. Limitation of liability",
      paragraphs: [
        "To the maximum extent permitted by applicable law, Italir Pothe and its service providers are not liable for indirect, incidental, special, consequential, exemplary, or punitive loss arising from the use of or inability to use the service.",
        "This may include loss of data, profit, opportunity, expected savings, business, or reputation.",
        "Mandatory consumer protections and liabilities that cannot legally be excluded remain unaffected.",
      ],
    },
    {
      title: "20. Changes to these Terms",
      paragraphs: [
        "We may update these Terms to reflect changes in the website, application, services, providers, operational practices, safety requirements, or applicable law.",
        "We will update the effective date and provide additional notice when a change is material or when applicable law requires notice.",
      ],
    },
    {
      title: "21. Applicable law and disputes",
      paragraphs: [
        "These Terms are governed by applicable law.",
        "Any dispute will be handled by a court, tribunal, or other process with lawful jurisdiction, while preserving mandatory consumer rights and venue protections available in the user’s country of residence.",
      ],
    },
    {
      title: "22. Contact",
      paragraphs: [
        `Questions about these Terms and Conditions may be sent to ${supportEmail}.`,
      ],
    },
  ],
};
