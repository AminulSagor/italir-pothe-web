import BackButton from "@/components/UI/buttons/back-button";

export default function BreadcrumbHeader() {
  return (
    <div className="flex items-center gap-3 text-sm">
      <BackButton />
      <span className="text-[#66736A]">Examinee Queue</span>
      <span className="text-[#A1AAA3]">›</span>
      <span className="font-semibold text-[#006B3F]">Evaluate Student</span>
    </div>
  );
}
