import Card from "@/components/UI/cards/card";
import { dashboardStats } from "@/mock/dashboard/dashboard-stats.mock";

const DashboardStats = () => {
  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {dashboardStats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.id}
            className="min-h-48"
            padding="lg"
            rounded="3xl"
            shadow="sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex size-13 items-center justify-center rounded-full bg-[#E7F0ED]">
                <Icon className="size-6 text-[#007A4D]" />
              </div>

              <span className="rounded-full bg-[#E9FBEF] px-4 py-1 text-sm font-semibold text-[#00864F]">
                {stat.growth}
              </span>
            </div>

            <div className="mt-8">
              <p className="text-lg text-[#4B4B4B]">{stat.title}</p>
              <h3 className="mt-1 text-3xl font-bold text-[#1E1E1E]">
                {stat.value}
              </h3>
            </div>
          </Card>
        );
      })}
    </section>
  );
};

export default DashboardStats;
