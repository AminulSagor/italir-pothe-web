"use client";

import Image from "next/image";

import BackButton from "@/components/UI/buttons/back-button";
import Button from "@/components/UI/buttons/button";
import { IMAGE } from "@/constant/image.path";

export default function ModuleSentenceBankHeader() {
  return (
    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex items-start gap-4">
        <BackButton className="mt-1 shrink-0" />

        <div>
          <h1 className="text-2xl font-bold text-[#202420] md:text-3xl">
            Module Sentence Bank Builder
          </h1>

          <p className="mt-2 text-sm text-[#66736B] md:text-base">
            Architecture module for AI assisted linguistic datasets
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="flex -space-x-3">
          <Image
            src={IMAGE.customer}
            alt="User"
            width={42}
            height={42}
            className="rounded-full border-2 border-white"
          />

          <div className="flex size-[42px] items-center justify-center rounded-full border-2 border-white bg-[#006B3F] text-xs font-bold text-white">
            +3
          </div>
        </div>

        <Button size="lg" className="px-8 shadow-md">
          Save & Sync
        </Button>
      </div>
    </div>
  );
}
