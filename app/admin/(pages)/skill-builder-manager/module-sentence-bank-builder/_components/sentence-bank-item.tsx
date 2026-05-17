import { Pencil, Trash2, Play } from "lucide-react";

import Card from "@/components/UI/cards/card";
import { SentenceBankItem as SentenceItemType } from "@/mock/skill-builder-manager/module-sentence-bank-builder/module-sentence-bank-builder.types";

interface Props {
  item: SentenceItemType;
}

export default function SentenceBankItem({ item }: Props) {
  return (
    <Card
      padding="lg"
      rounded="3xl"
      className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="flex gap-5">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#EEF2ED] text-lg font-semibold text-[#006B3F]">
          {String(item.id).padStart(2, "0")}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs uppercase text-[#98A198]">Italian</p>

            <p className="text-base text-[#202420]">{item.italian}</p>
          </div>

          <div>
            <p className="mb-2 text-xs uppercase text-[#98A198]">Bengali</p>

            <p className="text-base text-[#202420]">{item.bengali}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex size-11 items-center justify-center rounded-full bg-[#E9F7EC] text-[#006B3F]">
          <Play className="ml-0.5 size-4 fill-current" />
        </button>

        <button>
          <Pencil className="size-5 text-[#98A198]" />
        </button>

        <button>
          <Trash2 className="size-5 text-[#98A198]" />
        </button>
      </div>
    </Card>
  );
}
