import { GripVertical } from "lucide-react";

import { ConnectedModule } from "@/mock/skill-builder-manager/career-track-studio/career-track-studio.types";

interface ModuleItemProps {
  module: ConnectedModule;
}

export default function ModuleItem({ module }: ModuleItemProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[#FAFBF8] p-3 transition hover:bg-[#F4F7F4]">
      <div className="flex items-center gap-4">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#F5EDE4] text-sm font-bold text-[#9C4E2E]">
          {module.id}
        </div>

        <div>
          <h4 className="text-sm font-semibold text-[#202420]">
            {module.title}
          </h4>

          <p className="text-xs text-[#7B847D]">
            {module.moduleNumber} • {module.totalSentences} Sentences
          </p>
        </div>
      </div>

      <button
        type="button"
        className="text-[#7B847D] transition hover:text-[#202420]"
      >
        <GripVertical className="size-5" />
      </button>
    </div>
  );
}
