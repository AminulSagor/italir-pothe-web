import { Save, Trash2 } from "lucide-react";

import Button from "@/components/UI/buttons/button";

export default function QuizActionPanel() {
  return (
    <div className="space-y-5">
      <Button size="lg" className="w-full gap-2">
        <Save className="size-4" />
        Save Question Configuration
      </Button>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 text-sm font-semibold text-red-600"
      >
        <Trash2 className="size-4" />
        Discard Question
      </button>
    </div>
  );
}
