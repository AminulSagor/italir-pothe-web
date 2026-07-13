import type {
  PublicCourse,
  PublicFeature,
  PublicNavigationItem,
  WebinarCategory,
} from "@/types/public-site/public-site.type";

export const PUBLIC_SITE_CONFIG = {
  name: "Italir Pothe",
  shortDescription:
    "A practical learning platform for Italian language, career preparation, live webinars, examinations and verified certificates.",
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@italirpothe.com",
  youtubeUrl: "https://www.youtube.com/@italirpothe",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://italirpothe.com",

  facebookPageUrl: "https://www.facebook.com/ItalirPothe",
  facebookGroupUrl: "https://www.facebook.com/groups/1816913385931720",
} as const;

export const PUBLIC_NAVIGATION: PublicNavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Books", href: "/books" },
  { label: "Webinars", href: "/webinars" },
  { label: "Verify", href: "/certificates/verify" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const PUBLIC_FEATURES: PublicFeature[] = [
  {
    title: "Structured Italian courses",
    description:
      "Learn with guided lessons, vocabulary practice, quizzes and clear progress tracking.",
    icon: "book-open",
  },
  {
    title: "Survival Italian",
    description:
      "Practice useful Italian for everyday conversations and real-life situations.",
    icon: "messages",
  },
  {
    title: "Career skill building",
    description:
      "Develop workplace language and practical skills for professional growth.",
    icon: "briefcase",
  },
  {
    title: "CV preparation",
    description:
      "Create a professional profile and prepare a well-structured CV for opportunities.",
    icon: "file-text",
  },
  {
    title: "Exams and certificates",
    description:
      "Complete final assessments and receive certificates that can be verified online.",
    icon: "badge-check",
  },
  {
    title: "Progress and rewards",
    description:
      "Stay motivated with XP, learning streaks, leagues, achievements and rewards.",
    icon: "trophy",
  },
];

export const PUBLIC_COURSES: PublicCourse[] = [
  {
    title: "Italian Foundations",
    description:
      "Build a strong base in everyday vocabulary, grammar, reading and sentence formation.",
    level: "Beginner friendly",
    highlights: [
      "Grammar guidance",
      "Vocabulary practice",
      "Interactive quizzes",
    ],
    icon: "languages",
  },
  {
    title: "Everyday & Survival Italian",
    description:
      "Learn the phrases and listening skills needed for common daily conversations.",
    level: "Practical learning",
    highlights: ["Daily situations", "Useful phrases", "Pronunciation support"],
    icon: "message-circle",
  },
  {
    title: "Career Italian",
    description:
      "Prepare for workplace communication, professional situations and career growth.",
    level: "Career focused",
    highlights: ["Workplace language", "Career tracks", "CV preparation"],
    icon: "briefcase-business",
  },
  {
    title: "Speaking Practice",
    description:
      "Improve confidence through guided pronunciation, speaking activities and feedback.",
    level: "Skill practice",
    highlights: ["Speaking exercises", "Pronunciation", "Confidence building"],
    icon: "mic-2",
  },
];

export const WEBINAR_CATEGORIES: WebinarCategory[] = [
  {
    title: "Language workshops",
    description:
      "Join guided sessions focused on grammar, pronunciation and practical Italian.",
    icon: "presentation",
  },
  {
    title: "Career conversations",
    description:
      "Learn from focused discussions about communication, preparation and career skills.",
    icon: "messages-square",
  },
  {
    title: "Live questions and answers",
    description:
      "Ask questions directly and get practical clarification during interactive sessions.",
    icon: "circle-help",
  },
];
