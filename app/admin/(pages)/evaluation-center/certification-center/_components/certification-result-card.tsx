"use client";

import Link from "next/link";
import {
  Award,
  Bell,
  CheckCircle2,
  Gauge,
  RefreshCw,
  Send,
} from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";
import {
  CertificationStudent,
  CertificationTab,
  FeedbackSummary,
} from "@/mock/evaluation-center/certification-center/certification-center.types";

interface CertificationResultCardProps {
  activeTab: CertificationTab;
  student: CertificationStudent;
  feedback: FeedbackSummary;
  onIssueCertificate?: () => void;
}

export default function CertificationResultCard({
  activeTab,
  student,
  feedback,
  onIssueCertificate,
}: CertificationResultCardProps) {
  const isPassed = activeTab === "issue-certificate";
  const score = isPassed ? student.passedScore : student.retakeScore;

  return (
    <Card
      padding="none"
      rounded="3xl"
      shadow="sm"
      className="bg-gradient-to-br from-white via-white to-[#EFFFF3] px-5 py-12 md:px-10"
    >
      <div className="mx-auto flex max-w-[620px] flex-col items-center text-center">
        <div className="mb-10 inline-flex rounded-full bg-[#EEF2EC] p-1">
          <Link
            href="?tab=issue-certificate"
            className={`rounded-full px-7 py-2 text-sm font-semibold ${
              isPassed ? "bg-white text-[#006B3F] shadow-sm" : "text-[#202420]"
            }`}
          >
            Issue Certificate
          </Link>

          <Link
            href="?tab=request-retake"
            className={`rounded-full px-7 py-2 text-sm font-semibold ${
              !isPassed ? "bg-white text-[#006B3F] shadow-sm" : "text-[#202420]"
            }`}
          >
            Request Retake
          </Link>
        </div>

        <span
          className={`mb-7 rounded-full px-5 py-2 text-sm uppercase tracking-[0.18em] ${
            isPassed
              ? "bg-[#DDF3E8] text-[#006B3F]"
              : "bg-[#DDE3DD] text-[#66736A]"
          }`}
        >
          {isPassed ? "Final Result" : "Review Required"}
        </span>

        <div
          className={`mb-10 flex size-36 flex-col items-center justify-center rounded-full border-[10px] ${
            isPassed ? "border-[#59F94D]" : "border-[#6F7D70]"
          }`}
        >
          <strong
            className={`text-4xl font-bold ${
              isPassed ? "text-[#006B3F]" : "text-[#3F4842]"
            }`}
          >
            {score}%
          </strong>
          <span className="text-sm uppercase text-[#66736A]">
            {isPassed ? "Passed" : "Not Met"}
          </span>
        </div>

        {isPassed ? (
          <PassedContent student={student} />
        ) : (
          <RetakeContent feedback={feedback} />
        )}

        <div className="mt-14 flex w-full max-w-[410px] items-center justify-between rounded-full bg-[#F1F5EF] px-6 py-4">
          <div className="flex items-center gap-4">
            <CheckCircle2 className="size-6 fill-[#006B3F] text-white" />
            <span className="text-sm font-semibold text-[#202420]">
              Send Push Notification to Student
            </span>
          </div>
          <Bell className="size-5 text-[#202420]" />
        </div>

        <Button
          size="lg"
          fullWidth
          onClick={isPassed ? onIssueCertificate : undefined}
          className={`mt-8 max-w-[430px] gap-3 text-base font-bold ${
            isPassed
              ? "bg-[#59F94D] !text-[#006B3F] shadow-[0_8px_0_#37C83C] hover:!bg-[#4EF044]"
              : "bg-[#DDE3DD] text-[#202420] shadow-[0_8px_0_#C7D0C8] hover:bg-[#D7DED7]"
          }`}
        >
          {isPassed ? (
            <>
              <Award className="size-5" />
              ISSUE OFFICIAL CERTIFICATE & NOTIFY
            </>
          ) : (
            <>
              <Send className="size-5" />
              NOTIFY STUDENT & REQUEST RETAKE
            </>
          )}
        </Button>

        <button
          type="button"
          className="mt-8 flex items-center gap-1 text-sm font-bold text-[#006B3F]"
        >
          <RefreshCw className="size-3" />
          Re-evaluate Exam
        </button>
      </div>
    </Card>
  );
}

function PassedContent({ student }: { student: CertificationStudent }) {
  return (
    <>
      <h2 className="text-2xl font-bold text-[#202420]">
        Congratulations, {student.name}!
      </h2>

      <p className="mt-4 max-w-[520px] text-base leading-7 text-[#66736A]">
        The evaluation of the Italian A1 Level proficiency exam is complete. The
        student has demonstrated exceptional command of fundamental grammar and
        vocabulary.
      </p>

      <div className="mt-16 w-full max-w-[500px] rounded-[2rem] border border-[#DDE3DD] bg-white px-7 py-8 text-center shadow-xl">
        <div className="mb-7 flex items-start justify-between">
          <Award className="size-7 text-[#006B3F]" />
          <div className="text-right">
            <p className="text-[9px] font-bold uppercase text-[#202420]">
              Certificato Di Competenza
            </p>
            <p className="text-[8px] text-[#66736A]">
              ID: {student.certificateId}
            </p>
          </div>
        </div>

        <p className="text-xs italic text-[#66736A]">
          Official Italian Language Institute
        </p>

        <h3 className="mt-3 text-xl font-bold text-[#006B3F]">
          {student.name}
        </h3>

        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#59F94D]" />

        <p className="mt-4 text-xs text-[#66736A]">
          Has successfully attained the proficiency level of
        </p>

        <h4 className="mt-2 text-3xl font-bold text-[#006B3F]">
          {student.level}
        </h4>

        <p className="mt-5 text-[10px] text-[#66736A]">
          Issued on {student.issueDate}
        </p>

        <div className="mt-16 flex items-end justify-between">
          <div>
            <div className="mb-2 h-px w-24 bg-[#C9D4CC]" />
            <p className="text-[8px] uppercase text-[#66736A]">
              Registrar Signature
            </p>
          </div>

          <div className="grid size-9 grid-cols-3 gap-1 bg-[#E7F5EF] p-1">
            {Array.from({ length: 9 }).map((_, index) => (
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

function RetakeContent({ feedback }: { feedback: FeedbackSummary }) {
  return (
    <>
      <h2 className="text-2xl font-bold text-[#202420]">
        Evaluation Result: Improvement Needed
      </h2>

      <p className="mt-4 max-w-[520px] text-base leading-7 text-[#66736A]">
        Arif has shown strong effort but requires further practice in specific
        areas before certification. A retake is recommended after reviewing the
        feedback below.
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
              {feedback.keyStrength}
            </p>
          </div>

          <div className="rounded-full bg-white/75 px-5 py-4">
            <p className="text-xs font-bold uppercase text-[#D92D20]">
              Critical Gap
            </p>
            <p className="text-sm leading-5 text-[#202420]">
              {feedback.criticalGap}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
