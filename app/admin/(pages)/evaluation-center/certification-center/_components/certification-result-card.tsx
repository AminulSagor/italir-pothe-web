"use client";

import {
  Award,
  Bell,
  CheckCircle2,
  ExternalLink,
  FileText,
  Gauge,
  RefreshCw,
  Send,
  ShieldX,
} from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";
import type { CertificationCenterResponse } from "@/types/evaluation-center/evaluation-center.type";

import type { CertificationTab } from "./certification-center-client";

interface CertificationResultCardProps {
  activeTab: CertificationTab;
  data: CertificationCenterResponse;
  onTabChange: (tab: CertificationTab) => void;
  onIssueCertificate: () => void;
  onRequestRetake: () => void;
  onReEvaluate: () => void;
  onRevokeCertificate: () => void;
  onOpenPdf: () => void;
  onRegeneratePdf: () => void;
  onVerify: () => void;
}

const formatDate = (value: string | null) => {
  if (!value) return "Pending";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
};

export default function CertificationResultCard({
  activeTab,
  data,
  onTabChange,
  onIssueCertificate,
  onRequestRetake,
  onReEvaluate,
  onRevokeCertificate,
  onOpenPdf,
  onRegeneratePdf,
  onVerify,
}: CertificationResultCardProps) {
  const isPassedTab = activeTab === "issue-certificate";

  const score = data.result.finalScore;

  const certificateIssued = Boolean(data.certificate);

  const certificateRevoked = data.certificate?.status === "revoked";

  return (
    <Card
      padding="none"
      rounded="3xl"
      shadow="sm"
      className="bg-gradient-to-br from-white via-white to-[#EFFFF3] px-5 py-12 md:px-10"
    >
      <div className="mx-auto flex max-w-[650px] flex-col items-center text-center">
        <div className="mb-10 inline-flex rounded-full bg-[#EEF2EC] p-1">
          <button
            type="button"
            onClick={() => onTabChange("issue-certificate")}
            className={`rounded-full px-7 py-2 text-sm font-semibold ${
              isPassedTab
                ? "bg-white text-[#006B3F] shadow-sm"
                : "text-[#202420]"
            }`}
          >
            Issue Certificate
          </button>

          <button
            type="button"
            onClick={() => onTabChange("request-retake")}
            className={`rounded-full px-7 py-2 text-sm font-semibold ${
              !isPassedTab
                ? "bg-white text-[#006B3F] shadow-sm"
                : "text-[#202420]"
            }`}
          >
            Request Retake
          </button>
        </div>

        <span
          className={`mb-7 rounded-full px-5 py-2 text-sm uppercase tracking-[0.18em] ${
            isPassedTab
              ? "bg-[#DDF3E8] text-[#006B3F]"
              : "bg-[#DDE3DD] text-[#66736A]"
          }`}
        >
          {isPassedTab ? "Final Result" : "Review Required"}
        </span>

        <div
          className={`mb-10 flex size-36 flex-col items-center justify-center rounded-full border-[10px] ${
            data.result.passed ? "border-[#59F94D]" : "border-[#6F7D70]"
          }`}
        >
          <strong
            className={`text-4xl font-bold ${
              data.result.passed ? "text-[#006B3F]" : "text-[#3F4842]"
            }`}
          >
            {score}%
          </strong>

          <span className="text-sm uppercase text-[#66736A]">
            {data.result.label}
          </span>
        </div>

        {isPassedTab ? (
          <PassedContent data={data} />
        ) : (
          <RetakeContent data={data} />
        )}

        <div className="mt-14 flex w-full max-w-[430px] items-center justify-between rounded-full bg-[#F1F5EF] px-6 py-4">
          <div className="flex items-center gap-4">
            <CheckCircle2 className="size-6 fill-[#006B3F] text-white" />

            <span className="text-sm font-semibold text-[#202420]">
              Push notification is available for this action
            </span>
          </div>

          <Bell className="size-5 text-[#202420]" />
        </div>

        {isPassedTab ? (
          certificateIssued ? (
            <div className="mt-8 grid w-full max-w-[520px] gap-3 sm:grid-cols-2">
              <Button
                size="lg"
                fullWidth
                disabled={!data.certificate?.id}
                onClick={onOpenPdf}
                className="gap-3 bg-[#59F94D] !text-[#006B3F] hover:!bg-[#4EF044]"
              >
                <FileText className="size-5" />
                Open Certificate PDF
              </Button>

              <Button
                size="lg"
                fullWidth
                variant="outline"
                disabled={!data.certificate?.verificationUrl}
                onClick={onVerify}
                className="gap-3"
              >
                <ExternalLink className="size-5" />
                Verify Certificate
              </Button>

              {data.certificate && !data.certificate.pdfFileId && (
                <Button
                  size="lg"
                  fullWidth
                  variant="outline"
                  onClick={onRegeneratePdf}
                  className="gap-3 sm:col-span-2"
                >
                  <RefreshCw className="size-5" />
                  Regenerate Missing PDF
                </Button>
              )}

              {!certificateRevoked && (
                <Button
                  size="lg"
                  fullWidth
                  onClick={onRevokeCertificate}
                  className="gap-3 !bg-[#FCEBEC] !text-[#B42318] hover:!bg-[#F8DCDC] sm:col-span-2"
                >
                  <ShieldX className="size-5" />
                  Revoke Certificate
                </Button>
              )}
            </div>
          ) : (
            <Button
              size="lg"
              fullWidth
              disabled={!data.actions.canIssueCertificate}
              onClick={onIssueCertificate}
              className="mt-8 max-w-[430px] gap-3 bg-[#59F94D] !text-[#006B3F] shadow-[0_8px_0_#37C83C] hover:!bg-[#4EF044]"
            >
              <Award className="size-5" />
              ISSUE OFFICIAL CERTIFICATE & NOTIFY
            </Button>
          )
        ) : (
          <Button
            size="lg"
            fullWidth
            disabled={!data.actions.canRequestRetake}
            onClick={onRequestRetake}
            className="mt-8 max-w-[430px] gap-3 bg-[#DDE3DD] text-[#202420] shadow-[0_8px_0_#C7D0C8] hover:bg-[#D7DED7]"
          >
            <Send className="size-5" />
            NOTIFY STUDENT & REQUEST RETAKE
          </Button>
        )}

        <button
          type="button"
          disabled={!data.actions.canReEvaluate}
          onClick={onReEvaluate}
          className="mt-8 flex items-center gap-1 text-sm font-bold text-[#006B3F] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RefreshCw className="size-3" />
          Re-evaluate Exam
        </button>
      </div>
    </Card>
  );
}

