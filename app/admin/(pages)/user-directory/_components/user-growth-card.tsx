"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { getAdminUserGrowth } from "@/service/user-directory/user-directory.service";
import type {
  AdminUserGrowthRange,
  AdminUserGrowthResponse,
} from "@/types/user-directory/user-directory.type";

const getErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : "Unable to load user growth.";
};

const ranges: Array<{
  label: string;
  value: AdminUserGrowthRange;
}> = [
  {
    label: "Day",
    value: "day",
  },
  {
    label: "Week",
    value: "week",
  },
  {
    label: "Month",
    value: "month",
  },
];

export default function UserGrowthCard() {
  const [range, setRange] = useState<AdminUserGrowthRange>("month");

  const [growth, setGrowth] = useState<AdminUserGrowthResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadGrowth = async () => {
      try {
        const response = await getAdminUserGrowth({
          range,
        });

        if (mounted) {
          setGrowth(response);
        }
      } catch (error) {
        if (mounted) {
          toast.error(getErrorMessage(error));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadGrowth();

    return () => {
      mounted = false;
    };
  }, [range]);

  const chart = useMemo(() => {
    const points = growth?.points || [];

    const width = 960;
    const top = 30;
    const bottom = 220;

    const chartHeight = bottom - top;

    const maximum = Math.max(1, ...points.map((point) => point.totalUsers));

    const minimum = Math.min(0, ...points.map((point) => point.totalUsers));

    const valueRange = Math.max(1, maximum - minimum);

    const coordinates = points.map((point, index) => ({
      ...point,

      x: points.length <= 1 ? width / 2 : (index / (points.length - 1)) * width,

      y: bottom - ((point.totalUsers - minimum) / valueRange) * chartHeight,
    }));

    const linePath = coordinates
      .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
      .join(" ");

    const areaPath =
      coordinates.length > 0
        ? `${linePath} L${coordinates.at(-1)?.x || 0} ${bottom} L${
            coordinates[0]?.x || 0
          } ${bottom} Z`
        : "";

    return {
      coordinates,
      linePath,
      areaPath,
    };
  }, [growth]);

  return (
    <section className="rounded-[2.5rem] bg-white p-8 shadow-xl shadow-black/5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-black/90">
            User Growth Over Time
          </h2>

          <p className="mt-2 text-base text-black/45">
            Visualizing platform expansion and retention metrics
          </p>
        </div>

        <div className="flex rounded-full bg-[#EEF3EC] p-1">
          {ranges.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                if (item.value === range) {
                  return;
                }

                setIsLoading(true);
                setRange(item.value);
              }}
              className={`rounded-full px-8 py-3 text-sm font-semibold ${
                range === item.value
                  ? "bg-secondary text-white"
                  : "text-black/65"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-10 min-h-[320px] overflow-hidden rounded-[2rem] bg-white">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
            <Loader2 className="size-7 animate-spin text-secondary" />
          </div>
        )}

        {chart.coordinates.length > 0 ? (
          <svg viewBox="0 0 980 280" className="h-[320px] w-full">
            {[55, 110, 165, 220].map((y) => (
              <line
                key={y}
                x1="0"
                x2="960"
                y1={y}
                y2={y}
                stroke="#E5EAE3"
                strokeWidth="1"
              />
            ))}

            <defs>
              <linearGradient
                id="userGrowthGradient"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#007A4D" stopOpacity="0.18" />

                <stop offset="100%" stopColor="#007A4D" stopOpacity="0" />
              </linearGradient>
            </defs>

            <path d={chart.areaPath} fill="url(#userGrowthGradient)" />

            <path
              d={chart.linePath}
              fill="none"
              stroke="#007A4D"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {chart.coordinates.map((point) => (
              <circle
                key={point.bucketStart}
                cx={point.x}
                cy={point.y}
                r="5"
                fill="#007A4D"
              />
            ))}

            {chart.coordinates.map((point) => (
              <text
                key={`label-${point.bucketStart}`}
                x={point.x}
                y="260"
                textAnchor="middle"
                className="fill-black/35 text-sm font-semibold"
              >
                {point.label}
              </text>
            ))}
          </svg>
        ) : (
          <div className="flex h-[320px] items-center justify-center text-sm text-black/40">
            No user growth data is available for this period.
          </div>
        )}
      </div>
    </section>
  );
}
