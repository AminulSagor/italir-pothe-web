"use client";

import { GripVertical, Pencil, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import Button from "@/components/UI/buttons/button";
import { getCareerTrackModules } from "@/service/skill-builder/skill-builder.service";
import type { SkillBuilderCareerTrackModule } from "@/types/skill-builder/skill-builder.type";

interface ConnectedModulesPanelProps {
  careerTrackId?: string;
  refreshKey?: number;
  onAttachModule: () => void;
  onEditModule: (module: SkillBuilderCareerTrackModule) => void;
}

const getSentenceCount = (module: SkillBuilderCareerTrackModule) => {
  return module.sentenceCount || module.totalSentences || 0;
};

export default function ConnectedModulesPanel({
  careerTrackId,
  refreshKey = 0,
  onAttachModule,
  onEditModule,
}: ConnectedModulesPanelProps) {
  const [modules, setModules] = useState<SkillBuilderCareerTrackModule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!careerTrackId) {
      setModules([]);
      return;
    }

    let isMounted = true;

    const loadModules = async () => {
      try {
        setIsLoading(true);

        const response = await getCareerTrackModules(careerTrackId, {
          page: 1,
          limit: 10,
        });

        if (isMounted) {
          setModules(response.items);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadModules();

    return () => {
      isMounted = false;
    };
  }, [careerTrackId, refreshKey]);

  return (
    <aside className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-[#202420]">
        Connected Modules
      </h2>

      <div className="mt-6 space-y-3">
        {isLoading ? (
          <p className="rounded-2xl bg-[#F6F8F4] px-4 py-4 text-sm text-[#5F675F]">
            Loading modules...
          </p>
        ) : modules.length > 0 ? (
          modules.map((module, index) => (
            <div
              key={module.id}
              className="flex items-center gap-4 rounded-2xl bg-[#F8F6F1] px-4 py-3"
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-[#F6E8D4] text-sm font-semibold text-[#7A4B18]">
                {index + 1}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-[#202420]">
                  {module.name}
                </h3>

                <p className="mt-1 text-xs text-[#66736B]">
                  Module {String(module.sortOrder).padStart(2, "0")} •{" "}
                  {getSentenceCount(module)} Sentences
                </p>
              </div>

              <button
                type="button"
                onClick={() => onEditModule(module)}
                className="text-[#006B3F]"
                title="Edit module"
              >
                <Pencil className="size-4" />
              </button>

              <GripVertical className="size-5 text-[#889188]" />
            </div>
          ))
        ) : (
          <p className="rounded-2xl bg-[#F6F8F4] px-4 py-4 text-sm text-[#5F675F]">
            No modules connected yet.
          </p>
        )}
      </div>

      <Button
        fullWidth
        variant="outline"
        size="lg"
        disabled={!careerTrackId}
        className="mt-6 gap-2 border-dashed"
        onClick={onAttachModule}
      >
        <Plus className="size-5" />
        ATTACH NEW MODULE
      </Button>

      {!careerTrackId ? (
        <p className="mt-3 text-xs text-[#8A938A]">
          Save the career track first to attach modules.
        </p>
      ) : null}
    </aside>
  );
}
