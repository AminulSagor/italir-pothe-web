import { Plus } from "lucide-react";

import BackButton from "@/components/UI/buttons/back-button";
import Button from "@/components/UI/buttons/button";

interface CVTemplateHeaderProps {
  onUpload: () => void;
}

export default function CVTemplateHeader({
  onUpload,
}: CVTemplateHeaderProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <BackButton />

        <div>
          <h1 className="text-3xl font-bold text-[#006B3F]">
            CV Template Manager
          </h1>

          <p className="mt-1 max-w-[620px] text-sm leading-6 text-black/60">
            Upload CV template images and manage the templates available
            in the application.
          </p>
        </div>
      </div>

      <Button
        rounded="full"
        size="lg"
        className="min-w-[220px] gap-2 shadow-lg"
        onClick={onUpload}
      >
        <Plus className="size-5" />
        Upload CV Template
      </Button>
    </div>
  );
}