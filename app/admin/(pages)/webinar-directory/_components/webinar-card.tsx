"use client";

import Image from "next/image";
import { Pencil, Trash2, BellRing, Play } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";
import { IMAGE } from "@/constant/image.path";
import { Webinar } from "@/mock/webinar-directory/webinar-directory.types";

interface WebinarCardProps {
  webinar: Webinar;
}

const badgeClasses = {
  "only-a2-users": "bg-[#E6F4EC] text-[#006B3F] border border-[#C7E7D5]",
  "all-users": "bg-[#E6F4EC] text-[#006B3F] border border-[#C7E7D5]",
  "beginner-b1": "bg-[#FFF1E8] text-[#C45A00] border border-[#FFD6BF]",
};

const WebinarCard = ({ webinar }: WebinarCardProps) => {
  return (
    <Card
      rounded="3xl"
      padding="lg"
      className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="flex gap-5">
        <div className="flex h-[92px] min-w-[92px] flex-col items-center justify-center rounded-[28px] bg-[#F1F4F0]">
          <span className="text-xs font-semibold text-[#5D635F]">
            {webinar.webinarDate}
          </span>

          <span className="text-2xl font-bold text-[#202420]">
            {webinar.webinarTime}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-base font-semibold text-[#202420]">
              {webinar.title}
            </h3>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                badgeClasses[webinar.level]
              }`}
            >
              {webinar.badge}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Image
              src={IMAGE.customer}
              alt="Host"
              width={28}
              height={28}
              className="rounded-full object-cover"
            />

            <p className="text-sm text-[#5D635F]">Host: {webinar.hostName}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {webinar.isLive ? (
          <Button className="gap-2 px-7">
            <span>Enter Pre Live Studio</span>
            <Play size={16} />
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="gap-2 bg-[#EEF1ED] text-[#4E554F] hover:bg-[#E4E8E2]"
          >
            <BellRing size={16} />
            <span>Send Push Reminder</span>
          </Button>
        )}

        <button type="button">
          <Pencil className="size-5 text-[#202420]" />
        </button>

        <button type="button">
          <Trash2 className="size-5 text-[#DC2626]" />
        </button>
      </div>
    </Card>
  );
};

export default WebinarCard;
