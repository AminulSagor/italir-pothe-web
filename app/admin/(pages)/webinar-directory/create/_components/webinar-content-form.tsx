"use client";

import { CalendarDays, Clock3, Presentation } from "lucide-react";

import BackButton from "@/components/UI/buttons/back-button";
import Card from "@/components/UI/cards/card";
import FileUploader from "@/components/UI/uploaders/file-uploader";

const WebinarContentForm = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-[#66736B]">
        <BackButton />

        <span>Webinars</span>

        <span>›</span>

        <span className="font-semibold text-[#006B3F]">Create</span>
      </div>

      <h1 className="text-2xl font-semibold text-[#006339]">
        Schedule New Webinar
      </h1>

      <Card padding="lg" rounded="3xl" shadow="sm">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#E8F3ED]">
            <Presentation className="size-5 text-[#006B3F]" />
          </div>

          <h2 className="text-lg font-semibold text-[#202420]">
            Webinar Content
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="mb-3 block text-sm font-medium text-[#202420]">
              Webinar Title
            </label>

            <input
              type="text"
              placeholder="e.g., Grammar Bootcamp: Past Tense"
              className="h-14 w-full rounded-2xl border border-[#E4EBE5] bg-[#F8FBF7] px-5 text-sm outline-none transition focus:border-[#006B3F]"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-3 block text-sm font-medium text-[#202420]">
                Start Date
              </label>

              <div className="relative">
                <CalendarDays className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-[#006B3F]" />

                <input
                  type="date"
                  className="h-14 w-full rounded-2xl border border-[#E4EBE5] bg-[#F8FBF7] pl-14 pr-5 text-sm outline-none transition focus:border-[#006B3F]"
                />
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-[#202420]">
                Time (CET)
              </label>

              <div className="relative">
                <Clock3 className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-[#006B3F]" />

                <input
                  type="time"
                  className="h-14 w-full rounded-2xl border border-[#E4EBE5] bg-[#F8FBF7] pl-14 pr-5 text-sm outline-none transition focus:border-[#006B3F]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-[#202420]">
              Host / Teacher
            </label>

            <select className="h-14 w-full rounded-2xl border border-[#E4EBE5] bg-[#F8FBF7] px-5 text-sm outline-none transition focus:border-[#006B3F]">
              <option>Select a certified instructor</option>
              <option>Mario Rossi</option>
              <option>Sofia Bianchi</option>
              <option>Luigi Moretti</option>
            </select>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-[#202420]">
              Thumbnail Upload
            </label>

            <FileUploader
              accept="image/*"
              className="min-h-[220px]"
              title="Drag & drop thumbnail image (16:9)"
              description="or click to browse local files (Max 5MB)"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WebinarContentForm;
