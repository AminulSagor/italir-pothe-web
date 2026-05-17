// mock/final-exam-manager/final-exam-setup.mock.ts

import { Headphones, Mic, NotebookPen, SquarePen } from "lucide-react";

import { ExamPart } from "./final-exam-setup.types";

export const examSetupInfo = {
  title: "Final Exam Setup: Level A1 Beginner",
  subtitle:
    "Design and configure the ultimate graduation gateway for students.",
  progress: 65,
  examName: "Level A1 Beginner",
  linkedCourse: "Italian A1: Beginner Comprehensive",
};

export const examParts: ExamPart[] = [
  {
    id: 1,
    title: "Part 1: Core Quiz (Automated)",
    description: "Standard multiple-choice and fill-in-the-blanks logic.",
    icon: SquarePen,
    iconWrapperClass: "bg-[#007A43]",
    iconClass: "text-white",
    accentClass: "border-l-[#007A43]",
  },
  {
    id: 2,
    title: "Part 2: Listening Lab (Automated MCQ)",
    description: "High-fidelity audio comprehension module.",
    icon: Headphones,
    iconWrapperClass: "bg-[#EAF6FF]",
    iconClass: "text-[#006B3F]",
    accentClass: "border-l-[#EAF6FF]",
  },
  {
    id: 3,
    title: "Part 3: Writing Task (Manual Review)",
    description: "Extended essay response with accent assistance.",
    icon: NotebookPen,
    iconWrapperClass: "bg-[#FFF4E8]",
    iconClass: "text-[#C45125]",
    accentClass: "border-l-[#FFF4E8]",
  },
  {
    id: 4,
    title: "Part 4: Speaking Lab (Manual Review)",
    description: "Audio recording for pronunciation and fluency check.",
    icon: Mic,
    iconWrapperClass: "bg-[#EAF8F4]",
    iconClass: "text-[#006B3F]",
    accentClass: "border-l-[#EAF8F4]",
  },
];
