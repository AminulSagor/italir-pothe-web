import { History } from "lucide-react";

import Card from "@/components/UI/cards/card";
import { orderDetailsMock } from "@/mock/package-store/order-details.mock";

export default function TimelineActivityCard() {
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
        {orderDetailsMock.timeline.map((item) => (
          <div key={item.id} className="relative pl-6">
            <span className="absolute left-0 top-1 size-3 rounded-full bg-[#006B3F]" />
            <span className="absolute left-[5px] top-5 h-full w-px bg-[#DDE5DD]" />

            <h3 className="text-sm font-bold text-[#202420]">{item.title}</h3>
            <p className="text-sm text-[#4F5B52]">{item.date}</p>
            <p className="mt-2 text-sm leading-6 text-[#6B776F]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
