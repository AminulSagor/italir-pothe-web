"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Trash2, Video, Volume2, VolumeX } from "lucide-react";
import toast from "react-hot-toast";

import Card from "@/components/UI/cards/card";
import FileUploader from "@/components/UI/uploaders/file-uploader";
import { createSignedReadUrl } from "@/service/files/file_upload";

interface MediaOverviewCardProps {
  title: string;
  videoFileId: string;
  disabled?: boolean;
  isUploadingVideo?: boolean;
  onTitleChange: (value: string) => void;
  onVideoSelect: (file: File) => void;
  onDeleteVideo: () => void;
}

interface VideoPreview {
  filename: string;
  duration: string;
  size: string;
  previewUrl: string;
}

type SignedReadUrlResponse = {
  signedReadUrl?: string;
  publicUrl?: string;
  filename?: string;
  originalName?: string;
  name?: string;
  sizeBytes?: number;
  size?: number;
  file?: {
    filename?: string;
    originalName?: string;
    name?: string;
    sizeBytes?: number;
    size?: number;
  };
};

interface MediaOverviewCardProps {
  title: string;
  videoFileId: string;
  disabled?: boolean;
  isUploadingVideo?: boolean;
  videoUploadProgress?: number;
  onTitleChange: (value: string) => void;
  onVideoSelect: (file: File) => void;
  onDeleteVideo: () => void;
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

const formatDuration = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return "Attached";

  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = String(totalSeconds % 60).padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
};

const formatFileSize = (bytes?: number) => {
  if (!bytes || !Number.isFinite(bytes)) return "Uploaded resource";

  const mb = bytes / (1024 * 1024);

  return `${mb.toFixed(1)} MB`;
};

const getVideoFilename = (response: SignedReadUrlResponse) =>
  response.originalName ||
  response.filename ||
  response.name ||
  response.file?.originalName ||
  response.file?.filename ||
  response.file?.name ||
  "Lesson video attached";

const getVideoSize = (response: SignedReadUrlResponse) =>
  response.sizeBytes ||
  response.size ||
  response.file?.sizeBytes ||
  response.file?.size;

