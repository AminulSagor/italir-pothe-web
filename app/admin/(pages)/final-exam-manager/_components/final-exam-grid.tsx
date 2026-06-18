import type { FinalExamListItem } from "@/types/final-exam/final-exam.type";

import CreateFinalExamCard from "./create-final-exam-card";
import FinalExamCard from "./final-exam-card";

interface FinalExamGridProps {
  exams: FinalExamListItem[];
  isLoading: boolean;
  isCreating: boolean;
  isDeletingId: string | null;
  isLinkingId: string | null;
  onCreateExam: () => void;
  onDeleteExam: (examId: string) => void;
  onLinkCourse: (examId: string) => void;
  onDelinkCourse: (examId: string) => void;
}

const FinalExamGrid = ({
  exams,
  isLoading,
  isCreating,
  isDeletingId,
  isLinkingId,
  onCreateExam,
  onDeleteExam,
  onLinkCourse,
  onDelinkCourse,
}: FinalExamGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="min-h-[320px] animate-pulse rounded-3xl bg-white shadow-sm"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {exams.map((exam, index) => (
        <FinalExamCard
          key={exam.id}
          exam={exam}
          index={index}
          isDeleting={isDeletingId === exam.id}
          isLinking={isLinkingId === exam.id}
          onDelete={onDeleteExam}
          onLinkCourse={onLinkCourse}
          onDelinkCourse={onDelinkCourse}
        />
      ))}

      <CreateFinalExamCard isCreating={isCreating} onClick={onCreateExam} />
    </div>
  );
};

export default FinalExamGrid;
