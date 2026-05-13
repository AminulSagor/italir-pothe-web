export interface ModerationStat {
    id: number;
    label: string;
    value: string;
    change: string;
    tone: "green" | "red" | "orange" | "blue";
}

export interface ModerationQueueItem {
    id: number;
    userName: string;
    contentType: string;
    contentId: string;
    reason: string;
    reportedDate: string;
    reportedTime: string;
    status: "pending" | "processing" | "resolved" | "banned";
    avatar: string;
}