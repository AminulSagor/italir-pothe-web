import { UserRound } from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { StoreAdminOrder } from "@/types/package-store/package-store.type";

interface CustomerInfoCardProps {
  order: StoreAdminOrder;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export default function CustomerInfoCard({ order }: CustomerInfoCardProps) {
  const name = order.user?.name || "Unknown Customer";

  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#DDEEEE] text-[#006B3F]">
          <UserRound className="size-5" />
        </div>

        <h2 className="text-lg font-semibold text-[#202420]">
          Customer Information
        </h2>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="flex size-24 items-center justify-center rounded-full bg-[#DDF3E8] text-2xl font-bold text-[#006B3F]">
          {getInitials(name) || "?"}
        </div>

        <h3 className="mt-5 text-xl font-bold text-[#202420]">{name}</h3>

        <p className="text-sm text-[#4F5B52]">
          {order.user?.email || "No email available"}
        </p>

        <div className="mt-8 flex w-full items-center justify-between rounded-full bg-[#EEF3EC] px-6 py-4">
          <span className="text-xs font-bold text-[#4F5B52]">Student ID</span>
          <span className="text-xs font-bold text-[#006B3F]">
            {order.user?.studentId || order.user?.id || "—"}
          </span>
        </div>
      </div>
    </Card>
  );
}
