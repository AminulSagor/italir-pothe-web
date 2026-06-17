"use client";

import { ImagePlus, Trash2 } from "lucide-react";

import Card from "@/components/UI/cards/card";
import FileUploader from "@/components/UI/uploaders/file-uploader";
import type { QuizQuestionOption } from "@/types/course-directory/quiz.type";

import AnswerOptionsCard from "./answer-options-card";

interface IdentifyImageMcqQuestionConfigProps {
  mediaFileId: string;
  mediaUrl: string;
  options: QuizQuestionOption[];
  isUploading?: boolean;
  onFileSelect: (file: File) => void;
  onRemoveMedia: () => void;
  onOptionsChange: (options: QuizQuestionOption[]) => void;
}

export default function IdentifyImageMcqQuestionConfig({
  mediaFileId,
  mediaUrl,
  options,
  isUploading = false,
  onFileSelect,
  onRemoveMedia,
  onOptionsChange,
}: IdentifyImageMcqQuestionConfigProps) {
  return (
    <div className="space-y-6">
      <Card
        padding="lg"
        rounded="3xl"
        shadow="sm"
        className="border border-[#E2E8E1]"
      >
        {mediaFileId ? (
          <>
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ImagePlus className="size-5 text-[#007A4A]" />

                <h3 className="text-sm font-semibold text-[#007A4A]">
                  Question Visual
                </h3>
              </div>

              <button
                type="button"
                onClick={onRemoveMedia}
                className="inline-flex h-9 items-center gap-2 rounded-full bg-[#FFD8D3] px-4 text-xs font-bold uppercase text-[#D83324]"
              >
                <Trash2 className="size-4" />
                Remove Image
              </button>
            </div>

            <div className="flex min-h-72 items-center justify-center rounded-3xl border border-[#DDE6DD] bg-[#EEF3EC] p-6">
              {mediaUrl ? (
                <img
                  src={mediaUrl}
                  alt="Quiz question visual"
                  className="max-h-64 w-auto object-contain"
                />
              ) : (
                <p className="text-sm text-[#66736B]">Image URL loading...</p>
              )}
            </div>

            <label className="mt-5 inline-flex h-10 cursor-pointer items-center rounded-full bg-white px-5 text-sm font-semibold text-[#007A4A]">
              {isUploading ? "Uploading..." : "Replace Image"}

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                disabled={isUploading}
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (file) {
                    onFileSelect(file);
                  }

                  event.target.value = "";
                }}
              />
            </label>
          </>
        ) : (
          <FileUploader
            title={isUploading ? "Uploading..." : "Question Visual"}
            description="Upload the high-quality image students need to identify during the quiz."
            accept="image/png,image/jpeg,image/jpg"
            icon={<ImagePlus className="size-8" />}
            className="min-h-80 rounded-[40px]"
            onFileSelect={onFileSelect}
          />
        )}
      </Card>

      <AnswerOptionsCard options={options} onOptionsChange={onOptionsChange} />
    </div>
  );
}
