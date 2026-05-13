import { Search, UserRoundPlus } from "lucide-react";

export default function InfluencerSearchBar() {
    return (
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex h-12 w-full max-w-[360px] items-center gap-3 rounded-full bg-white px-5 text-black/40 shadow-sm">
                <Search className="size-4" />
                <span className="text-sm">Search influencers or codes...</span>
            </div>

            <button className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#75FF33] px-6 text-sm font-bold text-deep-green shadow-sm">
                <UserRoundPlus className="size-4" />
                Onboard New Influencer
            </button>
        </div>
    );
}