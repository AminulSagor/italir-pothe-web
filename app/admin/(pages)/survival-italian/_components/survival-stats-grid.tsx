"use client";

import { useEffect, useState } from "react";

import SurvivalStatCard from "./survival-stat-card";

import { getSurvivalSummaryMetrics } from "@/service/survival-italian/survival-italian.service";
import type {
  SurvivalStat,
  SurvivalSummaryMetrics,
} from "@/types/survival-italian/survival-italian.type";

interface SurvivalStatsGridProps {
  refreshKey?: number;
}

const getStatsFromMetrics = (
  metrics: SurvivalSummaryMetrics,
): SurvivalStat[] => [
  {
    id: 1,
    title: "TOTAL SITUATIONS",
    value: String(metrics.totalSituations),
    iconKey: "total-situations",
    iconBg: "bg-[#DDF3E8]",
  },
  {
    id: 2,
    title: "PDFS ATTACHED",
    value: `${metrics.pdfsAttached}/${metrics.totalSituations}`,
    iconKey: "pdfs-attached",
    iconBg: "bg-[#F8ECD7]",
  },
  {
    id: 3,
    title: "MISSING BENGALI",
    value: String(metrics.missingBengali),
    iconKey: "missing-bengali",
    iconBg: "bg-[#DDEEEE]",
  },
  {
    id: 4,
    title: "COMPLETION",
    value: `${metrics.completionPercent}%`,
    iconKey: "completion",
    iconBg: "bg-[#F0DDF0]",
  },
];

export default function SurvivalStatsGrid({
  refreshKey = 0,
}: SurvivalStatsGridProps) {
  const [stats, setStats] = useState<SurvivalStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        setIsLoading(true);
        setError("");

        const metrics = await getSurvivalSummaryMetrics();

        if (isMounted) {
          setStats(getStatsFromMetrics(metrics));
        }
      } catch (loadError) {
        if (isMounted) {
          setStats([]);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load summary metrics.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  if (isLoading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[118px] animate-pulse rounded-3xl bg-[#EEF2EE]"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-[#F7C6C7] bg-[#FFF8F8] px-6 py-4 text-sm text-[#D92D20]">
        {error}
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <SurvivalStatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
