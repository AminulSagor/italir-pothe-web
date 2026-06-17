import type { LucideIcon } from "lucide-react";

interface Props {
  Icon: LucideIcon;
  backgroundColor: string;
  onClick: () => void;
}

export default function SituationIconPreview({
  Icon,
  backgroundColor,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[140px] w-[140px] flex-col items-center justify-center rounded-[32px] border border-dashed border-[#B7CCD6] transition hover:scale-[1.02]"
      style={{ backgroundColor }}
    >
      <Icon className="size-10 text-[#007A3D]" />

      <p className="mt-3 text-sm font-medium text-[#0C7A43]">CHANGE ICON</p>
    </button>
  );
}
