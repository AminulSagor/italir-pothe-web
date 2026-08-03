"use client";

import {
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Pencil,
  Plus,
} from "lucide-react";
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

const MODULES_PER_PAGE = 10;

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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  /*
   * When the user opens another career track,
   * start that track from page one.
   */
  useEffect(() => {
    setPage(1);
  }, [careerTrackId]);

  useEffect(() => {
    if (!careerTrackId) {
      setModules([]);
      setTotalItems(0);
      setTotalPages(1);
      return;
    }

    let isMounted = true;

    const loadModules = async () => {
      try {
        setIsLoading(true);

        const response = await getCareerTrackModules(careerTrackId, {
          page,
          limit: MODULES_PER_PAGE,
        });

        if (!isMounted) {
          return;
        }

        const availablePages = Math.max(response.totalPages, 1);

        /*
         * This can happen when the last module on the final page
         * is deleted. Move back to the last available page.
         */
        if (page > availablePages) {
          setPage(availablePages);
          return;
        }

        setModules(response.items);
        setTotalItems(response.totalItems);
        setTotalPages(availablePages);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadModules();

    return () => {
      isMounted = false;
    };
  }, [careerTrackId, page, refreshKey]);

  const startItem = totalItems === 0 ? 0 : (page - 1) * MODULES_PER_PAGE + 1;

  const endItem = Math.min(page * MODULES_PER_PAGE, totalItems);

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  const handlePreviousPage = () => {
    if (!canGoPrevious || isLoading) {
      return;
    }

    setPage((currentPage) => currentPage - 1);
  };

  const handleNextPage = () => {
    if (!canGoNext || isLoading) {
      return;
    }

    setPage((currentPage) => currentPage + 1);
  };

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
          modules.map((module, index) => {
            const moduleNumber = (page - 1) * MODULES_PER_PAGE + index + 1;

            return (
              <div
                key={module.id}
                className="flex items-center gap-4 rounded-2xl bg-[#F8F6F1] px-4 py-3"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F6E8D4] text-sm font-semibold text-[#7A4B18]">
                  {moduleNumber}
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
                  aria-label={`Edit ${module.name}`}
                >
                  <Pencil className="size-4" />
                </button>

                <GripVertical className="size-5 shrink-0 text-[#889188]" />
              </div>
            );
          })
        ) : (
          <p className="rounded-2xl bg-[#F6F8F4] px-4 py-4 text-sm text-[#5F675F]">
            No modules connected yet.
          </p>
        )}
      </div>

      {totalItems > 0 ? (
        <div className="mt-5 border-t border-[#E7ECE7] pt-4">
          <p className="text-center text-xs text-[#66736B]">
            Showing{" "}
            <span className="font-semibold text-[#006B3F]">
              {startItem}-{endItem}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#006B3F]">{totalItems}</span>{" "}
            modules
          </p>

          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={!canGoPrevious || isLoading}
              onClick={handlePreviousPage}
              className="flex size-10 items-center justify-center rounded-full border border-[#DCE5DA] text-[#202420] transition hover:bg-[#F4F7F4] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous modules page"
            >
              <ChevronLeft className="size-5" />
            </button>

            <span className="text-sm font-medium text-[#66736B]">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={!canGoNext || isLoading}
              onClick={handleNextPage}
              className="flex size-10 items-center justify-center rounded-full border border-[#DCE5DA] text-[#202420] transition hover:bg-[#F4F7F4] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next modules page"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      ) : null}

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
