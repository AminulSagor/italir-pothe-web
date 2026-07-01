"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Loader2, Pause, Play, Volume2, VolumeX } from "lucide-react";

import type { FinalExamEvaluationAnswer } from "@/types/evaluation-center/evaluation-center.type";

interface AudioPlayerCardProps {
  answer: FinalExamEvaluationAnswer | null;

  audioUrl: string | null;
  isLoading: boolean;
  loadError?: string;
}

const formatTime = (value: number) => {
  const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0;

  const minutes = Math.floor(safeValue / 60);

  const seconds = Math.floor(safeValue % 60);

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

export default function AudioPlayerCard({
  answer,
  audioUrl,
  isLoading,
  loadError,
}: AudioPlayerCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const [isMuted, setIsMuted] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(answer?.durationSeconds || 0);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    setIsPlaying(false);
    setIsMuted(false);
    setCurrentTime(0);

    setDuration(answer?.durationSeconds || 0);
  }, [answer, audioUrl]);

  if (!answer) {
    return (
      <div className="rounded-[2rem] bg-[#006B3F] px-6 py-7 text-center text-sm text-white/70 shadow-lg">
        This exam does not contain a submitted speaking recording.
      </div>
    );
  }

  const playbackAvailable = Boolean(audioUrl) && !isLoading;

  const handlePlayPause = async () => {
    const audio = audioRef.current;

    if (!audio || !playbackAvailable) {
      return;
    }

    if (audio.paused) {
      await audio.play();
    } else {
      audio.pause();
    }
  };

  const handleProgressChange = (value: number) => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.currentTime = value;
    setCurrentTime(value);
  };

  const handleMuteToggle = () => {
    const audio = audioRef.current;

    if (!audio) return;

    const nextMuted = !audio.muted;

    audio.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="rounded-[2rem] bg-[#006B3F] px-6 py-5 shadow-lg">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentTime(0);
          }}
          onTimeUpdate={(event) =>
            setCurrentTime(event.currentTarget.currentTime)
          }
          onLoadedMetadata={(event) => {
            const metadataDuration = event.currentTarget.duration;

            setDuration(
              Number.isFinite(metadataDuration)
                ? metadataDuration
                : answer.durationSeconds,
            );
          }}
        />
      )}

      <div className="flex items-center gap-5">
        <button
          type="button"
          aria-label={
            isPlaying ? "Pause speaking recording" : "Play speaking recording"
          }
          disabled={!playbackAvailable}
          onClick={() => void handlePlayPause()}
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/15 text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLoading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="size-5 fill-white" />
          ) : (
            <Play className="size-5 fill-white" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center justify-between gap-4 text-xs font-bold text-white">
            <span className="truncate">
              {answer.question?.title || "Speaking submission"}
            </span>

            <span>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="relative">
            <div className="h-2 rounded-full bg-white/25">
              <div
                className="h-full rounded-full bg-[#59F94D]"
                style={{
                  width: `${Math.min(100, Math.max(0, progress))}%`,
                }}
              />
            </div>

            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={Math.min(currentTime, duration || 0)}
              disabled={!playbackAvailable || duration <= 0}
              onChange={(event) =>
                handleProgressChange(Number(event.target.value))
              }
              aria-label="Speaking recording progress"
              className="absolute inset-0 h-2 w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
            />
          </div>

          {isLoading && (
            <p className="mt-3 text-[11px] font-medium text-white/65">
              Generating secure playback URL...
            </p>
          )}

          {!isLoading && loadError && (
            <p className="mt-3 text-[11px] font-medium text-[#FFD8D8]">
              {loadError}
            </p>
          )}

          {!isLoading && !loadError && !audioUrl && (
            <p className="mt-3 text-[11px] font-medium text-white/65">
              No speaking audio file was attached to this answer.
            </p>
          )}
        </div>

        <button
          type="button"
          aria-label={
            isMuted ? "Unmute speaking recording" : "Mute speaking recording"
          }
          disabled={!playbackAvailable}
          onClick={handleMuteToggle}
          className="text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isMuted ? (
            <VolumeX className="size-5" />
          ) : (
            <Volume2 className="size-5" />
          )}
        </button>

        {audioUrl ? (
          <a
            href={audioUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Download speaking recording"
            className="text-white"
          >
            <Download className="size-5" />
          </a>
        ) : (
          <button
            type="button"
            disabled
            aria-label="Download speaking recording unavailable"
            className="text-white opacity-40"
          >
            <Download className="size-5" />
          </button>
        )}
      </div>
    </div>
  );
}
