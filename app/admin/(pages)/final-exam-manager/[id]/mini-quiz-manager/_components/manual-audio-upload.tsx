import { CloudUpload, FileAudio, Trash2 } from "lucide-react";

interface ManualAudioUploadProps {
  mediaFileId: string;
  mediaUrl: string;
  isUploading?: boolean;
  onFileSelect: (file: File) => void;
  onRemoveAudio: () => void;
}

const ManualAudioUpload = ({
  mediaFileId,
  mediaUrl,
  isUploading = false,
  onFileSelect,
  onRemoveAudio,
}: ManualAudioUploadProps) => {
  if (mediaFileId) {
    return (
      <div className="rounded-3xl border border-[#D8DFD6] bg-[#F7FBF5] p-5">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-[#E6F8E7]">
              <FileAudio className="size-5 text-[#006B3F]" />
            </div>

            <div>
              <p className="text-sm font-bold text-[#202420]">Audio attached</p>
              <p className="text-xs text-[#6F7673]">
                Uploaded listening question audio
              </p>
            </div>
          </div>

          <button type="button" onClick={onRemoveAudio}>
            <Trash2 className="size-4 text-[#D92D20]" />
          </button>
        </div>

        {mediaUrl ? (
          <audio src={mediaUrl} controls className="w-full" />
        ) : (
          <p className="text-sm text-[#6F7673]">Preparing playable URL...</p>
        )}

        <label className="mt-5 inline-flex cursor-pointer rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#006B3F]">
          {isUploading ? "Uploading..." : "Replace Audio"}

          <input
            type="file"
            accept="audio/mpeg,audio/wav,audio/aac,audio/x-wav"
            disabled={isUploading}
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                onFileSelect(file);
              }

              event.target.value = "";
            }}
          />
        </label>
      </div>
    );
  }

  return (
    <label className="block cursor-pointer rounded-3xl border-2 border-dashed border-[#D8DFD6] px-6 py-10 text-center transition hover:border-[#006B3F]">
      <CloudUpload className="mx-auto size-6 text-[#006B3F]" />

      <p className="mt-3 text-sm text-[#6F7673]">
        {isUploading ? "Uploading..." : "Drag audio or browse"}
      </p>

      <input
        type="file"
        accept="audio/mpeg,audio/wav,audio/aac,audio/x-wav"
        disabled={isUploading}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            onFileSelect(file);
          }

          event.target.value = "";
        }}
      />
    </label>
  );
};

export default ManualAudioUpload;
