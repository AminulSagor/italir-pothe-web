import { QuizBuilderMock } from "./quiz-builder.types";

export const quizBuilderMockData: QuizBuilderMock = {
  lessonTitle: "Lesson 1.1",
  questionTitle: "Question 4 Configuration",
  flowQuestions: [
    {
      id: 1,
      title: "Listening",
      type: "Audio Response",
      questionType: "listening",
    },
    {
      id: 2,
      title: "Word Translation",
      type: "Word Pick",
      questionType: "word_translation",
    },
    {
      id: 3,
      title: "Sentence Translation",
      type: "Visual Puzzle",
      questionType: "sentence_translation",
    },
    {
      id: 4,
      title: "True False",
      type: "Fact Check",
      questionType: "true_false",
    },
    {
      id: 5,
      title: "Fill in The blanks",
      type: "Missing Word",
      questionType: "fill_blanks",
    },
    {
      id: 6,
      title: "Listen & Assemble",
      type: "Audio Puzzle",
      questionType: "listen_assemble",
    },
    {
      id: 7,
      title: "Match the Pair",
      type: "Link Words",
      questionType: "match_pair",
    },
    {
      id: 8,
      title: "Writing Word",
      type: "Free Typing",
      questionType: "writing_word",
    },
    {
      id: 9,
      title: "Identify Image",
      type: "Visual Pick",
      questionType: "identify_image",
    },
  ],
  answerOptions: [
    { id: 1, label: "Croissant", isCorrect: true },
    { id: 2, label: "Coffee", isCorrect: false },
    { id: 3, label: "Pasta", isCorrect: false },
    { id: 4, label: "Tea", isCorrect: false },
  ],
};
