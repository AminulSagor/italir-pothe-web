// mock/final-exam-manager/final-exam-setup.types.ts

import { LucideIcon } from "lucide-react";

export interface ExamPart {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  iconWrapperClass: string;
  iconClass: string;
  accentClass: string;
}