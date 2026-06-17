import {
  CircleAlert,
  CircleCheck,
  FileText,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  getSurvivalIconOption,
  getSurvivalPdfFileName,
  getSurvivalSubtitleBn,
  hasSurvivalPdf,
} from "../_utils/survival-italian-ui.util";
import type { SurvivalSituation } from "@/types/survival-italian/survival-italian.type";

interface Props {
  situation: SurvivalSituation;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
}

export default function SurvivalTableRow({
  situation,
  onEdit,
  onView,
  onDelete,
}: Props) {
  const iconOption = getSurvivalIconOption(situation.iconKey);
  const Icon = iconOption.Icon;
  const pdfAttached = hasSurvivalPdf(situation);

  return (
    <tr className="border-b border-[#EEF2EE] last:border-b-0">
      <td className="px-5 py-5">
        <div
          className="flex size-12 items-center justify-center rounded-2xl"
          style={{ backgroundColor: situation.cardColor }}
        >
          <Icon className="size-6 text-[#007A3D]" />
        </div>
      </td>

      <td className="px-5 py-5 text-sm font-medium text-[#202420]">
        {situation.title}
      </td>

      <td className="px-5 py-5 text-sm text-[#5F675F]">
        <span
          className={
            situation.subtitleBn?.trim() ? "text-[#5F675F]" : "text-[#8A938A]"
          }
        >
          {getSurvivalSubtitleBn(situation)}
        </span>
      </td>

      <td className="px-5 py-5">
        {pdfAttached ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EDF8EF] px-4 py-2 text-xs font-medium text-[#1C8B42]">
            <CircleCheck className="size-4" />
            <span>PDF Attached: {getSurvivalPdfFileName(situation)}</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FCEBEC] px-4 py-2 text-xs font-medium text-[#D92D20]">
            <CircleAlert className="size-4" />
            <span>Missing PDF Upload</span>
          </div>
        )}
      </td>

      <td className="px-5 py-5">
        <div className="flex items-center gap-5">
          <button
            type="button"
            className="text-[#202420] transition hover:opacity-70"
            onClick={onEdit}
            title="Edit situation"
          >
            <Pencil className="size-4" />
          </button>

          <button
            type="button"
            className="text-[#006B3F] transition hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={onView}
            disabled={!pdfAttached}
            title="View PDF"
          >
            <FileText className="size-4" />
          </button>

          <button
            type="button"
            className="text-[#D92D20] transition hover:opacity-70"
            onClick={onDelete}
            title="Delete situation"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
