import { FileText, Pencil, Trash2 } from "lucide-react";

import Card from "@/components/UI/cards/card";

import { SurvivalSituation } from "@/mock/survival-italian/survival-italian.types";

interface Props {
  situation: SurvivalSituation;
}

export default function SurvivalTableMobileCard({ situation }: Props) {
  return (
    <Card padding="md" rounded="3xl" shadow="sm" className="space-y-4">
      <div className="flex items-center gap-4">
        <div
          className={`flex size-12 items-center justify-center rounded-2xl text-xl ${situation.iconBg}`}
        >
          {situation.icon}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[#202420]">
            {situation.situationName}
          </h3>

          <p className="text-xs text-[#5F675F]">{situation.bengaliSubtitle}</p>
        </div>
      </div>

      <div>
        {situation.pdfStatus === "attached" ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EDF8EF] px-4 py-2 text-xs font-medium text-[#1C8B42]">
            ✓ PDF Attached
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FCEBEC] px-4 py-2 text-xs font-medium text-[#D92D20]">
            ! Missing PDF Upload
          </div>
        )}
      </div>

      <div className="flex items-center gap-5">
        <button type="button" className="text-[#202420]">
          <Pencil className="size-4" />
        </button>

        <button type="button" className="text-[#006B3F]">
          <FileText className="size-4" />
        </button>

        <button type="button" className="text-[#D92D20]">
          <Trash2 className="size-4" />
        </button>
      </div>
    </Card>
  );
}
