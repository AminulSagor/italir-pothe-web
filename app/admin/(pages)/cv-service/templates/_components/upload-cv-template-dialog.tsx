"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
} from "react";
import {
  FileImage,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";
import { createCvTemplate } from "@/service/cv-template/cv_template";
import { uploadCvTemplateThumbnail } from "@/service/files/file_upload";

interface UploadCVTemplateDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const allowedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const getErrorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "CV template could not be uploaded.";

const validateImage = (file: File) => {
  if (!allowedImageTypes.has(file.type)) {
    return "Only JPG, PNG, and WebP images are allowed.";
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return "The image size must not exceed 5 MB.";
  }

  return "";
};

export default function UploadCVTemplateDialog({
  open,
  onClose,
  onCreated,
}: UploadCVTemplateDialogProps) {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);

    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  const resetForm = () => {
    setName("");
    setImageFile(null);
    setValidationError("");
  };

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    resetForm();
    onClose();
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0] ?? null;

    setValidationError("");

    if (!selectedFile) {
      setImageFile(null);
      return;
    }

    const fileError = validateImage(selectedFile);

    if (fileError) {
      setImageFile(null);
      setValidationError(fileError);
      event.target.value = "";
      return;
    }

    setImageFile(selectedFile);
  };

  const handleSubmit = async () => {
    const normalizedName = name.trim();

    if (!normalizedName) {
      setValidationError("Template name is required.");
      return;
    }

    if (!imageFile) {
      setValidationError("Please select a CV template image.");
      return;
    }

    const fileError = validateImage(imageFile);

    if (fileError) {
      setValidationError(fileError);
      return;
    }

    setValidationError("");
    setIsSubmitting(true);

    const toastId = toast.loading(
      "Uploading CV template...",
    );

    try {
      const imageUrl =
        await uploadCvTemplateThumbnail(imageFile);

      await createCvTemplate({
        name: normalizedName,
        imageUrl,
      });

      toast.success("CV template uploaded successfully.", {
        id: toastId,
      });

      resetForm();
      onCreated();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      size="lg"
      className="p-0"
    >
      <div className="relative p-7 sm:p-9">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleClose}
          className="absolute right-7 top-7 flex size-10 items-center justify-center rounded-full bg-[#EEF3EB] text-black/60 transition hover:bg-[#E2EAE0] disabled:opacity-50"
          aria-label="Close upload dialog"
        >
          <X className="size-5" />
        </button>

        <span className="inline-flex rounded-full bg-[#DDF8D5] px-4 py-1 text-xs font-bold uppercase text-[#008542]">
          CV Templates
        </span>

        <h2 className="mt-4 text-3xl font-bold text-[#006B3F]">
          Upload CV Template
        </h2>

        <p className="mt-2 max-w-[440px] text-sm leading-6 text-black/55">
          Add a template name and upload an image of the CV
          design.
        </p>

        <div className="mt-8">
          <label
            htmlFor="cv-template-name"
            className="mb-2 block text-sm font-bold text-[#202420]"
          >
            Template Name
          </label>

          <input
            id="cv-template-name"
            type="text"
            maxLength={160}
            value={name}
            disabled={isSubmitting}
            onChange={(event) => {
              setName(event.target.value);
              setValidationError("");
            }}
            placeholder="e.g., Modern Professional CV"
            className="h-12 w-full rounded-full bg-[#EEF3EB] px-5 text-sm outline-none placeholder:text-black/30 disabled:opacity-60"
          />
        </div>

        <div className="mt-7">
          <label className="mb-2 block text-sm font-bold text-[#202420]">
            CV Template Image
          </label>

          <label
            className={`flex min-h-[170px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 text-center transition ${
              imageFile
                ? "border-[#56CF81] bg-[#F2FFF6]"
                : "border-black/10 bg-[#F8FAF7] hover:border-[#56CF81]"
            } ${
              isSubmitting
                ? "pointer-events-none opacity-60"
                : ""
            }`}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={isSubmitting}
              onChange={handleFileChange}
              className="sr-only"
            />

            <span className="flex size-14 items-center justify-center rounded-2xl bg-[#E6F6F0] text-[#007A4D]">
              {imageFile ? (
                <FileImage className="size-6" />
              ) : (
                <Upload className="size-6" />
              )}
            </span>

            <p className="mt-4 text-sm font-bold text-[#202420]">
              {imageFile
                ? imageFile.name
                : "Select CV template image"}
            </p>

            <p className="mt-1 text-xs text-black/45">
              JPG, PNG or WebP · Maximum 5 MB
            </p>
          </label>
        </div>

        {previewUrl && (
          <div className="mt-7">
            <p className="mb-2 text-sm font-bold text-[#202420]">
              Image Preview
            </p>

            <div className="flex h-[300px] items-center justify-center overflow-hidden rounded-3xl border border-black/5 bg-[#F6F7F4]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Selected CV template preview"
                className="h-full w-full object-contain p-3"
              />
            </div>
          </div>
        )}

        {validationError && (
          <p className="mt-5 text-sm font-medium text-[#D92D20]">
            {validationError}
          </p>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Button
            variant="outline"
            rounded="full"
            size="lg"
            disabled={isSubmitting}
            onClick={handleClose}
          >
            Cancel
          </Button>

          <Button
            rounded="full"
            size="lg"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="min-w-[220px] gap-2 shadow-lg"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}

            {isSubmitting
              ? "Uploading Template..."
              : "Upload Template"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}