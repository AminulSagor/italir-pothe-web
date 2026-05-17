"use client";

import { BookOpen, FileText } from "lucide-react";

import Card from "@/components/UI/cards/card";
import FileUploader from "@/components/UI/uploaders/file-uploader";

export default function TheoryBookResourceCard() {
  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="mb-8 flex gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#EDF6EF]">
          <BookOpen className="size-6 text-[#006B3F]" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#202420]">
            Theory Book Resource
          </h2>

          <p className="mt-1 text-sm text-[#6D756E]">
            Manage the primary theoretical companion for this track.
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium uppercase tracking-wide text-[#7A837B]">
          Instructional Resource
        </p>
      </div>

      <FileUploader
        title="Drag & drop instructional PDF here"
        description="or browse files from your computer

MAX FILE SIZE 25MB • PDF ONLY"
        accept=".pdf"
        icon={<FileText className="size-5 text-[#C43B31]" />}
        className="min-h-[230px] border-[#C6D4C8] bg-[#FCFDFC]"
      />
    </Card>
  );
}
