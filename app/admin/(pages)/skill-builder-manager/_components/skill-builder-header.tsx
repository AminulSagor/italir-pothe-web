import { PlusCircle } from "lucide-react";

import Button from "@/components/UI/buttons/button";

export default function SkillBuilderHeader() {
  return (
    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
      <div>
        <h1 className="text-2xl font-bold text-[#006B3F] md:text-3xl">
          Career Tracks Hub
        </h1>

        <p className="mt-2 text-sm text-[#5F675F] md:text-base">
          Manage and organize specialized language paths for professional
          integration.
        </p>
      </div>

      <Button size="lg" className="gap-2 px-7 shadow-md">
        <PlusCircle className="size-5" />
        Create New Career Track
      </Button>
    </div>
  );
}
