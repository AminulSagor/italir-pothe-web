import { CheckCircle2, Pencil } from "lucide-react";

import { MiniQuizQuestion } from "@/mock/final-exam-manager/listening-mini-quiz.types";

interface Props {
  question: MiniQuizQuestion;
  active?: boolean;
}

const MiniQuizQuestionItem = ({ question, active }: Props) => {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-4 rounded-3xl border p-4 text-left transition ${
        active
          ? "border-[#006B3F] bg-[#006B3F]"
          : "border-[#E2E8E1] bg-[#F9FBF8]"
      }`}
    >
      <div
        className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          active ? "bg-[#2BBF63] text-white" : "bg-[#E8EFE8] text-[#202420]"
        }`}
      >
        {question.id}
      </div>

      <div className="min-w-0 flex-1">
        <h3
          className={`truncate text-sm font-bold ${
            active ? "text-white" : "text-[#202420]"
          }`}
        >
          {question.title}
        </h3>

        <p
          className={`mt-1 text-xs ${
            active ? "text-white/70" : "text-[#7A8580]"
          }`}
        >
          {question.subtitle}
        </p>
      </div>

      {active ? (
        <Pencil className="size-4 text-white" />
      ) : (
        <CheckCircle2 className="size-5 text-[#0A7C3E]" />
      )}
    </button>
  );
};

export default MiniQuizQuestionItem;
