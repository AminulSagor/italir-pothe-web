import { ArrowLeft } from "lucide-react";

export default function CVPackageHeader() {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        className="mt-1 flex size-8 items-center justify-center rounded-full bg-white text-[#006B3F] shadow-sm"
      >
        <ArrowLeft className="size-5" />
      </button>

      <div>
        <h1 className="text-2xl font-bold text-[#006B3F]">
          CV Package Configuration
        </h1>
        <p className="mt-1 text-sm text-black/55">
          Manage credit issuance, pricing tiers, and global economy thresholds.
        </p>
      </div>
    </div>
  );
}