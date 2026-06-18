import { Zap } from "lucide-react";

import Button from "@/components/UI/buttons/button";

interface AiVoiceAudioGeneratorProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate?: () => void;
}

const AiVoiceAudioGenerator = ({
  value,
  onChange,
  onGenerate,
}: AiVoiceAudioGeneratorProps) => {
  return (
    <div className="rounded-3xl bg-[#F7FBF5] p-6">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Enter the text you want the AI to speak in Italian..."
        className="min-h-[120px] w-full resize-none rounded-3xl bg-[#EEF3EC] p-5 text-sm text-[#202420] outline-none placeholder:text-[#9AA39C]"
      />

      <div className="mt-5 flex justify-end">
        <Button
          type="button"
          disabled={!value.trim()}
          onClick={onGenerate}
          className="gap-2 bg-[#86F266] text-[#006B3F] hover:bg-[#76E457]"
          rounded="full"
        >
          <Zap className="size-4" />
          Generate AI Audio
        </Button>
      </div>
    </div>
  );
};

export default AiVoiceAudioGenerator;
