import { History } from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { StoreAdminOrder } from "@/types/package-store/package-store.type";

interface TimelineActivityCardProps {
  order: StoreAdminOrder;
}

const formatDate = (value: string) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

export default function TimelineActivityCard({
  order,
}: TimelineActivityCardProps) {
  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#DDEEEE] text-[#006B3F]">
          <History className="size-5" />
        </div>

        <h2 className="text-lg font-semibold text-[#202420]">
          Timeline Activity
        </h2>
      </div>

      <div className="space-y-6">
        {order.timeline.length === 0 && (
          <p className="text-sm text-[#6B776F]">No timeline activity found.</p>
        )}

        {order.timeline.map((item, index) => (
          <div key={item.id} className="relative pl-6">
            <span className="absolute left-0 top-1 size-3 rounded-full bg-[#006B3F]" />
            {index < order.timeline.length - 1 && (
              <span className="absolute left-[5px] top-5 h-full w-px bg-[#DDE5DD]" />
            )}

            <h3 className="text-sm font-bold text-[#202420]">{item.title}</h3>
            <p className="text-sm text-[#4F5B52]">
              {formatDate(item.occurredAt)}
            </p>
            {item.description && (
              <p className="mt-2 text-sm leading-6 text-[#6B776F]">
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
