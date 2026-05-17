export interface SyllabusLessonMock {
  id: number;
  title: string;
  type: "video" | "document" | "quiz";
  accessType: "free" | "premium";
}

export interface SyllabusChapterMock {
  id: number;
  title: string;
  lessons: SyllabusLessonMock[];
  defaultOpen?: boolean;
}
