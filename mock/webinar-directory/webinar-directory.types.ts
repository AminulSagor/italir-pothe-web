export type WebinarStatus = "upcoming-scheduled" | "live-now" | "draft";

export type WebinarLevel = "all-users" | "beginner-b1" | "only-a2-users";

export interface Webinar {
  id: number;
  title: string;
  hostName: string;
  webinarDate: string;
  webinarTime: string;
  badge: string;
  level: WebinarLevel;
  status: WebinarStatus;
  isLive: boolean;
}
