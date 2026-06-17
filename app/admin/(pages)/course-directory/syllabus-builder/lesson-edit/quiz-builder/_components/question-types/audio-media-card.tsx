"use client";

import { useEffect, useRef, useState } from "react";
import {
  FileAudio,
  Music,
  Pause,
  Play,
  Trash2,
  Upload,
  Volume2,
  Wand2,
} from "lucide-react";

import Card from "@/components/UI/cards/card";
import FileUploader from "@/components/UI/uploaders/file-uploader";

type AudioTab = "generate" | "upload";

interface AudioMediaCardProps {
  mediaFileId: string;
  mediaUrl: string;
  generatedAudioText: string;
  isUploading?: boolean;
  isGenerating?: boolean;
  onGeneratedAudioTextChange: (value: string) => void;
  onFileSelect: (file: File) => void;
  onRemoveMedia: () => void;
  onGenerateAudio?: () => void;
}

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

function AudioPreview({
  mediaUrl,
  label,
}: {
  mediaUrl: string;
  label: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    setIsPlaying(false);
    setHasError(false);
    setCurrentTime(0);
    setDuration(0);
  }, [mediaUrl]);

  const handleTogglePlay = async () => {
    const audio = audioRef.current;

    if (!audio || !mediaUrl || hasError) return;

    try {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
        return;
      }

      audio.pause();
      setIsPlaying(false);
    } catch {
      setIsPlaying(false);
      setHasError(true);
    }
  };

  const handleSeek = (value: number) => {
    const audio = audioRef.current;

    if (!audio || !duration) return;

    audio.currentTime = value;
    setCurrentTime(value);
  };

  const handleVolumeChange = (value: number) => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = value;
    setVolume(value);
  };

  if (!mediaUrl) {
    return (
      <div className="rounded-3xl bg-white px-6 py-5 text-sm font-medium text-[#66736B]">
        Audio file is attached. Preparing playable URL...
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white px-6 py-5">
      <audio
        ref={audioRef}
        src={mediaUrl}
        preload="metadata"
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration || 0);
        }}
        onTimeUpdate={(event) => {
          setCurrentTime(event.currentTarget.currentTime || 0);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
        onError={() => {
          setIsPlaying(false);
          setHasError(true);
        }}
      />

      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h4 className="truncate text-sm font-bold text-[#202420]">{label}</h4>
          <p className="text-xs font-semibold uppercase text-[#66736B]">
            Quiz audio file
          </p>
        </div>

        <p className="text-sm font-bold text-[#007A4A]">
          {formatTime(currentTime)} / {formatTime(duration)}
        </p>
      </div>

      {hasError ? (
        <p className="rounded-2xl bg-[#FCEBEC] px-4 py-3 text-sm font-medium text-[#D92D20]">
          Audio URL is not playable. Please replace this audio file.
        </p>
      ) : (
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleTogglePlay}
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#007A4A] text-white"
          >
            {isPlaying ? (
              <Pause className="size-5 fill-white" />
            ) : (
              <Play className="ml-0.5 size-5 fill-white" />
            )}
          </button>

          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.1}
            value={currentTime}
            disabled={!duration}
            onChange={(event) => handleSeek(Number(event.target.value))}
            className="h-1 flex-1 accent-[#007A4A]"
          />

          <div className="hidden items-center gap-2 md:flex">
            <Volume2 className="size-4 text-[#007A4A]" />

            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(event) =>
                handleVolumeChange(Number(event.target.value))
              }
              className="h-1 w-24 accent-[#007A4A]"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function AudioMediaCard({
  mediaFileId,
  mediaUrl,
  generatedAudioText,
  isUploading = false,
  isGenerating = false,
  onGeneratedAudioTextChange,
  onFileSelect,
  onRemoveMedia,
  onGenerateAudio,
}: AudioMediaCardProps) {
  const [activeTab, setActiveTab] = useState<AudioTab>(
    mediaFileId ? "upload" : "generate",
  );

  useEffect(() => {
    if (mediaFileId) {
      setActiveTab("upload");
    }
  }, [mediaFileId]);

  const renderTabButton = (tab: AudioTab, label: string) => {
    const isActive = activeTab === tab;

    return (
      <button
        type="button"
        onClick={() => setActiveTab(tab)}
        className={`border-b-2 pb-3 text-lg font-bold transition ${
          isActive
            ? "border-[#007A4A] text-[#007A4A]"
            : "border-transparent text-[#66736B]"
        }`}
      >
        {label}
      </button>
    );
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
          <h3 className="text-2xl font-bold text-[#202420]">Audio Media</h3>

          <p className="text-base text-[#66736B]">
            MP3, WAV, or AAC formats supported
          </p>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-8 border-b border-[#DDE6DD]">
        {renderTabButton("generate", "Generate Audio")}
        {renderTabButton("upload", "Upload Audio")}
      </div>

      {activeTab === "generate" ? (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-3xl bg-[#EEF3EC] p-6 lg:flex-row lg:items-center">
            <textarea
              value={generatedAudioText}
              onChange={(event) =>
                onGeneratedAudioTextChange(event.target.value)
              }
              placeholder="Enter text to generate audio..."
              className="min-h-24 flex-1 resize-none bg-transparent text-lg text-[#202420] outline-none placeholder:text-[#B7C2BA]"
            />

            <button
              type="button"
              disabled={!generatedAudioText.trim() || isGenerating}
              onClick={onGenerateAudio}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#007A4A] px-8 text-base font-bold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Wand2 className="size-5" />
              {isGenerating ? "Generating..." : "AI Generate"}
            </button>
          </div>

          {mediaFileId ? (
            <AudioPreview
              mediaUrl={mediaUrl}
              label="Generated audio attached"
            />
          ) : (
            <div className="rounded-3xl bg-white px-6 py-5 text-sm text-[#66736B]">
              No generated audio attached yet.
            </div>
          )}
        </div>
      ) : (
        <div>
          {mediaFileId ? (
            <div className="rounded-[32px] border border-[#DDE6DD] bg-[#EEF5EC] p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#62F25A]">
                    <FileAudio className="size-5 text-[#007A4A]" />
                  </div>

                  <div className="min-w-0">
                    <h4 className="truncate text-lg font-bold text-[#202420]">
                      Audio attached
                    </h4>

                    <p className="text-xs font-semibold uppercase text-[#66736B]">
                      Uploaded quiz audio
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onRemoveMedia}
                  className="text-[#66736B] hover:text-red-600"
                  aria-label="Remove audio"
                >
                  <Trash2 className="size-5" />
                </button>
              </div>

              <AudioPreview mediaUrl={mediaUrl} label="Quiz audio attached" />

              <label className="mt-6 inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#007A4A]">
                <Upload className="size-4" />
                {isUploading ? "Uploading..." : "Replace Audio"}

                <input
                  type="file"
                  accept="audio/mpeg,audio/wav,audio/aac,audio/x-wav"
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
            </div>
          ) : (
            <FileUploader
              title={isUploading ? "Uploading..." : "Upload Audio"}
              description="Drag & drop audio file here or click to browse. Supported formats: MP3, WAV, AAC."
              accept="audio/mpeg,audio/wav,audio/aac,audio/x-wav"
              icon={<FileAudio className="size-6" />}
              onFileSelect={onFileSelect}
            />
          )}
        </div>
      )}
    </Card>
  );
}
