import { PlusCircle } from "lucide-react";

import Button from "@/components/UI/buttons/button";

const FinalExamHeader = () => {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-[#006B3F]">
          Final Exam Manager
        </h1>
      </div>

      <Button className="gap-2 shadow-lg shadow-[#006B3F]/20" size="lg">
        <PlusCircle className="size-5" />
        Create New Exam
      </Button>
    </div>
  );
};

export default FinalExamHeader;
