import { Circle, FileAudio, Play, Trash2 } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";
import type { QuizQuestionOption } from "@/types/course-directory/quiz.type";

import AudioSourceTabs, { AudioSourceType } from "./audio-source-tabs";
import AiVoiceAudioGenerator from "./ai-voice-audio-generator";
import ManualAudioUpload from "./manual-audio-upload";

interface QuestionEditorCardProps {
  title: string;
  promptText: string;
  generatedAudioText: string;
  mediaFileId: string;
  mediaUrl: string;
  audioSource: AudioSourceType;
  options: QuizQuestionOption[];
  isUploading?: boolean;
  isSaving?: boolean;
  isDeleting?: boolean;
  onAudioSourceChange: (value: AudioSourceType) => void;
  onPromptTextChange: (value: string) => void;
  onGeneratedAudioTextChange: (value: string) => void;
  onFileSelect: (file: File) => void;
  onRemoveAudio: () => void;
  onOptionsChange: (options: QuizQuestionOption[]) => void;
  onSaveQuestion: () => void;
  onDiscardQuestion: () => void;
}

const QuestionEditorCard = ({
  title,
  promptText,
  generatedAudioText,
  mediaFileId,
  mediaUrl,
  audioSource,
  options,
  isUploading = false,
  isSaving = false,
  isDeleting = false,
  onAudioSourceChange,
  onPromptTextChange,
  onGeneratedAudioTextChange,
  onFileSelect,
  onRemoveAudio,
  onOptionsChange,
  onSaveQuestion,
  onDiscardQuestion,
}: QuestionEditorCardProps) => {
  const markCorrect = (optionIndex: number) => {
    onOptionsChange(
      options.map((option, index) => ({
        ...option,
        isCorrect: index === optionIndex,
      })),
    );
  };

  const updateOption = (
    optionIndex: number,
    patch: Partial<QuizQuestionOption>,
  ) => {
    onOptionsChange(
      options.map((option, index) =>
        index === optionIndex ? { ...option, ...patch } : option,
      ),
    );
  };

  const addOption = () => {
    onOptionsChange([
      ...options,
      {
        optionText: "",
        isCorrect: options.length === 0,
        sortOrder: options.length + 1,
      },
    ]);
  };

  const removeOption = (optionIndex: number) => {
    const filteredOptions = options.filter((_, index) => index !== optionIndex);
    const hasCorrectOption = filteredOptions.some((option) => option.isCorrect);

    onOptionsChange(
      filteredOptions.map((option, index) => ({
        ...option,
        sortOrder: index + 1,
        isCorrect: option.isCorrect || (!hasCorrectOption && index === 0),
      })),
    );
  };

  return (
    <Card rounded="3xl" padding="lg" shadow="sm">
      <div className="mb-8 flex items-start justify-between gap-5">
        <div>
          <h2 className="text-xl font-bold text-[#202420]">Question Editor</h2>

          <p className="mt-1 text-sm text-[#6F7673]">
            {title || "Configure question details and answer validation"}
          </p>
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
            <ManualAudioUpload
              mediaFileId={mediaFileId}
              mediaUrl={mediaUrl}
              isUploading={isUploading}
              onFileSelect={onFileSelect}
              onRemoveAudio={onRemoveAudio}
            />
          ) : (
            <AiVoiceAudioGenerator
              value={generatedAudioText}
              onChange={onGeneratedAudioTextChange}
            />
          )}
        </div>

        {mediaFileId && (
          <div className="flex items-center gap-4 rounded-full bg-[#FBFCFA] px-4 py-4">
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full bg-[#006B3F]"
            >
              <Play className="size-4 fill-white text-white" />
            </button>

            <div className="h-1 flex-1 rounded-full bg-[#E0E7DE]" />

            <span className="text-xs text-[#98A29E]">Ready</span>
          </div>
        )}

        <div>
          <p className="mb-3 text-xs font-semibold uppercase text-[#4F5B55]">
            Question Prompt
          </p>

          <textarea
            value={promptText}
            onChange={(event) => onPromptTextChange(event.target.value)}
            placeholder="e.g. Listen to the dialogue. At what time does the train to Rome depart?"
            className="min-h-[120px] w-full resize-none rounded-3xl bg-[#F4F8F2] px-6 py-5 text-sm text-[#202420] outline-none placeholder:text-[#9AA39C]"
          />
        </div>

        <div>
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase text-[#4F5B55]">
              Answer Options (Decoys & Correct Answer)
            </p>

            <button
              type="button"
              onClick={addOption}
              className="text-sm font-medium text-[#006B3F]"
            >
              + Add Option
            </button>
          </div>

          <div className="space-y-4">
            {options.map((option, index) => (
              <div
                key={`${option.id || "option"}-${index}`}
                className={`flex items-center gap-5 rounded-full border px-4 py-4 ${
                  option.isCorrect
                    ? "border-[#4CF15C] bg-[#F5FFF4]"
                    : "border-transparent bg-[#F4F7F2]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => markCorrect(index)}
                  className={`flex size-8 items-center justify-center rounded-full border-2 ${
                    option.isCorrect ? "border-[#4CF15C]" : "border-[#B9C4BC]"
                  }`}
                >
                  <Circle
                    className={`size-3 ${
                      option.isCorrect
                        ? "fill-[#4CF15C] text-[#4CF15C]"
                        : "text-transparent"
                    }`}
                  />
                </button>

                <input
                  value={option.optionText}
                  onChange={(event) =>
                    updateOption(index, { optionText: event.target.value })
                  }
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 bg-transparent text-sm font-medium text-[#202420] outline-none placeholder:text-[#9AA39C]"
                />

                {options.length > 2 && (
                  <button type="button" onClick={() => removeOption(index)}>
                    <Trash2 className="size-4 text-[#7A8580]" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Button
            fullWidth
            size="lg"
            disabled={isSaving || isDeleting}
            onClick={onSaveQuestion}
            className="gap-2 shadow-xl shadow-[#006B3F]/15"
          >
            {isSaving ? "Saving..." : "Save Question Configuration"}
          </Button>

          <button
            type="button"
            disabled={isSaving || isDeleting}
            onClick={onDiscardQuestion}
            className="mt-5 flex w-full items-center justify-center gap-2 text-sm font-medium text-[#D92D20] disabled:opacity-60"
          >
            <Trash2 className="size-4" />
            {isDeleting ? "Discarding..." : "Discard Question"}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default QuestionEditorCard;
