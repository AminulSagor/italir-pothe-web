import SituationIconPreview from "../icons/situation-icon-preview";

interface Props {
  selectedColor: string;
}

export default function VisualIdentityPanel({ selectedColor }: Props) {
  return (
    <div className="flex flex-col items-center justify-center border-b border-[#EEF2EE] bg-[#F6F8F4] px-5 py-8 md:border-b-0 md:border-r md:px-8 md:py-10">
      <SituationIconPreview icon="🚌" backgroundColor={selectedColor} />

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
