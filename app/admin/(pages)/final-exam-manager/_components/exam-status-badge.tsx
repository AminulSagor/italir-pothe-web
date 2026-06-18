import type { FinalExamStatus } from "@/types/final-exam/final-exam.type";

interface ExamStatusBadgeProps {
  status: FinalExamStatus;
}

const getStatusLabel = (status: FinalExamStatus) => {
  if (status === "published") return "LIVE";
  if (status === "archived") return "ARCHIVED";

  return "DRAFT";
};

const ExamStatusBadge = ({ status }: ExamStatusBadgeProps) => {
  const label = getStatusLabel(status);

  const badgeClassName =
    status === "published"
      ? "bg-[#DDF5DF] text-[#0B8A4D]"
      : "bg-[#E8ECE7] text-[#5F665F]";

  return (
    <div
      className={`inline-flex rounded-full px-4 py-1 text-xs font-semibold ${badgeClassName}`}
    >
      {label}
    </div>
  );
};

export default ExamStatusBadge;
