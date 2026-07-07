import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function DealConfiguratorSuccessPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-white/55 backdrop-blur-md" />

      <section className="relative z-10 w-full max-w-[420px] rounded-[2rem] bg-white px-10 py-9 text-center shadow-2xl">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#75FF33] shadow-lg shadow-green-500/20">
          <CheckCircle2 className="size-9 text-deep-green" />
        </div>

        <h1 className="mt-8 text-3xl font-bold text-deep-green">
          Partner Deal Saved
        </h1>

        <p className="mx-auto mt-4 max-w-[320px] text-sm leading-6 text-black/55">
          The influencer partner and coupon mapping were saved. New flows now
          redirect to the real partner report page after creation.
        </p>

        <p className="mx-auto mt-4 max-w-[320px] text-sm leading-6 text-black/40">
          Product discount is controlled by the mapped Google Play/App Store
          product IDs. The admin panel does not calculate final checkout price.
        </p>

        <Link
          href="/admin/influencer-hub"
          className="mt-8 flex h-12 w-full items-center justify-center rounded-full bg-secondary text-sm font-bold text-white shadow-lg shadow-secondary/20"
        >
          Back to Influencer Hub
        </Link>
      </section>
    </div>
  );
}
