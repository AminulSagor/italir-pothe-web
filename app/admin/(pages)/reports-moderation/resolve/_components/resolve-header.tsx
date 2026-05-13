import { ArrowLeft, Bell, Clock3, FileSearch, RotateCcw, Search, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function ResolveHeader() {
    return (
        <>
            <div className="mb-8 flex h-16 items-center justify-between border-b border-black/5 bg-white/80 px-6">
                <div className="flex h-10 w-[360px] items-center gap-3 rounded-full bg-[#EEF3EC] px-5 text-black/40">
                    <Search className="size-4" />
                    <span className="text-sm">Search moderation cases...</span>
                </div>

                <div className="flex items-center gap-5 text-black/60">
                    <Bell className="size-5" />
                    <RotateCcw className="size-5" />
                    <ShieldCheck className="size-5" />

                    <div className="border-l border-black/10 pl-5">
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-black/75">Sarah Jenkins</p>
                                <p className="text-xs uppercase text-black/40">Lead Moderator</p>
                            </div>

                            <Image
                                src="/images/sarah-jenkins.png"
                                alt="Sarah Jenkins"
                                width={48}
                                height={48}
                                className="size-12 rounded-full border-4 border-green-100 object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <button className="mb-5 flex items-center gap-3 text-sm font-semibold uppercase text-secondary">
                <span className="flex size-9 items-center justify-center rounded-full bg-white shadow-sm">
                    <ArrowLeft className="size-5" />
                </span>
                Back to Moderation Queue
            </button>

            <p className="text-xs font-semibold uppercase tracking-wide text-black/35">
                Moderation Queue <span className="mx-2">›</span>
                <span className="text-secondary">Case #9921-AR</span>
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight text-deep-green">
                Resolve Report
            </h1>
        </>
    );
}