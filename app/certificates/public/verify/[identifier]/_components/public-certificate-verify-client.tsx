"use client";

import {
  Award,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Loader2,
  ShieldCheck,
  ShieldX,
  UserRound,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import Button from "@/components/UI/buttons/button";
import { verifyPublicCertificate } from "@/service/evaluation-center/evaluation-center.service";

interface PublicCertificateVerifyClientProps {
  identifier: string;
}

interface PublicCertificateFile {
  id: string;
  originalName?: string;
  mimeType?: string;
  sizeBytes?: number;
}

interface NormalizedPublicCertificate {
  id: string;
  certificateNumber: string;
  recipientName: string;
  courseTitle: string;
  courseLevel: string | null;
  verificationUrl: string | null;
  status: string;
  issuedAt: string | null;
  revokedAt: string | null;
  revocationReason: string | null;
  isValid: boolean;
  pdfUrl: string | null;
  pdfFile: PublicCertificateFile | null;
}

const getErrorMessage = (error: unknown) => {
  return error instanceof Error
    ? error.message
    : "Unable to verify certificate.";
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const readString = (source: Record<string, unknown> | null, key: string) => {
  if (!source) return "";

  const value = source[key];

  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
};

const readBoolean = (source: Record<string, unknown> | null, key: string) => {
  if (!source) return false;

  const value = source[key];

  return value === true;
};

const normalizePublicCertificate = (
  response: unknown,
): NormalizedPublicCertificate | null => {
  if (!isRecord(response)) {
    return null;
  }

  const nestedCertificate = isRecord(response.certificate)
    ? response.certificate
    : null;

  const source = nestedCertificate || response;

  const id = readString(source, "id");

  const certificateNumber = readString(source, "certificateNumber");

  if (!id || !certificateNumber) {
    return null;
  }

  const pdfFile = isRecord(source.pdfFile)
    ? {
        id: readString(source.pdfFile, "id"),
        originalName: readString(source.pdfFile, "originalName"),
        mimeType: readString(source.pdfFile, "mimeType"),
        sizeBytes: Number(source.pdfFile.sizeBytes || 0),
      }
    : null;

  return {
    id,
    certificateNumber,
    recipientName:
      readString(source, "recipientName") ||
      readString(source, "studentName") ||
      "—",
    courseTitle:
      readString(source, "courseTitle") ||
      readString(source, "courseName") ||
      "—",
    courseLevel: readString(source, "courseLevel") || null,
    verificationUrl: readString(source, "verificationUrl") || null,
    status: readString(source, "status") || "unknown",
    issuedAt: readString(source, "issuedAt") || null,
    revokedAt: readString(source, "revokedAt") || null,
    revocationReason: readString(source, "revocationReason") || null,
    isValid: readBoolean(response, "isValid") || readBoolean(source, "isValid"),
    pdfUrl:
      readString(source, "pdfUrl") || readString(source, "publicUrl") || null,
    pdfFile,
  };
};

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
};

const formatLabel = (value?: string | null) => {
  if (!value) return "—";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

export default function PublicCertificateVerifyClient({
  identifier,
}: PublicCertificateVerifyClientProps) {
  const [rawData, setRawData] = useState<unknown>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  const certificate = useMemo(() => {
    return normalizePublicCertificate(rawData);
  }, [rawData]);

  useEffect(() => {
    let mounted = true;

    const loadCertificate = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await verifyPublicCertificate(
          decodeURIComponent(identifier),
        );

        if (mounted) {
          setRawData(response);
        }
      } catch (error) {
        if (mounted) {
          setRawData(null);
          setErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadCertificate();

    return () => {
      mounted = false;
    };
  }, [identifier]);

  const isValid = certificate?.isValid === true;

  const isRevoked =
    certificate?.status === "revoked" || Boolean(certificate?.revokedAt);

  return (
    <main className="min-h-screen overflow-hidden bg-[#F3FAF4] px-5 py-8 text-[#142418]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-[#75FF33] text-[#006B3F] shadow-md">
            <Award className="size-5" />
          </span>

          <span>
            <span className="block text-sm font-black uppercase tracking-[0.22em] text-[#006B3F]">
              Italir Pothe
            </span>

            <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-[#8A948C]">
              Certificate Verification
            </span>
          </span>
        </Link>

        <span className="hidden rounded-full border border-black/10 bg-white px-5 py-2 text-xs font-semibold text-[#4F5B52] shadow-sm sm:inline-flex">
          Secure Public Verification
        </span>
      </div>

      <section className="mx-auto mt-14 grid w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-[#006B3F]/10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-8 sm:p-12">
          {isLoading ? (
            <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
              <Loader2 className="size-10 animate-spin text-[#006B3F]" />

              <p className="mt-5 text-sm font-semibold text-[#4F5B52]">
                Verifying certificate...
              </p>
            </div>
          ) : errorMessage ? (
            <NotFoundState title="Verification failed" message={errorMessage} />
          ) : !certificate ? (
            <NotFoundState
              title="Certificate not found"
              message="We could not find a certificate for this verification link or certificate ID."
            />
          ) : (
            <>
              <div
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] ${
                  isValid
                    ? "bg-[#DDF3E8] text-[#006B3F]"
                    : "bg-[#FCEBEC] text-[#B42318]"
                }`}
              >
                {isValid ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  <XCircle className="size-4" />
                )}

                {isValid
                  ? "Certificate Verified"
                  : isRevoked
                    ? "Certificate Revoked"
                    : "Certificate Invalid"}
              </div>

              <h1 className="mt-8 text-4xl font-black leading-tight text-[#142418] sm:text-5xl">
                {isValid
                  ? "This certificate is valid"
                  : "This certificate is not valid"}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-[#66736A]">
                This page verifies the certificate record directly from the
                Italir Pothe backend.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <DetailCard
                  icon={Award}
                  label="Certificate Number"
                  value={certificate.certificateNumber}
                />

                <DetailCard
                  icon={UserRound}
                  label="Recipient"
                  value={certificate.recipientName}
                />

                <DetailCard
                  icon={ShieldCheck}
                  label="Course"
                  value={certificate.courseTitle}
                />

                <DetailCard
                  icon={CalendarDays}
                  label="Issued On"
                  value={formatDate(certificate.issuedAt)}
                />

                <DetailCard
                  icon={ShieldCheck}
                  label="Status"
                  value={formatLabel(certificate.status)}
                />

                <DetailCard
                  icon={Award}
                  label="Certificate ID"
                  value={certificate.id}
                />

                {certificate.courseLevel && (
                  <DetailCard
                    icon={Award}
                    label="Course Level"
                    value={certificate.courseLevel}
                  />
                )}

                {certificate.pdfFile && (
                  <DetailCard
                    icon={Award}
                    label="PDF File"
                    value={
                      certificate.pdfFile.originalName || certificate.pdfFile.id
                    }
                  />
                )}
              </div>

              {isRevoked && (
                <div className="mt-6 rounded-3xl border border-[#F4D5D2] bg-[#FFF7F6] p-5">
                  <div className="flex items-start gap-3">
                    <ShieldX className="mt-1 size-5 text-[#B42318]" />

                    <div>
                      <p className="font-bold text-[#B42318]">
                        Certificate revoked
                      </p>

                      <p className="mt-2 text-sm leading-6 text-[#7A2E25]">
                        {certificate.revocationReason ||
                          "This certificate was revoked by Italir Pothe administration."}
                      </p>

                      <p className="mt-2 text-xs text-[#7A2E25]/70">
                        Revoked At: {formatDate(certificate.revokedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {certificate.pdfUrl && (
                  <Button
                    size="lg"
                    onClick={() =>
                      window.open(
                        certificate.pdfUrl || "",
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }
                    className="gap-3"
                  >
                    <ExternalLink className="size-5" />
                    Open Certificate
                  </Button>
                )}

                {certificate.verificationUrl && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() =>
                      window.open(
                        certificate.verificationUrl || window.location.href,
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }
                    className="gap-3"
                  >
                    <ExternalLink className="size-5" />
                    Verification Link
                  </Button>
                )}
              </div>
            </>
          )}
        </div>

        <div className="relative hidden items-center justify-center bg-[#ECF8F0] p-10 lg:flex">
          <div className="absolute left-16 top-16 size-28 rounded-full border border-[#006B3F]/10" />

          <div className="absolute bottom-20 right-16 size-36 rounded-full border border-[#006B3F]/10" />

          <div className="relative flex size-80 items-center justify-center rounded-full bg-white shadow-xl shadow-[#006B3F]/10">
            <div className="flex size-56 flex-col items-center justify-center rounded-full border border-dashed border-[#006B3F]/25 text-center">
              {isValid ? (
                <ShieldCheck className="size-16 text-[#006B3F]" />
              ) : (
                <ShieldX className="size-16 text-[#B42318]" />
              )}

              <p
                className={`mt-6 text-6xl font-black ${
                  isValid ? "text-[#006B3F]" : "text-[#B42318]"
                }`}
              >
                {isLoading ? "..." : isValid ? "VALID" : "INVALID"}
              </p>

              <p className="mt-3 text-xs font-bold uppercase tracking-[0.24em] text-[#8A948C]">
                Italir Pothe
              </p>
            </div>
          </div>
        </div>
      </section>

      <p className="mt-10 text-center text-xs text-[#8A948C]">
        © 2026 Italir Pothe. Public certificate verification system.
      </p>
    </main>
  );
}

function DetailCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Award;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl bg-[#F7FAF7] p-5">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-full bg-[#DDF3E8] text-[#006B3F]">
          <Icon className="size-4" />
        </div>

        <p className="text-[10px] font-bold uppercase tracking-wide text-[#8A948C]">
          {label}
        </p>
      </div>

      <p className="mt-3 break-all text-sm font-bold text-[#142418]">
        {value || "—"}
      </p>
    </div>
  );
}

function NotFoundState({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex min-h-[430px] flex-col justify-center">
      <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-[#FCEBEC] text-[#B42318]">
        <XCircle className="size-7" />
      </div>

      <h1 className="mt-7 text-4xl font-black text-[#142418]">{title}</h1>

      <p className="mt-4 max-w-xl text-base leading-7 text-[#66736A]">
        {message}
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex h-12 w-fit items-center justify-center rounded-full bg-[#006B3F] px-8 text-sm font-bold text-white"
      >
        Back to Home
      </Link>
    </div>
  );
}
