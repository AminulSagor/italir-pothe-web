import { CalendarDays, FileText, CheckCircle } from "lucide-react";
import { CourseStatusOption } from "./create-course-progress.type";

export const createCourseStatusOptions: CourseStatusOption[] = [
  {
    id: 1,
    title: "Published",
    icon: CheckCircle,
    isActive: true,
  },
  {
    id: 2,
    title: "Draft",
    icon: FileText,
  },
  {
    id: 3,
    title: "Upcoming",
    icon: CalendarDays,
  },
];
