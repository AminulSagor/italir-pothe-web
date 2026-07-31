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
  | "cv_template_thumbnail"
  | "notification_image";

export type FileVisibility = "private" | "public";
export type MediaType = "image" | "audio" | "video" | "pdf";

export type UploadProgressCallback = (percentage: number) => void;

export type MultipartVideoPurpose =
  | "lesson_video"
  | "skill_builder_video"
  | "caf_hero_video";

const DEFAULT_MAX_VIDEO_UPLOAD_BYTES = 2 * 1024 * 1024 * 1024;
const MULTIPART_UPLOAD_CONCURRENCY = 4;
const MULTIPART_UPLOAD_MAXIMUM_ATTEMPTS = 3;

const configuredMaxVideoUploadBytes = Number(
  process.env.NEXT_PUBLIC_MAX_VIDEO_UPLOAD_BYTES ??
    DEFAULT_MAX_VIDEO_UPLOAD_BYTES,
);

export const maxVideoUploadBytes =
  Number.isSafeInteger(configuredMaxVideoUploadBytes) &&
  configuredMaxVideoUploadBytes > 0
    ? configuredMaxVideoUploadBytes
    : DEFAULT_MAX_VIDEO_UPLOAD_BYTES;

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
  durationSeconds?: number;
  thumbnailFileId?: string;
}

export interface MediaAssetResponse {
  id: string;
  fileId: string;
  title: string | null;
  mediaType: MediaType;
  durationSeconds: number | null;
  thumbnailFileId: string | null;
  transcodeStatus?:
    | "not_required"
    | "pending"
    | "processing"
    | "ready"
    | "failed";
  hlsMasterKey?: string | null;
  status: "active" | "archived";
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
  mediaAsset: MediaAssetResponse | null;
}

export interface SignedReadUrlResponse {
  fileId: string;
  storageKey: string;
  publicUrl: string;
  signedReadUrl: string;
  expiresInSeconds: number;
}

export interface UploadedNotificationImage {
  fileId: string;
  publicUrl: string;
}

export interface InitiateMultipartUploadResponse {
  sessionId: string;
  storageKey: string;
  partSizeBytes: number;
  totalParts: number;
  expiresAt: string;
  maxSizeBytes: number;
}

export interface SignedMultipartPart {
  partNumber: number;
  signedUploadUrl: string;
}

export interface SignedMultipartPartsResponse {
  sessionId: string;
  parts: SignedMultipartPart[];
  expiresInSeconds: number;
}

export interface CompletedMultipartPart {
  partNumber: number;
  eTag: string;
}

export interface CompleteMultipartUploadPayload {
  parts: CompletedMultipartPart[];
  title?: string;
  durationSeconds?: number;
  thumbnailFileId?: string;
}

export interface UploadVideoMultipartParams {
  file: File;
  filePurpose: MultipartVideoPurpose;
  visibility?: FileVisibility;
  title?: string;
  durationSeconds?: number;
  thumbnailFileId?: string;
  onProgress?: UploadProgressCallback;
}

/**
 * Requests a normal signed S3 PUT URL.
 *
 * Use this for images, audio, PDFs and small files.
 * Large videos use the multipart methods below.
 */
export const createSignedUploadUrl = (payload: SignedUploadUrlPayload) =>
  serviceClient.post<SignedUploadUrlResponse>(
    "/files/signed-upload-url",
    payload,
  );

/**
 * Confirms a normal single-PUT upload after S3 finishes receiving it.
 */
export const confirmUpload = (payload: ConfirmUploadPayload) =>
  serviceClient.post<ConfirmUploadResponse>("/files/confirm-upload", payload);

export const createSignedReadUrl = (fileId: string) =>
  serviceClient.get<SignedReadUrlResponse>(`/files/${fileId}/signed-read-url`);

/**
 * Uploads a complete small file through one signed S3 PUT request.
 */
