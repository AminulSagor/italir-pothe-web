"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ClipboardCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";
import { getFinalExams } from "@/service/final-exam/final-exam.service";
import type { FinalExamListItem } from "@/types/final-exam/final-exam.type";
import { isValidUuid } from "@/utils/uuid";

interface FinalExaminationCardProps {
  courseId: string;
  courseTitle: string;
  disabled?: boolean;
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

const FinalExaminationCard = ({
  courseId,
  disabled = false,
}: FinalExaminationCardProps) => {
  const router = useRouter();

  const [linkedExam, setLinkedExam] = useState<FinalExamListItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const hasValidCourseId = isValidUuid(courseId);

  const buttonLabel = useMemo(() => {
    if (!hasValidCourseId) return "Save Course First";
    if (isLoading) return "Checking Final Exam...";
    return "Link Final Exam";
  }, [hasValidCourseId, isLoading]);

  useEffect(() => {
    if (!hasValidCourseId) {
      setLinkedExam(null);
      return;
    }

    let isMounted = true;

    const loadLinkedExam = async () => {
      try {
        setIsLoading(true);

        const response = await getFinalExams({
          page: 1,
          limit: 1,
          courseId,
          linkedOnly: true,
        });

        if (!isMounted) return;

        setLinkedExam(response.items[0] || null);
      } catch (error) {
        if (isMounted) {
          toast.error(getErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadLinkedExam();

    return () => {
      isMounted = false;
    };
  }, [courseId, hasValidCourseId]);

  const handleFinalExamClick = () => {
    if (!hasValidCourseId) {
      toast.error("Save the course before linking a final exam.");
      return;
    }

    router.push("/admin/final-exam-manager");
  };

  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#FFEBDD]">
          <ClipboardCheck className="size-5 text-[#C46A00]" />
        </div>

        <h2 className="text-lg font-bold text-[#202420]">Final Examination</h2>
      </div>

      <p className="mb-6 text-sm leading-6 text-black/65">
        Configure graduation requirements, including Quiz, Listening, Writing,
        and Speaking modules.
      </p>

      {linkedExam && (
        <div className="mb-5 rounded-2xl bg-[#F4F7F2] p-4">
          <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-[#98A29E]">
            Linked Exam
          </p>

          <h4 className="text-sm font-semibold text-[#006B3F]">
            {linkedExam.title}
          </h4>

          <p className="mt-1 text-xs text-[#66736B]">
            {linkedExam.totalQuestions} Questions ·{" "}
            {linkedExam.totalDurationMinutes} min ·{" "}
            {linkedExam.overallPassingPercent}% passing
          </p>
        </div>
      )}

      <Button
        size="lg"
        fullWidth
        disabled={disabled || isLoading || !hasValidCourseId}
        onClick={handleFinalExamClick}
        className="gap-2"
      >
        {isLoading && <Loader2 className="size-4 animate-spin" />}

        {buttonLabel}

        {!isLoading && <ArrowRight className="size-4" />}
      </Button>
    </Card>
  );
};

export default FinalExaminationCard;
