import Card from "@/components/UI/cards/card";

interface ModuleNameCardProps {
  moduleName: string;
  moduleSubtitleBn: string;
  disabled?: boolean;
  onModuleNameChange: (value: string) => void;
  onModuleSubtitleBnChange: (value: string) => void;
}

export default function ModuleNameCard({
  moduleName,
  moduleSubtitleBn,
  disabled = false,
  onModuleNameChange,
  onModuleSubtitleBnChange,
}: ModuleNameCardProps) {
  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-4">
          <label className="text-sm font-medium uppercase text-[#5F675F]">
            Module Name
          </label>

          <input
            type="text"
            value={moduleName}
            disabled={disabled}
            placeholder="e.g., Taking Orders"
            onChange={(event) => onModuleNameChange(event.target.value)}
            className="h-16 w-full rounded-full border border-transparent bg-[#EEF2ED] px-7 text-sm text-[#202420] outline-none placeholder:text-[#A3AAA3] focus:border-[#006B3F] disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium uppercase text-[#5F675F]">
            Bangla Translation
          </label>

          <input
            type="text"
            value={moduleSubtitleBn}
            disabled={disabled}
            placeholder="e.g., অর্ডার নেওয়া"
            onChange={(event) => onModuleSubtitleBnChange(event.target.value)}
            className="h-16 w-full rounded-full border border-transparent bg-[#EEF2ED] px-7 text-sm text-[#202420] outline-none placeholder:text-[#A3AAA3] focus:border-[#006B3F] disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>
    </Card>
  );
}
