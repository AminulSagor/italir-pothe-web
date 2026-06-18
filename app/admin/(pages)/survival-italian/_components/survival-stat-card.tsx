import Card from "@/components/UI/cards/card";
import { getSurvivalStatIcon } from "../_utils/survival-italian-ui.util";
import type { SurvivalStat } from "@/types/survival-italian/survival-italian.type";

interface Props {
  stat: SurvivalStat;
}

export default function SurvivalStatCard({ stat }: Props) {
  const Icon = getSurvivalStatIcon(stat.iconKey);

  return (
    <Card
      padding="lg"
      rounded="3xl"
      shadow="sm"
      className="flex items-center gap-4"
    >
      <div
        className={`flex size-14 items-center justify-center rounded-2xl ${stat.iconBg}`}
      >
        <Icon className="size-6 text-[#007A3D]" />
      </div>

      <div>
        <p className="text-xs font-semibold tracking-wide text-[#5F675F]">
          {stat.title}
        </p>

        <h3 className="mt-1 text-2xl font-bold text-[#202420]">{stat.value}</h3>
      </div>
    </Card>
  );
}
