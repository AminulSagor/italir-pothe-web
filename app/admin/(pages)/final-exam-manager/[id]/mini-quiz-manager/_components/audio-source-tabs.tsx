export type AudioSourceType = "manual_upload" | "ai_voice";

interface AudioSourceTabsProps {
  value: AudioSourceType;
  onChange: (value: AudioSourceType) => void;
}

const AudioSourceTabs = ({ value, onChange }: AudioSourceTabsProps) => {
  return (
    <div className="inline-flex rounded-full bg-[#EEF2EC] p-1">
      <button
        type="button"
        onClick={() => onChange("manual_upload")}
        className={`rounded-full px-5 py-2 text-xs font-medium transition ${
          value === "manual_upload"
            ? "bg-[#006B3F] text-white"
            : "text-[#4F5B55]"
        }`}
      >
        Manual Upload
      </button>

      <button
        type="button"
        onClick={() => onChange("ai_voice")}
        className={`rounded-full px-5 py-2 text-xs font-medium transition ${
          value === "ai_voice" ? "bg-[#006B3F] text-white" : "text-[#4F5B55]"
        }`}
      >
        AI Voice
      </button>
    </div>
  );
};

export default AudioSourceTabs;
