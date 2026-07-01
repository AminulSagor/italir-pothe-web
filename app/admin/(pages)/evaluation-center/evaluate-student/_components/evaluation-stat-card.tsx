import { Gauge, SendHorizontal } from "lucide-react";

import Card from "@/components/UI/cards/card";

interface EvaluationStatCardProps {
  stat: {
    id: string;
    title: string;
    value: string;
    helper?: string;

    iconType: "submission" | "score" | "progress";

    progressPercent?: number;
  };
}

export default function EvaluationStatCard({ stat }: EvaluationStatCardProps) {
  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="flex items-center gap-5">
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

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wide text-[#3F4842]">
            {stat.title}
          </p>

          <div className="flex items-end gap-2">
            <h3 className="truncate text-2xl font-bold text-[#202420]">
              {stat.value}
            </h3>

            {stat.helper && (
              <span className="pb-1 text-sm font-semibold text-[#0B8F3A]">
                {stat.helper}
              </span>
            )}
          </div>

          {stat.iconType === "progress" && (
            <div className="mt-2 h-2 rounded-full bg-[#DCE5DE]">
              <div
                className="h-full rounded-full bg-[#006B3F]"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, stat.progressPercent || 0),
                  )}%`,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
