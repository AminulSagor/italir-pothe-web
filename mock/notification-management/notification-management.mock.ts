import {
    NotificationHistory,
    NotificationStat,
} from "./notification-management.mock.types";

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
        audience: "B2 Level Students",
        audienceCount: "1,450",
        status: "scheduled",
    },
    {
        id: 2,
        date: "Oct 24, 2023",
        time: "14:00 PM",
        title: "Flash Sale: 40% Off All Courses",
        audience: "All Users",
        audienceCount: "42k",
        status: "completed",
    },
    {
        id: 3,
        date: "Oct 24, 2023",
        time: "14:00 PM",
        title: "New Syllabus: Travel Basics",
        audience: "Unsubscribed/Recent",
        audienceCount: "800",
        status: "completed",
    },
    {
        id: 4,
        date: "Oct 24, 2023",
        time: "14:00 PM",
        title: "Weekly Newsletter #42",
        audience: "Active Learners",
        audienceCount: "8,200",
        status: "scheduled",
    },
];