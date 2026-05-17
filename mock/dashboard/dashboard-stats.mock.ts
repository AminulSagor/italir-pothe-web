import { Banknote, BookOpen, UserRound, UserRoundPlus } from "lucide-react";
import { DashboardStat } from "./dashboard-stats.type";

export const dashboardStats: DashboardStat[] = [
  {
    id: 1,
    title: "Monthly Revenue",
    value: "€42,850",
    growth: "+12.4%",
    icon: Banknote,
  },
  {
    id: 2,
    title: "Total Students",
    value: "8,241",
    growth: "+3.1%",
    icon: UserRound,
  },
  {
    id: 3,
    title: "Active Courses",
    value: "156",
    growth: "+8.7%",
    icon: BookOpen,
  },
  {
    id: 4,
    title: "New Student Signups",
    value: "432",
    growth: "+15.2%",
    icon: UserRoundPlus,
  },
];
