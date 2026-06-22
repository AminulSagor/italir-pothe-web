import { Info } from "lucide-react";

interface DevicePreviewCardProps {
  title: string;
  body: string;
  imagePreviewUrl: string | null;
}

export default function DevicePreviewCard({
  title,
  body,
  imagePreviewUrl,
}: DevicePreviewCardProps) {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-black/45">
        Live Device Preview
      </p>

      <div className="mx-auto mt-8 w-full max-w-[230px] rounded-[2rem] bg-[#111827] p-3 shadow-2xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#092418] px-5 pb-8 pt-20 text-white">
          <div className="absolute inset-0 opacity-40">
            <div className="h-full w-full bg-[radial-gradient(circle_at_40%_20%,rgba(52,211,153,0.45),transparent_35%),linear-gradient(140deg,#06160f,#0b3d2a)]" />
          </div>

          <div className="relative z-10 text-center">
            <p className="text-2xl font-light leading-none">
              09:41
            </p>
            <p className="mt-2 text-xs font-semibold">
              Italian Learning
            </p>
          </div>

          <div className="relative z-10 mt-6 rounded-3xl bg-white p-4 text-black">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
                IS
              </div>

              <div>
                <p className="text-xs font-bold uppercase text-black/80">
                  Italian Shikhi
                </p>
                <p className="text-xs text-black/45">
                  now
                </p>
              </div>
            </div>

            <h3 className="mt-4 break-words text-sm font-bold text-black">
              {title.trim() || "Notification Title"}
            </h3>

            <p className="mt-2 break-words text-xs leading-5 text-black/60">
              {body.trim() ||
                "Your notification message will appear here."}
            </p>

            {imagePreviewUrl && (
              <div className="mt-3 overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreviewUrl}
                  alt="Notification preview"
                  className="h-20 w-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="relative z-10 mx-auto mt-8 h-1.5 w-28 rounded-full bg-white/50" />
        </div>
      </div>

      <p className="mt-8 flex items-center justify-center gap-2 text-xs text-black/45">
        <Info className="size-4" />
        Actual display may vary by device.
      </p>
    </section>
  );
}