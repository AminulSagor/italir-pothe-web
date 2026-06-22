import {
  BarChart3,
  Bell,
  BookOpen,
  Briefcase,
  ChartNoAxesColumn,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  Network,
  Package,
  ShieldCheck,
  Trophy,
  UserRound,
  UsersRound,
} from "lucide-react";

import { NavigationGroup } from "../types/navigations/navigation";

export const adminNavigation: NavigationGroup[] = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Revenue & Analytics",
        href: "/admin/revenue-and-analytics",
        icon: BarChart3,
        children: [
          {
            title: "Course Performance",
            href: "/admin/revenue-and-analytics/course-performance",
            icon: ChartNoAxesColumn,
          },
          {
            title: "Package Performance",
            href: "/admin/revenue-and-analytics/package-performance",
            icon: Package,
          },
        ],
      },
    ],
  },
  {
    title: "Academy",
    items: [
      {
        title: "Course Directory",
        href: "/admin/course-directory",
        icon: BookOpen,
      },
      {
        title: "Skill Builder Manager",
        href: "/admin/skill-builder-manager",
        icon: UsersRound,
      },
      {
        title: "Survival Italian",
        href: "/admin/survival-italian",
        icon: GraduationCap,
      },
      {
        title: "Final Exam Manager",
        href: "/admin/final-exam-manager",
        icon: ClipboardCheck,
        children: [
          {
            title: "Evaluation Center",
            href: "/admin/evaluation-center",
            icon: ClipboardCheck,
          },
        ],
      },
    ],
  },
  {
    title: "Store",
    items: [
      {
        title: "Package Store",
        href: "/admin/package-store",
        icon: Package,
      },
      {
        title: "CV Service Dashboard",
        href: "/admin/cv-service",
        icon: Briefcase,
      },
    ],
  },
  {
    title: "Community",
    items: [
      {
        title: "Webinar Directory",
        href: "/admin/webinar-directory",
        icon: Package,
      },
      {
        title: "User Directory",
        href: "/admin/user-directory",
        icon: UserRound,
      },
      {
        title: "League & Gamification",
        href: "/admin/league-gamification",
        icon: Trophy,
      },
      {
        title: "Reports & Moderation",
        href: "/admin/reports-moderation",
        icon: ShieldCheck,
      },
    ],
  },
  {
    title: "Utilities",
    items: [
   
      {
        title: "Influencer Hub",
        href: "/admin/influencer-hub",
        icon: Network,
      },
      {
        title: "Notification",
        href: "/admin/notification-management",
        icon: Bell,
      },
      {
        title: "Analytics",
        href: "/admin/analytics",
        icon: ChartNoAxesColumn,
      },
    ],
  },
];
