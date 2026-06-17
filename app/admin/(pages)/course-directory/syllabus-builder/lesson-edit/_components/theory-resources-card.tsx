"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bold,
  FileAudio,
  FileImage,
  Italic,
  Languages,
  Link,
  List,
  ListOrdered,
  Pause,
  Play,
  Trash2,
  Underline,
  Volume2,
  VolumeX,
} from "lucide-react";
import toast from "react-hot-toast";

import Card from "@/components/UI/cards/card";
import FileUploader from "@/components/UI/uploaders/file-uploader";
import { createSignedReadUrl } from "@/service/files/file_upload";

interface TheoryResourcesCardProps {
  theoryText: string;
  bengaliTranslation: string;
  theoryAudioFileId: string;
  supplementaryMaterialFileId: string;
  disabled?: boolean;
  isUploadingAudio?: boolean;
  isUploadingPdf?: boolean;
  onTheoryTextChange: (value: string) => void;
  onBengaliTranslationChange: (value: string) => void;
  onAudioSelect: (file: File) => void;
  onPdfSelect: (file: File) => void;
  onRemoveAudio: () => void;
  onRemovePdf: () => void;
}

function EditorBox({
  value,
  onChange,
  muted = false,
  disabled = false,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  muted?: boolean;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#DDE6DD]">
      <div className="flex h-9 items-center gap-4 bg-[#EEF5EC] px-4 text-[#526057]">
        <Bold className="size-3" />
        <Italic className="size-3" />
        <Underline className="size-3" />
        <List className="size-3" />
        <ListOrdered className="size-3" />
        <Link className="size-3" />
      </div>

      <textarea
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`min-h-32 w-full resize-none bg-white px-4 py-4 text-sm leading-6 outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
          muted
            ? "text-[#66736B] placeholder:text-[#A8B2AA]"
            : "text-[#202420] placeholder:text-[#A8B2AA]"
        }`}
      />
    </div>
  );
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
};

