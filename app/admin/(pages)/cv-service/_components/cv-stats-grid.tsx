import {
  BadgeEuro,
  FileText,
  PackageCheck,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";

import Card from "@/components/UI/cards/card";

interface CVStat {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  highlighted?: boolean;
}

const stats: CVStat[] = [
  {
    title: "Total Templates",
    value: "12",
    description: "Uploaded CV templates",
    icon: FileText,
    highlighted: true,
  },
  {
    title: "Active Packages",
    value: "4",
    description: "Currently available packages",
    icon: PackageCheck,
  },
  {
    title: "Total Orders",
    value: "184",
    description: "Completed and pending orders",
    icon: ShoppingCart,
  },
  {
    title: "Total Revenue",
    value: "€2,430",
    description: "Revenue from CV packages",
    icon: BadgeEuro,
  },
];

export default function CVStatsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isHighlighted = Boolean(stat.highlighted);

        return (
          <Card
            key={stat.title}
            padding="lg"
            rounded="3xl"
            shadow="sm"
            className={
              isHighlighted
                ? "!bg-[#005B35] !text-white"
                : "!bg-white !text-[#202420]"
            }
          >
            <div className="flex h-full min-h-[130px] flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p
                    className={
                      isHighlighted
                        ? "text-sm font-medium text-white/75"
                        : "text-sm font-medium text-black/55"
                    }
                  >
                    {stat.title}
                  </p>

                  <h2
                    className={
                      isHighlighted
                        ? "mt-5 text-3xl font-bold text-white"
                        : "mt-5 text-3xl font-bold text-[#202420]"
                    }
                  >
                    {stat.value}
                  </h2>
                </div>

                <span
                  className={
                    isHighlighted
                      ? "flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white"
                      : "flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#E6F6F0] text-[#007A4D]"
                  }
                >
                  <Icon className="size-5" />
                </span>
              </div>

              <p
                className={
                  isHighlighted
                    ? "mt-5 text-xs text-white/65"
                    : "mt-5 text-xs text-black/45"
                }
              >
                {stat.description}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}