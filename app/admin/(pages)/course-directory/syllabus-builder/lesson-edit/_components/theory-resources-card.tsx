"use client";

import { useState } from "react";
import {
  Bold,
  FileImage,
  Italic,
  Link,
  List,
  ListOrdered,
  Play,
  Underline,
} from "lucide-react";

import Card from "@/components/UI/cards/card";
import FileUploader from "@/components/UI/uploaders/file-uploader";
import { LessonEditMock } from "@/mock/syllabus-lesson-edit/syllabus-lesson-edit.types";

interface TheoryResourcesCardProps {
  lesson: LessonEditMock;
}

function EditorBox({
  value,
  onChange,
  muted = false,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  muted?: boolean;
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
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`min-h-32 w-full resize-none bg-white px-4 py-4 text-sm leading-6 outline-none ${
          muted
            ? "text-[#66736B] placeholder:text-[#A8B2AA]"
            : "text-[#202420] placeholder:text-[#A8B2AA]"
        }`}
      />
    </div>
  );
}

export default function TheoryResourcesCard({
  lesson,
}: TheoryResourcesCardProps) {
  const [theoryText, setTheoryText] = useState(lesson.theoryText);
  const [bengaliTranslation, setBengaliTranslation] = useState(
    lesson.bengaliTranslation,
  );

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
        onChange={setTheoryText}
        placeholder="Write lesson theory here..."
      />

      <div className="my-8 rounded-3xl border border-[#DDE6DD] bg-[#EEF5EC] p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <button className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#007A4A] text-white">
            <Play className="ml-0.5 size-5 fill-white" />
          </button>

          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-[#202420]">
              Listen to Italian Theory
            </h4>
            <p className="text-xs text-[#66736B]">AI Voice Preview</p>
          </div>

          <div className="flex flex-1 items-center gap-3">
            <div className="h-1 flex-1 rounded-full bg-[#B7C8BB]">
              <div className="relative h-1 w-1/2 rounded-full bg-[#007A4A]">
                <span className="absolute right-0 top-1/2 size-2 -translate-y-1/2 rounded-full bg-[#007A4A]" />
              </div>
            </div>

            <span className="whitespace-nowrap text-xs text-[#202420]">
              {lesson.audioProgress} / {lesson.audioDuration}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-full bg-[#FBE4E4]">
          <span className="text-sm font-bold text-[#B64A4A]">文</span>
        </div>
        <h3 className="text-sm font-bold text-[#202420]">
          Bengali Translation
        </h3>
      </div>

      <EditorBox
        value={bengaliTranslation}
        onChange={setBengaliTranslation}
        muted
        placeholder="Write Bengali translation here..."
      />

      <div className="mt-8">
        <FileUploader
          title="Upload Supplementary Material"
          description="Drag and drop a PDF file here, or click to browse. Max size 10MB."
          accept="application/pdf"
          icon={<FileImage className="size-5" />}
        />
      </div>
    </Card>
  );
}
