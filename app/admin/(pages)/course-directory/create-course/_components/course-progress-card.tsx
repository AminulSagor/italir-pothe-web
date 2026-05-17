import { CheckCircle, Circle, LayoutDashboard } from "lucide-react";
import Card from "@/components/UI/cards/card";
import { createCourseProgressSteps } from "@/mock/create-course/create-course-progress.mock";

const CourseProgressCard = () => {
  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#DFF3F4]">
          <LayoutDashboard className="size-5 text-[#006B3F]" />
        </div>

        <h2 className="text-lg font-bold text-[#202420]">Course Progress</h2>
      </div>

      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-bold text-[#202420]">Setup Status</p>
          <p className="text-xs font-bold text-[#006B3F]">75%</p>
        </div>

        <div className="h-2 rounded-full bg-[#E4E9E2]">
          <div className="h-full w-3/4 rounded-full bg-[#006B3F]" />
        </div>
      </div>

      <div className="space-y-3">
        {createCourseProgressSteps.map((step) => (
          <div key={step.id} className="flex items-center gap-3">
            {step.isCompleted ? (
              <CheckCircle className="size-5 text-[#006B3F]" />
            ) : (
              <Circle className="size-5 text-black/35" />
            )}

            <p className="text-sm font-medium text-[#202420]">{step.title}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CourseProgressCard;
