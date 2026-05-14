"use client";

import { useRef, useState } from "react";

import Button from "@/components/UI/buttons/button";

import ColorPicker from "./color-picker";
import UploadedPdfCard from "./uploaded-pdf-card";
import FileUploader from "@/components/UI/uploaders/file-uploader";

interface Props {
  onPublish: () => void;
}

export default function SituationForm({ onPublish }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedColor, setSelectedColor] = useState("#DCEBF6");

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleReplace = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div>
        <h2 className="text-2xl font-bold text-[#202420]">
          Edit Situation: Bus & Tickets
        </h2>

        <p className="mt-1 text-sm text-[#66736B]">
          Update the content and resources for this module.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm text-[#66736B]">
          SITUATION NAME (ENGLISH)
        </label>

        <input
          defaultValue="Bus & Tickets"
          className="h-14 w-full rounded-full bg-[#F3F5F1] px-6 text-sm outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-[#66736B]">
          SUBTITLE (BENGALI)
        </label>

        <input
          defaultValue="বাস এবং টিকিট"
          className="h-14 w-full rounded-full bg-[#F3F5F1] px-6 text-sm outline-none"
        />
      </div>

      <div>
        <label className="mb-3 block text-sm text-[#66736B]">
          CARD STYLING (BACKGROUND COLOR)
        </label>

        <ColorPicker
          selectedColor={selectedColor}
          onChange={setSelectedColor}
        />
      </div>

      <div>
        <label className="mb-3 block text-sm text-[#66736B]">
          INSTRUCTIONAL RESOURCE
        </label>

        {uploadedFile ? (
          <>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (file) {
                  setUploadedFile(file);
                }
              }}
            />

            <UploadedPdfCard
              fileName={uploadedFile.name}
              fileSize={`${(uploadedFile.size / 1024 / 1024).toFixed(1)} MB`}
              onReplace={handleReplace}
              onDelete={() => setUploadedFile(null)}
            />
          </>
        ) : (
          <FileUploader
            title="Drag & drop instructional PDF here"
            description="MAX FILE SIZE 25MB • PDF ONLY"
            accept=".pdf"
            onFileSelect={(file) => setUploadedFile(file)}
          />
        )}
      </div>

      <div className="border-t border-[#EEF2EE] pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <button type="button" className="text-sm text-[#4D574F]">
            Discard Changes
          </button>

          <Button size="lg" className="px-10" onClick={onPublish}>
            PUBLISH TO APP ▷
          </Button>
        </div>
      </div>
    </div>
  );
}
