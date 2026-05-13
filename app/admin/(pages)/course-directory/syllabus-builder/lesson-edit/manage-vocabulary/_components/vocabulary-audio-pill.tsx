import { Play } from "lucide-react";

interface VocabularyAudioPillProps {
  duration: string;
}

export default function VocabularyAudioPill({
  duration,
}: VocabularyAudioPillProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF3EC] px-3 py-2">
      <button
        type="button"
        className="flex size-7 items-center justify-center rounded-full bg-white text-[#007A4A]"
      >
        <Play className="ml-0.5 size-3 fill-[#007A4A]" />
      </button>

      <div className="flex items-center gap-1">
        <span className="h-3 w-1 rounded-full bg-[#B8C8BC]" />
        <span className="h-4 w-1 rounded-full bg-[#007A4A]" />
        <span className="h-5 w-1 rounded-full bg-[#007A4A]" />
        <span className="h-3 w-1 rounded-full bg-[#B8C8BC]" />
      </div>

      <span className="text-xs text-[#66736B]">{duration}</span>
    </div>
  );
}
