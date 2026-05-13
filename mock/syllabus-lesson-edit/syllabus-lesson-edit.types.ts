export interface LessonVideoMock {
  filename: string;
  duration: string;
  size: string;
  thumbnail: string;
}

export interface LessonEditMock {
  title: string;
  theoryText: string;
  bengaliTranslation: string;
  audioProgress: string;
  audioDuration: string;
  video?: LessonVideoMock;
  accessType: "free" | "premium";
}
