import { Link2 } from "lucide-react";

interface Props {
  courseName: string;
}

const LinkedCourseChip = ({ courseName }: Props) => {
  return (
    <div className="rounded-2xl bg-[#F4F7F2] p-4">
      <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-[#98A29E]">
        Linked To
      </p>

      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-[#006B3F]">
          {courseName}
        </h4>

        <Link2 className="size-4 text-[#6F7673]" />
      </div>
    </div>
  );
};

export default LinkedCourseChip;