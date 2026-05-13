import { Download } from "lucide-react";

export default function InfluencerHubHeader() {
    return (
        <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-deep-green">
                Influencer Hub
            </h1>

            <button className="flex h-10 items-center gap-2 rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-black/65 shadow-sm">
                <Download className="size-4" />
                Export CSV
            </button>
        </div>
    );
}