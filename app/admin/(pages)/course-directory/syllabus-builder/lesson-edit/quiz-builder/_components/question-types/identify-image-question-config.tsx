"use client";

import { Plus, Trash2 } from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { QuizQuestionAcceptedAnswer } from "@/types/course-directory/quiz.type";

interface IdentifyImageQuestionConfigProps {
  acceptedAnswers: QuizQuestionAcceptedAnswer[];
  onAcceptedAnswersChange: (answers: QuizQuestionAcceptedAnswer[]) => void;
}

export default function IdentifyImageQuestionConfig({
  acceptedAnswers,
  onAcceptedAnswersChange,
}: IdentifyImageQuestionConfigProps) {
  const updateAnswer = (
    answerIndex: number,
    patch: Partial<QuizQuestionAcceptedAnswer>,
  ) => {
    onAcceptedAnswersChange(
      acceptedAnswers.map((answer, index) =>
        index === answerIndex ? { ...answer, ...patch } : answer,
      ),
    );
  };

  const markPrimary = (answerIndex: number) => {
    onAcceptedAnswersChange(
      acceptedAnswers.map((answer, index) => ({
        ...answer,
        isPrimary: index === answerIndex,
      })),
    );
  };

  const addAnswer = () => {
    onAcceptedAnswersChange([
      ...acceptedAnswers,
      {
        answerText: "",
        isPrimary: acceptedAnswers.length === 0,
        sortOrder: acceptedAnswers.length + 1,
      },
    ]);
  };

  const removeAnswer = (answerIndex: number) => {
    onAcceptedAnswersChange(
      acceptedAnswers
        .filter((_, index) => index !== answerIndex)
        .map((answer, index) => ({
          ...answer,
          isPrimary: answer.isPrimary || index === 0,
          sortOrder: index + 1,
        })),
    );
  };

  return (
    <Card
      padding="lg"
      rounded="3xl"
      shadow="sm"
      className="border border-[#E2E8E1]"
    >
      <div className="mb-7 flex items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-[#202420]">Accepted Answers</h3>

        <button
          type="button"
          onClick={addAnswer}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[#007A4A] px-5 text-sm font-semibold text-white"
        >
          <Plus className="size-4" />
          Add Answer
        </button>
      </div>

      <div className="space-y-3">
        {acceptedAnswers.map((answer, index) => (
          <div
            key={`${answer.id || "answer"}-${index}`}
            className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_120px_48px]"
          >
            <input
              value={answer.answerText}
              onChange={(event) =>
                updateAnswer(index, { answerText: event.target.value })
              }
              placeholder="Accepted answer..."
              className="h-14 rounded-full bg-[#EEF3EC] px-6 text-sm font-semibold text-[#202420] outline-none"
            />

            <button
              type="button"
              onClick={() => markPrimary(index)}
              className={`h-14 rounded-full text-sm font-semibold ${
                answer.isPrimary
                  ? "bg-[#DFF8DC] text-[#007A4A]"
                  : "bg-[#EEF3EC] text-[#66736B]"
              }`}
            >
              Primary
            </button>

            <button
              type="button"
              onClick={() => removeAnswer(index)}
              className="flex size-14 items-center justify-center rounded-full bg-[#FFF1F1] text-[#D83324]"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}
