import { Save } from "lucide-react";

import Button from "@/components/UI/buttons/button";

interface LessonActionPanelProps {
  isSaving?: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

export default function LessonActionPanel({
  isSaving = false,
  onSave,
  onDiscard,
}: LessonActionPanelProps) {
  return (
    <div className="space-y-5">
      <Button
        type="button"
        size="lg"
        disabled={isSaving}
        className="w-full gap-2"
        onClick={onSave}
      >
        <Save className="size-4" />
        {isSaving ? "Saving..." : "Save Lesson Content"}
      </Button>

      <button
        type="button"
        disabled={isSaving}
        onClick={onDiscard}
        className="w-full text-sm font-semibold text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Discard Changes
      </button>
    </div>
  );
}
