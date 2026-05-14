"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  certificationBottomStats,
  certificationStudent,
  feedbackSummary,
} from "@/mock/evaluation-center/certification-center/certification-center.mock";
import { CertificationTab } from "@/mock/evaluation-center/certification-center/certification-center.types";

import CertificationBottomStats from "./_components/certification-bottom-stats";
import CertificationResultCard from "./_components/certification-result-card";
import IssueCertificateDialog from "./_components/issue-certificate-dialog";
import BackButton from "@/components/UI/buttons/back-button";

export default function CertificationCenterPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab");
  const activeTab: CertificationTab =
    tab === "request-retake" ? "request-retake" : "issue-certificate";

  return (
    <div className="space-y-7">
      <div>
        <div className="mb-5 flex items-center gap-2 text-sm">
          <BackButton />
          <span className="text-[#66736A]">Examinee Queue</span>
          <span className="text-[#A1AAA3]">›</span>
          <span className="text-[#66736A]">Evaluate Student</span>
          <span className="text-[#A1AAA3]">›</span>
          <span className="font-bold text-[#006B3F]">Certification Center</span>
        </div>

        <h1 className="text-3xl font-bold text-[#006B3F]">
          Certification Center
        </h1>
      </div>

      <CertificationResultCard
        activeTab={activeTab}
        student={certificationStudent}
        feedback={feedbackSummary}
        onIssueCertificate={() => setIsDialogOpen(true)}
      />

      <CertificationBottomStats stats={certificationBottomStats} />

      <IssueCertificateDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        student={certificationStudent}
      />
    </div>
  );
}
