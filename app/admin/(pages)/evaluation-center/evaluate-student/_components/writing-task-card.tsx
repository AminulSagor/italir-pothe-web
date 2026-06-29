import { ListChecks } from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { FinalExamEvaluationAnswer } from "@/types/evaluation-center/evaluation-center.type";

interface WritingTaskCardProps {
  answer: FinalExamEvaluationAnswer | null;
}

export default function WritingTaskCard({ answer }: WritingTaskCardProps) {
  if (!answer) {
    return (
      <Card padding="lg" rounded="3xl" shadow="sm">
        <div className="flex min-h-[180px] items-center justify-center text-sm text-[#8A948D]">
          This exam does not contain a submitted writing task.
        </div>
      </Card>
    );
  }

  const title =
    answer.question?.title || answer.section?.title || "Writing Task";

  const prompt = answer.question?.prompt || answer.question?.subtitle;

  const paragraphs = (answer.textAnswer || "")
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="mb-7 flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-[#F3E5F4]">
          <ListChecks className="size-5 text-[#5D525B]" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#202420]">{title}</h2>

          {prompt && (
            <p className="text-sm text-[#9CA5A0]">
              Prompt: &quot;
              {prompt}
              &quot;
            </p>
          )}
        </div>
      </div>

      <div className="mb-7 h-px bg-[#E6ECE7]" />

      <div className="space-y-6 text-base leading-7 text-[#202420]">
        {paragraphs.length ? (
          paragraphs.map((paragraph, index) => (
            <p key={`${answer.id}-${index}`}>{paragraph}</p>
          ))
        ) : (
          <p className="text-[#8A948D]">No written response was submitted.</p>
        )}
      </div>
    </Card>
  );
}
