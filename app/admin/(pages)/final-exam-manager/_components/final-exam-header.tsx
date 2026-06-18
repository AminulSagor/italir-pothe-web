import { Loader2, PlusCircle } from "lucide-react";

import Button from "@/components/UI/buttons/button";

interface FinalExamHeaderProps {
  isCreating?: boolean;
  onCreateExam: () => void;
}

const FinalExamHeader = ({
  isCreating = false,
  onCreateExam,
}: FinalExamHeaderProps) => {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-[#006B3F]">
          Final Exam Manager
        </h1>
      </div>

      <Button
        type="button"
        className="gap-2 shadow-lg shadow-[#006B3F]/20"
        size="lg"
        disabled={isCreating}
        onClick={onCreateExam}
      >
        {isCreating ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <PlusCircle className="size-5" />
        )}

        {isCreating ? "Creating..." : "Create New Exam"}
      </Button>
    </div>
  );
};

export default FinalExamHeader;
