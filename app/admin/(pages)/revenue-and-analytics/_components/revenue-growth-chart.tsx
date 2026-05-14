"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import Card from "@/components/UI/cards/card";

import RevenueChartToolbar from "./revenue-chart-toolbar";

import { revenueChartData } from "@/mock/revenue-and-analytics/revenue-analytics.mock";
import { TrendingUp } from "lucide-react";

const RevenueGrowthChart = () => {
  return (
    <Card rounded="3xl" padding="lg" shadow="sm" className="bg-white">
      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#EAF6EF]">
            <TrendingUp className="size-5 text-[#006B3F]" />
          </div>

          <h2 className="text-2xl font-bold text-[#202420]">
            Revenue Growth Over Time
          </h2>
        </div>

        <RevenueChartToolbar />
      </div>

      <div className="h-[260px] w-full sm:h-[320px] lg:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueChartData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#53E04F" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#53E04F" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="#F2F4F3" />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#98A29E",
                fontSize: 12,
              }}
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#53E04F"
              strokeWidth={4}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RevenueGrowthChart;
