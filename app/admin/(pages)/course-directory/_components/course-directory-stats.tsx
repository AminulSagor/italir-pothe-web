import Card from "@/components/UI/cards/card";
import { courseDirectoryStats } from "@/mock/course-directory/course-directory-stats.mock";

const CourseDirectoryStats = () => {
  return (
    <section className="grid gap-5 md:grid-cols-3">
      {courseDirectoryStats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.id}
            padding="lg"
            rounded="3xl"
            shadow="sm"
            className="min-h-32"
          >
            <div className="flex items-center gap-5">
              <div
                className={`flex size-12 shrink-0 items-center justify-center rounded-full ${stat.iconBg}`}
              >
                <Icon className={`size-6 ${stat.iconColor}`} />
              </div>

              <div>
                <p className="text-sm uppercase text-black/55">{stat.title}</p>
                <h3 className="mt-1 text-3xl font-medium text-[#202420]">
                  {stat.value}
                </h3>
              </div>
            </div>
          </Card>
        );
      })}
    </section>
  );
};

export default CourseDirectoryStats;
