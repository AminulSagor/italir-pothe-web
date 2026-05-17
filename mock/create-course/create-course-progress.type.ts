import { LucideIcon } from "lucide-react";

export interface CreateCourseProgressStep {
  id: number;
  title: string;
  isCompleted: boolean;
}

export interface CourseStatusOption {
  id: number;
  title: string;
  icon: LucideIcon;
  isActive?: boolean;
}
