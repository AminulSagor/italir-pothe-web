"use client";

import { useState } from "react";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { QuizQuestionType } from "@/types/course-directory/quiz.type";

export interface QuizFlowQuestionItem {
  id?: string;
  localId: string;
  title: string;
  type: string;
  questionType: QuizQuestionType;
  sortOrder?: number;
}

interface QuizFlowSidebarProps {
  questions: QuizFlowQuestionItem[];
  activeQuestionKey: string;
  lessonTitle?: string;
  onQuestionSelect: (key: string) => void;
  onAddQuestion: () => void;
  onQuestionReorder?: (draggedKey: string, targetKey: string) => void;
  onQuestionDelete?: (question: QuizFlowQuestionItem) => void;
  isReordering?: boolean;
  deletingQuestionId?: string;
}

export default function QuizFlowSidebar({
  questions,
  activeQuestionKey,
  lessonTitle,
  onQuestionSelect,
  onAddQuestion,
  onQuestionReorder,
  onQuestionDelete,
  isReordering,
  deletingQuestionId,
}: QuizFlowSidebarProps) {
  const [draggedQuestionKey, setDraggedQuestionKey] = useState<string | null>(
    null,
  );
  const [dragOverQuestionKey, setDragOverQuestionKey] = useState<string | null>(
    null,
  );

  const clearDragState = () => {
    setDraggedQuestionKey(null);
    setDragOverQuestionKey(null);
  };

  return (
    <Card
      padding="lg"
      rounded="3xl"
      shadow="sm"
      className="border border-[#E2E8E1] xl:min-h-[760px]"
    >
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#007A4A]">Quiz Flow</h2>

          <p className="text-xl font-semibold italic text-[#9BA59E]">
            {questions.length}{" "}
            {questions.length === 1 ? "Question" : "Questions"}
          </p>

          <p className="text-xs text-[#8A968E]">{lessonTitle || "Lesson"}</p>
        </div>

        <button
          type="button"
          onClick={onAddQuestion}
          disabled={isReordering}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#62F25A] text-[#007A4A] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Add quiz question"
        >
          <Plus className="size-5" />
        </button>
      </div>

      <div className="space-y-3">
        {questions.map((question, index) => {
          const isActive = question.localId === activeQuestionKey;

          return (
            <div
              key={`${question.localId}-${question.questionType}`}
              draggable={
                Boolean(question.id) &&
                Boolean(onQuestionReorder) &&
                !isReordering
              }
              onDragStart={(event) => {
                setDraggedQuestionKey(question.localId);
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", question.localId);
              }}
              onDragOver={(event) => {
                if (
                  !draggedQuestionKey ||
                  draggedQuestionKey === question.localId
                ) {
                  return;
                }

                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                setDragOverQuestionKey(question.localId);
              }}
              onDragLeave={() => {
                if (dragOverQuestionKey === question.localId) {
                  setDragOverQuestionKey(null);
                }
              }}
              onDrop={(event) => {
                event.preventDefault();
                const sourceKey =
                  draggedQuestionKey || event.dataTransfer.getData("text/plain");

                if (sourceKey && sourceKey !== question.localId) {
                  onQuestionReorder?.(sourceKey, question.localId);
                }

                clearDragState();
              }}
              onDragEnd={clearDragState}
              className={`flex w-full items-center justify-between gap-3 rounded-full px-4 py-3 text-left transition ${
                isActive
                  ? "bg-[#007A4A] text-white"
                  : "bg-[#EEF3EC] text-[#202420] hover:bg-[#E5ECE3]"
              } ${
                dragOverQuestionKey === question.localId
                  ? "ring-2 ring-[#62F25A] ring-offset-2"
                  : ""
              } ${
                draggedQuestionKey === question.localId ? "opacity-60" : ""
              } ${
                question.id && onQuestionReorder && !isReordering
                  ? "cursor-grab active:cursor-grabbing"
                  : "cursor-default"
              }`}
            >
              <button
                type="button"
                disabled={isReordering}
                onClick={() => onQuestionSelect(question.localId)}
                className="flex min-w-0 flex-1 items-center gap-3 text-left disabled:cursor-not-allowed"
                aria-label={`Open question ${question.sortOrder ?? index + 1}`}
              >
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "bg-[#DDF3E8] text-[#007A4A]"
                  }`}
                >
                  {question.sortOrder ?? index + 1}
                </span>

                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">
                    {question.questionType || `Question ${index + 1}`}
                  </span>

                  <span className="block truncate text-[10px] uppercase tracking-wide opacity-70">
                    {question.type}
                  </span>
                </span>
              </button>

              <span className="flex shrink-0 items-center gap-2">
                {isActive ? <Pencil className="size-4" /> : null}

                {question.id && onQuestionDelete ? (
                  <button
                    type="button"
                    disabled={
                      isReordering || deletingQuestionId === question.id
                    }
                    onClick={() => onQuestionDelete(question)}
                    className={`flex size-7 items-center justify-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      isActive
                        ? "text-white/80 hover:bg-white/15 hover:text-white"
                        : "text-[#C91818] hover:bg-[#FFE1E1]"
                    }`}
                    aria-label={`Permanently delete question ${question.sortOrder ?? index + 1}`}
                    title="Permanently delete question"
                  >
                    <Trash2 className="size-4" />
                  </button>
                ) : null}

                {onQuestionReorder ? (
                  <GripVertical
                    className={`size-5 ${
                      question.id && !isReordering
                        ? "opacity-70"
                        : "opacity-25"
                    }`}
                    aria-hidden="true"
                  />
                ) : null}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
