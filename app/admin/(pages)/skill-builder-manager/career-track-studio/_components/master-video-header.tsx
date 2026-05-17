"use client";

import BackButton from "@/components/UI/buttons/back-button";
import Button from "@/components/UI/buttons/button";

export default function MasterVideoHeader() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-sm text-[#7A837B]">
        <span>Course Management</span>
        <span>{">"}</span>
        <span className="font-medium text-[#202420]">Career Track Studio</span>
      </div>

      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-4">
          <BackButton className="mt-1 shrink-0" />

          <div>
            <h1 className="text-2xl font-bold text-[#202420] md:text-3xl">
              Master Video Settings
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-[#66736B] md:text-base">
              Manage the master introduction video and supporting educational
              materials for this career track.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" size="lg" className="px-7">
            DISCARD CHANGES
          </Button>

          <Button size="lg" className="bg-[]">
            SAVE TRACK
          </Button>
        </div>
      </div>
    </div>
  );
}
