"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getModerationDashboardMetrics,
  getModerationReports,
} from "@/service/reports-moderation/reports-moderation.service";
import type {
  ModerationDashboardMetricsResponse,
  ModerationReportsResponse,
  ModerationReportStatus,
} from "@/types/reports-moderation/reports-moderation.type";

import ModerationHeader from "./moderation-header";
import ModerationStatsGrid from "./moderation-stats-grid";
import QueueDetailsCard from "./queue-details-card";

export type ModerationStatusFilter = ModerationReportStatus | "all";

export interface ModerationQueueFilters {
  search: string;
  status: ModerationStatusFilter;
  reason: string;
}

const PAGE_LIMIT = 10;

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

export default function ReportsModerationClient() {
  const [metrics, setMetrics] =
    useState<ModerationDashboardMetricsResponse | null>(null);

  const [reports, setReports] = useState<ModerationReportsResponse | null>(
    null,
  );

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<ModerationStatusFilter>("all");

  const [reason, setReason] = useState("");

  const [isMetricsLoading, setIsMetricsLoading] = useState(true);

  const [isReportsLoading, setIsReportsLoading] = useState(true);

  const [refreshVersion, setRefreshVersion] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadMetrics = async () => {
      setIsMetricsLoading(true);

      try {
        const response = await getModerationDashboardMetrics();

        if (isMounted) {
          setMetrics(response);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            getErrorMessage(error, "Unable to load moderation metrics."),
          );
        }
      } finally {
        if (isMounted) {
          setIsMetricsLoading(false);
        }
      }
    };

    void loadMetrics();

    return () => {
      isMounted = false;
    };
  }, [refreshVersion]);

  useEffect(() => {
    let isMounted = true;

    const loadReports = async () => {
      setIsReportsLoading(true);

      try {
        const response = await getModerationReports({
          page,
          limit: PAGE_LIMIT,
          search: search || undefined,
          status,
          reason: reason || undefined,
        });

        if (isMounted) {
          setReports(response);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            getErrorMessage(error, "Unable to load moderation reports."),
          );
        }
      } finally {
        if (isMounted) {
          setIsReportsLoading(false);
        }
      }
    };

    void loadReports();

    return () => {
      isMounted = false;
    };
  }, [page, reason, refreshVersion, search, status]);

  const availableReasons = Array.from(
    new Set(
      metrics?.reason_counts
        .map((item) => item.reason.trim())
        .filter(Boolean) ?? [],
    ),
  );

  const applyFilters = (filters: ModerationQueueFilters) => {
    setPage(1);
    setSearch(filters.search.trim());
    setStatus(filters.status);
    setReason(filters.reason);
  };

  return (
    <div className="space-y-6">
      <ModerationHeader
        isRefreshing={isMetricsLoading || isReportsLoading}
        onRefresh={() => {
          setRefreshVersion((current) => current + 1);
        }}
      />

      <ModerationStatsGrid metrics={metrics} isLoading={isMetricsLoading} />

      <QueueDetailsCard
        response={reports}
        isLoading={isReportsLoading}
        page={page}
        search={search}
        status={status}
        reason={reason}
        availableReasons={availableReasons}
        onPageChange={setPage}
        onFiltersApply={applyFilters}
        onRetry={() => {
          setRefreshVersion((current) => current + 1);
        }}
      />
    </div>
  );
}
