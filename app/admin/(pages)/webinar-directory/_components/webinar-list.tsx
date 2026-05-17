"use client";

import { useSearchParams } from "next/navigation";

import { webinarDirectoryMock } from "@/mock/webinar-directory/webinar-directory.mock";
import WebinarCard from "./webinar-card";
import { WebinarStatus } from "@/mock/webinar-directory/webinar-directory.types";

const WebinarList = () => {
  const searchParams = useSearchParams();

  const activeTab =
    (searchParams.get("tab") as WebinarStatus) ?? "upcoming-scheduled";

  const filteredWebinars = webinarDirectoryMock.filter(
    (item) => item.status === activeTab,
  );

  return (
    <div className="space-y-5">
      {filteredWebinars.map((webinar) => (
        <WebinarCard key={webinar.id} webinar={webinar} />
      ))}
    </div>
  );
};

export default WebinarList;
