export interface SyllabusLesson {
  id: string;
  title: string;
  isFree: boolean;
  sortOrder: number;
  status: "draft" | "published" | "archived";
}

export interface SyllabusChapter {
  id: string;
  courseId: string;
  title: string;
  sortOrder: number;
  isPublished: boolean;
  totalLessons?: number;
  lessons: SyllabusLesson[];
}

export interface CourseSyllabusResponse {
  chapters: Omit<SyllabusChapter, "lessons">[];
}

export interface ChapterLessonsResponse {
  id: string;
  title: string;
  sortOrder: number;
  isPublished: boolean;
  lessons: SyllabusLesson[];
}

export interface CourseSyllabusSummaryResponse {
  summary: {
    totalChapters: number;
    totalLessons: number;
  };
}

export interface CreateCourseChapterPayload {
  title: string;
  sortOrder: number;
  isPublished: boolean;
}

export interface UpdateCourseChapterPayload {
  title: string;
  sortOrder: number;
  isPublished: boolean;
}

export interface ReorderSyllabusPayload {
  chapters: {
    chapterId: string;
    sortOrder: number;
    lessons?: {
      lessonId: string;
      sortOrder: number;
    }[];
  }[];
}
