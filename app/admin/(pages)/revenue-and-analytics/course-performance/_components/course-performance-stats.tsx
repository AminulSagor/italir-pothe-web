import Card from "@/components/UI/cards/card";
import { coursePerformanceStats } from "@/mock/course-performance/course-performance-stats.mock";

const CoursePerformanceStats = () => {
  return (
    <section className="grid gap-5 md:grid-cols-3">
      {coursePerformanceStats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.id} padding="lg" rounded="3xl" className="min-h-40">
            <div className="flex items-start justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#E9FBEF]">
                <Icon className="size-5 text-[#006B3F]" />
              </div>

              <span className="rounded-full bg-[#E9FBEF] px-3 py-1 text-xs font-bold text-[#007A4D]">
                {stat.badge}
              </span>
            </div>

            <div className="mt-7">
              <p className="text-sm text-black/50">{stat.title}</p>
              <h3 className="mt-1 text-2xl font-bold text-[#202420]">
                {stat.value}
              </h3>
            </div>
          </Card>
        );
      })}
    </section>
  );
};

export default CoursePerformanceStats;
