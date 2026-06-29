import type {
  EvaluationQueueSortBy,
  EvaluationQueueSortOrder,
  FinalExamAttemptStatus,
} from "@/types/evaluation-center/evaluation-center.type";

import EvaluationCenterClient from "./_components/evaluation-center-client";

interface EvaluationCenterPageProps {
  searchParams: Promise<{
    page?: string | string[];
    search?: string | string[];
    status?: string | string[];
    level?: string | string[];
    courseId?: string | string[];
    examTemplateId?: string | string[];
    sortBy?: string | string[];
    sortOrder?: string | string[];
  }>;
}

const getSingleValue = (value?: string | string[]) => {
  return Array.isArray(value) ? value[0] || "" : value || "";
};

const getPositiveInteger = (value?: string | string[]) => {
  const parsed = Number(getSingleValue(value));

  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
};

const queueStatuses: FinalExamAttemptStatus[] = [
  "under_review",
  "evaluated",
  "retake_requested",
  "certificate_issued",
];

const parseStatus = (
  value?: string | string[],
): FinalExamAttemptStatus | undefined => {
  const status = getSingleValue(value) as FinalExamAttemptStatus;

  return queueStatuses.includes(status) ? status : undefined;
};

const parseSortBy = (value?: string | string[]): EvaluationQueueSortBy => {
  const sortBy = getSingleValue(value);

  if (
    sortBy === "submissionDate" ||
    sortBy === "studentName" ||
    sortBy === "status"
  ) {
    return sortBy;
  }

  return "timeInQueue";
};

const parseSortOrder = (
  value?: string | string[],
): EvaluationQueueSortOrder => {
  return getSingleValue(value) === "ASC" ? "ASC" : "DESC";
};

export default async function EvaluationCenterPage({
  searchParams,
}: EvaluationCenterPageProps) {
  const params = await searchParams;

  return (
    <EvaluationCenterClient
      page={getPositiveInteger(params.page)}
      search={getSingleValue(params.search)}
      status={parseStatus(params.status)}
      level={getSingleValue(params.level)}
      courseId={getSingleValue(params.courseId)}
      examTemplateId={getSingleValue(params.examTemplateId)}
      sortBy={parseSortBy(params.sortBy)}
      sortOrder={parseSortOrder(params.sortOrder)}
    />
  );
}
