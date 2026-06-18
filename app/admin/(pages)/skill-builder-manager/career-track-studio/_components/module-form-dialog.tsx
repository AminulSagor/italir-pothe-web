"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";
import type {
  SkillBuilderCareerTrackModule,
  UpdateCareerTrackModulePayload,
} from "@/types/skill-builder/skill-builder.type";

interface ModuleFormDialogProps {
  open: boolean;
  module: SkillBuilderCareerTrackModule | null;
  nextSortOrder: number;
  isSaving?: boolean;
  onClose: () => void;
  onSave: (payload: UpdateCareerTrackModulePayload) => Promise<void>;
}

export default function ModuleFormDialog({
  open,
  module,
  nextSortOrder,
  isSaving = false,
  onClose,
  onSave,
}: ModuleFormDialogProps) {
  const [name, setName] = useState("");
  const [subtitleBn, setSubtitleBn] = useState("");
  const [sortOrder, setSortOrder] = useState(nextSortOrder);

  useEffect(() => {
    if (!open) return;

    setName(module?.name || "");
    setSubtitleBn(module?.subtitleBn || "");
    setSortOrder(module?.sortOrder || nextSortOrder);
  }, [open, module, nextSortOrder]);

  const handleSave = () => {
    const trimmedName = name.trim();
    const trimmedSubtitleBn = subtitleBn.trim();

    if (!trimmedName) return;

    onSave({
      name: trimmedName,
      ...(trimmedSubtitleBn ? { subtitleBn: trimmedSubtitleBn } : {}),
      sortOrder,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} size="md" className="p-0">
      <div className="relative p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 flex size-10 items-center justify-center rounded-full bg-[#EEF2EE]"
        >
          <X className="size-5 text-[#4D574F]" />
        </button>

        <div>
          <h2 className="text-2xl font-bold text-[#202420]">
            {module ? "Update Module" : "Attach New Module"}
          </h2>

          <p className="mt-2 text-sm text-[#66736B]">
            Add the module title and Bangla translation for this career track.
          </p>
        </div>

        <div className="mt-7 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#66736B]">
              MODULE NAME
            </label>

            <input
              value={name}
              disabled={isSaving}
              onChange={(event) => setName(event.target.value)}
              placeholder="Taking Orders"
              className="h-14 w-full rounded-full bg-[#F3F5F1] px-6 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#66736B]">
              BANGLA TRANSLATION
            </label>

            <input
              value={subtitleBn}
              disabled={isSaving}
              onChange={(event) => setSubtitleBn(event.target.value)}
              placeholder="অর্ডার নেওয়া"
              className="h-14 w-full rounded-full bg-[#F3F5F1] px-6 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#66736B]">
              SORT ORDER
            </label>

            <input
              type="number"
              min={1}
              value={sortOrder}
              disabled={isSaving}
              onChange={(event) =>
                setSortOrder(Number(event.target.value) || 1)
              }
              className="h-14 w-full rounded-full bg-[#F3F5F1] px-6 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Button
            fullWidth
            variant="outline"
            size="lg"
            disabled={isSaving}
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            fullWidth
            size="lg"
            disabled={isSaving || !name.trim()}
            onClick={handleSave}
          >
            {isSaving
              ? "Saving..."
              : module
                ? "Update Module"
                : "Attach Module"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
