'use client'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
} from "recharts";

import Card from "@/components/UI/cards/card";

const chartData = [
  { name: "Week 1", paid: 20, free: 32 },
  { name: "Week 2", paid: 30, free: 45 },
  { name: "Week 3", paid: 58, free: 38 },
  { name: "Week 4", paid: 84, free: 30 },
];

export default function CVGenerationTrends() {
  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#202420]">
            CV Generation Trends
          </h2>
          <p className="text-sm text-black/55">
            Comparison between paid and free generations (30 days)
          </p>
        </div>

        <div className="flex items-center gap-5 text-xs text-black/60">
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#006B3F]" />
            PAID CVs
          </span>
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#B9C7B9]" />
            FREE CVs
          </span>
        </div>
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="0"
              opacity={0.08}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
            />
            <Area
              type="monotone"
              dataKey="paid"
              stroke="#006B3F"
              strokeWidth={3}
              fill="#006B3F"
              fillOpacity={0.04}
            />
            <Area
              type="monotone"
              dataKey="free"
              stroke="#B9C7B9"
              strokeWidth={3}
              fill="#B9C7B9"
              fillOpacity={0.04}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
