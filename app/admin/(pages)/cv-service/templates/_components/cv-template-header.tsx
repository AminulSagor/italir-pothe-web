import { Plus } from "lucide-react";

import BackButton from "@/components/UI/buttons/back-button";
import Button from "@/components/UI/buttons/button";

interface CVTemplateHeaderProps {
  onCreate: () => void;
}

export default function CVTemplateHeader({
  onCreate,
}: CVTemplateHeaderProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <BackButton />

        <div>
          <h1 className="text-3xl font-bold text-[#006B3F]">
            CV Template Studio
          </h1>

          <p className="mt-1 max-w-[720px] text-sm leading-6 text-black/60">
            Build backend-rendered CV templates with HTML, CSS, dynamic Flutter
            fields, versioned drafts, and pixel-consistent PDF previews.
          </p>
        </div>
      </div>

      <Button
        rounded="full"
        size="lg"
        className="min-w-[210px] gap-2 shadow-lg"
        onClick={onCreate}
      >
        <Plus className="size-5" />
        Create Template
      </Button>
    </div>
  );
}
