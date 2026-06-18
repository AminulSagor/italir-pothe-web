import { Pencil, Play, Trash2 } from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { SkillBuilderSentence } from "@/types/skill-builder/skill-builder.type";

interface Props {
  item: SkillBuilderSentence;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export default function SentenceBankItem({
  item,
  index,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Card padding="lg" rounded="3xl">
      <div className="grid items-center gap-6 lg:grid-cols-[56px_minmax(0,1fr)_minmax(0,1fr)_120px]">
        <div className="flex size-14 items-center justify-center rounded-full bg-[#EEF2ED] text-lg font-semibold text-[#006B3F]">
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="min-w-0">
          <p className="mb-2 text-xs uppercase text-[#98A198]">Italian</p>

          <p className="break-words text-base text-[#202420]">
            {item.italianSentence}
          </p>
        </div>

        <div className="min-w-0">
          <p className="mb-2 text-xs uppercase text-[#98A198]">Bengali</p>

          <p className="break-words text-base text-[#202420]">
            {item.bengaliTranslation?.trim() || "Needs translation"}
          </p>
        </div>

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-full bg-[#E9F7EC] text-[#006B3F]"
          >
            <Play className="ml-0.5 size-4 fill-current" />
          </button>

          <button type="button" onClick={onEdit}>
            <Pencil className="size-5 text-[#98A198]" />
          </button>

          <button type="button" onClick={onDelete}>
            <Trash2 className="size-5 text-[#98A198]" />
          </button>
        </div>
      </div>
    </Card>
  );
}
