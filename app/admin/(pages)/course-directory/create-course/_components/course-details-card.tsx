import { FileText } from "lucide-react";

import Card from "@/components/UI/cards/card";

interface CourseDetailsCardProps {
  title: string;
  subtitle: string;
  description: string;
  disabled?: boolean;
  onTitleChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const CourseDetailsCard = ({
  title,
  subtitle,
  description,
  disabled = false,
  onTitleChange,
  onSubtitleChange,
  onDescriptionChange,
}: CourseDetailsCardProps) => {
  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="mb-8 flex items-start gap-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-[#DFF3F4]">
          <FileText className="size-6 text-[#006B3F]" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#202420]">Course Details</h2>
          <p className="text-sm text-black/55">
            Core information about your learning module
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-xs font-bold text-[#202420]">
            Course Title
          </label>

          <input
            value={title}
            disabled={disabled}
            placeholder="e.g. Master Italian for Professional Environments"
            onChange={(event) => onTitleChange(event.target.value)}
            className="h-12 w-full rounded-full bg-[#EEF3EC] px-6 text-sm outline-none placeholder:text-black/40 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold text-[#202420]">
            Course Subtitle
          </label>

          <input
            value={subtitle}
            disabled={disabled}
            placeholder="Short description to grab attention"
            onChange={(event) => onSubtitleChange(event.target.value)}
            className="h-12 w-full rounded-full bg-[#EEF3EC] px-6 text-sm outline-none placeholder:text-black/40 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold text-[#202420]">
            Description
          </label>

          <textarea
            value={description}
            disabled={disabled}
            placeholder="Write a detailed course summary..."
            onChange={(event) => onDescriptionChange(event.target.value)}
            className="min-h-40 w-full resize-none rounded-3xl bg-[#EEF3EC] px-6 py-5 text-sm outline-none placeholder:text-black/40 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>
    </Card>
  );
};

export default CourseDetailsCard;
