import { CheckCircle, Circle, LayoutDashboard } from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { Course } from "@/types/course-directory/course.type";

interface CourseProgressCardProps {
  course: Course | null;
}

const defaultSteps = {
  courseDetails: false,
  pricingAccess: false,
  finalExamination: false,
  syllabusBuilder: false,
};

const CourseProgressCard = ({ course }: CourseProgressCardProps) => {
  const progress = course?.setupProgress;
  const percentage = progress?.percentage || 0;
  const steps = progress?.steps || defaultSteps;

  const progressSteps = [
    {
      id: "courseDetails",
      title: "Course Details",
      isCompleted: steps.courseDetails,
    },
    {
      id: "pricingAccess",
      title: "Pricing Access",
      isCompleted: steps.pricingAccess,
    },
    {
      id: "finalExamination",
      title: "Final Examination",
      isCompleted: steps.finalExamination,
    },
    {
      id: "syllabusBuilder",
      title: "Syllabus Builder",
      isCompleted: steps.syllabusBuilder,
    },
  ];

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
          <p className="text-xs font-bold text-[#006B3F]">{percentage}%</p>
        </div>

        <div className="h-2 rounded-full bg-[#E4E9E2]">
          <div
            className="h-full rounded-full bg-[#006B3F]"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {progressSteps.map((step) => (
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
