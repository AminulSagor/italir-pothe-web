import { serviceClient } from "@/service/base/service_client";
import type {
  AdminCertificate,
  AdminCertificateListResponse,
  AdminCertificateQuery,
  CertificationCenterResponse,
  EvaluationQueueQuery,
  EvaluationQueueResponse,
  FinalExamEvaluationDetails,
  GiveFinalVerdictPayload,
  IssueAdminCertificatePayload,
  IssueAdminCertificateResponse,
  IssueEvaluationCertificatePayload,
  IssueEvaluationCertificateResponse,
  ReopenEvaluationPayload,
  ReopenEvaluationResponse,
  RequestFinalExamRetakePayload,
  RequestFinalExamRetakeResponse,
  RevokeCertificatePayload,
  VerifyCertificateResponse,
} from "@/types/evaluation-center/evaluation-center.type";
import { assertValidUuid } from "@/utils/uuid";

const ADMIN_EVALUATION_ENDPOINT = "/admin/final-exam-evaluations";

const ADMIN_CERTIFICATES_ENDPOINT = "/admin/certificates";

type QueryValue = string | number | undefined | null;

interface SignedReadUrlResponse {
  signedReadUrl?: string;
  publicUrl?: string;
}

export interface CertificateDownloadUrlResponse {
  certificateId: string;
  certificateNumber: string;
  signedReadUrl: string;
  expiresInSeconds: number;
  file: {
    id: string;
    originalName?: string;
    fileName?: string;
    mimeType?: string;
    sizeBytes?: number;
    filePurpose?: string;
    visibility?: string;
    uploadStatus?: string;
    publicUrl?: string | null;
  };
}

export interface RegenerateCertificatePdfResponse {
  message: string;
  certificate: AdminCertificate;
  pdfDownload: CertificateDownloadUrlResponse;
}

const buildQueryString = (values: Record<string, QueryValue>) => {
  const params = new URLSearchParams();

  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    params.set(key, String(value));
  });

  const queryString = params.toString();

  return queryString ? `?${queryString}` : "";
};

export const getEvaluationQueue = async (query: EvaluationQueueQuery = {}) => {
  const queryString = buildQueryString({
    status: query.status,
    search: query.search?.trim(),
    level: query.level?.trim(),
    courseId: query.courseId,
    examTemplateId: query.examTemplateId,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
    page: query.page,
    limit: query.limit,
  });

  return serviceClient.get<EvaluationQueueResponse>(
    `${ADMIN_EVALUATION_ENDPOINT}/queue${queryString}`,
  );
};

export const getEvaluationDetails = async (attemptId: string) => {
  const safeAttemptId = assertValidUuid(attemptId, "Exam attempt ID");

  return serviceClient.get<FinalExamEvaluationDetails>(
    `${ADMIN_EVALUATION_ENDPOINT}/queue/${safeAttemptId}`,
  );
};

export const getCertificationCenter = async (attemptId: string) => {
  const safeAttemptId = assertValidUuid(attemptId, "Exam attempt ID");

  return serviceClient.get<CertificationCenterResponse>(
    `${ADMIN_EVALUATION_ENDPOINT}/queue/${safeAttemptId}/certificate-center`,
  );
};

export const giveFinalExamVerdict = async (
  attemptId: string,
  payload: GiveFinalVerdictPayload,
) => {
  const safeAttemptId = assertValidUuid(attemptId, "Exam attempt ID");

  return serviceClient.post<FinalExamEvaluationDetails>(
    `${ADMIN_EVALUATION_ENDPOINT}/queue/${safeAttemptId}/verdict`,
    payload,
  );
};

export const requestFinalExamRetake = async (
  attemptId: string,
  payload: RequestFinalExamRetakePayload,
) => {
  const safeAttemptId = assertValidUuid(attemptId, "Exam attempt ID");

  return serviceClient.post<RequestFinalExamRetakeResponse>(
    `${ADMIN_EVALUATION_ENDPOINT}/queue/${safeAttemptId}/retake`,
    payload,
  );
};

export const issueEvaluationCertificate = async (
  attemptId: string,
  payload: IssueEvaluationCertificatePayload,
) => {
  const safeAttemptId = assertValidUuid(attemptId, "Exam attempt ID");

  return serviceClient.post<IssueEvaluationCertificateResponse>(
    `${ADMIN_EVALUATION_ENDPOINT}/queue/${safeAttemptId}/issue-certificate`,
    payload,
  );
};

