import { Eye } from "lucide-react";
import Card from "@/components/UI/cards/card";
import { createCourseStatusOptions } from "@/mock/create-course/create-course-status.mock";

const CourseStatusCard = () => {
  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#FFE6F3]">
          <Eye className="size-5 text-[#D34A8C]" />
        </div>

        <h2 className="text-lg font-bold text-[#202420]">Course Status</h2>
      </div>

      <div className="space-y-3">
        {createCourseStatusOptions.map((option) => {
          const Icon = option.icon;

          return (
            <button
              key={option.id}
              type="button"
              className={`flex w-full items-center gap-4 rounded-full px-5 py-3 text-left transition ${
                option.isActive
                  ? "border border-[#006B3F] bg-[#DDFBE6]"
                  : "bg-[#EEF3EC]"
              }`}
            >
              <Icon
                className={`size-5 ${
                  option.isActive ? "text-[#006B3F]" : "text-black/55"
                }`}
              />

              <span
                className={`text-sm font-semibold ${
                  option.isActive ? "text-[#006B3F]" : "text-[#202420]"
                }`}
              >
                {option.title}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default CourseStatusCard;
