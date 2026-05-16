import Image from "next/image";
import { Mic, Video, Upload, Settings } from "lucide-react";
import { IMAGE } from "@/constant/image.path";

const controls = [Mic, Video, Upload, Settings];

export default function WebinarPreviewCard() {
  return (
    <div className="relative h-[405px] overflow-hidden rounded-[34px] bg-[#1B2B2D] p-5 shadow-sm">
      <Image
        src={IMAGE.teacher}
        alt="Webinar teacher preview"
        fill
        className="object-cover"
      />

      <div className="absolute left-8 top-7 rounded-full bg-black/70 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-white">
        <span className="mr-2 inline-block size-2 rounded-full bg-red-500" />
        Off-Air Preview
      </div>

      <p className="absolute inset-x-0 top-1/2 text-center text-sm text-white/80">
        Camera Feed Active
      </p>

      <div className="absolute inset-x-0 bottom-8 flex justify-center gap-4">
        {controls.map((Icon, index) => (
          <button
            key={index}
            className="flex size-14 items-center justify-center rounded-full bg-white text-[#007A4D] shadow-md"
          >
            <Icon className="size-5" />
          </button>
        ))}
      </div>
    </div>
  );
}
