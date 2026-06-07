"use client";

import { ReactNode, useRef } from "react";
import { Upload } from "lucide-react";

interface FileUploaderProps {
  title: string;
  description: string;
  accept?: string;
  icon?: ReactNode;
  className?: string;
  previewUrl?: string;
  previewAlt?: string;
  onFileSelect?: (file: File) => void;
}

export default function FileUploader({
  title,
  description,
  accept,
  icon,
  className = "",
  previewUrl,
  previewAlt = "Selected file preview",
  onFileSelect,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      onFileSelect?.(file);
    }
  };

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className={`flex min-h-40 w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-[#AFC4B5] bg-[#F9FCF7] px-6 py-8 text-center transition hover:bg-[#F3F8F1] ${className}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />

      {previewUrl ? (
        <div className="w-full">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#EEF3EC]">
            <img
              src={previewUrl}
              alt={previewAlt}
              className="h-full w-full object-cover"
            />
          </div>

          <h4 className="mt-4 text-sm font-bold text-[#202420]">{title}</h4>
          <p className="mt-1 text-xs leading-5 text-[#66736B]">
            {description}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-[#EEF3EC] text-[#6B776F]">
            {icon ?? <Upload className="size-5" />}
          </div>

          <h4 className="text-sm font-bold text-[#202420]">{title}</h4>
          <p className="mt-1 max-w-xs text-xs leading-5 text-[#66736B]">
            {description}
          </p>
        </>
      )}
    </button>
  );
}
