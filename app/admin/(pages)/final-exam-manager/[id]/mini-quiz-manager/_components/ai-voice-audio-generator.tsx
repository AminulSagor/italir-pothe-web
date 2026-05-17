import { Zap } from "lucide-react";

import Button from "@/components/UI/buttons/button";

const AiVoiceAudioGenerator = () => {
  return (
    <div className="rounded-3xl bg-[#F7FBF5] p-6">
      <div className="min-h-[120px] rounded-3xl bg-[#EEF3EC] p-5 text-sm text-[#9AA39C]">
        Enter the text you want the AI to speak in Italian...
      </div>

      <div className="mt-5 flex justify-end">
        <Button
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
