export interface NotificationStat {
    id: number;
    title: string;
    value: string;
    description: string;
}

export interface NotificationHistory {
    id: number;
    date: string;
    time: string;
    title: string;
    audience: string;
    audienceCount: string;
    status: "scheduled" | "completed";
}