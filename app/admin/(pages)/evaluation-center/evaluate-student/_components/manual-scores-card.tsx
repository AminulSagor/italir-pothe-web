import { ClipboardCheck } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";
import { ManualScore } from "@/mock/evaluation-center/evaluate-student/evaluate-student.types";
import Link from "next/link";

interface ManualScoresCardProps {
  scores: ManualScore[];
}

export default function ManualScoresCard({ scores }: ManualScoresCardProps) {
  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="mb-7 flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-[#FCEBEC]">
          <ClipboardCheck className="size-5 text-[#B42318]" />
        </div>

        <h2 className="text-xl font-bold text-[#202420]">Manual Scores</h2>
      </div>

      <div className="mb-8 rounded-full bg-[#F1F4EF] px-5 py-4">
        <p className="text-xs font-bold uppercase tracking-wide text-[#8A948D]">
          Core Quiz
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#202420]">Auto-Graded</span>
          <strong className="text-3xl text-[#007A35]">
            8.5
            <span className="text-sm font-medium text-[#8A948D]"> /10</span>
          </strong>
        </div>
      </div>

      <div className="space-y-7">
        {scores.map((score) => (
          <div
            key={score.id}
            className="flex items-center justify-between gap-4"
          >
            <p className="text-sm font-bold text-[#3F4842]">{score.label}</p>
            <span className="flex size-11 items-center justify-center rounded-full border border-[#C9D4CC] bg-[#F8FBF8] text-base font-bold text-[#006B3F]">
              {score.value}
            </span>
          </div>
        ))}
      </div>

      <div className="my-8 h-px bg-[#E6ECE7]" />

      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="text-xs font-bold uppercase text-[#006B3F]">
          Final Average Score
        </p>
        <span className="rounded-full bg-[#DDF3E8] px-3 py-1 text-xs font-bold text-[#006B3F]">
          Calculated
        </span>
      </div>

      <div className="mb-7 rounded-2xl bg-[#006B3F] p-6 text-white">
        <p className="text-base">Overall Performance</p>
        <p className="mt-1 text-3xl font-bold">
          81 <span className="text-base font-medium">/100</span>
        </p>
      </div>

      <Link href="/admin/evaluation-center/certification-center">
        <Button
          fullWidth
          size="lg"
          className="bg-[#59F94D] !text-[#006B3F] hover:!bg-[#48E93E]"
        >
          Give Final Verdict
        </Button>
      </Link>
    </Card>
  );
}
