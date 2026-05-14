interface Props {
  selectedColor: string;
}

export default function VisualIdentityPanel({ selectedColor }: Props) {
  return (
    <div className="flex flex-col items-center justify-center border-b border-[#EEF2EE] bg-[#F6F8F4] px-8 py-10 md:border-b-0 md:border-r">
      <div
        className="flex h-[140px] w-[140px] flex-col items-center justify-center rounded-[32px] border border-dashed border-[#B7CCD6]"
        style={{ backgroundColor: selectedColor }}
      >
        <div className="text-4xl">🚌</div>

        <p className="mt-3 text-sm font-medium text-[#0C7A43]">CHANGE ICON</p>
      </div>

      <div className="mt-10 max-w-[220px] text-center">
        <h3 className="text-base font-semibold text-[#0C7A43]">
          Visual Identity
        </h3>

        <p className="mt-2 text-sm leading-6 text-[#5F675F]">
          Configure how the situation appears to students in the mobile app.
        </p>
      </div>
    </div>
  );
}
