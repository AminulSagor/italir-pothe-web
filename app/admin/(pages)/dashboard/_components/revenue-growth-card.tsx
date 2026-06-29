"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Card from "@/components/UI/cards/card";
import type {
  DashboardRevenueGrowthResponse,
  DashboardRevenueRange,
} from "@/types/admin-dashboard/admin-dashboard.type";

interface RevenueGrowthCardProps {
  growth: DashboardRevenueGrowthResponse | null;

  range: DashboardRevenueRange;
  isLoading: boolean;

  onRangeChange: (range: DashboardRevenueRange) => void;
}

const filterItems: Array<{
  label: string;
  value: DashboardRevenueRange;
}> = [
  {
    label: "Daily",
    value: "daily",
  },
  {
    label: "Weekly",
    value: "weekly",
  },
  {
    label: "Monthly",
    value: "monthly",
  },
];

const formatCurrency = (value: number) => {
  const safeValue = Number.isFinite(value) ? value : 0;

  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(safeValue);
};

export default function RevenueGrowthCard({
  growth,
  range,
  isLoading,
  onRangeChange,
}: RevenueGrowthCardProps) {
  const chartData =
    growth?.points.map((point) => ({
      label: point.label,

      revenue: Number(point.totalRevenueEur),

      courseRevenue: Number(point.courseRevenueEur),

      packageRevenue: Number(point.packageRevenueEur),

      purchases: point.purchaseCount,
    })) || [];

  return (
    <Card padding="lg" rounded="3xl" shadow="sm" className="min-h-[360px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-medium text-[#202420]">
            Revenue Growth
          </h2>

          <p className="mt-1 text-sm text-[#3F463F]">
            Consolidated financial performance across all learning modules
          </p>

          <p className="mt-2 text-xs text-[#7A847B]">
            {formatCurrency(Number(growth?.totals.revenueEur || 0))} from{" "}
            {growth?.totals.purchases || 0} purchases
          </p>
        </div>

        <div className="flex w-full rounded-full bg-[#E9EEE9] p-1 sm:w-auto">
          {filterItems.map((item) => (
            <button
              key={item.value}
              type="button"
              disabled={isLoading}
              onClick={() => {
                if (item.value !== range) {
                  onRangeChange(item.value);
                }
              }}
              className={`flex-1 rounded-full px-5 py-1.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none ${
                item.value === range
                  ? "bg-[#006B3F] text-white"
                  : "text-[#3F463F]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`mt-8 h-[230px] w-full sm:h-[280px] ${
          isLoading ? "opacity-55" : ""
        }`}
      >
        {chartData.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 20,
                right: 10,
                left: -30,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="dashboardRevenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#006B3F" stopOpacity={0.14} />

                  <stop offset="95%" stopColor="#006B3F" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#3F463F",
                  fontSize: 12,
                  fontWeight: 700,
                }}
                dy={12}
              />

              <YAxis hide domain={[0, "dataMax + 100"]} />

              <Tooltip
                cursor={false}
                formatter={(value) => {
                  const normalizedValue = Array.isArray(value)
                    ? value[0]
                    : value;

                  return [
                    formatCurrency(Number(normalizedValue ?? 0)),
                    "Revenue",
                  ] as [string, string];
                }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                }}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#00552E"
                strokeWidth={5}
                fill="url(#dashboardRevenueGradient)"
                dot={{
                  r: 4,
                  fill: "#75FF33",
                  stroke: "#00552E",
                  strokeWidth: 3,
                }}
                activeDot={{
                  r: 8,
                  fill: "#75FF33",
                  stroke: "#00552E",
                  strokeWidth: 4,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#7A847B]">
            No revenue was recorded for this range.
          </div>
        )}
      </div>
    </Card>
  );
}
