// app/admin/(pages)/final-exam-manager/[id]/_components/publish-final-exam.tsx

import { Rocket } from "lucide-react";

import Button from "@/components/UI/buttons/button";

const PublishFinalExam = () => {
  return (
    <div className="flex justify-center pt-20">
      <div className="rounded-full bg-white/80 p-7 shadow-2xl shadow-[#006B3F]/20">
        <Button size="lg" className="gap-3 px-12 text-base shadow-lg">
          <Rocket className="size-6" />
          PUBLISH FINAL EXAM
        </Button>
      </div>
    </div>
  );
};

export default PublishFinalExam;
