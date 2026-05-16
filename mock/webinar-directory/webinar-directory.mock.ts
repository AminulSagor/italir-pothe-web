import { Webinar } from "@/mock/webinar-directory/webinar-directory.types";

export const webinarDirectoryMock: Webinar[] = [
  {
    id: 1,
    title: "Grammar Q&A: Passato Prossimo",
    hostName: "Admin / Mario Rossi",
    webinarDate: "OCT 28",
    webinarTime: "18:00",
    badge: "ONLY A2 USERS",
    level: "only-a2-users",
    status: "upcoming-scheduled",
    isLive: true,
  },
  {
    id: 2,
    title: "Job Interview Practice",
    hostName: "Sofia Bianchi",
    webinarDate: "NOV 02",
    webinarTime: "19:30",
    badge: "ALL USERS",
    level: "all-users",
    status: "upcoming-scheduled",
    isLive: false,
  },
  {
    id: 3,
    title: "Ordering at a Restaurant",
    hostName: "Luigi Moretti",
    webinarDate: "NOV 05",
    webinarTime: "17:00",
    badge: "BEGINNER B1",
    level: "beginner-b1",
    status: "upcoming-scheduled",
    isLive: false,
  },
];
