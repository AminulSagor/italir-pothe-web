import { ListChecks } from "lucide-react";

import Card from "@/components/UI/cards/card";
import { WritingTask } from "@/mock/evaluation-center/evaluate-student/evaluate-student.types";

interface WritingTaskCardProps {
  task: WritingTask;
}

export default function WritingTaskCard({ task }: WritingTaskCardProps) {
  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="mb-7 flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-[#F3E5F4]">
          <ListChecks className="size-5 text-[#5D525B]" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#202420]">{task.title}</h2>
          <p className="text-sm text-[#9CA5A0]">
            Prompt: &quot;{task.prompt}&quot;
          </p>
        </div>
      </div>

      <div className="mb-7 h-px bg-[#E6ECE7]" />

      <div className="space-y-6 text-base leading-7 text-[#202420]">
        {task.answer.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </Card>
  );
}
