"use client";

import { useState } from "react";
import { CalendarCheck2 } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";

const PublishCard = () => {
  const [pushNotification, setPushNotification] = useState(true);

  const [publishType, setPublishType] = useState("schedule");

  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <h3 className="mb-5 text-lg font-semibold text-[#202420]">Publish</h3>

      <div className="mb-6 flex rounded-full bg-[#F3F6F2] p-1">
        <button
          type="button"
          onClick={() => setPublishType("draft")}
          className={`flex-1 rounded-full px-4 py-3 text-sm font-medium transition ${
            publishType === "draft"
              ? "bg-white text-[#202420] shadow-sm"
              : "text-[#66736B]"
          }`}
        >
          Save as Draft
        </button>

        <button
          type="button"
          onClick={() => setPublishType("schedule")}
          className={`flex-1 rounded-full px-4 py-3 text-sm font-medium transition ${
            publishType === "schedule"
              ? "bg-white text-[#006B3F] shadow-sm"
              : "text-[#66736B]"
          }`}
        >
          Schedule
        </button>
      </div>

      <div className="mb-6 flex items-start justify-between border-b border-[#EEF2EE] pb-5">
        <div>
          <h4 className="text-sm font-semibold text-[#202420]">
            Push Notification
          </h4>

          <p className="mt-1 text-xs text-[#66736B]">
            {` Send "New Event" alert to users`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPushNotification(!pushNotification)}
          className={`relative h-7 w-12 rounded-full transition ${
            pushNotification ? "bg-[#67E35B]" : "bg-[#D9E2DA]"
          }`}
        >
          <span
            className={`absolute top-1 size-5 rounded-full bg-white transition ${
              pushNotification ? "right-1" : "left-1"
            }`}
          />
        </button>
      </div>

      <Button fullWidth size="lg" className="gap-2">
        <CalendarCheck2 className="size-5" />
        <span>Save & Schedule</span>
      </Button>
    </Card>
  );
};

export default PublishCard;
