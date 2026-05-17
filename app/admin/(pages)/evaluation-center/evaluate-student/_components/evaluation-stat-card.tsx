import Image from "next/image";
import { Gauge, SendHorizontal } from "lucide-react";

import Card from "@/components/UI/cards/card";
import { EvaluationStat } from "@/mock/evaluation-center/evaluate-student/evaluate-student.types";

interface EvaluationStatCardProps {
  stat: EvaluationStat;
}

export default function EvaluationStatCard({ stat }: EvaluationStatCardProps) {
  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="flex items-center gap-5">
        {stat.image ? (
          <div className="relative size-16 overflow-hidden rounded-full">
            <Image
              src={stat.image}
              alt={stat.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className={`flex size-14 items-center justify-center rounded-full ${
              stat.iconType === "submission" ? "bg-[#F3E5F4]" : "bg-[#DDF3EE]"
            }`}
          >
            {stat.iconType === "submission" ? (
              <SendHorizontal className="size-5 text-[#5D525B]" />
            ) : (
              <Gauge className="size-5 text-[#007A67]" />
            )}
          </div>
        )}

        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-wide text-[#3F4842]">
            {stat.title}
          </p>

          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-bold text-[#202420]">{stat.value}</h3>
            {stat.helper && (
              <span className="pb-1 text-sm font-semibold text-[#0B8F3A]">
                {stat.helper}
              </span>
            )}
          </div>

          {stat.iconType === "progress" && (
            <div className="mt-2 h-2 rounded-full bg-[#DCE5DE]">
              <div className="h-full w-[78%] rounded-full bg-[#006B3F]" />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
