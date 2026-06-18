import { serviceClient } from "@/service/base/service_client";

export type FilePurpose =
  | "course_cover"
  | "lesson_video"
  | "lesson_audio"
  | "lesson_image"
  | "lesson_pdf"
  | "quiz_audio"
  | "quiz_image"
  | "exam_speaking_audio"
  | "certificate_pdf"
  | "survival_audio"
  | "survival_image"
  | "survival_pdf"
  | "skill_builder_video"
  | "skill_builder_audio"
  | "skill_builder_pdf"
  | "caf_hero_video"
  | "caf_checklist_pdf"
  | "profile_avatar"
  | "webinar_thumbnail" 
  | "cv_template_thumbnail";
export type FileVisibility = "private" | "public";
export type MediaType = "image" | "audio" | "video" | "pdf";

export interface SignedUploadUrlPayload {
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  filePurpose: FilePurpose;
  visibility?: FileVisibility;
}

export interface SignedUploadUrlResponse {
  storageKey: string;
  publicUrl: string;
  signedUploadUrl: string;
  method: "PUT";
  headers: {
    "Content-Type": string;
  };
  expiresInSeconds: number;
  maxSizeBytes: number;
}

export interface ConfirmUploadPayload extends SignedUploadUrlPayload {
  storageKey: string;
  title?: string;
  mediaType?: MediaType;
}

export interface ConfirmUploadResponse {
  message: string;
  file: {
    id: string;
    storageKey: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    filePurpose: string;
    visibility: string;
    uploadStatus: string;
  };
  publicUrl: string;
  mediaAsset: unknown | null;
}

export interface SignedReadUrlResponse {
  fileId: string;
  storageKey: string;
  publicUrl: string;
  signedReadUrl: string;
  expiresInSeconds: number;
}

export const createSignedUploadUrl = (payload: SignedUploadUrlPayload) =>
  serviceClient.post<SignedUploadUrlResponse>(
    "/files/signed-upload-url",
    payload,
  );

export const confirmUpload = (payload: ConfirmUploadPayload) =>
  serviceClient.post<ConfirmUploadResponse>("/files/confirm-upload", payload);

export const createSignedReadUrl = (fileId: string) =>
  serviceClient.get<SignedReadUrlResponse>(`/files/${fileId}/signed-read-url`);

export const uploadToSignedUrl = async (
  signedUploadUrl: string,
  file: File,
  contentType: string,
) => {
  const response = await fetch(signedUploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Thumbnail upload failed. Please try again.");
  }
};

const uploadImageFile = async (file: File, filePurpose: FilePurpose) => {
  const visibility: FileVisibility = "public";
  const mimeType = file.type || "image/png";

  const signedUpload = await createSignedUploadUrl({
    originalName: file.name,
    mimeType,
    sizeBytes: file.size,
    filePurpose,
    visibility,
  });

  await uploadToSignedUrl(signedUpload.signedUploadUrl, file, mimeType);

  const confirmedUpload = await confirmUpload({
    storageKey: signedUpload.storageKey,
    originalName: file.name,
    mimeType,
    sizeBytes: file.size,
    filePurpose,
    visibility,
    mediaType: "image",
    title: file.name,
  });

  return confirmedUpload.publicUrl || signedUpload.publicUrl;
};

export const uploadWebinarThumbnail = async (file: File) =>
  uploadImageFile(file, "webinar_thumbnail");

export const uploadCvTemplateThumbnail = async (file: File) =>
  uploadImageFile(file, "cv_template_thumbnail");
