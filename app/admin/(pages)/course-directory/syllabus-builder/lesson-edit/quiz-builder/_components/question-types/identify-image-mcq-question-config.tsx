"use client";

import { useEffect, useState } from "react";
import { Check, ImagePlus, ListChecks, Trash2 } from "lucide-react";

import Card from "@/components/UI/cards/card";
import FileUploader from "@/components/UI/uploaders/file-uploader";

interface UploadedImage {
  name: string;
  previewUrl: string;
}

const answerOptions = ["Mela", "Arancia", "Limone", "Fragola"];

export default function IdentifyImageMcqQuestionConfig() {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(
    null,
  );
  const [correctAnswer, setCorrectAnswer] = useState("Mela");

  useEffect(() => {
    return () => {
      if (uploadedImage?.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(uploadedImage.previewUrl);
      }
    };
  }, [uploadedImage]);

  const handleImageSelect = (file: File) => {
    setUploadedImage({
      name: file.name,
      previewUrl: URL.createObjectURL(file),
    });
  };

  const handleRemoveImage = () => {
    if (uploadedImage?.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(uploadedImage.previewUrl);
    }

    setUploadedImage(null);
  };

  return (
    <div className="space-y-6">
      <Card
        padding="lg"
        rounded="3xl"
        shadow="sm"
        className="border border-[#E2E8E1]"
      >
        {uploadedImage ? (
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
                onClick={handleRemoveImage}
                className="inline-flex h-9 items-center gap-2 rounded-full bg-[#FFD8D3] px-4 text-xs font-bold uppercase text-[#D83324]"
              >
                <Trash2 className="size-4" />
                Remove Image
              </button>
            </div>

            <div className="flex min-h-72 items-center justify-center rounded-3xl border border-[#DDE6DD] bg-[#EEF3EC] p-6">
              <img
                src={uploadedImage.previewUrl}
                alt={uploadedImage.name}
                className="max-h-64 w-auto object-contain"
              />
            </div>
          </>
        ) : (
          <FileUploader
            title="Question Visual"
            description="Upload the high-quality image students need to identify during the quiz."
            accept="image/png,image/jpeg,image/jpg"
            icon={<ImagePlus className="size-8" />}
            className="min-h-80 rounded-[40px]"
            onFileSelect={handleImageSelect}
          />
        )}
      </Card>

      <Card
        padding="lg"
        rounded="3xl"
        shadow="sm"
        className="border border-[#E2E8E1]"
      >
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <ListChecks className="size-5 text-[#007A4A]" />
            <h3 className="text-sm font-semibold text-[#007A4A]">
              Answer Options
            </h3>
          </div>

          <span className="w-fit rounded-full bg-[#DFF8DC] px-4 py-2 text-[10px] font-bold uppercase text-[#007A4A]">
            Select Correct Answer
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {answerOptions.map((option) => {
            const isCorrect = option === correctAnswer;

            return (
              <button
                key={option}
                type="button"
                onClick={() => setCorrectAnswer(option)}
                className={`flex h-14 items-center justify-between rounded-full border px-5 text-sm font-bold ${
                  isCorrect
                    ? "border-[#007A4A] bg-white text-[#202420] shadow-sm"
                    : "border-[#DDE6DD] bg-[#EEF3EC] text-[#202420]"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`flex size-6 items-center justify-center rounded-full border ${
                      isCorrect
                        ? "border-[#007A4A] bg-[#007A4A]"
                        : "border-[#C5D0C8] bg-white"
                    }`}
                  >
                    {isCorrect && (
                      <span className="size-2 rounded-full bg-white" />
                    )}
                  </span>

                  {option}
                </span>

                {isCorrect && (
                  <span className="flex size-7 items-center justify-center rounded-full bg-[#007A4A] text-white">
                    <Check className="size-4" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
