"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Loader2, TriangleAlert } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import UnsavedChangesWarningDialog from "@/components/UI/dialogs/unsaved-changes-warning-dialog";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";
import {
  getCertificationCenter,
  issueEvaluationCertificate,
  openAdminCertificatePdf,
  regenerateAdminCertificatePdf,
  reopenFinalExamEvaluation,
  requestFinalExamRetake,
  revokeAdminCertificate,
} from "@/service/evaluation-center/evaluation-center.service";
import type { CertificationCenterResponse } from "@/types/evaluation-center/evaluation-center.type";

import CertificationBottomStats from "./certification-bottom-stats";
import CertificationResultCard from "./certification-result-card";
import IssueCertificateDialog from "./issue-certificate-dialog";
import ReopenEvaluationDialog from "./reopen-evaluation-dialog";
import RequestRetakeDialog, {
  type RetakeFormState,
} from "./request-retake-dialog";
import RevokeCertificateDialog from "./revoke-certificate-dialog";

export type CertificationTab = "issue-certificate" | "request-retake";

interface CertificationCenterClientProps {
  attemptId: string;
  requestedTab: CertificationTab;
}

const getErrorMessage = (error: unknown) => {
  return error instanceof Error
    ? error.message
    : "Unable to complete the certification action.";
};

const createRetakeFormFromData = (
  response: CertificationCenterResponse,
): RetakeFormState => ({
  keyStrength: response.result.keyStrength || "",
  criticalGap: response.result.criticalGap || "",
  teacherComment: response.result.teacherComment || "",
  teacherCommentBn: response.result.teacherCommentBn || "",
  notifyStudent: true,
});

