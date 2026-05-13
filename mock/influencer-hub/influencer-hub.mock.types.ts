export interface InfluencerStat {
    id: number;
    label: string;
    value: string;
    description: string;
    tone: "green" | "blue" | "orange";
}

export interface PartnerPerformance {
    id: number;
    partnerName: string;
    username: string;
    couponCode: string;
    usersLinked: string;
    totalSales: string;
    commissionRate: string;
    commissionType: string;
    commissionEarned: string;
}

export interface PayoutHistory {
    id: number;
    date: string;
    transactionType: string;
    referenceId: string;
    amount: string;
    status: "paid" | "pending";
}

export interface EarningsBar {
    id: number;
    value: number;
}