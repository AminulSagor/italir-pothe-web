import Image from "next/image";
import { UserRound } from "lucide-react";

import Card from "@/components/UI/cards/card";
import { orderDetailsMock } from "@/mock/package-store/order-details.mock";

export default function CustomerInfoCard() {
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
        <Image
          src={orderDetailsMock.customer.avatar}
          alt={orderDetailsMock.customer.name}
          width={96}
          height={96}
          className="rounded-full"
        />

        <h3 className="mt-5 text-xl font-bold text-[#202420]">
          {orderDetailsMock.customer.name}
        </h3>

        <p className="text-sm text-[#4F5B52]">
          {orderDetailsMock.customer.email}
        </p>

        <div className="mt-8 flex w-full items-center justify-between rounded-full bg-[#EEF3EC] px-6 py-4">
          <span className="text-xs font-bold text-[#4F5B52]">Student ID</span>
          <span className="text-xs font-bold text-[#006B3F]">
            {orderDetailsMock.customer.studentId}
          </span>
        </div>
      </div>
    </Card>
  );
}
