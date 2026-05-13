import { ArrowLeft, Search, Bell, CircleUserRound } from "lucide-react";
import HeroVideoCard from "./_components/hero-video-card";
import HowToApplyCard from "./_components/how-to-apply-card";
import RequirementsCard from "./_components/requirements-card";
import RightSidePanel from "./_components/right-side-panel";

interface EditCafServicePageProps {
    searchParams: Promise<{
        hasVideo?: string;
        hasPdf?: string;
    }>;
}

export default async function EditCafServicePage({
    searchParams,
}: EditCafServicePageProps) {
    const params = await searchParams;
    const hasVideo = params.hasVideo === "true";
    const hasPdf = params.hasPdf === "true";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-black/10 bg-white px-6 py-4">
                <div className="flex items-center gap-3">
                    <ArrowLeft className="size-5 text-secondary" />
                    <h2 className="text-lg font-bold text-black/85">Pre-Live Studio</h2>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden h-10 w-[280px] items-center gap-3 rounded-full bg-[#EEF3EC] px-4 text-black/40 lg:flex">
                        <Search className="size-4" />
                        <span className="text-sm">Search sessions...</span>
                    </div>

                    <button className="flex size-10 items-center justify-center rounded-full bg-[#EEF3EC]">
                        <Bell className="size-5 text-black/60" />
                    </button>

                    <button className="flex size-10 items-center justify-center rounded-full bg-[#EEF3EC]">
                        <CircleUserRound className="size-5 text-black/60" />
                    </button>
                </div>
            </div>

            <div className="px-6 pb-8">
                <div className="mb-6">
                    <div className="mb-6 flex items-center gap-4">
                        <button className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm">
                            <ArrowLeft className="size-5 text-secondary" />
                        </button>

                        <span className="text-lg font-semibold text-deep-green">
                            Edit Service
                        </span>
                    </div>

                    <p className="text-sm text-black/55">
                        Services <span className="mx-2">›</span> CAF Grid{" "}
                        <span className="mx-2">›</span>
                        <span className="font-semibold text-secondary">
                            Permesso di Soggiorno
                        </span>
                    </p>

                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-deep-green">
                        Edit Service Page: Permesso di Soggiorno
                    </h1>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
                    <div className="space-y-6">
                        <HeroVideoCard hasVideo={hasVideo} />
                        <RequirementsCard />
                        <HowToApplyCard />
                    </div>

                    <RightSidePanel hasPdf={hasPdf} />
                </div>
            </div>
        </div>
    );
}