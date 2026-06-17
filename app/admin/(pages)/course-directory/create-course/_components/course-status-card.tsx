import { Archive, Eye, FileText, Radio } from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { CourseStatus } from "@/types/course-directory/course.type";

interface CourseStatusCardProps {
  status: CourseStatus;
  disabled?: boolean;
  onStatusChange: (status: CourseStatus) => void;
}

const statusOptions = [
  {
    id: "draft",
    title: "Draft",
    icon: FileText,
  },
  {
    id: "published",
    title: "Published",
    icon: Radio,
  },
  {
    id: "archived",
    title: "Archived",
    icon: Archive,
  },
] satisfies {
  id: CourseStatus;
  title: string;
  icon: typeof Eye;
}[];

const CourseStatusCard = ({
  status,
  disabled = false,
  onStatusChange,
}: CourseStatusCardProps) => {
  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#FFE6F3]">
          <Eye className="size-5 text-[#D34A8C]" />
        </div>

        <h2 className="text-lg font-bold text-[#202420]">Course Status</h2>
      </div>

      <div className="space-y-3">
        {statusOptions.map((option) => {
          const Icon = option.icon;
          const isActive = status === option.id;

          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              onClick={() => onStatusChange(option.id)}
              className={`flex w-full items-center gap-4 rounded-full px-5 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
                isActive
                  ? "border border-[#006B3F] bg-[#DDFBE6]"
                  : "bg-[#EEF3EC]"
              }`}
            >
              <Icon
                className={`size-5 ${
                  isActive ? "text-[#006B3F]" : "text-black/55"
                }`}
              />

              <span
                className={`text-sm font-semibold ${
                  isActive ? "text-[#006B3F]" : "text-[#202420]"
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
