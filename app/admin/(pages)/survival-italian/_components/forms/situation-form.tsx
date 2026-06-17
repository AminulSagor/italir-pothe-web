"use client";

import { useEffect, useRef, useState } from "react";
import { FileText } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import FileUploader from "@/components/UI/uploaders/file-uploader";
import type {
  SurvivalSituation,
  UpdateSurvivalSituationPayload,
} from "@/types/survival-italian/survival-italian.type";

import { getSurvivalPdfFileName } from "../../_utils/survival-italian-ui.util";
import ColorPicker from "./color-picker";
import UploadedPdfCard from "./uploaded-pdf-card";

interface Props {
  situation: SurvivalSituation | null;
  selectedIconKey: string;
  selectedColor: string;
  error?: string;
  isSaving?: boolean;
  onColorChange: (color: string) => void;
  onDiscard: () => void;
  onPublish: (
    payload: UpdateSurvivalSituationPayload,
    uploadedPdf: File | null,
  ) => Promise<void>;
}

const defaultCardVariant = "normal";

export default function SituationForm({
  situation,
  selectedIconKey,
  selectedColor,
  error = "",
  isSaving = false,
  onColorChange,
  onDiscard,
  onPublish,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [subtitleBn, setSubtitleBn] = useState("");
  const [cardVariant, setCardVariant] = useState(defaultCardVariant);
  const [sortOrder, setSortOrder] = useState(1);
  const [resourceFileId, setResourceFileId] = useState<
    string | null | undefined
  >(undefined);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    setTitle(situation?.title || "");
    setSubtitleBn(situation?.subtitleBn || "");
    setCardVariant(situation?.cardVariant || defaultCardVariant);
    setSortOrder(situation?.sortOrder || 1);
    setResourceFileId(situation ? situation.resourceFileId : undefined);
    setUploadedFile(null);
  }, [situation]);

  const existingFileName = situation ? getSurvivalPdfFileName(situation) : "";
  const shownPdfName =
    uploadedFile?.name || (resourceFileId ? existingFileName : "");
  const shownPdfSize = uploadedFile
    ? `${(uploadedFile.size / 1024 / 1024).toFixed(1)} MB`
    : "PDF attached";

  const handlePublish = () => {
    const trimmedTitle = title.trim();
    const trimmedSubtitleBn = subtitleBn.trim();

    onPublish(
      {
        title: trimmedTitle,
        ...(trimmedSubtitleBn ? { subtitleBn: trimmedSubtitleBn } : {}),
        iconKey: selectedIconKey,
        cardColor: selectedColor,
        cardVariant,
        ...(resourceFileId !== undefined ? { resourceFileId } : {}),
        sortOrder,
      },
      uploadedFile,
    );
  };

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div>
        <h2 className="text-2xl font-bold text-[#202420]">
          {situation
            ? `Edit Situation: ${situation.title}`
            : "Add New Situation"}
        </h2>

        <p className="mt-1 text-sm text-[#66736B]">
          Update the content and resources for this module.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-[#F7C6C7] bg-[#FFF8F8] px-4 py-3 text-sm text-[#D92D20]">
          {error}
        </div>
      ) : null}

      <div>
        <label className="mb-2 block text-sm text-[#66736B]">
          SITUATION NAME (ENGLISH)
        </label>

        <input
          value={title}
          disabled={isSaving}
          onChange={(event) => setTitle(event.target.value)}
          className="h-14 w-full rounded-full bg-[#F3F5F1] px-6 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-[#66736B]">
          SUBTITLE (BENGALI)
        </label>

        <input
          value={subtitleBn}
          disabled={isSaving}
          onChange={(event) => setSubtitleBn(event.target.value)}
          className="h-14 w-full rounded-full bg-[#F3F5F1] px-6 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div>
        <label className="mb-3 block text-sm text-[#66736B]">
          CARD STYLING (BACKGROUND COLOR)
        </label>

        <ColorPicker selectedColor={selectedColor} onChange={onColorChange} />
      </div>

      <div>
        <label className="mb-3 block text-sm text-[#66736B]">
          INSTRUCTIONAL RESOURCE
        </label>

        {shownPdfName ? (
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
                  setResourceFileId(undefined);
                }
              }}
            />

            <UploadedPdfCard
              fileName={shownPdfName}
              fileSize={shownPdfSize}
              onReplace={() => inputRef.current?.click()}
              onDelete={() => {
                setUploadedFile(null);
                setResourceFileId(situation ? null : undefined);
              }}
            />
          </>
        ) : (
          <FileUploader
            title="Drag & drop instructional PDF here"
            description="or browse files from your computer"
            accept=".pdf"
            icon={<FileText className="size-5 text-[#D92D20]" />}
            onFileSelect={(file) => {
              setUploadedFile(file);
              setResourceFileId(undefined);
            }}
          />
        )}
      </div>

      <div className="border-t border-[#EEF2EE] pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <button
            type="button"
            disabled={isSaving}
            className="text-sm text-[#4D574F] disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onDiscard}
          >
            Discard Changes
          </button>

          <Button
            size="lg"
            disabled={isSaving || !title.trim()}
            className="px-10"
            onClick={handlePublish}
          >
            {isSaving ? "PUBLISHING..." : "PUBLISH TO APP ▷"}
          </Button>
        </div>
      </div>
    </div>
  );
}
