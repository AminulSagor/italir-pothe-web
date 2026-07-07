import Button from "@/components/UI/buttons/button";
import type { EvaluationQueueItem } from "@/types/evaluation-center/evaluation-center.type";

interface EvaluationTableRowProps {
  item: EvaluationQueueItem;
  targetWaitHours: number;

  onOpen: (item: EvaluationQueueItem) => void;
}

const statusDotClasses: Record<EvaluationQueueItem["status"], string> = {
  in_progress: "bg-[#C8D0C9]",
  submitted: "bg-[#C8D0C9]",
  under_review: "bg-[#C8D0C9]",
  evaluated: "bg-[#008A2E]",
  certificate_issued: "bg-[#008A2E]",
  retake_requested: "bg-[#FF7A00]",
  cancelled: "bg-[#D92D20]",
};

const formatSubmissionDate = (value: string | null) => {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

const canOpenAttempt = (item: EvaluationQueueItem) => {
  if (item.action.enabled) return true;

  return (
    item.action.type === "view_result" ||
    item.action.type === "review_sent" ||
    item.status === "evaluated" ||
    item.status === "certificate_issued" ||
    item.status === "retake_requested"
  );
};

const getActionLabel = (item: EvaluationQueueItem) => {
  if (item.status === "certificate_issued") {
    return "View Certificate";
  }

  if (item.status === "evaluated") {
    return "View Result";
  }

  if (item.status === "retake_requested") {
    return "View Feedback";
  }

  if (item.action.type === "review_sent") {
    return "View Result";
  }

  return item.action.label;
};

export default function EvaluationTableRow({
  item,
  targetWaitHours,
  onOpen,
}: EvaluationTableRowProps) {
  const exceededTarget =
    item.timeInQueueSeconds > Math.max(0, targetWaitHours) * 3600;

  const canOpen = canOpenAttempt(item);

  return (
    <tr className="border-b border-[#EEF2EE] last:border-b-0">
      <td className="px-4 py-6">
        <div className="flex items-center gap-4">
          {item.student.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.student.avatarUrl}
              alt={item.student.fullName}
              className="size-12 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#E7F5EF] text-sm font-bold text-[#006B3F]">
              {item.student.initials}
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#202420]">
              {item.student.fullName}
            </p>

            <p className="truncate text-xs text-[#5F675F]">
              {item.student.email || item.referenceCode}
            </p>

            <p className="mt-1 truncate text-[11px] text-[#8A948D]">
              {item.course.title} • {item.exam.title}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-6">
        <span className="rounded-full bg-[#DDE5DD] px-3 py-1 text-xs font-medium text-[#4F5B52]">
          {item.level || "—"}
        </span>
      </td>

      <td className="px-4 py-6 text-sm text-[#4F5B52]">
        {formatSubmissionDate(item.submissionDate)}
      </td>

      <td
        className={`px-4 py-6 text-sm font-medium ${
          exceededTarget ? "text-[#D92D20]" : "text-[#202420]"
        }`}
      >
        {item.timeInQueueLabel}
      </td>

      <td className="px-4 py-6">
        <div className="flex items-center gap-2">
          <span
            className={`size-2 rounded-full ${statusDotClasses[item.status]}`}
          />

          <span className="text-xs font-medium text-[#202420]">
            {item.statusLabel}
          </span>
        </div>
      </td>

      <td className="px-4 py-6">
        <Button
          size="sm"
          disabled={!canOpen}
          onClick={() => onOpen(item)}
          className={
            !canOpen
              ? "bg-[#EEF0ED] text-[#9BA49D] hover:bg-[#EEF0ED]"
              : item.status === "certificate_issued"
                ? "bg-[#DDF3E8] !text-[#006B3F] hover:bg-[#CBEBD8]"
                : ""
          }
        >
          {getActionLabel(item)}
        </Button>
      </td>
    </tr>
  );
}
