import { Rocket } from "lucide-react";

import Button from "@/components/UI/buttons/button";

interface PublishFinalExamProps {
  isPublishing?: boolean;
  onPublish: () => void;
}

const PublishFinalExam = ({
  isPublishing = false,
  onPublish,
}: PublishFinalExamProps) => {
  return (
    <div className="flex justify-center pt-20">
      <div className="rounded-full bg-white/80 p-7 shadow-2xl shadow-[#006B3F]/20">
        <Button
          size="lg"
          disabled={isPublishing}
          onClick={onPublish}
          className="gap-3 px-12 text-base shadow-lg"
        >
          <Rocket className="size-6" />
          {isPublishing ? "PUBLISHING..." : "PUBLISH FINAL EXAM"}
        </Button>
      </div>
    </div>
  );
};

export default PublishFinalExam;