export const uploadToSignedUrl = (
  signedUploadUrl: string,
  file: File,
  contentType: string,
  onProgress?: UploadProgressCallback,
): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.open("PUT", signedUploadUrl);

    request.setRequestHeader("Content-Type", contentType);

    request.upload.onprogress = (event: ProgressEvent<EventTarget>) => {
      if (!event.lengthComputable || event.total <= 0) {
        return;
      }

      const percentage = Math.min(
        100,
        Math.round((event.loaded / event.total) * 100),
      );

      onProgress?.(percentage);
    };

    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        onProgress?.(100);
        resolve();
        return;
      }

      reject(new Error(`File upload failed with status ${request.status}.`));
    };

    request.onerror = () => {
      reject(new Error("File upload failed because of a network error."));
    };

    request.onabort = () => {
      reject(new Error("File upload was cancelled."));
    };

    request.send(file);
  });

/**
 * Creates an S3 multipart upload session through the backend.
 */
export const initiateMultipartUpload = (payload: SignedUploadUrlPayload) =>
  serviceClient.post<InitiateMultipartUploadResponse>(
    "/files/multipart/initiate",
    payload,
  );

/**
 * Requests signed S3 URLs for selected multipart part numbers.
 */
export const signMultipartParts = (sessionId: string, partNumbers: number[]) =>
  serviceClient.post<SignedMultipartPartsResponse>(
    `/files/multipart/${sessionId}/sign-parts`,
    {
      partNumbers,
    },
  );

/**
 * Completes an S3 multipart upload and creates the file/media records.
 */
export const completeMultipartUpload = (
  sessionId: string,
  payload: CompleteMultipartUploadPayload,
) =>
  serviceClient.post<ConfirmUploadResponse>(
    `/files/multipart/${sessionId}/complete`,
    payload,
  );

/**
 * Cancels an incomplete multipart upload.
 */
export const abortMultipartUpload = (sessionId: string) =>
  serviceClient.delete<{
    message: string;
    sessionId: string;
  }>(`/files/multipart/${sessionId}`);

/**
 * Uploads one video chunk directly to S3.
 *
 * S3 returns an ETag for each uploaded part. The ETag is required
 * when completing the multipart upload.
 */
const uploadMultipartPart = (
  signedUploadUrl: string,
  part: Blob,
  onProgress: (loadedBytes: number) => void,
): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.open("PUT", signedUploadUrl);

    request.upload.onprogress = (event: ProgressEvent<EventTarget>) => {
      if (!event.lengthComputable) {
        return;
      }

      onProgress(event.loaded);
    };

    request.onload = () => {
      if (request.status < 200 || request.status >= 300) {
        reject(
          new Error(
            `Multipart part upload failed with status ${request.status}.`,
          ),
        );
        return;
      }

      const eTag = request.getResponseHeader("ETag");

      if (!eTag) {
        reject(
          new Error(
            "S3 did not expose the uploaded part ETag. Confirm that ETag is included in the bucket CORS ExposeHeaders configuration.",
          ),
        );
        return;
      }

      onProgress(part.size);
      resolve(eTag);
    };

    request.onerror = () => {
      reject(
        new Error("Multipart part upload failed because of a network error."),
      );
    };

    request.onabort = () => {
      reject(new Error("Multipart part upload was cancelled."));
    };

    /*
     * Do not manually set Content-Type here.
     * The signed UploadPart request does not sign a Content-Type header.
     */
    request.send(part);
  });

/**
 * Retries one failed multipart part without restarting the full video.
 */
