import { Plus, Save } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";

interface ChapterTitleTrayProps {
  title: string;
  isEditing?: boolean;
  isSaving?: boolean;
  onTitleChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function ChapterTitleTray({
  title,
  isEditing = false,
  isSaving = false,
  onTitleChange,
  onCancel,
  onSave,
}: ChapterTitleTrayProps) {
  return (
    <Card
      padding="md"
      rounded="3xl"
      shadow="sm"
      className="border border-dashed border-[#CBD6CE]"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex-1">
          <label className="mb-2 block text-xs font-bold uppercase text-[#66736B]">
            Chapter Title
          </label>

          <input
            value={title}
            placeholder="e.g., Capitolo 1: Saluti"
            onChange={(event) => onTitleChange(event.target.value)}
            className="h-12 w-full rounded-full bg-[#EEF3EC] px-6 text-sm outline-none placeholder:text-black/40"
          />
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            disabled={isSaving}
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            size="lg"
            disabled={isSaving}
            className="gap-2"
            onClick={onSave}
          >
            {isEditing ? <Save className="size-5" /> : <></>}
            {isSaving ? "Saving..." : isEditing ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
