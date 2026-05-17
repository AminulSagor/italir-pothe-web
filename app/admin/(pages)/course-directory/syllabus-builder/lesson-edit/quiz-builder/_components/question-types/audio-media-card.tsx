"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { FileAudio, Music, Play, Sparkles, Trash2 } from "lucide-react";

import Card from "@/components/UI/cards/card";
import FileUploader from "@/components/UI/uploaders/file-uploader";
import { QuizAudioTab } from "@/mock/quiz-builder/quiz-builder.types";

interface UploadedAudio {
  filename: string;
  size: string;
  previewUrl: string;
}

const audioTabs: { label: string; value: QuizAudioTab }[] = [
  { label: "Generate Audio", value: "generate" },
  { label: "Upload Audio", value: "upload" },
];

export default function AudioMediaCard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTab =
    searchParams.get("audioTab") === "upload" ? "upload" : "generate";

  const [generateText, setGenerateText] = useState("");
  const [uploadedAudio, setUploadedAudio] = useState<UploadedAudio | null>(
    null,
  );

  useEffect(() => {
    return () => {
      if (uploadedAudio?.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(uploadedAudio.previewUrl);
      }
    };
  }, [uploadedAudio]);

  const handleTabChange = (tab: QuizAudioTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("audioTab", tab);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleAudioSelect = (file: File) => {
    const previewUrl = URL.createObjectURL(file);

    setUploadedAudio({
      filename: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      previewUrl,
    });
  };

  const handleDeleteAudio = () => {
    if (uploadedAudio?.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(uploadedAudio.previewUrl);
    }

    setUploadedAudio(null);
  };

  const handleGenerateInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setGenerateText(event.target.value);
  };

  return (
    <Card
      padding="lg"
      rounded="3xl"
      shadow="sm"
      className="border border-[#E2E8E1]"
    >
      <div className="mb-6 flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-[#62F25A]">
          <Music className="size-6 text-[#007A4A]" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-[#202420]">Audio Media</h3>
          <p className="text-sm text-[#66736B]">
            MP3, WAV, or AAC formats supported
          </p>
        </div>
      </div>

      <div className="mb-6 flex gap-6 border-b border-[#DDE6DD]">
        {audioTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => handleTabChange(tab.value)}
            className={`border-b-2 pb-3 text-sm font-bold transition ${
              currentTab === tab.value
                ? "border-[#007A4A] text-[#007A4A]"
                : "border-transparent text-[#66736B]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {currentTab === "generate" ? (
        <div>
          <div className="rounded-3xl bg-[#EEF3EC] p-5">
            <textarea
              value={generateText}
              onChange={handleGenerateInput}
              placeholder="Enter text to generate audio..."
              className="min-h-20 w-full resize-none bg-transparent text-sm text-[#202420] outline-none placeholder:text-[#B2BDB5]"
            />

            <div className="flex justify-end">
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#007A4A] px-6 text-sm font-bold text-white shadow-md"
              >
                <Sparkles className="size-4" />
                AI Generate
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-4 rounded-full border border-[#DDE6DD] bg-white px-4 py-3">
            <button
              type="button"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#007A4A] text-white"
            >
              <Play className="ml-0.5 size-4 fill-white" />
            </button>

            <div className="h-1 flex-1 rounded-full bg-[#DDE6DD]" />

            <span className="text-xs text-[#A8B2AA]">0:00</span>
          </div>
        </div>
      ) : uploadedAudio ? (
        <div className="rounded-3xl border border-[#DDE6DD] bg-[#EEF5EC] p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#62F25A]">
                <FileAudio className="size-5 text-[#007A4A]" />
              </div>

              <div className="min-w-0">
                <h4 className="truncate text-base font-bold text-[#202420]">
                  {uploadedAudio.filename}
                </h4>
                <p className="text-xs uppercase text-[#66736B]">
                  {uploadedAudio.size} • MP3 Audio
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDeleteAudio}
              className="text-[#66736B] hover:text-red-600"
            >
              <Trash2 className="size-5" />
            </button>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4">
            <button
              type="button"
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#007A4A] text-white"
            >
              <Play className="ml-0.5 size-5 fill-white" />
            </button>

            <audio src={uploadedAudio.previewUrl} controls className="hidden" />

            <div className="h-2 flex-1 rounded-full bg-[#DDE6DD]">
              <div className="h-2 w-1/3 rounded-full bg-[#007A4A]" />
            </div>

            <span className="whitespace-nowrap text-xs font-semibold text-[#007A4A]">
              0:12
            </span>
            <span className="whitespace-nowrap text-xs text-[#A8B2AA]">
              / 0:45
            </span>
          </div>
        </div>
      ) : (
        <FileUploader
          title="Drop your MP3, WAV, or AAC file here or click to browse"
          description=""
          accept="audio/mpeg,audio/wav,audio/aac"
          icon={<FileAudio className="size-6" />}
          className="min-h-44"
          onFileSelect={handleAudioSelect}
        />
      )}
    </Card>
  );
}
