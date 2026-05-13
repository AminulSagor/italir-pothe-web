import {
    EarningsBar,
    InfluencerStat,
    PartnerPerformance,
    PayoutHistory,
} from "./influencer-hub.mock.types";

export const influencerStats: InfluencerStat[] = [
    {
        id: 1,
        label: "Total Influencer Partners",
        value: "28",
        description: "+12% this month",
        tone: "green",
    },
    {
        id: 2,
        label: "Active Referrals",
        value: "4,250",
        description: "Across 14 campaigns",
        tone: "blue",
    },
    {
        id: 3,
        label: "Total Commission Owed",
        value: "€1,450.00",
        description: "Due in 3 days",
        tone: "orange",
    },
];

export const partnerPerformanceData: PartnerPerformance[] = [
    {
        id: 1,
        partnerName: "Rahim Italy Vlog",
        username: "rahim_vlogs_it",
        couponCode: "RAHIM20",
        usersLinked: "850",
        totalSales: "€12,450.00",
        commissionRate: "20%",
        commissionType: "Lifetime",
        commissionEarned: "€2,490.00 earned",
    },
    {
        id: 2,
        partnerName: "Chiara Style",
        username: "chiara_fashion_daily",
        couponCode: "STYLEIT",
        usersLinked: "1,240",
        totalSales: "€28,100.00",
        commissionRate: "15%",
        commissionType: "Lifetime",
        commissionEarned: "€4,215.00 earned",
    },
    {
        id: 3,
        partnerName: "Marco Tech IT",
        username: "marco_technologia",
        couponCode: "MARCOTECH",
        usersLinked: "620",
        totalSales: "€8,900.00",
        commissionRate: "10%",
        commissionType: "Lifetime",
        commissionEarned: "€890.00 earned",
    },
];

export const earningsGrowthData: EarningsBar[] = [
    { id: 1, value: 38 },
    { id: 2, value: 52 },
    { id: 3, value: 44 },
    { id: 4, value: 67 },
    { id: 5, value: 78 },
    { id: 6, value: 61 },
    { id: 7, value: 88 },
    { id: 8, value: 70 },
    { id: 9, value: 55 },
    { id: 10, value: 74 },
    { id: 11, value: 82 },
    { id: 12, value: 94 },
    { id: 13, value: 78 },
    { id: 14, value: 88 },
];

export const payoutHistoryData: PayoutHistory[] = [
    {
        id: 1,
        date: "Oct 15, 2023",
        transactionType: "Manual Adjustment",
        referenceId: "#TR-NEW",
        amount: "€200.00",
        status: "pending",
    },
    {
        id: 2,
        date: "Oct 01, 2023",
        transactionType: "Bank Transfer",
        referenceId: "#TR-9821",
        amount: "€450.00",
        status: "paid",
    },
    {
        id: 3,
        date: "Sep 01, 2023",
        transactionType: "Bank Transfer",
        referenceId: "#TR-8712",
        amount: "€1,240.00",
        status: "paid",
    },
    {
        id: 4,
        date: "Aug 01, 2023",
        transactionType: "Bank Transfer",
        referenceId: "#TR-7210",
        amount: "€890.00",
        status: "paid",
    },
];