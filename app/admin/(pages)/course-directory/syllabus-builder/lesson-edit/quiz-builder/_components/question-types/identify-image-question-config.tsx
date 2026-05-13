"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  ImagePlus,
  Info,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import Card from "@/components/UI/cards/card";
import FileUploader from "@/components/UI/uploaders/file-uploader";

interface UploadedImage {
  name: string;
  previewUrl: string;
}

const initialAlternateSpellings = ["mela", "la mela", "una mela"];

export default function IdentifyImageQuestionConfig() {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(
    null,
  );
  const [helperText, setHelperText] = useState("Apple");
  const [correctAnswer, setCorrectAnswer] = useState("Mela");
  const [alternateSpellings, setAlternateSpellings] = useState(
    initialAlternateSpellings,
  );
  const [variationInput, setVariationInput] = useState("");

  useEffect(() => {
    return () => {
      if (uploadedImage?.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(uploadedImage.previewUrl);
      }
    };
  }, [uploadedImage]);

  const handleImageSelect = (file: File) => {
    const previewUrl = URL.createObjectURL(file);

    setUploadedImage({
      name: file.name,
      previewUrl,
    });
  };

  const handleRemoveImage = () => {
    if (uploadedImage?.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(uploadedImage.previewUrl);
    }

    setUploadedImage(null);
  };

  const handleAddVariation = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || !variationInput.trim()) return;

    event.preventDefault();
    setAlternateSpellings((prev) => [...prev, variationInput.trim()]);
    setVariationInput("");
  };

  const handleRemoveVariation = (item: string) => {
    setAlternateSpellings((prev) => prev.filter((value) => value !== item));
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
                <div className="flex size-9 items-center justify-center rounded-full bg-[#DDF3E8]">
                  <ImagePlus className="size-4 text-[#007A4A]" />
                </div>

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
                className="max-h-64 w-auto rounded-sm object-contain"
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
        <div className="mb-7 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#62F25A]">
            <ShieldCheck className="size-5 text-[#007A4A]" />
          </div>

          <h3 className="text-lg font-bold text-[#202420]">
            Typing Validation Setup
          </h3>
        </div>

        <div className="space-y-6">
          <label>
            <span className="mb-2 block text-xs font-bold text-[#526057]">
              English Helper Text
            </span>

            <input
              value={helperText}
              onChange={(event) => setHelperText(event.target.value)}
              className="h-12 w-full rounded-full bg-[#EEF3EC] px-6 text-sm text-[#202420] outline-none"
            />
          </label>

          <label>
            <span className="mb-2 block text-xs font-bold text-[#526057]">
              Exact Correct Answer (Italian)
            </span>

            <div className="flex h-12 items-center rounded-full border-2 border-[#007A4A] px-6">
              <input
                value={correctAnswer}
                onChange={(event) => setCorrectAnswer(event.target.value)}
                className="w-full bg-transparent text-sm font-bold text-[#007A4A] outline-none"
              />

              <CheckCircle className="size-5 text-[#007A4A]" />
            </div>
          </label>

          <div>
            <p className="mb-3 text-xs font-bold text-[#526057]">
              Acceptable Alternate Spellings
            </p>

            <div className="rounded-3xl border border-dashed border-[#B9DCC8] bg-[#F7FBF4] p-5">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {alternateSpellings.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleRemoveVariation(item)}
                    className="rounded-full border border-[#DDE6DD] bg-white px-4 py-2 text-xs font-medium text-[#526057]"
                  >
                    {item} ×
                  </button>
                ))}

                <input
                  value={variationInput}
                  onChange={(event) => setVariationInput(event.target.value)}
                  onKeyDown={handleAddVariation}
                  placeholder="Add variation..."
                  className="min-w-[150px] flex-1 bg-transparent text-sm outline-none placeholder:text-[#8A968E]"
                />
              </div>

              <div className="flex items-start gap-3 text-xs leading-5 text-[#8A968E]">
                <Info className="mt-0.5 size-4 shrink-0" />
                <p>
                  Add variations the system should accept as correct e.g.,
                  ignoring capitalization or articles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
