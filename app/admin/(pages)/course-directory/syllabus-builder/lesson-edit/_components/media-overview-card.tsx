"use client";

import { useEffect, useState } from "react";
import { Play, Trash2, Video } from "lucide-react";

import Card from "@/components/UI/cards/card";
import FileUploader from "@/components/UI/uploaders/file-uploader";
import { LessonEditMock } from "@/mock/syllabus-lesson-edit/syllabus-lesson-edit.types";

interface MediaOverviewCardProps {
  lesson: LessonEditMock;
}

interface UploadedVideo {
  filename: string;
  duration: string;
  size: string;
  previewUrl: string;
}

export default function MediaOverviewCard({ lesson }: MediaOverviewCardProps) {
  const [uploadedVideo, setUploadedVideo] = useState<UploadedVideo | null>(
    lesson.video
      ? {
          filename: lesson.video.filename,
          duration: lesson.video.duration,
          size: lesson.video.size,
          previewUrl: lesson.video.thumbnail,
        }
      : null,
  );

  useEffect(() => {
    return () => {
      if (uploadedVideo?.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(uploadedVideo.previewUrl);
      }
    };
  }, [uploadedVideo]);

  const handleVideoSelect = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    const sizeInMb = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    setUploadedVideo({
      filename: file.name,
      duration: "02:45",
      size: sizeInMb,
      previewUrl,
    });
  };

  const handleDeleteVideo = () => {
    if (uploadedVideo?.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(uploadedVideo.previewUrl);
    }

    setUploadedVideo(null);
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

      <h3 className="mt-3 border-b border-[#D8E0D8] pb-3 text-2xl font-bold text-[#202420] sm:text-3xl">
        {lesson.title}
      </h3>

      <div className="mt-7">
        {uploadedVideo ? (
          <div>
            <div className="relative flex min-h-52 overflow-hidden rounded-3xl bg-black">
              <video
                src={uploadedVideo.previewUrl}
                className="absolute inset-0 size-full object-cover"
                muted
              />

              <div className="absolute inset-0 bg-black/15" />

              <div className="relative z-10 m-auto flex size-16 items-center justify-center rounded-full bg-white/35 backdrop-blur">
                <Play className="ml-1 size-8 fill-white text-white" />
              </div>

              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-black/35 px-4 py-3 text-white backdrop-blur">
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="text-[10px] text-white/70">FILENAME</p>
                    <p className="truncate">{uploadedVideo.filename}</p>
                  </div>

                  <div>
                    <p className="text-[10px] text-white/70">Duration</p>
                    <p>{uploadedVideo.duration}</p>
                  </div>

                  <div>
                    <p className="text-[10px] text-white/70">Size</p>
                    <p>{uploadedVideo.size}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleDeleteVideo}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#FFD8D3] px-5 text-sm font-semibold text-[#D83324] transition hover:bg-[#FFC7C0]"
              >
                <Trash2 className="size-4" />
                Delete Video
              </button>
            </div>
          </div>
        ) : (
          <FileUploader
            title="Upload Course Video"
            description="Drag & drop course video here or click to browse. Supported formats: MP4, MOV. Max size 500MB."
            accept="video/mp4,video/quicktime"
            icon={<Video className="size-5" />}
            onFileSelect={handleVideoSelect}
          />
        )}
      </div>
    </Card>
  );
}
