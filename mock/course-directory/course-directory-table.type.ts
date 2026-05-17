export type CourseStatus = "Published" | "Draft" | "Archived";

export interface CourseDirectoryTableItem {
  id: number;
  courseName: string;
  category: string;
  students: number;
  price: string;
  status: CourseStatus;
}
