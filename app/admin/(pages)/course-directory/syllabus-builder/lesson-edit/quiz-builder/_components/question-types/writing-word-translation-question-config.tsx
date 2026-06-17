"use client";

import { KeyboardEvent, useMemo, useState } from "react";
import { ImagePlus, ShieldCheck, Trash2, X } from "lucide-react";

import Card from "@/components/UI/cards/card";
import FileUploader from "@/components/UI/uploaders/file-uploader";
import type { QuizQuestionAcceptedAnswer } from "@/types/course-directory/quiz.type";

interface WritingWordTranslationQuestionConfigProps {
  mediaFileId: string;
  mediaUrl: string;
  translationText: string;
  acceptedAnswers: QuizQuestionAcceptedAnswer[];
  isUploading?: boolean;
  onFileSelect: (file: File) => void;
  onRemoveMedia: () => void;
  onTranslationTextChange: (value: string) => void;
  onAcceptedAnswersChange: (answers: QuizQuestionAcceptedAnswer[]) => void;
}

const normalizeAnswers = (answers: QuizQuestionAcceptedAnswer[]) =>
  answers.map((answer, index) => ({
    ...answer,
    sortOrder: index + 1,
  }));

export default function WritingWordTranslationQuestionConfig({
  mediaFileId,
  mediaUrl,
  translationText,
  acceptedAnswers,
  isUploading = false,
  onFileSelect,
  onRemoveMedia,
  onTranslationTextChange,
  onAcceptedAnswersChange,
}: WritingWordTranslationQuestionConfigProps) {
  const [alternateInput, setAlternateInput] = useState("");

  const primaryAnswer = useMemo(
    () =>
      acceptedAnswers.find((answer) => answer.isPrimary) ||
      acceptedAnswers[0] || {
        answerText: "",
        isPrimary: true,
        sortOrder: 1,
      },
    [acceptedAnswers],
  );

  const alternateAnswers = useMemo(
    () => acceptedAnswers.filter((answer) => answer !== primaryAnswer),
    [acceptedAnswers, primaryAnswer],
  );

  const updatePrimaryAnswer = (value: string) => {
    const hasExistingPrimary = acceptedAnswers.some(
      (answer) => answer === primaryAnswer,
    );

    if (!hasExistingPrimary) {
      onAcceptedAnswersChange([
        {
          answerText: value,
          isPrimary: true,
          sortOrder: 1,
        },
        ...normalizeAnswers(alternateAnswers),
      ]);
      return;
    }

    onAcceptedAnswersChange(
      normalizeAnswers(
        acceptedAnswers.map((answer) =>
          answer === primaryAnswer
            ? { ...answer, answerText: value, isPrimary: true }
            : { ...answer, isPrimary: false },
        ),
      ),
    );
  };

  const addAlternateAnswer = () => {
    const nextAnswer = alternateInput.trim();

    if (!nextAnswer) return;

    onAcceptedAnswersChange(
      normalizeAnswers([
        ...acceptedAnswers.map((answer) => ({
          ...answer,
          isPrimary: answer === primaryAnswer,
        })),
        {
          answerText: nextAnswer,
          isPrimary: false,
          sortOrder: acceptedAnswers.length + 1,
        },
      ]),
    );
    setAlternateInput("");
  };

  const handleAlternateKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    addAlternateAnswer();
  };

  const removeAlternateAnswer = (answerIndex: number) => {
    const targetAnswer = alternateAnswers[answerIndex];
    const nextAnswers = acceptedAnswers.filter((answer) => answer !== targetAnswer);

    onAcceptedAnswersChange(normalizeAnswers(nextAnswers));
  };

  return (
    <div className="space-y-6">
      <Card
        padding="lg"
        rounded="3xl"
        shadow="sm"
        className="border border-[#E2E8E1]"
      >
        {mediaFileId ? (
          <>
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ImagePlus className="size-5 text-[#007A4A]" />

                <h3 className="text-sm font-semibold text-[#007A4A]">
                  Question Visual
                </h3>
              </div>

              <button
                type="button"
                onClick={onRemoveMedia}
                className="inline-flex h-9 items-center gap-2 rounded-full bg-[#FFD8D3] px-4 text-xs font-bold uppercase text-[#D83324]"
              >
                <Trash2 className="size-4" />
                Remove Image
              </button>
            </div>

            <div className="flex min-h-72 items-center justify-center rounded-3xl border border-[#DDE6DD] bg-[#EEF3EC] p-6">
              {mediaUrl ? (
                <img
                  src={mediaUrl}
                  alt="Quiz question visual"
                  className="max-h-64 w-auto object-contain"
                />
              ) : (
                <p className="text-sm text-[#66736B]">Image URL loading...</p>
              )}
            </div>

            <label className="mt-5 inline-flex h-10 cursor-pointer items-center rounded-full bg-white px-5 text-sm font-semibold text-[#007A4A]">
              {isUploading ? "Uploading..." : "Replace Image"}

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                disabled={isUploading}
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (file) {
                    onFileSelect(file);
                  }

                  event.target.value = "";
                }}
              />
            </label>
          </>
        ) : (
          <FileUploader
            title={isUploading ? "Uploading..." : "Question Visual"}
            description="Upload the high-quality image students need to identify during the quiz."
            accept="image/png,image/jpeg,image/jpg"
            icon={<ImagePlus className="size-8" />}
            className="min-h-80 rounded-[40px]"
            onFileSelect={onFileSelect}
          />
        )}
      </Card>

      <Card
        padding="lg"
        rounded="3xl"
        shadow="sm"
        className="border border-[#E2E8E1]"
      >
        <div className="mb-8 flex items-center gap-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#DFF8DC]">
            <ShieldCheck className="size-5 text-[#007A4A]" />
          </div>

          <h3 className="text-lg font-bold text-[#202420]">
            Typing Validation Setup
          </h3>
        </div>

        <div className="space-y-6">
          <label>
            <span className="mb-2 block text-[10px] font-bold uppercase text-[#66736B]">
              English Helper Text
            </span>

            <input
              value={translationText}
              onChange={(event) => onTranslationTextChange(event.target.value)}
              placeholder="Apple"
              className="h-14 w-full rounded-full bg-[#EEF3EC] px-6 text-sm font-semibold text-[#202420] outline-none placeholder:text-[#8A968E]"
            />
          </label>

          <label>
            <span className="mb-2 block text-[10px] font-bold uppercase text-[#66736B]">
              Exact Correct Answer (Italian)
            </span>

            <input
              value={primaryAnswer.answerText}
              onChange={(event) => updatePrimaryAnswer(event.target.value)}
              placeholder="Mela"
              className="h-14 w-full rounded-full border border-[#007A4A] bg-[#F1FBF4] px-6 text-sm font-bold text-[#007A4A] outline-none placeholder:text-[#8A968E]"
            />
          </label>

          <div>
            <span className="mb-2 block text-[10px] font-bold uppercase text-[#66736B]">
              Acceptable Alternate Spellings
            </span>

            <div className="flex min-h-20 flex-wrap items-center gap-3 rounded-3xl border border-dashed border-[#C9D8CE] bg-[#F7FBF6] px-5 py-4">
              {alternateAnswers.map((answer, index) => (
                <button
                  key={`${answer.id || "alternate-answer"}-${index}`}
                  type="button"
                  onClick={() => removeAlternateAnswer(index)}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#526057] shadow-sm"
                >
                  {answer.answerText}
                  <X className="size-3" />
                </button>
              ))}

              <input
                value={alternateInput}
                onChange={(event) => setAlternateInput(event.target.value)}
                onKeyDown={handleAlternateKeyDown}
                onBlur={addAlternateAnswer}
                placeholder="Add variation..."
                className="min-w-44 flex-1 bg-transparent text-sm text-[#202420] outline-none placeholder:text-[#8A968E]"
              />
            </div>

            <p className="mt-3 text-xs text-[#8A968E]">
              Add variations the system should accept as correct.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
