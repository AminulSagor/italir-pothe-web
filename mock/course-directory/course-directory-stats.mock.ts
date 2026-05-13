import { BookOpenText, TrendingUp, UsersRound } from "lucide-react";
import { CourseDirectoryStat } from "./course-directory-stats.type";

export const courseDirectoryStats: CourseDirectoryStat[] = [
  {
    id: 1,
    title: "Total Courses",
    value: "42",
    icon: BookOpenText,
    iconBg: "bg-[#DDF4EA]",
    iconColor: "text-[#006B3F]",
  },
  {
    id: 2,
    title: "Active Students",
    value: "1,204",
    icon: UsersRound,
    iconBg: "bg-[#FFF1DD]",
    iconColor: "text-[#8A2E20]",
  },
  {
    id: 3,
    title: "Avg. Completion Rate",
    value: "78%",
    icon: TrendingUp,
    iconBg: "bg-[#DFF3F8]",
    iconColor: "text-[#006B3F]",
  },
];
