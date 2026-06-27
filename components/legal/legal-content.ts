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

export const supportEmail = "support@lumina.it";

export const privacyPolicy: LegalDocument = {
  title: "Privacy Policy",
  effectiveDate: "Effective June 27, 2026",
  introduction:
    "This Privacy Policy explains how Italir Pothe collects, uses, stores, and shares information when you use the mobile application, its backend services, and related support or administrative services.",
  sections: [
    {
      title: "1. Who this policy applies to",
      paragraphs: [
        "This policy applies to learners, community members, and other users of Italir Pothe. By using the service, you acknowledge the practices described here. Where consent is required by law, we request it before collecting or using the relevant data.",
      ],
    },
    {
      title: "2. Information we collect",
      paragraphs: [
        "We collect only information reasonably needed to provide, secure, personalize, and improve the service.",
      ],
      bullets: [
        "Account and profile information: full name, email address or phone number, password hash, verification status, profile photo, and account identifiers.",
        "Learning information: course enrollment and progress, lessons, quiz and exam answers, scores, certificates, streaks, XP, saved learning items, AI Tutor level results, strengths, and focus areas.",
        "Content and communications: messages, attachments, CV details and generated documents, reports, support requests, and information you intentionally provide in AI Tutor conversations.",
        "Audio, video, and media: microphone audio and transcripts used for AI voice chat, speaking tests, speaking exams, calls, and webinars; photos or files you choose to upload; and camera input only when you choose a camera-based feature.",
        "Purchase and entitlement information: order number, purchased package or course, price, currency, discounts, payment provider, payment status, refunds, and resulting balances such as AI minutes, text tokens, CV credits, or streak freezes.",
        "Device and technical information: device identifier, platform, app version, timezone, app state, push-notification tokens, IP address, request logs, diagnostic information, and security events.",
        "Safety and moderation information: blocks, reports, uploaded evidence, moderation decisions, and records needed to prevent abuse or protect users.",
      ],
    },
    {
      title: "3. Device permissions",
      paragraphs: [
        "Depending on the feature you use, the app may request microphone, camera or photo access, notifications, network access, and limited file access. You can deny or later revoke optional permissions in your device settings, although the related feature may stop working.",
        "The current app does not request access to your precise device location or address book contacts.",
      ],
    },
    {
      title: "4. How we use information",
      bullets: [
        "Create, verify, authenticate, and maintain your account.",
        "Deliver courses, practice activities, exams, certificates, CV tools, webinars, messaging, calls, notifications, rewards, purchases, and customer support.",
        "Personalize lessons and AI Tutor responses using your level, recent context, mistakes, and learning progress.",
        "Process orders, grant purchased digital entitlements, prevent duplicate transactions, and handle refunds or disputes.",
        "Operate, troubleshoot, secure, moderate, and improve the app and backend.",
        "Comply with legal obligations, enforce our Terms, and protect users, Italir Pothe, and the public.",
      ],
    },
    {
      title: "5. AI Tutor and voice processing",
      paragraphs: [
        "AI Tutor text, voice, writing-help, and level-test requests may be sent to AI, speech-to-text, text-to-speech, and real-time communication providers so they can generate a response. This can include your prompt, recent conversation context, selected learning topic, learner level, audio, and transcript.",
        "Live AI audio is generally processed as a stream. Some speaking-exam recordings, uploaded files, transcripts, level results, or conversation context may be stored when required to provide the feature. Do not submit highly sensitive information that is not needed for language learning.",
      ],
    },
    {
      title: "6. When information is shared",
      paragraphs: [
        "We do not sell personal information. The current version does not use personal information for cross-app behavioral advertising or tracking.",
        "We may share limited information with service providers only as needed to operate the service, including:",
      ],
      bullets: [
        "Cloud hosting, database, file-storage, and email providers, including AWS-based services where configured.",
        "Firebase for push notifications and device delivery.",
        "OpenAI, Pipecat, and LiveKit for AI, transcription, speech, and real-time AI sessions.",
        "Agora for user calls and live webinar communication.",
        "Google Play, Apple, Stripe, or another configured payment provider for purchases, verification, refunds, and fraud prevention.",
        "Authorized administrators, moderators, or support staff who need access to provide support, manage content, or investigate safety issues.",
        "Authorities or other parties when required by law, necessary to protect rights or safety, or involved in a business transfer subject to appropriate safeguards.",
      ],
    },
    {
      title: "7. Data retention and account deletion",
      paragraphs: [
        "We keep account and service data while your account is active and for as long as reasonably necessary for the purposes described in this policy. Retention periods vary by data type, operational need, legal obligations, fraud prevention, payment disputes, and backup cycles.",
        "You can initiate account deletion in Settings → Privacy & Legal → Delete Account. Account access is disabled and direct profile identifiers are removed or anonymized. Associated personal data is deleted or de-identified according to our operational retention process, except records we must retain for legal, accounting, security, fraud-prevention, or dispute-resolution reasons.",
        "You may also request deletion through our public account-deletion page or by contacting support. Backup copies may remain for a limited period before being overwritten and are not used for ordinary product activity.",
      ],
    },
    {
      title: "8. Your choices and rights",
      bullets: [
        "Review or update your name, profile photo, verified email, verified phone, and password from Settings, subject to verification requirements.",
        "Control microphone, camera, photo, and notification permissions through your device settings.",
        "Block users and use available reporting or moderation tools.",
        "Request access, correction, deletion, restriction, or a copy of your personal data where applicable law provides those rights.",
        "Withdraw consent for optional processing without affecting processing already lawfully completed.",
      ],
    },
    {
      title: "9. Security",
      paragraphs: [
        "We use reasonable administrative, technical, and organizational safeguards, including authenticated APIs, password hashing, access controls, secure token storage, and encrypted network connections in production. No service can guarantee absolute security, so keep your password private and contact us if you suspect unauthorized access.",
      ],
    },
    {
      title: "10. International processing",
      paragraphs: [
        "Our service providers may process information in countries other than your own. Where required, we use appropriate contractual, technical, or legal safeguards for international transfers.",
      ],
    },
    {
      title: "11. Children",
      paragraphs: [
        "Italir Pothe is not directed to children under 13. If the law where you live requires a higher minimum age, you may use the service only with valid permission from a parent or legal guardian. Contact us if you believe a child provided personal information without appropriate authorization.",
      ],
    },
    {
      title: "12. Policy updates",
      paragraphs: [
        "We may update this policy when features, providers, or legal requirements change. We will update the effective date and provide additional notice when a change is material.",
      ],
    },
    {
      title: "13. Contact us",
      paragraphs: [
        `For privacy questions, requests, or complaints, contact ${supportEmail}. Please include the email address or phone number connected to your account so we can securely verify and respond to your request.`,
      ],
    },
  ],
};

