import { ListeningMiniQuizData } from "./listening-mini-quiz.types";

export const listeningMiniQuizMock: ListeningMiniQuizData = {
  pageTitle: "Listening Mini Quiz Builder: Final Exam Level A1 Beginner",
  pageDescription:
    "Manage questions and interactive content for the Italian language module.",
  totalQuestions: 3,

  questions: [
    {
      id: 1,
      title: "A che ora inizia...",
      subtitle: "Multiple Choice",
      completed: true,
    },
    {
      id: 2,
      title: "Dove si trova la...",
      subtitle: "Multiple Choice",
    },
    {
      id: 3,
      title: "Qual è il prezzo...",
      subtitle: "Short Answer",
    },
  ],

  answerOptions: [
    {
      id: 1,
      label: "Ciao",
      correct: true,
    },
    {
      id: 2,
      label: "Grazie",
    },
    {
      id: 3,
      label: "Buongiorno",
    },
    {
      id: 4,
      label: "Prego",
    },
  ],
};
