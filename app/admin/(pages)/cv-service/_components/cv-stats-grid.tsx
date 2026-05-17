import { BadgeEuro, FileText, Hexagon, ShoppingCart } from "lucide-react";

import Card from "@/components/UI/cards/card";
import { cvStats } from "@/mock/cv-service/cv-service.mock";

const icons = [BadgeEuro, FileText, Hexagon, ShoppingCart];

export default function CVStatsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cvStats.map((stat, index) => {
        const Icon = icons[index];

        return (
          <Card
            key={stat.title}
            padding="lg"
            rounded="3xl"
            shadow="sm"
            className={stat.dark ? "bg-[#005B35] text-white" : "bg-white"}
          >
            <div className="flex items-start justify-between gap-4">
              <p
                className={`text-sm ${
                  stat.dark ? "text-white/75" : "text-black/55"
                }`}
              >
                {stat.title}
              </p>

              <span
                className={`flex size-8 items-center justify-center rounded-full ${
                  stat.dark ? "bg-white/15" : "bg-[#E6F6F0]"
                }`}
              >
                <Icon className="size-4 text-[#007A4D]" />
              </span>
            </div>

            <h2 className="mt-7 text-3xl font-bold">{stat.value}</h2>

            <span
              className={`mt-5 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                stat.dark
                  ? "bg-white/15 text-white"
                  : "bg-[#E9F8EF] text-[#008542]"
              }`}
            >
              {stat.badge}
            </span>
          </Card>
        );
      })}
    </div>
  );
}
