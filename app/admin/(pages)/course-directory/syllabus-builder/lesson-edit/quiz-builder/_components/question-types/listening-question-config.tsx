"use client";

import { ListPlus } from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { QuizQuestionOption } from "@/types/course-directory/quiz.type";

import AnswerOptionsCard from "./answer-options-card";
import AudioMediaCard from "./audio-media-card";

type QuestionStatus = "draft" | "active" | "published" | "archived";

interface ListeningQuestionConfigProps {
  title: string;
  points: number;
  sortOrder: number;
  status: QuestionStatus;
  mediaFileId: string;
  mediaUrl: string;
  generatedAudioText: string;
  options: QuizQuestionOption[];
  isUploading?: boolean;
  isGenerating?: boolean;
  onTitleChange: (value: string) => void;
  onPointsChange: (value: number) => void;
  onSortOrderChange: (value: number) => void;
  onStatusChange: (value: QuestionStatus) => void;
  onGeneratedAudioTextChange: (value: string) => void;
  onFileSelect: (file: File) => void;
  onRemoveMedia: () => void;
  onGenerateAudio?: () => void;
  onOptionsChange: (options: QuizQuestionOption[]) => void;
}

export default function ListeningQuestionConfig({
  title,
  points,
  sortOrder,
  status,
  mediaFileId,
  mediaUrl,
  generatedAudioText,
  options,
  isUploading = false,
  isGenerating = false,
  onTitleChange,
  onPointsChange,
  onSortOrderChange,
  onStatusChange,
  onGeneratedAudioTextChange,
  onFileSelect,
  onRemoveMedia,
  onGenerateAudio,
  onOptionsChange,
}: ListeningQuestionConfigProps) {
  return (
    <>
      <Card
        padding="lg"
        rounded="3xl"
        shadow="sm"
        className="border border-[#E2E8E1]"
      >
        <div className="mb-5 flex items-center gap-3">
          <ListPlus className="size-5 text-[#007A4A]" />
          <h3 className="text-lg font-bold text-[#202420]">
            Listening MCQ Settings
          </h3>
        </div>

        <div className="grid gap-5">
          <label>
            <span className="mb-2 block text-[10px] font-bold uppercase text-[#66736B]">
              Question Title
            </span>

            <input
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="Enter question title..."
              className="h-14 w-full rounded-full bg-[#EEF3EC] px-6 text-sm text-[#202420] outline-none placeholder:text-[#A8B2AA]"
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-3">
            <label>
              <span className="mb-2 block text-[10px] font-bold uppercase text-[#66736B]">
                Points
              </span>

              <input
                type="number"
                min={1}
                value={points}
                onChange={(event) => onPointsChange(Number(event.target.value))}
                className="h-14 w-full rounded-full bg-[#EEF3EC] px-6 text-sm text-[#202420] outline-none"
              />
            </label>

            <label>
              <span className="mb-2 block text-[10px] font-bold uppercase text-[#66736B]">
                Sort Order
              </span>

              <input
                type="number"
                min={0}
                value={sortOrder}
                onChange={(event) =>
                  onSortOrderChange(Number(event.target.value))
                }
                className="h-14 w-full rounded-full bg-[#EEF3EC] px-6 text-sm text-[#202420] outline-none"
              />
            </label>

            <label>
              <span className="mb-2 block text-[10px] font-bold uppercase text-[#66736B]">
                Status
              </span>

              <select
                value={status}
                onChange={(event) =>
                  onStatusChange(event.target.value as QuestionStatus)
                }
                className="h-14 w-full rounded-full bg-[#EEF3EC] px-6 text-sm text-[#202420] outline-none"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </label>
          </div>
        </div>
      </Card>

      <AudioMediaCard
        mediaFileId={mediaFileId}
        mediaUrl={mediaUrl}
        generatedAudioText={generatedAudioText}
        isUploading={isUploading}
        isGenerating={isGenerating}
        onGeneratedAudioTextChange={onGeneratedAudioTextChange}
        onFileSelect={onFileSelect}
        onRemoveMedia={onRemoveMedia}
        onGenerateAudio={onGenerateAudio}
      />

      <AnswerOptionsCard options={options} onOptionsChange={onOptionsChange} />
    </>
  );
}
