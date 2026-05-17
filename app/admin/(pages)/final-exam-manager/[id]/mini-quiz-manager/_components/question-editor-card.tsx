import { Circle, FileAudio, Play, Settings2, Trash2 } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";

import AudioSourceTabs from "./audio-source-tabs";
import AiVoiceAudioGenerator from "./ai-voice-audio-generator";
import ManualAudioUpload from "./manual-audio-upload";

import {
  AudioSourceType,
  ListeningMiniQuizData,
} from "@/mock/final-exam-manager/listening-mini-quiz.types";

interface Props {
  data: ListeningMiniQuizData;
  audioSource: AudioSourceType;
  onAudioSourceChange: (value: AudioSourceType) => void;
}

const QuestionEditorCard = ({
  data,
  audioSource,
  onAudioSourceChange,
}: Props) => {
  return (
    <Card rounded="3xl" padding="lg" shadow="sm">
      <div className="mb-8 flex items-start justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-[#006B3F]">
            <Settings2 className="size-5 text-white" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#202420]">
              Question Editor
            </h2>

            <p className="mt-1 text-sm text-[#6F7673]">
              Configure question details and answer validation
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <FileAudio className="size-4 text-[#006B3F]" />

            <p className="text-xs font-semibold uppercase text-[#4F5B55]">
              Audio Source
            </p>
          </div>

          <AudioSourceTabs value={audioSource} onChange={onAudioSourceChange} />
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase text-[#4F5B55]">
            Audio Script
          </p>

          {audioSource === "manual_upload" ? (
            <ManualAudioUpload />
          ) : (
            <AiVoiceAudioGenerator />
          )}
        </div>

        <div className="flex items-center gap-4 rounded-full bg-[#FBFCFA] px-4 py-4">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full bg-[#006B3F]"
          >
            <Play className="size-4 fill-white text-white" />
          </button>

          <div className="h-1 flex-1 rounded-full bg-[#E0E7DE]" />

          <span className="text-xs text-[#98A29E]">0:00</span>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase text-[#4F5B55]">
            Question Prompt
          </p>

          <div className="min-h-[120px] rounded-3xl bg-[#F4F8F2] px-6 py-5 text-sm text-[#9AA39C]">
            e.g. Listen to the dialogue. At what time does the train to Rome
            depart?
          </div>
        </div>

        <div>
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase text-[#4F5B55]">
              Answer Options (Decoys & Correct Answer)
            </p>

            <button
              type="button"
              className="text-sm font-medium text-[#006B3F]"
            >
              + Add Option
            </button>
          </div>

          <div className="space-y-4">
            {data.answerOptions.map((option) => (
              <div
                key={option.id}
                className={`flex items-center gap-5 rounded-full border px-4 py-4 ${
                  option.correct
                    ? "border-[#4CF15C] bg-[#F5FFF4]"
                    : "border-transparent bg-[#F4F7F2]"
                }`}
              >
                <div
                  className={`flex size-8 items-center justify-center rounded-full border-2 ${
                    option.correct ? "border-[#4CF15C]" : "border-[#B9C4BC]"
                  }`}
                >
                  <Circle
                    className={`size-3 ${
                      option.correct
                        ? "fill-[#4CF15C] text-[#4CF15C]"
                        : "text-transparent"
                    }`}
                  />
                </div>

                <span className="flex-1 text-sm font-medium text-[#202420]">
                  {option.label}
                </span>

                <button type="button">
                  <Trash2 className="size-4 text-[#7A8580]" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Button
            fullWidth
            size="lg"
            className="gap-2 shadow-xl shadow-[#006B3F]/15"
          >
            Save Question Configuration
          </Button>

          <button
            type="button"
            className="mt-5 flex w-full items-center justify-center gap-2 text-sm font-medium text-[#D92D20]"
          >
            <Trash2 className="size-4" />
            Discard Question
          </button>
        </div>
      </div>
    </Card>
  );
};

export default QuestionEditorCard;
