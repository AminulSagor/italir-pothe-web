import {
  BookOpen,
  BriefcaseBusiness,
  Languages,
  Mic2,
  ScrollText,
} from "lucide-react";

import { FinalExamItem } from "./final-exam-manager.types";

export const finalExamTabs = [
  {
    id: "all-exams",
    label: "All Exams",
    active: true,
  },
  {
    id: "linked-course",
    label: "Linked to Course",
  },
  {
    id: "drafts",
    label: "Drafts",
  },
];

export const finalExams: FinalExamItem[] = [
  {
    id: 1,
    title: "Level A1: Beginner Finals",
    questionCount: 30,
    duration: "60 Mins",
    linkedCourse: "A1 Italian Foundation",
    status: "LIVE",
    icon: BookOpen,
    iconBackground: "bg-[#EAF4FF]",
    iconColor: "text-[#006B3F]",
  },
  {
    id: 2,
    title: "Intermediate Italian B1",
    questionCount: 45,
    duration: "90 Mins",
    linkedCourse: "B1 Intermediate Track",
    status: "LIVE",
    icon: Languages,
    iconBackground: "bg-[#F9ECF8]",
    iconColor: "text-[#8B286F]",
  },
  {
    id: 3,
    title: "Advanced Grammar Master",
    questionCount: 45,
    duration: "90 Mins",
    linkedCourse: "Independent",
    status: "DRAFT",
    icon: ScrollText,
    iconBackground: "bg-[#F9F1E4]",
    iconColor: "text-[#8A5B16]",
  },
  {
    id: 4,
    title: "Business Italian Basics",
    questionCount: 25,
    duration: "45 Mins",
    linkedCourse: "Professional Italian",
    status: "LIVE",
    icon: BriefcaseBusiness,
    iconBackground: "bg-[#EAF4FF]",
    iconColor: "text-[#006B3F]",
  },
  {
    id: 5,
    title: "Italian Pronunciation Oral",
    questionCount: 10,
    duration: "30 Mins",
    linkedCourse: "Perfect Pronunciation",
    status: "LIVE",
    icon: Mic2,
    iconBackground: "bg-[#EAF4FF]",
    iconColor: "text-[#006B3F]",
  },
];