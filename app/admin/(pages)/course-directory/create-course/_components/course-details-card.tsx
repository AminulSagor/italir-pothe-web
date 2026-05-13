import { FileText } from "lucide-react";
import Card from "@/components/UI/cards/card";

const CourseDetailsCard = () => {
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
            placeholder="e.g. Master Italian for Professional Environments"
            className="h-12 w-full rounded-full bg-[#EEF3EC] px-6 text-sm outline-none placeholder:text-black/40"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold text-[#202420]">
            Course Subtitle
          </label>
          <input
            placeholder="Short description to grab attention"
            className="h-12 w-full rounded-full bg-[#EEF3EC] px-6 text-sm outline-none placeholder:text-black/40"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold text-[#202420]">
            Description
          </label>
          <textarea
            placeholder="Write a detailed course summary..."
            className="min-h-40 w-full resize-none rounded-3xl bg-[#EEF3EC] px-6 py-5 text-sm outline-none placeholder:text-black/40"
          />
        </div>
      </div>
    </Card>
  );
};

export default CourseDetailsCard;