export default function TheoryResourcesCard({
  theoryText,
  bengaliTranslation,
  theoryAudioFileId,
  supplementaryMaterialFileId,
  disabled = false,
  isUploadingAudio = false,
  isUploadingPdf = false,
  onTheoryTextChange,
  onBengaliTranslationChange,
  onAudioSelect,
  onPdfSelect,
  onRemoveAudio,
  onRemovePdf,
}: TheoryResourcesCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [audioUrl, setAudioUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioVolume, setAudioVolume] = useState(1);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadAudioUrl = async () => {
      if (!theoryAudioFileId) {
        setAudioUrl("");
        setIsPlaying(false);
        setAudioCurrentTime(0);
        setAudioDuration(0);
        return;
      }

      try {
        const response = await createSignedReadUrl(theoryAudioFileId);
        const nextUrl = response.signedReadUrl || response.publicUrl || "";

        if (!isMounted) return;

        setAudioUrl(nextUrl);
        setIsPlaying(false);
        setAudioCurrentTime(0);
        setAudioDuration(0);
      } catch (error) {
        toast.error(getErrorMessage(error));

        if (isMounted) {
          setAudioUrl("");
          setIsPlaying(false);
          setAudioCurrentTime(0);
          setAudioDuration(0);
        }
      }
    };

    loadAudioUrl();

    return () => {
      isMounted = false;
    };
  }, [theoryAudioFileId]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = audioVolume;
    audio.muted = isAudioMuted || audioVolume === 0;
  }, [audioVolume, isAudioMuted, audioUrl]);

  const handleAudioToggle = async () => {
    const audio = audioRef.current;

    if (!audio || !audioUrl) return;

    try {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const progressPercentage =
    audioDuration > 0
      ? Math.min((audioCurrentTime / audioDuration) * 100, 100)
      : 0;

  const handleAudioVolumeChange = (value: string) => {
    const nextVolume = Number(value);

    setAudioVolume(nextVolume);
    setIsAudioMuted(nextVolume === 0);
  };

  const handleToggleAudioMute = () => {
    setIsAudioMuted((currentValue) => !currentValue);
  };

  return (
    <Card
      padding="lg"
      rounded="3xl"
      shadow="sm"
      className="border border-[#E2E8E1]"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-full bg-[#DFF8DC]">
          <List className="size-4 text-[#009F5A]" />
        </div>

        <h2 className="text-lg font-bold text-[#202420]">Theory & Resources</h2>
      </div>

      <EditorBox
        value={theoryText}
        disabled={disabled}
        onChange={onTheoryTextChange}
        placeholder="Write lesson theory here..."
      />

      <div className="my-8 rounded-3xl border border-[#DDE6DD] bg-[#EEF5EC] p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            type="button"
            disabled={!audioUrl}
            onClick={handleAudioToggle}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#007A4A] text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPlaying ? (
              <Pause className="size-5 fill-white" />
            ) : (
              <Play className="ml-0.5 size-5 fill-white" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-[#202420]">
              Listen to Italian Theory
            </h4>

            <p className="text-xs text-[#66736B]">
              {theoryAudioFileId
                ? "AI Voice Preview Attached"
                : "No audio attached"}
            </p>
          </div>

          <div className="flex flex-1 items-center gap-3">
            <div className="h-1 flex-1 rounded-full bg-[#B7C8BB]">
              <div
                className="relative h-1 rounded-full bg-[#007A4A]"
                style={{ width: `${progressPercentage}%` }}
              >
                <span className="absolute right-0 top-1/2 size-2 -translate-y-1/2 rounded-full bg-[#007A4A]" />
              </div>
            </div>

            <span className="whitespace-nowrap text-xs text-[#202420]">
              {formatTime(audioCurrentTime)} / {formatTime(audioDuration)}
            </span>

            <div className="flex w-32 items-center gap-2">
              <button
                type="button"
                onClick={handleToggleAudioMute}
                className="text-[#007A4A]"
                aria-label={isAudioMuted ? "Unmute audio" : "Mute audio"}
              >
                {isAudioMuted || audioVolume === 0 ? (
                  <VolumeX className="size-4" />
                ) : (
                  <Volume2 className="size-4" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isAudioMuted ? 0 : audioVolume}
                onChange={(event) =>
                  handleAudioVolumeChange(event.target.value)
                }
                className="w-full h-1 accent-[#007A4A]"
                aria-label="Audio volume"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full bg-white px-4 text-xs font-semibold text-[#007A4A]">
              <FileAudio className="size-4" />
              {isUploadingAudio
                ? "Uploading..."
                : theoryAudioFileId
                  ? "Replace"
                  : "Upload"}

              <input
                type="file"
                accept="audio/*"
                disabled={disabled || isUploadingAudio}
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (file) {
                    onAudioSelect(file);
                  }

                  event.target.value = "";
                }}
              />
            </label>

            {theoryAudioFileId ? (
              <button
                type="button"
                disabled={disabled}
                onClick={onRemoveAudio}
                className="flex size-9 items-center justify-center rounded-full bg-[#FFD8D3] text-[#D83324] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 className="size-4" />
              </button>
            ) : null}
          </div>
        </div>

        {audioUrl ? (
          <audio
            ref={audioRef}
            src={audioUrl}
            preload="metadata"
            className="hidden"
            onLoadedMetadata={(event) => {
              event.currentTarget.volume = audioVolume;
              event.currentTarget.muted = isAudioMuted || audioVolume === 0;
              setAudioDuration(event.currentTarget.duration || 0);
            }}
            onTimeUpdate={(event) => {
              setAudioCurrentTime(event.currentTarget.currentTime || 0);
            }}
            onEnded={() => {
              setIsPlaying(false);
              setAudioCurrentTime(0);
            }}
          />
        ) : null}
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-full bg-[#FBE4E4]">
          <Languages className="size-5 text-[#B64A4A]" />
        </div>

        <h3 className="text-sm font-bold text-[#202420]">
          Bengali Translation
        </h3>
      </div>

      <EditorBox
        value={bengaliTranslation}
        disabled={disabled}
        onChange={onBengaliTranslationChange}
        muted
        placeholder="Write Bengali translation here..."
      />

      <div className="mt-8">
        {supplementaryMaterialFileId ? (
          <div className="flex flex-col gap-4 rounded-3xl border border-[#DDE6DD] bg-[#EEF5EC] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-white">
                <FileImage className="size-5 text-[#007A4A]" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#202420]">
                  Supplementary material attached
                </h4>

                <p className="text-xs text-[#66736B]">
                  PDF resource is connected to this lesson.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="inline-flex h-10 cursor-pointer items-center rounded-full bg-white px-5 text-sm font-semibold text-[#007A4A]">
                {isUploadingPdf ? "Uploading..." : "Replace PDF"}

                <input
                  type="file"
                  accept="application/pdf"
                  disabled={disabled || isUploadingPdf}
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];

                    if (file) {
                      onPdfSelect(file);
                    }

                    event.target.value = "";
                  }}
                />
              </label>

              <button
                type="button"
                disabled={disabled}
                onClick={onRemovePdf}
                className="flex h-10 items-center gap-2 rounded-full bg-[#FFD8D3] px-4 text-sm font-semibold text-[#D83324] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 className="size-4" />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <FileUploader
            title={
              isUploadingPdf
                ? "Uploading Supplementary Material..."
                : "Upload Supplementary Material"
            }
            description="Drag and drop a PDF file here, or click to browse. Max size 10MB."
            accept="application/pdf"
            icon={<FileImage className="size-5" />}
            onFileSelect={onPdfSelect}
          />
        )}
      </div>
    </Card>
  );
}
