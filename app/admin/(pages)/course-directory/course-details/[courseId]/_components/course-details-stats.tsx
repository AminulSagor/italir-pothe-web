import Card from "@/components/UI/cards/card";
import { courseDetailsStats } from "@/mock/course-details/course-details-stats.mock";

const CourseDetailsStats = () => {
  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {courseDetailsStats.map((stat) => {
        const Icon = stat.icon;
        const isPrimary = stat.variant === "primary";
        const isRefunded = stat.title === "Refunded";

        return (
          <Card
            key={stat.id}
            padding="lg"
            rounded="3xl"
            shadow="sm"
            className={`min-h-44 ${
              isPrimary ? "!bg-[#006B3F] text-white" : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <p
                className={
                  isPrimary ? "text-white/70" : "text-sm text-black/55"
                }
              >
                {stat.title}
              </p>

              <div
                className={`flex size-10 items-center justify-center rounded-full ${
                  isPrimary
                    ? "bg-white/15"
                    : isRefunded
                      ? "bg-[#FFD9D9]"
                      : "bg-[#E9FBEF]"
                }`}
              >
                <Icon
                  className={`size-5 ${
                    isPrimary
                      ? "text-white"
                      : isRefunded
                        ? "text-[#D34A3A]"
                        : "text-[#006B3F]"
                  }`}
                />
              </div>
            </div>

            <h3
              className={`mt-6 text-4xl font-bold ${
                isPrimary ? "text-white" : "text-[#202420]"
              }`}
            >
              {stat.value}
            </h3>

            <span
              className={`mt-6 inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase ${
                isPrimary
                  ? "bg-white/15 text-white"
                  : isRefunded
                    ? "bg-[#FFD9D9] text-[#D34A3A]"
                    : "bg-[#DDFBE6] text-[#00864F]"
              }`}
            >
              {stat.badge}
            </span>
          </Card>
        );
      })}
    </section>
  );
};

export default CourseDetailsStats;
