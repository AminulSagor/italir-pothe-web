import { Save, Trash2 } from "lucide-react";

import Button from "@/components/UI/buttons/button";

interface QuizActionPanelProps {
  isSaving?: boolean;
  isDeleting?: boolean;
  onSaveQuestion: () => void;
  onDiscardQuestion: () => void;
}

export default function QuizActionPanel({
  isSaving = false,
  isDeleting = false,
  onSaveQuestion,
  onDiscardQuestion,
}: QuizActionPanelProps) {
  return (
    <div className="space-y-5">
      <Button
        size="lg"
        disabled={isSaving || isDeleting}
        className="w-full gap-2"
        onClick={onSaveQuestion}
      >
        <Save className="size-4" />
        {isSaving ? "Saving..." : "Save Question Configuration"}
      </Button>

      <button
        type="button"
        disabled={isSaving || isDeleting}
        onClick={onDiscardQuestion}
        className="flex w-full items-center justify-center gap-2 text-sm font-semibold text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Trash2 className="size-4" />
        {isDeleting ? "Discarding..." : "Discard Question"}
      </button>
    </div>
  );
}
