import { FileText, Trash2 } from "lucide-react";

import Button from "@/components/UI/buttons/button";

interface Props {
  fileName: string;
  fileSize: string;
  onReplace: () => void;
  onDelete: () => void;
}

export default function UploadedPdfCard({
  fileName,
  fileSize,
  onReplace,
  onDelete,
}: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-[#E5ECE6] bg-[#F8FBF7] p-5 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-[#FDECEC] text-[#D92D20]">
          <FileText className="size-5" />
        </div>

        <div>
          <h4 className="text-sm font-medium text-[#202420]">{fileName}</h4>

          <p className="mt-1 text-xs text-[#66736B]">{fileSize}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" rounded="full" onClick={onReplace}>
          ⛓ REPLACE
        </Button>

        <button type="button" onClick={onDelete} className="text-[#D92D20]">
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}
