interface Props {
  icon: string;
  backgroundColor: string;
}

export default function SituationIconPreview({ icon, backgroundColor }: Props) {
  return (
    <div
      className="flex h-[140px] w-[140px] flex-col items-center justify-center rounded-[32px] border border-dashed border-[#B7CCD6]"
      style={{ backgroundColor }}
    >
      <div className="text-4xl">{icon}</div>

      <p className="mt-3 text-sm font-medium text-[#0C7A43]">CHANGE ICON</p>
    </div>
  );
}
