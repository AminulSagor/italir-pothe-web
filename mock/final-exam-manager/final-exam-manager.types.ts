import { LucideIcon } from "lucide-react";

export type FinalExamStatus = "LIVE" | "DRAFT";

export interface FinalExamItem {
  id: number;
  title: string;
  questionCount: number;
  duration: string;
  linkedCourse: string;
  status: FinalExamStatus;
  icon: LucideIcon;
  iconBackground: string;
  iconColor: string;
}