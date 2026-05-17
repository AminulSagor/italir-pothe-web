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

const revenueGrowthData = [
  { month: "JAN", revenue: 18000 },
  { month: "FEB", revenue: 28000 },
  { month: "MAR", revenue: 41000 },
  { month: "APR", revenue: 48000 },
  { month: "MAY", revenue: 56000 },
  { month: "JUN", revenue: 64000 },
];

const filterItems = ["Daily", "Weekly", "Monthly"];

const RevenueGrowthCard = () => {
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
        </div>

        <div className="flex w-full rounded-full bg-[#E9EEE9] p-1 sm:w-auto">
          {filterItems.map((item) => (
            <button
              key={item}
              type="button"
              className={`flex-1 rounded-full px-5 py-1.5 text-sm font-semibold transition sm:flex-none ${
                item === "Monthly"
                  ? "bg-[#006B3F] text-white"
                  : "text-[#3F463F]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 h-[230px] w-full sm:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={revenueGrowthData}
            margin={{ top: 20, right: 10, left: -30, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#006B3F" stopOpacity={0.14} />
                <stop offset="95%" stopColor="#006B3F" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#3F463F", fontSize: 12, fontWeight: 700 }}
              dy={12}
            />

            <YAxis hide domain={[0, "dataMax + 10000"]} />

            <Tooltip
              cursor={false}
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
              fill="url(#revenueGradient)"
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
      </div>
    </Card>
  );
};

export default RevenueGrowthCard;
