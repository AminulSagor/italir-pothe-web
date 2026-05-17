import Card from "@/components/UI/cards/card";

export default function ModuleNameCard() {
  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="space-y-4">
        <label className="text-sm font-medium uppercase text-[#5F675F]">
          Module Name
        </label>

        <input
          type="text"
          placeholder="e.g., AI Survival: Restaurant & Dining"
          className="h-16 w-full rounded-full border border-transparent bg-[#EEF2ED] px-7 text-sm text-[#202420] outline-none placeholder:text-[#A3AAA3] focus:border-[#006B3F]"
        />
      </div>
    </Card>
  );
}
