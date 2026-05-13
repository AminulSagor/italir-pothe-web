import { SyllabusChapterMock } from "./syllabus-builder.types";

export const syllabusBuilderMockData: SyllabusChapterMock[] = [
  {
    id: 1,
    title: "Capitolo 1: Saluti",
    defaultOpen: true,
    lessons: [
      {
        id: 1,
        title: "Lesson 1.1: Basic Hellos",
        type: "video",
        accessType: "free",
      },
      {
        id: 2,
        title: "Lesson 1.2: Vocabulary Worksheet",
        type: "document",
        accessType: "premium",
      },
      {
        id: 3,
        title: "Lesson 1.3: Greetings Quiz",
        type: "quiz",
        accessType: "premium",
      },
    ],
  },
  {
    id: 2,
    title: "Capitolo 2: I Numeri",
    defaultOpen: false,
    lessons: [
      {
        id: 1,
        title: "Lesson 2.1: Numbers 1-10",
        type: "video",
        accessType: "free",
      },
      {
        id: 2,
        title: "Lesson 2.2: Counting Practice",
        type: "document",
        accessType: "premium",
      },
      {
        id: 3,
        title: "Lesson 2.3: Number Quiz",
        type: "quiz",
        accessType: "premium",
      },
    ],
  },
];