const uploadPartWithRetry = async (params: {
  signedUploadUrl: string;
  part: Blob;
  onProgress: (loadedBytes: number) => void;
  maximumAttempts?: number;
}): Promise<string> => {
  const maximumAttempts =
    params.maximumAttempts ?? MULTIPART_UPLOAD_MAXIMUM_ATTEMPTS;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
    try {
      return await uploadMultipartPart(
        params.signedUploadUrl,
        params.part,
        params.onProgress,
      );
    } catch (error) {
      lastError = error;

      /*
       * Reset the progress for this part before retrying it.
       */
      params.onProgress(0);

      if (attempt < maximumAttempts) {
        await new Promise<void>((resolve) => {
          window.setTimeout(resolve, attempt * 1_000);
        });
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Multipart part upload failed.");
};

/**
 * Uploads a large video using S3 multipart upload.
 *
 * Flow:
 * 1. Initiate the backend/S3 multipart session.
 * 2. Divide the file into chunks.
 * 3. Request signed part URLs in batches.
 * 4. Upload four parts concurrently.
 * 5. Send all part ETags to the backend.
 * 6. Complete and verify the upload.
 */
export const uploadVideoMultipart = async (
  params: UploadVideoMultipartParams,
): Promise<ConfirmUploadResponse> => {
  if (!params.file) {
    throw new Error("A video file is required.");
  }

  if (!Number.isSafeInteger(params.file.size) || params.file.size <= 0) {
    throw new Error("The selected video file is empty or invalid.");
  }

  if (params.file.size > maxVideoUploadBytes) {
    throw new Error("The selected video must not exceed 2 GiB.");
  }

  const allowedVideoMimeTypes = ["video/mp4", "video/webm", "video/quicktime"];

  const mimeType = params.file.type.trim().toLowerCase() || "video/mp4";

  if (!allowedVideoMimeTypes.includes(mimeType)) {
    throw new Error("Only MP4, WebM and MOV videos are supported.");
  }

  const initiated = await initiateMultipartUpload({
    originalName: params.file.name,
    mimeType,
    sizeBytes: params.file.size,
    filePurpose: params.filePurpose,
    visibility: params.visibility ?? "private",
  });

  const completedParts: CompletedMultipartPart[] = [];

  /*
   * Stores the number of bytes currently uploaded for each part.
   * This lets us calculate total progress while parts upload together.
   */
  const loadedBytesByPart = new Map<number, number>();

  const reportProgress = (partNumber: number, loadedBytes: number) => {
    loadedBytesByPart.set(partNumber, loadedBytes);

    const totalLoadedBytes = Array.from(loadedBytesByPart.values()).reduce(
      (total, currentValue) => total + currentValue,
      0,
    );

    /*
     * Keep 100% for after the backend successfully completes
     * and confirms the multipart upload.
     */
    const percentage = Math.min(
      99,
      Math.round((totalLoadedBytes / params.file.size) * 100),
    );

    params.onProgress?.(percentage);
  };

  try {
    for (
      let firstPartNumber = 1;
      firstPartNumber <= initiated.totalParts;
      firstPartNumber += MULTIPART_UPLOAD_CONCURRENCY
    ) {
      const currentBatchSize = Math.min(
        MULTIPART_UPLOAD_CONCURRENCY,
        initiated.totalParts - firstPartNumber + 1,
      );

      const partNumbers = Array.from(
        {
          length: currentBatchSize,
        },
        (_, index) => firstPartNumber + index,
      );

      const signedBatch = await signMultipartParts(
        initiated.sessionId,
        partNumbers,
      );

      const batchResults = await Promise.all(
        signedBatch.parts.map(async ({ partNumber, signedUploadUrl }) => {
          const startByte = (partNumber - 1) * initiated.partSizeBytes;

          const endByte = Math.min(
            startByte + initiated.partSizeBytes,
            params.file.size,
          );

          const part = params.file.slice(startByte, endByte);

          const eTag = await uploadPartWithRetry({
            signedUploadUrl,
            part,

            onProgress: (loadedBytes) => {
              reportProgress(partNumber, loadedBytes);
            },
          });

          return {
            partNumber,
            eTag,
          };
        }),
      );

      completedParts.push(...batchResults);
    }

    const confirmedUpload = await completeMultipartUpload(initiated.sessionId, {
      parts: completedParts.sort(
        (left, right) => left.partNumber - right.partNumber,
      ),

      title: params.title ?? params.file.name,

      durationSeconds: params.durationSeconds,

      thumbnailFileId: params.thumbnailFileId,
    });

    params.onProgress?.(100);

    return confirmedUpload;
  } catch (error) {
    /*
     * Prevent unfinished S3 parts from remaining when the browser
     * upload fails. The S3 lifecycle rule is a second safety layer.
     */
    await abortMultipartUpload(initiated.sessionId).catch(() => undefined);

    throw error;
  }
};

/**
 * Shared image upload flow.
 */
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

export const uploadNotificationImage = async (
  file: File,
): Promise<UploadedNotificationImage> => {
  const filePurpose: FilePurpose = "notification_image";

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

  return {
    fileId: confirmedUpload.file.id,

    publicUrl: confirmedUpload.publicUrl || signedUpload.publicUrl,
  };
};
