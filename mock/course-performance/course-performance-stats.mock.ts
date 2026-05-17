import { BookOpen, GraduationCap, WalletCards } from "lucide-react";
import { CoursePerformanceStat } from "./course-performance-stats.type";

export const coursePerformanceStats: CoursePerformanceStat[] = [
  {
    id: 1,
    title: "Total Course Revenue",
    value: "€42,850",
    badge: "TOP PERFORMER",
    icon: WalletCards,
  },
  {
    id: 2,
    title: "Best Selling Course",
    value: "Level A1: Beginner",
    badge: "TOP PERFORMER",
    icon: GraduationCap,
  },
  {
    id: 3,
    title: "Course Listing",
    value: "24",
    badge: "Active",
    icon: BookOpen,
  },
];