export const termsOfService: LegalDocument = {
  title: "Terms of Service",
  effectiveDate: "Effective June 27, 2026",
  introduction:
    "These Terms of Service govern your access to and use of Italir Pothe, including the mobile app, learning content, AI Tutor, community features, purchases, and related backend services.",
  sections: [
    {
      title: "1. Acceptance and eligibility",
      paragraphs: [
        "By creating an account or using Italir Pothe, you agree to these Terms and the Privacy Policy. If you do not agree, do not use the service.",
        "You must be at least 13 years old. If the law where you live requires a higher age, you may use the service only with permission from a parent or legal guardian who accepts these Terms for you.",
      ],
    },
    {
      title: "2. Your account",
      bullets: [
        "Provide accurate information and keep your verified email or phone number current.",
        "Protect your password and access codes, and do not share your account.",
        "Notify support promptly if you suspect unauthorized access.",
        "You are responsible for activity performed through your account unless applicable law states otherwise.",
      ],
    },
    {
      title: "3. The service",
      paragraphs: [
        "Italir Pothe provides Italian-language courses, practice activities, tests, certificates, AI-assisted learning, guided voice practice, messaging and calls, webinars, CV-building tools, rewards, and digital purchases. Some features may be unavailable by device, language, region, account status, or plan.",
        "We may improve, replace, limit, or discontinue features. We will try to give reasonable notice when a material change significantly affects a paid feature, unless an urgent security, legal, or technical issue requires immediate action.",
      ],
    },
    {
      title: "4. AI and educational limitations",
      paragraphs: [
        "AI-generated responses, translations, corrections, level estimates, and speech recognition may be incomplete or incorrect. Review important output before relying on it.",
        "Italir Pothe is an educational tool. It does not provide legal, immigration, medical, financial, employment, or other professional advice, and it does not guarantee exam results, language proficiency, employment, residency, or any official outcome.",
      ],
    },
    {
      title: "5. Acceptable use",
      paragraphs: ["You must use the service lawfully and respectfully. You must not:"],
      bullets: [
        "Harass, threaten, exploit, impersonate, or share another person’s private information without permission.",
        "Upload illegal, abusive, deceptive, infringing, sexually exploitative, malicious, or unsafe content.",
        "Record or distribute another person’s voice, video, messages, or personal information without all legally required consent.",
        "Interfere with the app, bypass access controls, probe security, introduce malware, scrape content, or use unauthorized automation.",
        "Manipulate purchases, credits, rewards, exams, referrals, or platform systems.",
        "Use AI or community features to facilitate unlawful activity or violate another person’s rights.",
      ],
    },
    {
      title: "6. User content and permissions",
      paragraphs: [
        "You keep ownership of content you create and upload. You grant Italir Pothe a limited, worldwide, non-exclusive license to host, process, reproduce, transmit, adapt, and display that content only as reasonably necessary to operate, secure, moderate, and improve the service.",
        "You confirm that you have the rights and permissions needed for content you submit. You can remove some content through available app tools or request assistance from support, subject to legal and operational retention requirements.",
      ],
    },
    {
      title: "7. Community, calls, and moderation",
      paragraphs: [
        "Messages, calls, reports, and community interactions must follow these Terms. We may use automated tools and authorized staff to investigate reports, enforce safety rules, restrict features, remove content, or suspend accounts. Blocking and reporting tools do not replace emergency services.",
      ],
    },
    {
      title: "8. Purchases, credits, and refunds",
      bullets: [
        "Prices, taxes, currency, package contents, and payment terms are shown before confirmation and may vary by platform or region.",
        "Purchases may be processed by Google Play, Apple, Stripe, or another displayed provider. Their payment and refund rules may also apply.",
        "AI minutes, AI text tokens, CV credits, streak freezes, rewards, and similar digital entitlements are personal, non-transferable, not legal tender, and have no cash value unless required by law.",
        "Digital entitlements may be reversed when a payment is refunded, cancelled, charged back, duplicated, fraudulent, or granted in error.",
        "Refund requests are handled under the purchasing platform’s rules, the displayed offer, and mandatory consumer law.",
      ],
    },
    {
      title: "9. Third-party services and links",
      paragraphs: [
        "The service may use or link to third-party services such as app stores, payment providers, OpenAI, Pipecat, LiveKit, Agora, Firebase, AWS, WhatsApp, Facebook, email, or phone services. Their own terms and privacy policies apply. Italir Pothe is not responsible for third-party content or services outside our control.",
      ],
    },
    {
      title: "10. Intellectual property",
      paragraphs: [
        "The app, software, designs, lessons, branding, and service content are owned by Italir Pothe or its licensors. We give you a limited, revocable, non-exclusive, non-transferable license to use the service for personal learning. You may not copy, sell, redistribute, or create unauthorized derivative works from protected service content.",
      ],
    },
    {
      title: "11. Privacy",
      paragraphs: [
        "Our Privacy Policy explains how information is collected and handled. By using the service, you acknowledge that policy and any permission or consent prompts presented for particular features.",
      ],
    },
    {
      title: "12. Suspension, termination, and deletion",
      paragraphs: [
        "You may stop using the service at any time and can initiate account deletion from Settings. We may warn, limit, suspend, or terminate access when reasonably necessary for security, fraud prevention, non-payment, legal compliance, serious or repeated violations, or protection of users and the service.",
      ],
    },
    {
      title: "13. Availability and disclaimers",
      paragraphs: [
        "We work to provide a reliable service, but availability may be interrupted by maintenance, network conditions, provider outages, device limitations, or events outside our control. To the extent permitted by law, the service is provided ‘as is’ and ‘as available.’ Nothing in these Terms excludes consumer rights that cannot legally be excluded.",
      ],
    },
    {
      title: "14. Limitation of liability",
      paragraphs: [
        "To the maximum extent permitted by law, Italir Pothe and its providers are not liable for indirect, incidental, special, consequential, or punitive loss, or for lost data, profit, opportunity, or reputation arising from use of the service. Mandatory consumer protections remain unaffected.",
      ],
    },
    {
      title: "15. Changes to these Terms",
      paragraphs: [
        "We may update these Terms to reflect changes in the service, providers, law, or safety requirements. We will update the effective date and provide additional notice for material changes when required.",
      ],
    },
    {
      title: "16. Applicable law and disputes",
      paragraphs: [
        "These Terms are governed by applicable law. Any dispute will be handled by a court or process with lawful jurisdiction, while preserving mandatory rights or venue protections available to consumers in their country of residence.",
      ],
    },
    {
      title: "17. Contact",
      paragraphs: [`Questions about these Terms may be sent to ${supportEmail}.`],
    },
  ],
};