export const reopenFinalExamEvaluation = async (
  attemptId: string,
  payload: ReopenEvaluationPayload = {},
) => {
  const safeAttemptId = assertValidUuid(attemptId, "Exam attempt ID");

  return serviceClient.post<ReopenEvaluationResponse>(
    `${ADMIN_EVALUATION_ENDPOINT}/queue/${safeAttemptId}/reopen`,
    payload,
  );
};

export const getAdminCertificates = async (
  query: AdminCertificateQuery = {},
) => {
  const queryString = buildQueryString({
    status: query.status,
    userId: query.userId,
    courseId: query.courseId,
    search: query.search?.trim(),
    page: query.page,
    limit: query.limit,
  });

  return serviceClient.get<AdminCertificateListResponse>(
    `${ADMIN_CERTIFICATES_ENDPOINT}${queryString}`,
  );
};

export const getAdminCertificateById = async (certificateId: string) => {
  const safeCertificateId = assertValidUuid(certificateId, "Certificate ID");

  return serviceClient.get<AdminCertificate>(
    `${ADMIN_CERTIFICATES_ENDPOINT}/${safeCertificateId}`,
  );
};

export const getAdminCertificateByAttemptId = async (examAttemptId: string) => {
  const safeAttemptId = assertValidUuid(examAttemptId, "Exam attempt ID");

  return serviceClient.get<AdminCertificate>(
    `${ADMIN_CERTIFICATES_ENDPOINT}/attempt/${safeAttemptId}`,
  );
};

export const getAdminCertificateDownloadUrl = async (certificateId: string) => {
  const safeCertificateId = assertValidUuid(certificateId, "Certificate ID");

  return serviceClient.get<CertificateDownloadUrlResponse>(
    `${ADMIN_CERTIFICATES_ENDPOINT}/${safeCertificateId}/download-url`,
  );
};

export const regenerateAdminCertificatePdf = async (certificateId: string) => {
  const safeCertificateId = assertValidUuid(certificateId, "Certificate ID");

  return serviceClient.post<RegenerateCertificatePdfResponse>(
    `${ADMIN_CERTIFICATES_ENDPOINT}/${safeCertificateId}/regenerate-pdf`,
  );
};

export const openAdminCertificatePdf = async (certificateId: string) => {
  const response = await getAdminCertificateDownloadUrl(certificateId);

  if (!response.signedReadUrl) {
    throw new Error("Certificate download URL is not available.");
  }

  window.open(response.signedReadUrl, "_blank", "noopener,noreferrer");

  return response;
};

export const verifyAdminCertificate = async (identifier: string) => {
  const normalizedIdentifier = identifier.trim();

  if (!normalizedIdentifier) {
    throw new Error("Certificate identifier is required.");
  }

  return serviceClient.get<VerifyCertificateResponse>(
    `${ADMIN_CERTIFICATES_ENDPOINT}/verify/${encodeURIComponent(
      normalizedIdentifier,
    )}`,
  );
};

export const issueAdminCertificate = async (
  payload: IssueAdminCertificatePayload,
) => {
  return serviceClient.post<IssueAdminCertificateResponse>(
    `${ADMIN_CERTIFICATES_ENDPOINT}/issue`,
    payload,
  );
};

export const revokeAdminCertificate = async (
  certificateId: string,
  payload: RevokeCertificatePayload = {},
) => {
  const safeCertificateId = assertValidUuid(certificateId, "Certificate ID");

  return serviceClient.patch<AdminCertificate>(
    `${ADMIN_CERTIFICATES_ENDPOINT}/${safeCertificateId}/revoke`,
    payload,
  );
};

export const getFileSignedReadUrl = async (fileId: string) => {
  const safeFileId = assertValidUuid(fileId, "File ID");

  const response = await serviceClient.get<SignedReadUrlResponse>(
    `/files/${safeFileId}/signed-read-url`,
  );

  const signedReadUrl = response.signedReadUrl || response.publicUrl;

  if (!signedReadUrl) {
    throw new Error(
      "The signed-read URL response did not contain a usable URL.",
    );
  }

  return signedReadUrl;
};
