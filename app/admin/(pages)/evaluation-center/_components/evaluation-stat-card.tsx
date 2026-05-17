import Card from "@/components/UI/cards/card";
import { EvaluationStat } from "@/mock/evaluation-center/evaluation-center.types";

interface Props {
  stat: EvaluationStat;
}

export default function EvaluationStatCard({ stat }: Props) {
  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="flex items-start gap-4">
        <div
          className={`flex size-10 items-center justify-center rounded-full text-sm text-[#006B3F] ${stat.iconBg}`}
        >
          {stat.icon}
        </div>

        <div>
          <p className="text-sm text-[#4F5B52]">{stat.title}</p>

          <h3 className="mt-2 text-3xl font-bold text-[#006B3F]">
            {stat.value}
          </h3>

          <p className="mt-1 text-xs text-[#7A847B]">{stat.subtitle}</p>
        </div>
      </div>
    </Card>
  );
}