export default function MediaOverviewCard({
  title,
  videoFileId,
  disabled = false,
  isUploadingVideo = false,
  videoUploadProgress = 0,
  onTitleChange,
  onVideoSelect,
  onDeleteVideo,
}: MediaOverviewCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [videoPreview, setVideoPreview] = useState<VideoPreview | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoVolume, setVideoVolume] = useState(1);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    video.volume = videoVolume;
    video.muted = isVideoMuted || videoVolume === 0;
  }, [videoVolume, isVideoMuted, videoPreview?.previewUrl]);

  useEffect(() => {
    let isMounted = true;

    const loadVideoPreview = async () => {
      if (!videoFileId) {
        setVideoPreview(null);
        setIsPlaying(false);
        return;
      }

      try {
        const response = (await createSignedReadUrl(
          videoFileId,
        )) as SignedReadUrlResponse;

        const previewUrl = response.signedReadUrl || response.publicUrl || "";

        if (!isMounted) return;

        setVideoPreview({
          filename: getVideoFilename(response),
          duration: "Loading...",
          size: formatFileSize(getVideoSize(response)),
          previewUrl,
        });
      } catch (error) {
        toast.error(getErrorMessage(error));

        if (isMounted) {
          setVideoPreview({
            filename: "Lesson video attached",
            duration: "Attached",
            size: "Uploaded resource",
            previewUrl: "",
          });
        }
      }
    };

    loadVideoPreview();

    return () => {
      isMounted = false;
    };
  }, [videoFileId]);

  const handleVideoSelect = (file: File) => {
    const previewUrl = URL.createObjectURL(file);

    setVideoPreview({
      filename: file.name,
      duration: "Loading...",
      size: formatFileSize(file.size),
      previewUrl,
    });

    onVideoSelect(file);
  };

  const handleTogglePlay = async () => {
    const video = videoRef.current;

    if (!video || !videoPreview?.previewUrl) return;

    try {
      if (video.paused) {
        await video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleVideoVolumeChange = (value: string) => {
    const nextVolume = Number(value);

    setVideoVolume(nextVolume);
    setIsVideoMuted(nextVolume === 0);
  };

  const handleToggleVideoMute = () => {
    setIsVideoMuted((currentValue) => !currentValue);
  };

  const handleDeleteVideo = () => {
    const previewUrl = videoPreview?.previewUrl;

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setVideoPreview(null);
    setIsPlaying(false);
    onDeleteVideo();
  };

  return (
    <Card
      padding="lg"
      rounded="3xl"
      shadow="sm"
      className="border border-[#E2E8E1]"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-full bg-[#DDF3E8]">
          <Video className="size-4 text-[#007A4A]" />
        </div>

        <h2 className="text-lg font-bold text-[#202420]">Media Overview</h2>
      </div>

      <p className="text-[10px] font-bold uppercase text-[#66736B]">
        Lesson Title
      </p>

      <input
        type="text"
        value={title}
        disabled={disabled}
        placeholder="e.g., Greetings Basics"
        onChange={(event) => onTitleChange(event.target.value)}
        className="mt-3 w-full border-b border-[#D8E0D8] bg-transparent pb-3 text-2xl font-bold text-[#202420] outline-none placeholder:text-[#A8B2AA] disabled:cursor-not-allowed disabled:opacity-60 sm:text-3xl"
      />

      <div className="mt-7">
        {videoPreview || videoFileId ? (
          <div>
            <div className="relative mx-auto aspect-video w-full max-w-[760px] overflow-hidden rounded-3xl bg-black">
              {videoPreview?.previewUrl ? (
                <video
                  ref={videoRef}
                  src={videoPreview.previewUrl}
                  className="absolute inset-0 size-full object-contain"
                  preload="metadata"
                  playsInline
                  onLoadedMetadata={(event) => {
                    event.currentTarget.volume = videoVolume;
                    event.currentTarget.muted =
                      isVideoMuted || videoVolume === 0;

                    const duration = formatDuration(
                      event.currentTarget.duration,
                    );

                    setVideoPreview((currentPreview) =>
                      currentPreview
                        ? {
                            ...currentPreview,
                            duration,
                          }
                        : currentPreview,
                    );
                  }}
                  onEnded={() => setIsPlaying(false)}
                />
              ) : null}

              {isUploadingVideo ? (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
                  <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-[#202420]">
                          Uploading course video
                        </p>

                        <p className="mt-1 text-xs text-[#66736B]">
                          Please keep this page open.
                        </p>
                      </div>

                      <span className="text-lg font-extrabold text-[#007A4A]">
                        {Math.round(videoUploadProgress)}%
                      </span>
                    </div>

                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#E4ECE5]">
                      <div
                        className="h-full rounded-full bg-[#007A4A] transition-[width] duration-200"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, videoUploadProgress),
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="absolute inset-0 bg-black/15" />

              <button
                type="button"
                disabled={isUploadingVideo || !videoPreview?.previewUrl}
                onClick={handleTogglePlay}
                className="absolute left-1/2 top-1/2 z-20 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/35 backdrop-blur transition hover:bg-white/45 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? (
                  <Pause className="size-8 fill-white text-white" />
                ) : (
                  <Play className="ml-1 size-8 fill-white text-white" />
                )}
              </button>

              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-black/35 px-4 py-3 text-white backdrop-blur">
                <div className="grid gap-3 text-xs sm:grid-cols-[1fr_90px_90px_170px]">
                  <div>
                    <p className="text-[10px] text-white/70">FILENAME</p>
                    <p className="truncate">
                      {videoPreview?.filename || "Lesson video attached"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-white/70">Duration</p>
                    <p>{videoPreview?.duration || "Attached"}</p>
                  </div>

                  <div>
                    <p className="text-[10px] text-white/70">Size</p>
                    <p>{videoPreview?.size || "Uploaded resource"}</p>
                  </div>

                  <div>
                    <p className="text-[10px] text-white/70">Volume</p>

                    <div className="mt-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleToggleVideoMute}
                        className="text-white"
                        aria-label={
                          isVideoMuted ? "Unmute video" : "Mute video"
                        }
                      >
                        {isVideoMuted || videoVolume === 0 ? (
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
                        value={isVideoMuted ? 0 : videoVolume}
                        onChange={(event) =>
                          handleVideoVolumeChange(event.target.value)
                        }
                        className="w-full h-1 accent-white"
                        aria-label="Video volume"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                disabled={disabled}
                onClick={handleDeleteVideo}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#FFD8D3] px-5 text-sm font-semibold text-[#D83324] transition hover:bg-[#FFC7C0] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 className="size-4" />
                Delete Video
              </button>
            </div>
          </div>
        ) : (
          <FileUploader
            title={
              isUploadingVideo
                ? `Uploading Course Video ${Math.round(videoUploadProgress)}%`
                : "Upload Course Video"
            }
            description={
              isUploadingVideo
                ? "Please keep this page open while the video uploads."
                : "Drag & drop course video here or click to browse. Supported formats: MP4, MOV. Max size 500MB."
            }
            accept="video/mp4,video/quicktime"
            icon={<Video className="size-5" />}
            onFileSelect={(file) => {
              if (isUploadingVideo) return;

              handleVideoSelect(file);
            }}
          />
        )}
      </div>
    </Card>
  );
}
