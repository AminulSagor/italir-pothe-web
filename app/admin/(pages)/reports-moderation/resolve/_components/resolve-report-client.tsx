"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getModerationReportByCaseNumber,
  performModerationAction,
} from "@/service/reports-moderation/reports-moderation.service";
import type {
  ModerationActionType,
  ModerationReportDetailsResponse,
} from "@/types/reports-moderation/reports-moderation.type";

import ActionHistoryCard from "./action-history-card";
import AdminActionPanel from "./admin-action-panel";
import ReportOverviewCard from "./report-overview-card";
import ReporterNoteCard from "./reporter-note-card";
import ResolveHeader from "./resolve-header";
import SubjectStatsCard from "./subject-stats-card";
import VisualEvidenceCard from "./visual-evidence-card";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const actionSuccessMessage: Record<ModerationActionType, string> = {
  formal_warning: "Formal warning recorded successfully.",
  permanent_ban: "Account ban recorded successfully.",
  dismiss: "Report dismissed successfully.",
};

export default function ResolveReportClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const caseNumber = searchParams.get("caseNumber")?.trim() ?? "";

  const [report, setReport] =
    useState<ModerationReportDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeAction, setActiveAction] =
    useState<ModerationActionType | null>(null);
  const [loadError, setLoadError] = useState("");

  const loadReport = useCallback(
    async (silent = false) => {
      if (!caseNumber) {
        setReport(null);
        setLoadError("A moderation case number was not provided.");
        setIsLoading(false);
        return;
      }

      if (silent) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setLoadError("");

      try {
        const response = await getModerationReportByCaseNumber(caseNumber);
        setReport(response);
      } catch (error) {
        const message = getErrorMessage(
          error,
          "Unable to load this moderation report.",
        );
        setReport(null);
        setLoadError(message);

        if (silent) {
          toast.error(message);
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [caseNumber],
  );

  useEffect(() => {
    void loadReport();
  }, [loadReport]);

  const handleAction = async (
    actionType: ModerationActionType,
    actionReason: string,
  ) => {
    if (!report) {
      return false;
    }

    const normalizedReason = actionReason.trim();

    if (!normalizedReason) {
      toast.error("Enter an action reason before continuing.");
      return false;
    }

    setActiveAction(actionType);

    try {
      const response = await performModerationAction(report.report_overview.id, {
        action_type: actionType,
        action_reason: normalizedReason,
      });

      const baseMessage = actionSuccessMessage[actionType];

      if (!response.notification.created) {
        toast.success(baseMessage);
        toast.error(
          "The action was saved, but the mobile notification could not be created.",
        );
      } else if (response.notification.sentCount > 0) {
        toast.success(`${baseMessage} Mobile notification sent.`);
      } else {
        toast.success(
          `${baseMessage} In-app notification created; no active push device was found.`,
        );
      }
      await loadReport(true);
      return true;
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Unable to complete the moderation action."),
      );
      return false;
    } finally {
      setActiveAction(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-9 animate-spin text-secondary" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-[720px] flex-col items-center justify-center rounded-[2rem] bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-deep-green">
          Moderation report unavailable
        </h1>
        <p className="mt-3 max-w-[520px] text-black/55">
          {loadError || "The requested moderation case could not be found."}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {caseNumber && (
            <button
              type="button"
              onClick={() => void loadReport()}
              className="flex items-center gap-2 rounded-full bg-secondary px-5 py-3 text-sm font-bold text-white"
            >
              <RefreshCw className="size-4" />
              Retry
            </button>
          )}
          <button
            type="button"
            onClick={() => router.push("/admin/reports-moderation")}
            className="rounded-full bg-[#DDE3DA] px-5 py-3 text-sm font-bold text-black/60"
          >
            Back to Queue
          </button>
        </div>
      </div>
    );
  }

  const isFinalDecision =
    report.report_overview.status === "resolved" ||
    report.report_overview.status === "banned";

  return (
    <div className="mx-auto min-h-[calc(100vh-3rem)] w-full max-w-[1120px]">
      <ResolveHeader
        caseNumber={report.report_overview.caseNumber}
        status={report.report_overview.status}
        isRefreshing={isRefreshing}
        onBack={() => router.push("/admin/reports-moderation")}
        onRefresh={() => void loadReport(true)}
      />

      <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <ReportOverviewCard
            overview={report.report_overview}
            reporter={report.reporter_details}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <ReporterNoteCard note={report.reporter_details.reporterNote} />
            <SubjectStatsCard
              subject={report.subject_stats}
              courses={report.subject_courses}
            />
          </div>

          <VisualEvidenceCard evidence={report.visual_evidence} />
          <ActionHistoryCard items={report.action_history} />
        </div>

        <AdminActionPanel
          overview={report.report_overview}
          subject={report.subject_stats}
          isFinalDecision={isFinalDecision}
          activeAction={activeAction}
          onAction={handleAction}
          onReturnToQueue={() => router.push("/admin/reports-moderation")}
        />
      </div>
    </div>
  );
}
