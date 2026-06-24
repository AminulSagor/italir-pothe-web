"use client";

import { useEffect, useState } from "react";
import { BadgeEuro, Boxes, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

import Card from "@/components/UI/cards/card";
import { getPackageStoreDashboard } from "@/service/package-store/package-store.service";
import type { PackageStoreDashboard } from "@/types/package-store/package-store.type";

const getErrorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Unable to load package store stats.";

export default function PackageStoreStats() {
  const [dashboard, setDashboard] = useState<PackageStoreDashboard | null>(
    null,
  );

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const response = await getPackageStoreDashboard();
        if (mounted) setDashboard(response);
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  const stats = [
    {
      id: "revenue",
      title: "Total Revenue",
      value: `€${dashboard?.totalRevenueEur || "0.00"}`,
      subtitle: `${dashboard?.changes.revenuePercentage || 0}% this month`,
      icon: <BadgeEuro className="size-5 text-[#006B3F]" />,
      iconBg: "bg-[#DDF3E8]",
    },
    {
      id: "orders",
      title: "Completed Orders",
      value: String(dashboard?.totalOrders || 0),
      subtitle: `${dashboard?.changes.orderPercentage || 0}% this month`,
      icon: <ShoppingBag className="size-5 text-[#FF7A00]" />,
      iconBg: "bg-[#FFF0D6]",
    },
    {
      id: "top-package",
      title: "Top Package",
      value: dashboard?.topPackage?.name || "No sales yet",
      subtitle: dashboard?.topPackage
        ? `${dashboard.topPackage.orderCount} orders • ${dashboard.topPackage.salesPercentage}%`
        : `${dashboard?.packageCounts.published || 0} published packages`,
      icon: <Boxes className="size-5 text-[#8B5CF6]" />,
      iconBg: "bg-[#F0DDF0]",
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.id} padding="lg" rounded="3xl" shadow="sm">
          <div className="flex items-start gap-4">
            <div
              className={`flex size-12 items-center justify-center rounded-2xl text-base ${stat.iconBg}`}
            >
              {stat.icon}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#4F5B52]">
                {stat.title}
              </p>

              <h3 className="truncate text-xl font-bold text-[#202420]">
                {stat.value}
              </h3>

              <p className="mt-4 text-sm font-medium text-[#007A35]">
                {stat.subtitle}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
