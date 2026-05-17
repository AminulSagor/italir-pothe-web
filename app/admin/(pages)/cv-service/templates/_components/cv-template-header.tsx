import { Plus } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import BackButton from "@/components/UI/buttons/back-button";

export default function CVTemplateHeader() {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <BackButton />

        <div>
          <h1 className="text-3xl font-bold text-[#006B3F]">
            CV Template Manager
          </h1>
          <p className="mt-1 text-sm text-black/60">
            Optimize and curate your high-fidelity template ecosystem with
            precision.
          </p>
        </div>
      </div>

      <Button rounded="full" size="lg" className="min-w-[220px] shadow-lg">
        <Plus className="size-5" />
        Upload New Template
      </Button>
    </div>
  );
}
