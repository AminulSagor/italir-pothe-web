import {
  NotificationHistory,
  NotificationStat,
} from "@/types/notification/notification-management.types";

export const notificationStats: NotificationStat[] = [
  {
    id: 1,
    title: "TOTAL SENT",
    value: "42k",
    description: "+12.4% from last month",
  },
  {
    id: 2,
    title: "SCHEDULED",
    value: "3",
    description: "Next: Italian Grammar Basics (2h)",
  },
];

export const notificationHistory: NotificationHistory[] = [
  {
    id: 1,
    date: "Oct 24, 2023",
    time: "14:00 PM",
    title: "Advanced Verb Conjugations Webinar",
    body: "Join our advanced Italian verb conjugation webinar and improve your speaking skills.",
    audience: "B2 Level Students",
    status: "scheduled",
  },
  {
    id: 2,
    date: "Oct 24, 2023",
    time: "14:00 PM",
    title: "Flash Sale: 40% Off All Courses",
    body: "Get 40% off all available Italian language courses for a limited time.",
    audience: "All Users",
    status: "completed",
  },
  {
    id: 3,
    date: "Oct 24, 2023",
    time: "14:00 PM",
    title: "New Syllabus: Travel Basics",
    body: "A new Travel Basics syllabus is now available inside your course.",
    audience: "Recent Users",
    status: "completed",
  },
  {
    id: 4,
    date: "Oct 24, 2023",
    time: "14:00 PM",
    title: "Weekly Newsletter #42",
    body: "Read this week's Italian learning updates, tips, and newly released lessons.",
    audience: "Active Learners",
    status: "scheduled",
    imageUrl: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1",
  },
];
