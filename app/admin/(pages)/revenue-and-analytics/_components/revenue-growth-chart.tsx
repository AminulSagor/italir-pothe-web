"use client";

import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Card from "@/components/UI/cards/card";
import type {
  RevenueGraphRange,
  RevenueGrowthResponse,
} from "@/types/revenue-and-analytics/revenue-and-analytics.type";

import RevenueChartToolbar from "./revenue-chart-toolbar";

interface RevenueGrowthChartProps {
  growth: RevenueGrowthResponse | null;

  range: RevenueGraphRange;

  onRangeChange: (range: RevenueGraphRange) => void;
}

export default function RevenueGrowthChart({
  growth,
  range,
  onRangeChange,
}: RevenueGrowthChartProps) {
  const chartData =
    growth?.points.map((point) => ({
      label: point.label,

      revenue: Number(point.totalRevenueEur),

      courses: Number(point.courseRevenueEur),

      packages: Number(point.packageRevenueEur),

      transactions: point.transactionCount,
    })) || [];

  return (
    <Card rounded="3xl" padding="lg" shadow="sm" className="bg-white">
      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#EAF6EF]">
            <TrendingUp className="size-5 text-[#006B3F]" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#202420]">
              Revenue Growth Over Time
            </h2>

            <p className="text-xs text-[#7A847B]">
              €{Number(growth?.totals.revenueEur || 0).toFixed(2)} from{" "}
              {growth?.totals.transactions || 0} transactions
            </p>
          </div>
        </div>

        <RevenueChartToolbar range={range} onChange={onRangeChange} />
      </div>

      <div className="h-[260px] w-full sm:h-[320px] lg:h-[400px]">
        {chartData.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#53E04F" stopOpacity={0.35} />

                  <stop offset="100%" stopColor="#53E04F" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} stroke="#F2F4F3" />

              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "#98A29E",
                  fontSize: 12,
                }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "#98A29E",
                  fontSize: 11,
                }}
              />

              <Tooltip
                formatter={(value) => [
                  `€${Number(value).toFixed(2)}`,
                  "Revenue",
                ]}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#53E04F"
                strokeWidth={4}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#98A29E]">
            No revenue was recorded in this range.
          </div>
        )}
      </div>
    </Card>
  );
}
