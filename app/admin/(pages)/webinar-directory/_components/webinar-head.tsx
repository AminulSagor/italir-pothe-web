"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import Button from "@/components/UI/buttons/button";

const WebinarHead = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-[#006339]">
        Webinar Directory
      </h1>

      <Button
        className="flex gap-2"
        onClick={() => router.push("/admin/webinar-directory/create")}
      >
        <Plus size={18} />
        <span>Schedule New Webinar</span>
      </Button>
    </div>
  );
};

export default WebinarHead;
