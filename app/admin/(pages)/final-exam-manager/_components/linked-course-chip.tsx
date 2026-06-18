import { Link2, Unlink } from "lucide-react";

interface LinkedCourseChipProps {
  courseName: string;
  isLinked: boolean;
  isLoading?: boolean;
  onLinkCourse: () => void;
  onDelinkCourse: () => void;
}

const LinkedCourseChip = ({
  courseName,
  isLinked,
  isLoading = false,
  onLinkCourse,
  onDelinkCourse,
}: LinkedCourseChipProps) => {
  return (
    <div className="rounded-2xl bg-[#F4F7F2] p-4">
      <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-[#98A29E]">
        {isLinked ? "Linked To" : "Not Linked"}
      </p>

      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-[#006B3F]">
          {courseName || "Independent"}
        </h4>

        <button
          type="button"
          disabled={isLoading}
          onClick={isLinked ? onDelinkCourse : onLinkCourse}
          className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase text-[#006B3F] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLinked ? (
            <>
              <Unlink className="size-3" />
              Delink
            </>
          ) : (
            <>
              <Link2 className="size-3" />
              Link
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LinkedCourseChip;
