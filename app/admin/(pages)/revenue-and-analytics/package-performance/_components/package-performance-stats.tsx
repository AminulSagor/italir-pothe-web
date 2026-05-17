import Card from "@/components/UI/cards/card";
import { packagePerformanceStats } from "@/mock/package-performance/package-performance-stats.mock";

const PackagePerformanceStats = () => {
  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {packagePerformanceStats.map((stat) => {
        const Icon = stat.icon;
        const isPrimary = stat.variant === "primary";

        return (
          <Card
            key={stat.id}
            padding="lg"
            rounded="3xl"
            shadow="sm"
            className={`min-h-40 ${isPrimary ? "!bg-[#006B3F] text-white" : ""}`}
          >
            <div className="flex items-start justify-between">
              <div
                className={`flex size-10 items-center justify-center rounded-xl ${
                  isPrimary ? "bg-white/15" : "bg-[#E9FBEF]"
                }`}
              >
                <Icon
                  className={`size-5 ${
                    isPrimary ? "text-white" : "text-[#006B3F]"
                  }`}
                />
              </div>

              {stat.badge && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    isPrimary
                      ? "bg-[#75FF33]/20 text-[#75FF33]"
                      : "bg-[#E9FBEF] text-[#007A4D]"
                  }`}
                >
                  {stat.badge}
                </span>
              )}
            </div>

            <div className="mt-7">
              <p
                className={
                  isPrimary ? "text-white/60" : "text-sm text-black/50"
                }
              >
                {stat.title}
              </p>
              <h3
                className={`mt-1 text-2xl font-bold ${
                  isPrimary ? "text-white" : "text-[#202420]"
                }`}
              >
                {stat.value}
              </h3>
            </div>
          </Card>
        );
      })}
    </section>
  );
};

export default PackagePerformanceStats;