export default function CertificationCenterClient({
  attemptId,
  requestedTab,
}: CertificationCenterClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [data, setData] = useState<CertificationCenterResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [loadError, setLoadError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [issueOpen, setIssueOpen] = useState(false);

  const [notifyOnIssue, setNotifyOnIssue] = useState(true);

  const [retakeOpen, setRetakeOpen] = useState(false);

  const [retakeForm, setRetakeForm] = useState<RetakeFormState>({
    keyStrength: "",
    criticalGap: "",
    teacherComment: "",
    teacherCommentBn: "",
    notifyStudent: true,
  });

  const [reopenOpen, setReopenOpen] = useState(false);

  const [reopenReason, setReopenReason] = useState("");

  const [revokeOpen, setRevokeOpen] = useState(false);

  const [revokeReason, setRevokeReason] = useState("");

  const loadCenter = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError("");

      const response = await getCertificationCenter(attemptId);

      setData(response);
      setRetakeForm(createRetakeFormFromData(response));
    } catch (error) {
      const message = getErrorMessage(error);

      setLoadError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [attemptId]);

  useEffect(() => {
    void loadCenter();
  }, [loadCenter]);

  const activeTab = useMemo<CertificationTab>(() => {
    if (!data) {
      return requestedTab;
    }

    if (requestedTab === "request-retake" && data.actions.canRequestRetake) {
      return "request-retake";
    }

    if (
      requestedTab === "issue-certificate" &&
      (data.result.passed || data.certificate)
    ) {
      return "issue-certificate";
    }

    return data.result.passed ? "issue-certificate" : "request-retake";
  }, [data, requestedTab]);

  const dialogDirty = useMemo(() => {
    if (issueOpen) {
      return notifyOnIssue !== true;
    }

    if (retakeOpen && data) {
      return (
        retakeForm.keyStrength !== (data.result.keyStrength || "") ||
        retakeForm.criticalGap !== (data.result.criticalGap || "") ||
        retakeForm.teacherComment !== (data.result.teacherComment || "") ||
        retakeForm.teacherCommentBn !== (data.result.teacherCommentBn || "") ||
        retakeForm.notifyStudent !== true
      );
    }

    if (reopenOpen) {
      return Boolean(reopenReason.trim());
    }

    if (revokeOpen) {
      return Boolean(revokeReason.trim());
    }

    return false;
  }, [
    data,
    issueOpen,
    notifyOnIssue,
    reopenOpen,
    reopenReason,
    retakeForm,
    retakeOpen,
    revokeOpen,
    revokeReason,
  ]);

  const unsavedChanges = useUnsavedChangesWarning(dialogDirty);

  const changeTab = (tab: CertificationTab) => {
    const params = new URLSearchParams(window.location.search);

    params.set("attemptId", attemptId);
    params.set("tab", tab);

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  const closeWithWarning = (action: () => void) => {
    unsavedChanges.requestAction(action);
  };

  const handleIssueCertificate = async () => {
    const toastId = toast.loading("Issuing official certificate...");

    try {
      setIsSubmitting(true);

      const response = await issueEvaluationCertificate(attemptId, {
        notifyStudent: notifyOnIssue,
      });

      setIssueOpen(false);
      setNotifyOnIssue(true);

      await loadCenter();

      toast.success(response.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestRetake = async () => {
    if (!retakeForm.criticalGap.trim()) {
      toast.error("Critical gap is required.");

      return;
    }

    if (!retakeForm.teacherComment.trim()) {
      toast.error("Teacher comment is required.");

      return;
    }

    const toastId = toast.loading("Requesting final exam retake...");

    try {
      setIsSubmitting(true);

      const response = await requestFinalExamRetake(attemptId, {
        keyStrength: retakeForm.keyStrength.trim() || undefined,
        criticalGap: retakeForm.criticalGap.trim(),
        teacherComment: retakeForm.teacherComment.trim(),
        teacherCommentBn: retakeForm.teacherCommentBn.trim() || undefined,
        notifyStudent: retakeForm.notifyStudent,
      });

      setRetakeOpen(false);

      await loadCenter();

      toast.success(response.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReopen = async () => {
    const toastId = toast.loading("Reopening exam evaluation...");

    try {
      setIsSubmitting(true);

      const response = await reopenFinalExamEvaluation(attemptId, {
        reason: reopenReason.trim() || undefined,
      });

      setReopenOpen(false);
      setReopenReason("");

      toast.success(response.message, {
        id: toastId,
      });

      router.push(
        `/admin/evaluation-center/evaluate-student?attemptId=${encodeURIComponent(
          attemptId,
        )}`,
      );
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevoke = async () => {
    if (!data?.certificate) {
      return;
    }

    const toastId = toast.loading("Revoking certificate...");

    try {
      setIsSubmitting(true);

      await revokeAdminCertificate(data.certificate.id, {
        reason: revokeReason.trim() || undefined,
      });

      setRevokeOpen(false);
      setRevokeReason("");

      await loadCenter();

      toast.success("Certificate revoked successfully.", {
        id: toastId,
      });
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenPdf = async () => {
    if (!data?.certificate?.id) {
      toast.error("Certificate ID is missing.");

      return;
    }

    const toastId = toast.loading("Opening certificate PDF...");

    try {
      await openAdminCertificatePdf(data.certificate.id);

      toast.success("Certificate PDF opened.", {
        id: toastId,
      });
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    }
  };

  const handleRegeneratePdf = async () => {
    if (!data?.certificate?.id) {
      toast.error("Certificate ID is missing.");

      return;
    }

    const toastId = toast.loading("Regenerating certificate PDF...");

    try {
      setIsSubmitting(true);

      await regenerateAdminCertificatePdf(data.certificate.id);

      await loadCenter();

      toast.success("Certificate PDF regenerated.", {
        id: toastId,
      });
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = () => {
    if (data?.certificate?.verificationUrl) {
      window.open(
        data.certificate.verificationUrl,
        "_blank",
        "noopener,noreferrer",
      );
    }
  };

  if (isLoading && !data) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <Loader2 className="size-9 animate-spin text-[#006B3F]" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto flex min-h-[460px] max-w-[760px] flex-col items-center justify-center rounded-[2.5rem] bg-white p-8 text-center shadow-xl shadow-black/5">
        <TriangleAlert className="size-10 text-[#D92D20]" />

        <h2 className="mt-5 text-2xl font-bold text-[#202420]">
          Certification Center unavailable
        </h2>

        <p className="mt-3 max-w-lg text-[#66736A]">{loadError}</p>

        <button
          type="button"
          onClick={() => router.push("/admin/evaluation-center")}
          className="mt-7 rounded-full bg-[#006B3F] px-8 py-3 font-semibold text-white"
        >
          Back to Evaluation Center
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-7">
        <div>
          <div className="mb-5 flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() =>
                unsavedChanges.requestNavigation("/admin/evaluation-center")
              }
              className="flex size-9 items-center justify-center rounded-full bg-[#EEF3EC] text-[#006B3F]"
              aria-label="Back to evaluation center"
            >
              <ArrowLeft className="size-4" />
            </button>

            <span className="text-[#66736A]">Examinee Queue</span>

            <span className="text-[#A1AAA3]">›</span>

            <span className="text-[#66736A]">Evaluate Student</span>

            <span className="text-[#A1AAA3]">›</span>

            <span className="font-bold text-[#006B3F]">
              Certification Center
            </span>
          </div>

          <h1 className="text-3xl font-bold text-[#006B3F]">
            Certification Center
          </h1>
        </div>

        <CertificationResultCard
          activeTab={activeTab}
          data={data}
          onTabChange={changeTab}
          onIssueCertificate={() => setIssueOpen(true)}
          onRequestRetake={() => setRetakeOpen(true)}
          onReEvaluate={() => setReopenOpen(true)}
          onRevokeCertificate={() => setRevokeOpen(true)}
          onOpenPdf={handleOpenPdf}
          onRegeneratePdf={handleRegeneratePdf}
          onVerify={handleVerify}
        />

        <CertificationBottomStats metric={data.evaluationMetric} />
      </div>

      <IssueCertificateDialog
        open={issueOpen}
        data={data}
        notifyStudent={notifyOnIssue}
        isSubmitting={isSubmitting}
        onNotifyStudentChange={setNotifyOnIssue}
        onClose={() =>
          closeWithWarning(() => {
            setIssueOpen(false);
            setNotifyOnIssue(true);
          })
        }
        onConfirm={handleIssueCertificate}
      />

      <RequestRetakeDialog
        open={retakeOpen}
        form={retakeForm}
        isSubmitting={isSubmitting}
        onChange={setRetakeForm}
        onClose={() => closeWithWarning(() => setRetakeOpen(false))}
        onConfirm={handleRequestRetake}
      />

      <ReopenEvaluationDialog
        open={reopenOpen}
        reason={reopenReason}
        isSubmitting={isSubmitting}
        onReasonChange={setReopenReason}
        onClose={() =>
          closeWithWarning(() => {
            setReopenOpen(false);
            setReopenReason("");
          })
        }
        onConfirm={handleReopen}
      />

      <RevokeCertificateDialog
        open={revokeOpen}
        reason={revokeReason}
        isSubmitting={isSubmitting}
        onReasonChange={setRevokeReason}
        onClose={() =>
          closeWithWarning(() => {
            setRevokeOpen(false);
            setRevokeReason("");
          })
        }
        onConfirm={handleRevoke}
      />

      <UnsavedChangesWarningDialog
        open={unsavedChanges.warningOpen}
        onCancel={unsavedChanges.cancelNavigation}
        onConfirm={unsavedChanges.confirmNavigation}
      />
    </>
  );
}
