import { FileText, Pencil, Trash2 } from "lucide-react";

import { SurvivalSituation } from "@/mock/survival-italian/survival-italian.types";

interface Props {
  situation: SurvivalSituation;
  onEdit: () => void;
  onDelete: () => void;
}

export default function SurvivalTableRow({
  situation,
  onEdit,
  onDelete,
}: Props) {
  return (
    <tr className="border-b border-[#EEF2EE]">
      <td className="px-5 py-5">
        <div
          className={`flex size-12 items-center justify-center rounded-2xl text-xl ${situation.iconBg}`}
        >
          {situation.icon}
        </div>
      </td>

      <td className="px-5 py-5 text-sm font-medium text-[#202420]">
        {situation.situationName}
      </td>

      <td className="px-5 py-5 text-sm text-[#5F675F]">
        {situation.bengaliSubtitle}
      </td>

      <td className="px-5 py-5">
        {situation.pdfStatus === "attached" ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EDF8EF] px-4 py-2 text-xs font-medium text-[#1C8B42]">
            <span>✓</span>
            PDF Attached: {situation.pdfName}
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FCEBEC] px-4 py-2 text-xs font-medium text-[#D92D20]">
            <span>!</span>
            Missing PDF Upload
          </div>
        )}
      </td>

      <td className="px-5 py-5">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="text-[#202420] transition hover:opacity-70"
            onClick={onEdit}
          >
            <Pencil className="size-4" />
          </button>

          <button
            type="button"
            className="text-[#006B3F] transition hover:opacity-70"
          >
            <FileText className="size-4" />
          </button>

          <button
            type="button"
            className="text-[#D92D20] transition hover:opacity-70"
            onClick={onDelete}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
