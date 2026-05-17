import { ArrowRight, ClipboardCheck } from "lucide-react";
import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";

const FinalExaminationCard = () => {
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

      <Button size="lg" fullWidth className="gap-2">
        Link Final Exam
        <ArrowRight className="size-4" />
      </Button>
    </Card>
  );
};

export default FinalExaminationCard;
