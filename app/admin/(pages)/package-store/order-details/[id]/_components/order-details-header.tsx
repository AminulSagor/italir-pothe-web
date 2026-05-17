import { Download, RotateCcw } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import BackButton from "@/components/UI/buttons/back-button";

export default function OrderDetailsHeader() {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div className="flex items-center gap-4">
        <BackButton />

        <div>
          <h1 className="text-2xl font-bold text-[#006B3F]">Order Details</h1>
          <p className="text-sm text-[#4F5B52]">
            Finance Manager / Transaction #ORD-7742
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button className="gap-2 bg-[#58F85F] !text-[#006B3F] hover:!bg-[#58F85F]">
          <Download className="size-4" />
          Download Invoice
        </Button>

        <Button variant="ghost" className="gap-2 bg-[#FCEBEC] text-[#D92D20]">
          <RotateCcw className="size-4" />
          Refund Order
        </Button>
      </div>
    </div>
  );
}