function PassedContent({ data }: { data: CertificationCenterResponse }) {
  const certificate = data.certificate;

  return (
    <>
      <h2 className="text-2xl font-bold text-[#202420]">
        {data.result.evaluationTitle}
      </h2>

      <p className="mt-4 max-w-[520px] text-base leading-7 text-[#66736A]">
        {data.result.teacherComment ||
          `The evaluation of ${data.exam.title} is complete. The student has met the required standard for ${data.course.title}.`}
      </p>

      <div className="mt-16 w-full max-w-[500px] rounded-[2rem] border border-[#DDE3DD] bg-white px-7 py-8 text-center shadow-xl">
        <div className="mb-7 flex items-start justify-between">
          <Award className="size-7 text-[#006B3F]" />

          <div className="text-right">
            <p className="text-[9px] font-bold uppercase text-[#202420]">
              Certificate of Completion
            </p>

            <p className="text-[8px] text-[#66736A]">
              Certificate ID:{" "}
              {certificate?.certificateNumber || "Pending issue"}
            </p>
          </div>
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#66736A]">
          Italir Pothe
        </p>

        <h3 className="mt-3 text-xl font-bold text-[#006B3F]">
          {data.student.fullName}
        </h3>

        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#59F94D]" />

        <p className="mt-4 text-xs text-[#66736A]">
          has successfully completed the course
        </p>

        <h4 className="mt-2 text-2xl font-bold text-[#202420]">
          {data.course.title}
        </h4>

        <p className="mt-5 text-[10px] text-[#66736A]">
          {certificate
            ? `Issued on ${formatDate(certificate.issuedAt)}`
            : "Certificate has not been issued yet"}
        </p>

        {certificate?.status === "revoked" && (
          <p className="mt-4 text-xs font-bold uppercase text-[#B42318]">
            Certificate Revoked
          </p>
        )}

        <div className="mt-16 flex items-end justify-between">
          <div>
            <div className="mb-2 h-px w-24 bg-[#C9D4CC]" />

            <p className="text-[8px] uppercase text-[#66736A]">
              Registrar Signature
            </p>
          </div>

          <div className="grid size-9 grid-cols-3 gap-1 bg-[#E7F5EF] p-1">
            {Array.from({
              length: 9,
            }).map((_, index) => (
              <span
                key={index}
                className={index % 2 === 0 ? "bg-[#006B3F]" : "bg-transparent"}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function RetakeContent({ data }: { data: CertificationCenterResponse }) {
  return (
    <>
      <h2 className="text-2xl font-bold text-[#202420]">
        {data.result.evaluationTitle}
      </h2>

      <p className="mt-4 max-w-[520px] text-base leading-7 text-[#66736A]">
        {data.result.teacherComment ||
          `${data.student.fullName} requires further practice before certification. Review the feedback and send the retake request when ready.`}
      </p>

      <div className="mt-16 w-full max-w-[440px] rounded-[1.75rem] border border-[#DDE3DD] bg-[#F1F5EF] p-6 text-left">
        <div className="mb-6 flex items-center gap-3">
          <Gauge className="size-5 text-[#006B3F]" />

          <h3 className="text-base font-semibold text-[#202420]">
            Performance Feedback Summary
          </h3>
        </div>

        <div className="space-y-3">
          <div className="rounded-full bg-white/75 px-5 py-4">
            <p className="text-xs font-bold uppercase text-[#66736A]">
              Key Strength
            </p>

            <p className="text-sm leading-5 text-[#202420]">
              {data.result.keyStrength || "Not provided"}
            </p>
          </div>

          <div className="rounded-full bg-white/75 px-5 py-4">
            <p className="text-xs font-bold uppercase text-[#D92D20]">
              Critical Gap
            </p>

            <p className="text-sm leading-5 text-[#202420]">
              {data.result.criticalGap || "Not provided"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
